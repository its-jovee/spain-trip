import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SHARED_AUTH_EMAIL, STORAGE_KEYS } from '../lib/constants'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession()
        setIsAuthenticated(!!data.session)
      } else {
        setIsAuthenticated(localStorage.getItem(STORAGE_KEYS.auth) === 'true')
      }
      setLoading(false)
    }
    void checkAuth()
  }, [])

  const login = useCallback(async (passcode: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: SHARED_AUTH_EMAIL,
        password: passcode,
      })
      if (error) throw error
      setIsAuthenticated(true)
      return
    }

    const expected = import.meta.env.VITE_APP_PASSCODE ?? 'spain2026'
    if (passcode !== expected) {
      throw new Error('Incorrect passcode')
    }
    localStorage.setItem(STORAGE_KEYS.auth, 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(STORAGE_KEYS.auth)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, logout }),
    [isAuthenticated, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
