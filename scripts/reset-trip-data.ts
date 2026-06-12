/**
 * Replace all trip events + documents in Supabase with seed data.
 * Usage: npx tsx scripts/reset-trip-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { SEED_DOCUMENTS, SEED_EVENTS } from '../src/data/seed'

function loadEnv() {
  const path = join(process.cwd(), '.env')
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf-8')
      .split('\n')
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      }),
  )
}

function mapEventToDb(event: (typeof SEED_EVENTS)[0]) {
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    start_at: event.startAt,
    end_at: event.endAt ?? null,
    location: event.location ?? null,
    confirmation_code: event.confirmationCode ?? null,
    participants: event.participants,
    notes: event.notes ?? null,
    details: event.details ?? null,
    document_id: event.documentId ?? null,
    sort_order: event.sortOrder,
    created_at: event.createdAt,
    updated_at: event.updatedAt,
  }
}

async function main() {
  const env = loadEnv()
  const url =
    env.VITE_SUPABASE_URL && !env.VITE_SUPABASE_URL.includes('your-project')
      ? env.VITE_SUPABASE_URL
      : env.SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = env.VITE_SUPABASE_ANON_KEY

  if (!url) {
    console.error('Set VITE_SUPABASE_URL in .env')
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey && !serviceKey.includes('your-service') ? serviceKey : anonKey!)

  if (!serviceKey || serviceKey.includes('your-service')) {
    const email = env.VITE_JOAO_EMAIL
    const password = env.VITE_APP_PASSCODE ?? 'spain2026'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Auth failed:', error.message)
      process.exit(1)
    }
    console.log('Signed in as', email)
  }

  console.log('Clearing existing events and documents…')
  await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log(`Inserting ${SEED_EVENTS.length} events…`)
  const { error: eventsError } = await supabase.from('events').insert(SEED_EVENTS.map(mapEventToDb))
  if (eventsError) {
    console.error('Events error:', eventsError.message)
    process.exit(1)
  }

  console.log(`Inserting ${SEED_DOCUMENTS.length} documents…`)
  const { error: docsError } = await supabase.from('documents').insert(
    SEED_DOCUMENTS.map((d) => ({
      id: d.id,
      name: d.name,
      storage_path: d.storagePath ?? null,
      url: d.url ?? (d.storagePath ? `/${d.storagePath.replace('uploads/', 'documents/')}` : null),
      event_id: d.eventId ?? null,
      created_at: d.createdAt,
    })),
  )
  if (docsError) {
    console.error('Documents error:', docsError.message)
    process.exit(1)
  }

  console.log('Done — refresh the app.')
}

void main()
