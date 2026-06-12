import type { Checklist, TripDocument, TripEvent } from '../types'
import { SEED_CHECKLISTS } from '../data/checklists'
import { SEED_DOCUMENTS, SEED_EVENTS } from '../data/seed'
import { STORAGE_KEYS, normalizeCheckedBy, normalizeParticipant } from './constants'
import { generateId } from './utils'
import { dedupeDocuments, resolveDocumentUrl } from './documents'
import { isSupabaseConfigured, supabase } from './supabase'

type Listener = () => void

export interface TripStoreSnapshot {
  events: TripEvent[]
  documents: TripDocument[]
  checklists: Checklist[]
}

class TripStore {
  private events: TripEvent[] = []
  private documents: TripDocument[] = []
  private checklists: Checklist[] = []
  private listeners = new Set<Listener>()
  private initialized = false
  private snapshot: TripStoreSnapshot = {
    events: this.events,
    documents: this.documents,
    checklists: this.checklists,
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot(): TripStoreSnapshot {
    return this.snapshot
  }

  private notify() {
    this.snapshot = {
      events: this.events,
      documents: this.documents,
      checklists: this.checklists,
    }
    this.listeners.forEach((l) => l())
  }

  async init() {
    if (this.initialized) return

    if (isSupabaseConfigured && supabase) {
      await this.loadFromSupabase()
    } else {
      this.loadFromLocal()
    }

    await this.resolveDocumentUrls()
    this.initialized = true
    this.notify()
  }

  private async resolveDocumentUrls() {
    this.documents = await Promise.all(
      this.documents.map(async (doc) => {
        const url = await resolveDocumentUrl(doc)
        return url ? { ...doc, url } : doc
      }),
    )
  }

  private loadFromLocal() {
    const events = localStorage.getItem(STORAGE_KEYS.events)
    const documents = localStorage.getItem(STORAGE_KEYS.documents)
    const checklists = localStorage.getItem(STORAGE_KEYS.checklists)

    this.events = events ? JSON.parse(events) : SEED_EVENTS
    this.documents = dedupeDocuments(documents ? JSON.parse(documents) : SEED_DOCUMENTS)
    this.checklists = checklists ? JSON.parse(checklists) : SEED_CHECKLISTS

    if (!events) this.persistLocal()
  }

  private persistLocal() {
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(this.events))
    localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(this.documents))
    localStorage.setItem(STORAGE_KEYS.checklists, JSON.stringify(this.checklists))
  }

  private async loadFromSupabase() {
    if (!supabase) return

    const [eventsRes, docsRes, checklistsRes, itemsRes] = await Promise.all([
      supabase.from('events').select('*').order('start_at'),
      supabase.from('documents').select('*').order('created_at'),
      supabase.from('checklists').select('*').order('sort_order'),
      supabase.from('checklist_items').select('*').order('sort_order'),
    ])

    if (eventsRes.data?.length) {
      this.events = eventsRes.data.map(mapEventFromDb)
    } else {
      this.events = SEED_EVENTS
      await this.seedSupabaseEvents()
    }

    if (docsRes.data?.length) {
      this.documents = dedupeDocuments(docsRes.data.map(mapDocumentFromDb))
    } else {
      this.documents = SEED_DOCUMENTS
    }

    if (checklistsRes.data?.length && itemsRes.data) {
      this.checklists = checklistsRes.data.map((cl) => ({
        id: cl.id,
        title: cl.title,
        description: cl.description ?? undefined,
        items: itemsRes.data!
          .filter((i) => i.checklist_id === cl.id)
          .map(mapChecklistItemFromDb),
      }))
    } else {
      this.checklists = SEED_CHECKLISTS
      await this.seedSupabaseChecklists()
    }

    this.setupRealtime()
  }

  private setupRealtime() {
    if (!supabase) return

    supabase
      .channel('trip-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        void this.refreshEvents()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_items' }, () => {
        void this.refreshChecklists()
      })
      .subscribe()
  }

  private async refreshEvents() {
    if (!supabase) return
    const { data } = await supabase.from('events').select('*').order('start_at')
    if (data) {
      this.events = data.map(mapEventFromDb)
      this.notify()
    }
  }

  private async refreshChecklists() {
    if (!supabase) return
    const [checklistsRes, itemsRes] = await Promise.all([
      supabase.from('checklists').select('*').order('sort_order'),
      supabase.from('checklist_items').select('*').order('sort_order'),
    ])
    if (checklistsRes.data && itemsRes.data) {
      this.checklists = checklistsRes.data.map((cl) => ({
        id: cl.id,
        title: cl.title,
        description: cl.description ?? undefined,
        items: itemsRes.data!
          .filter((i) => i.checklist_id === cl.id)
          .map(mapChecklistItemFromDb),
      }))
      this.notify()
    }
  }

  private async seedSupabaseEvents() {
    if (!supabase) return
    await supabase.from('events').insert(this.events.map(mapEventToDb))
  }

  private async seedSupabaseChecklists() {
    if (!supabase) return
    for (const cl of SEED_CHECKLISTS) {
      await supabase.from('checklists').insert({
        id: cl.id,
        title: cl.title,
        description: cl.description,
        sort_order: SEED_CHECKLISTS.indexOf(cl),
      })
      await supabase.from('checklist_items').insert(
        cl.items.map((item) => ({
          id: item.id,
          checklist_id: cl.id,
          text: item.text,
          checked: item.checked,
          checked_by: item.checkedBy ?? null,
          sort_order: item.sortOrder,
        })),
      )
    }
  }

  getEvents() {
    return this.events
  }

  getDocuments() {
    return this.documents
  }

  getChecklists() {
    return this.checklists
  }

  async addEvent(event: Omit<TripEvent, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const newEvent: TripEvent = {
      ...event,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }

    this.events.push(newEvent)
    this.events.sort((a, b) => a.startAt.localeCompare(b.startAt) || a.sortOrder - b.sortOrder)

    if (supabase) {
      await supabase.from('events').insert(mapEventToDb(newEvent))
    } else {
      this.persistLocal()
    }

    this.notify()
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<TripEvent>) {
    const index = this.events.findIndex((e) => e.id === id)
    if (index === -1) return

    this.events[index] = {
      ...this.events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (supabase) {
      await supabase.from('events').update(mapEventToDb(this.events[index])).eq('id', id)
    } else {
      this.persistLocal()
    }

    this.notify()
  }

  async deleteEvent(id: string) {
    this.events = this.events.filter((e) => e.id !== id)

    if (supabase) {
      await supabase.from('events').delete().eq('id', id)
    } else {
      this.persistLocal()
    }

    this.notify()
  }

  async reorderEvents(_dayKey: string, orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const event = this.events.find((e) => e.id === id)
      if (event) {
        event.sortOrder = index
        event.updatedAt = new Date().toISOString()
      }
    })

    if (supabase) {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase!.from('events').update({ sort_order: index, updated_at: new Date().toISOString() }).eq('id', id),
        ),
      )
    } else {
      this.persistLocal()
    }

    this.notify()
  }

  async moveEvent(id: string, newStartAt: string) {
    await this.updateEvent(id, { startAt: newStartAt })
  }

  async toggleChecklistItem(checklistId: string, itemId: string, checkedBy: 'joao' | 'paula') {
    const checklist = this.checklists.find((c) => c.id === checklistId)
    const item = checklist?.items.find((i) => i.id === itemId)
    if (!item) return

    item.checked = !item.checked
    item.checkedBy = item.checked ? checkedBy : undefined

    if (supabase) {
      await supabase
        .from('checklist_items')
        .update({
          checked: item.checked,
          checked_by: item.checkedBy ?? null,
        })
        .eq('id', itemId)
    } else {
      this.persistLocal()
    }

    this.notify()
  }

  async addDocument(doc: Omit<TripDocument, 'id' | 'createdAt'>) {
    const newDoc: TripDocument = {
      ...doc,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    this.documents.push(newDoc)

    if (supabase) {
      await supabase.from('documents').insert(mapDocumentToDb(newDoc))
    } else {
      this.persistLocal()
    }

    this.notify()
    return newDoc
  }
}

