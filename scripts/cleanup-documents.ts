/**
 * Remove duplicate document rows (keeps newest per storage_path).
 * Run migration 003_documents_delete_policy.sql in Supabase SQL Editor first,
 * OR set SUPABASE_SERVICE_ROLE_KEY in .env.
 *
 * Usage: npx tsx scripts/cleanup-documents.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
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
  const url =
    env.VITE_SUPABASE_URL && !env.VITE_SUPABASE_URL.includes('your-project')
      ? env.VITE_SUPABASE_URL
      : env.SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = env.VITE_SUPABASE_ANON_KEY

  const supabase = createClient(
    url!,
    serviceKey && !serviceKey.includes('your-service') ? serviceKey : anonKey!,
  )

  if (!serviceKey || serviceKey.includes('your-service')) {
    const { error } = await supabase.auth.signInWithPassword({
      email: env.VITE_JOAO_EMAIL,
      password: env.VITE_APP_PASSCODE ?? 'spain2026',
    })
    if (error) {
      console.error('Auth failed:', error.message)
      process.exit(1)
    }
  }

  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, name, storage_path, created_at')
    .order('created_at')

  if (error || !docs) {
    console.error('Fetch failed:', error?.message)
    process.exit(1)
  }

  console.log(`Found ${docs.length} documents`)

  const keepIds = new Set<string>()
  const seen = new Map<string, string>()

  for (const doc of docs) {
    const key = doc.storage_path ?? doc.name.toLowerCase()
    if (!seen.has(key)) {
      seen.set(key, doc.id)
      keepIds.add(doc.id)
    }
  }

  const toDelete = docs.filter((d) => !keepIds.has(d.id)).map((d) => d.id)
  if (toDelete.length === 0) {
    console.log('No duplicates to remove.')
    return
  }

  const { error: delError } = await supabase.from('documents').delete().in('id', toDelete)
  if (delError) {
    console.error('Delete failed:', delError.message)
    console.error('Run supabase/migrations/003_documents_delete_policy.sql in Supabase SQL Editor, then retry.')
    process.exit(1)
  }

  console.log(`Removed ${toDelete.length} duplicates. ${keepIds.size} documents remain.`)
}

void main()
