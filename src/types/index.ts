export type EventType = 'flight' | 'hotel' | 'train' | 'restaurant' | 'activity'
export type Participant = 'both' | 'paula' | 'joao'
export type ParticipantFilter = 'all' | Participant
export type TripUserId = 'joao' | 'paula'

export interface TripUser {
  id: TripUserId
  name: string
  email: string
  avatarUrl: string
}

export interface TripEvent {
  id: string
  type: EventType
  title: string
  startAt: string
  endAt?: string
  location?: string
  confirmationCode?: string
  participants: Participant
  notes?: string
  details?: Record<string, string>
  documentId?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TripDocument {
  id: string
  name: string
  storagePath?: string
  url?: string
  eventId?: string
  createdAt: string
}

export interface ChecklistItem {
  id: string
  checklistId: string
  text: string
  checked: boolean
  checkedBy?: TripUserId
  sortOrder: number
}

export interface Checklist {
  id: string
  title: string
  description?: string
  items: ChecklistItem[]
}

export interface AiPlanRequest {
  text: string
}

export interface AiPlanResponse {
  enabled: boolean
  event?: Partial<TripEvent>
  message?: string
}
