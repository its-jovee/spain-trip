import type { Participant } from '../types'

export const APP_NAME = 'Spain Trip'
export const TRIP_START = new Date('2026-06-20T00:00:00')
export const TRIP_END = new Date('2026-07-05T23:59:59')

export const PARTICIPANT_LABELS: Record<Participant, string> = {
  both: 'Both',
  paula: 'Paula',
  jovi: 'Jovi',
}

export const PARTICIPANT_MONOGRAM: Record<Participant, string> = {
  both: 'JP',
  paula: 'P',
  jovi: 'J',
}

export const EVENT_TYPE_LABELS = {
  flight: 'Flight',
  hotel: 'Hotel',
  train: 'Train',
  restaurant: 'Restaurant',
  activity: 'Activity',
} as const

export const SHARED_AUTH_EMAIL = 'trip@spain.local'
export const STORAGE_KEYS = {
  events: 'spain-trip-events',
  documents: 'spain-trip-documents',
  checklists: 'spain-trip-checklists',
  auth: 'spain-trip-auth',
} as const

export const AI_PLAN_ENABLED = import.meta.env.VITE_AI_PLAN_ENABLED === 'true'
