import type { Participant, TripUserId } from '../types'
import { TRIP_USERS } from './constants'

export function getUser(id: TripUserId) {
  return TRIP_USERS[id]
}

export function participantsToUsers(participant: Participant) {
  if (participant === 'both') return [TRIP_USERS.joao, TRIP_USERS.paula]
  return [TRIP_USERS[participant]]
}
