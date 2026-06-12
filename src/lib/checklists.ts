import type { TripLeg } from '../types'

export const TRIP_LEGS: { id: TripLeg; label: string; subtitle: string }[] = [
  { id: 'gru-mad', label: 'GRU → MAD', subtitle: 'Fly out · Madrid first stay' },
  { id: 'mad-sev', label: 'MAD → SEV', subtitle: 'Train to Sevilla · anniversary' },
  { id: 'sev-mad', label: 'SEV → MAD', subtitle: 'Back to Madrid · Alba' },
  { id: 'mad-gru', label: 'MAD → GRU', subtitle: 'Fly home' },
]

export function legFromDb(value: string | null | undefined): TripLeg {
  if (value === 'mad-sev' || value === 'sev-mad' || value === 'mad-gru') return value
  return 'gru-mad'
}
