import { useCallback, useEffect, useState } from 'react'
import { SHARED_AUTH_EMAIL, STORAGE_KEYS } from '../lib/constants'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useAuth() {
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

  return { isAuthenticated, loading, login, logout }
}
