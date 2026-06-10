import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TripUser, TripUserId } from '../types'
import { STORAGE_KEYS, TRIP_USERS, resolveUserFromEmail } from '../lib/constants'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

function loadStoredUser(): TripUser | null {
  const id = localStorage.getItem(STORAGE_KEYS.authUser) as TripUserId | null
  return id && TRIP_USERS[id] ? TRIP_USERS[id] : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TripUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user.email) {
          setUser(resolveUserFromEmail(data.session.user.email))
        } else {
          setUser(null)
        }
      } else {
        setUser(loadStoredUser())
      }
      setLoading(false)
    }
    void checkAuth()

    if (!supabase) return

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email) {
        setUser(resolveUserFromEmail(session.user.email))
      } else {
        setUser(null)
      }
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const login = useCallback(async (userId: TripUserId, password: string) => {
    const tripUser = TRIP_USERS[userId]

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: tripUser.email,
        password,
      })
      if (error) throw error
      setUser(tripUser)
      return
    }

    const expected = import.meta.env.VITE_APP_PASSCODE ?? 'spain2026'
    if (password !== expected) {
      throw new Error('Incorrect password')
    }
    localStorage.setItem(STORAGE_KEYS.authUser, userId)
    setUser(tripUser)
  }, [])

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(STORAGE_KEYS.authUser)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      loading,
      user,
      login,
      logout,
    }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
