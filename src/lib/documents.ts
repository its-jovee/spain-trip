import type { TripDocument } from '../types'
import { supabase } from './supabase'

function publicDocumentPath(doc: TripDocument): string | undefined {
  if (doc.storagePath) {
    return `/documents/${doc.storagePath.replace(/^uploads\//, '')}`
  }
  if (doc.url?.startsWith('/documents/')) {
    return doc.url
  }
  return undefined
}

export function dedupeDocuments(documents: TripDocument[]): TripDocument[] {
  const byKey = new Map<string, TripDocument>()

  for (const doc of documents) {
    const key = doc.storagePath ?? doc.name.toLowerCase()
    const existing = byKey.get(key)
    if (!existing || doc.createdAt > existing.createdAt) {
      byKey.set(key, doc)
    }
  }

  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function resolveDocumentUrl(doc: TripDocument): Promise<string | undefined> {
  if (supabase && doc.storagePath) {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.storagePath, 60 * 60 * 24)

    if (!error && data?.signedUrl) {
      return data.signedUrl
    }
  }

  if (doc.url && !doc.url.startsWith('#')) {
    return doc.url
  }

  return publicDocumentPath(doc)
}