function mapEventFromDb(row: Record<string, unknown>): TripEvent {
  return {
    id: row.id as string,
    type: row.type as TripEvent['type'],
    title: row.title as string,
    startAt: row.start_at as string,
    endAt: (row.end_at as string) ?? undefined,
    location: (row.location as string) ?? undefined,
    confirmationCode: (row.confirmation_code as string) ?? undefined,
    participants: normalizeParticipant(row.participants as string),
    notes: (row.notes as string) ?? undefined,
    details: (row.details as Record<string, string>) ?? undefined,
    documentId: (row.document_id as string) ?? undefined,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapEventToDb(event: TripEvent) {
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

function mapDocumentFromDb(row: Record<string, unknown>): TripDocument {
  return {
    id: row.id as string,
    name: row.name as string,
    storagePath: (row.storage_path as string) ?? undefined,
    url: (row.url as string) ?? undefined,
    eventId: (row.event_id as string) ?? undefined,
    createdAt: row.created_at as string,
  }
}

function mapDocumentToDb(doc: TripDocument) {
  return {
    id: doc.id,
    name: doc.name,
    storage_path: doc.storagePath ?? null,
    url: doc.url ?? null,
    event_id: doc.eventId ?? null,
    created_at: doc.createdAt,
  }
}

function mapChecklistItemFromDb(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    checklistId: row.checklist_id as string,
    text: row.text as string,
    checked: row.checked as boolean,
    checkedBy: normalizeCheckedBy(row.checked_by as string | null),
    sortOrder: row.sort_order as number,
  }
}

export const tripStore = new TripStore()
