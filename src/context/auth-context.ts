import { createContext } from 'react'

export interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  login: (passcode: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
