import {
  format,
  formatDistanceToNow,
  isSameDay,
  isToday,
  isTomorrow,
  parseISO,
  startOfDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isWithinInterval,
} from 'date-fns'
import type { Participant, ParticipantFilter, TripEvent } from '../types'

export function formatEventTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm')
}

export function formatEventDate(iso: string): string {
  return format(parseISO(iso), 'EEE, MMM d')
}

export function formatDayHeading(iso: string): string {
  const date = parseISO(iso)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEEE, MMMM d')
}

export function formatRelativeCountdown(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function groupEventsByDay(events: TripEvent[]): Map<string, TripEvent[]> {
  const sorted = [...events].sort((a, b) => a.startAt.localeCompare(b.startAt) || a.sortOrder - b.sortOrder)
  const map = new Map<string, TripEvent[]>()

  for (const event of sorted) {
    const key = startOfDay(parseISO(event.startAt)).toISOString()
    const list = map.get(key) ?? []
    list.push(event)
    map.set(key, list)
  }

  return map
}

export function filterByParticipant(events: TripEvent[], filter: ParticipantFilter): TripEvent[] {
  if (filter === 'all') return events
  return events.filter((e) => e.participants === filter || e.participants === 'both')
}

export function getWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  const end = endOfWeek(anchor, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export function getMonthDays(anchor: Date): Date[] {
  const start = startOfWeek(new Date(anchor.getFullYear(), anchor.getMonth(), 1), { weekStartsOn: 1 })
  const end = endOfWeek(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export function eventsForDay(events: TripEvent[], day: Date): TripEvent[] {
  return events
    .filter((e) => isSameDay(parseISO(e.startAt), day))
    .sort((a, b) => a.startAt.localeCompare(b.startAt) || a.sortOrder - b.sortOrder)
}

export function getUpcomingEvents(events: TripEvent[], limit = 3): TripEvent[] {
  const now = new Date()
  return events
    .filter((e) => parseISO(e.startAt) >= now)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, limit)
}

export function getCurrentOrNextEvent(events: TripEvent[]): TripEvent | null {
  const now = new Date()
  const sorted = [...events].sort((a, b) => a.startAt.localeCompare(b.startAt))

  for (const event of sorted) {
    const start = parseISO(event.startAt)
    const end = event.endAt ? parseISO(event.endAt) : addDays(start, 0)
    if (isWithinInterval(now, { start, end: end > start ? end : addDays(start, 1) })) {
      return event
    }
  }

  return sorted.find((e) => parseISO(e.startAt) > now) ?? null
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function participantColor(participant: Participant): string {
  switch (participant) {
    case 'paula':
      return 'var(--color-paula)'
    case 'jovi':
      return 'var(--color-jovi)'
    default:
      return 'var(--color-both)'
  }
}
