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
