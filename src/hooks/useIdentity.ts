import { useCallback, useState } from 'react'

export type Identity = 'jovi' | 'paula'

const KEY = 'spain-trip-identity'

export function useIdentity() {
  const [identity, setIdentityState] = useState<Identity>(
    () => (localStorage.getItem(KEY) as Identity) ?? 'jovi',
  )

  const setIdentity = useCallback((value: Identity) => {
    localStorage.setItem(KEY, value)
    setIdentityState(value)
  }, [])

  return { identity, setIdentity }
}
