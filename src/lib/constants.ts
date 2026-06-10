import type { Participant, TripUser, TripUserId } from '../types'

export const APP_NAME = 'Spain Trip'
export const TRIP_START = new Date('2026-06-20T00:00:00')
export const TRIP_END = new Date('2026-07-05T23:59:59')

export const TRIP_USERS: Record<TripUserId, TripUser> = {
  joao: {
    id: 'joao',
    name: 'João',
    email: import.meta.env.VITE_JOAO_EMAIL ?? 'joao@spain.local',
    avatarUrl: '/avatars/joao.png',
  },
  paula: {
    id: 'paula',
    name: 'Paula',
    email: import.meta.env.VITE_PAULA_EMAIL ?? 'paula@spain.local',
    avatarUrl: '/avatars/paula.png',
  },
}

export const PARTICIPANT_LABELS: Record<Participant, string> = {
  both: 'João & Paula',
  paula: 'Paula',
  joao: 'João',
}

export const EVENT_TYPE_LABELS = {
  flight: 'Flight',
  hotel: 'Hotel',
  train: 'Train',
  restaurant: 'Restaurant',
  activity: 'Activity',
} as const

export const STORAGE_KEYS = {
  events: 'spain-trip-events',
  documents: 'spain-trip-documents',
  checklists: 'spain-trip-checklists',
  authUser: 'spain-trip-auth-user',
} as const

export const AI_PLAN_ENABLED = import.meta.env.VITE_AI_PLAN_ENABLED === 'true'

export function resolveUserFromEmail(email: string): TripUser | null {
  const normalized = email.trim().toLowerCase()
  for (const user of Object.values(TRIP_USERS)) {
    if (user.email.toLowerCase() === normalized) return user
  }
  return null
}

export function normalizeParticipant(value: string): Participant {
  if (value === 'jovi') return 'joao'
  if (value === 'both' || value === 'paula' || value === 'joao') return value
  return 'both'
}

export function normalizeCheckedBy(value: string | null | undefined): TripUserId | undefined {
  if (!value) return undefined
  if (value === 'jovi' || value === 'joao') return 'joao'
  if (value === 'paula') return 'paula'
  return undefined
}
