import { createContext } from 'react'
import type { TripUser, TripUserId } from '../types'

export interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  user: TripUser | null
  login: (userId: TripUserId, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
