/**
 * Upload PDFs from pdfs/uploads/ to Supabase Storage.
 * Usage: npx tsx scripts/upload-pdfs.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

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

async function main() {
  const env = loadEnv()
  const url = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || key.includes('your-service')) {
    console.log('Skipping upload — set SUPABASE_SERVICE_ROLE_KEY in .env')
    return
  }

  const supabase = createClient(url, key)
  const dir = join(process.cwd(), 'pdfs', 'uploads')

  if (!existsSync(dir)) {
    console.log('No pdfs/uploads folder found.')
    return
  }

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.pdf'))) {
    const storagePath = `uploads/${file}`
    const buffer = readFileSync(join(dir, file))
    const { error } = await supabase.storage.from('documents').upload(storagePath, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })
    if (error) console.error(`✗ ${file}:`, error.message)
    else console.log(`✓ ${storagePath}`)
  }
}

void main()
