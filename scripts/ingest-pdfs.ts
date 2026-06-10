/**
 * PDF ingestion script
 *
 * Usage:
 *   1. Place PDFs in ./pdfs/
 *   2. Edit ./pdfs/manifest.json with extracted event/document metadata
 *   3. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 *   4. Run: npx tsx scripts/ingest-pdfs.ts
 *
 * When you share PDFs, we'll extract details and populate manifest.json,
 * then run this script to upload files and create linked events.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'

interface ManifestEntry {
  file: string
  name: string
  event?: {
    type: 'flight' | 'hotel' | 'train' | 'restaurant' | 'activity'
    title: string
    startAt: string
    endAt?: string
    location?: string
    confirmationCode?: string
    participants?: 'both' | 'paula' | 'jovi'
    notes?: string
    details?: Record<string, string>
  }
}

const PDFS_DIR = join(process.cwd(), 'pdfs')
const MANIFEST_PATH = join(PDFS_DIR, 'manifest.json')

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  if (!existsSync(MANIFEST_PATH)) {
    console.log('No manifest.json found in pdfs/. Add PDFs and manifest when ready.')
    process.exit(0)
  }

  const supabase = createClient(url, key)
  const manifest: ManifestEntry[] = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))

  for (const entry of manifest) {
    const filePath = join(PDFS_DIR, entry.file)
    if (!existsSync(filePath)) {
      console.warn(`Skipping missing file: ${entry.file}`)
      continue
    }

    const file = readFileSync(filePath)
    const storagePath = `uploads/${basename(entry.file)}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: true })

    if (uploadError) {
      console.error(`Upload failed for ${entry.file}:`, uploadError.message)
      continue
    }

    let eventId: string | null = null

    if (entry.event) {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          type: entry.event.type,
          title: entry.event.title,
          start_at: entry.event.startAt,
          end_at: entry.event.endAt ?? null,
          location: entry.event.location ?? null,
          confirmation_code: entry.event.confirmationCode ?? null,
          participants: entry.event.participants ?? 'both',
          notes: entry.event.notes ?? null,
          details: entry.event.details ?? null,
        })
        .select('id')
        .single()

      if (eventError) {
        console.error(`Event insert failed for ${entry.file}:`, eventError.message)
      } else {
        eventId = eventData.id
      }
    }

    const { error: docError } = await supabase.from('documents').insert({
      name: entry.name,
      storage_path: storagePath,
      event_id: eventId,
    })

    if (docError) {
      console.error(`Document insert failed for ${entry.file}:`, docError.message)
    } else {
      console.log(`✓ Ingested: ${entry.name}`)
    }
  }

  console.log('Done.')
}

void main()
