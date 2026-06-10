import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TripUserId } from '../types'
import { TRIP_USERS } from '../lib/constants'
import { useAuth } from '../hooks/useAuth'
import { UserAvatar } from '../components/ui/UserAvatar'

export function LoginPage() {
  const { login } = useAuth()
  const [selectedUser, setSelectedUser] = useState<TripUserId>('joao')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(selectedUser, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not sign in'
      setError(
        message.toLowerCase().includes('invalid login credentials')
          ? 'Wrong password for this account.'
          : message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: '2rem',
      }}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="small-caps" style={{ marginBottom: '0.5rem' }}>
          João & Paula
        </p>
        <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Spain Trip
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
          Sign in as yourself
        </p>

        <div className="login-user-picker" style={{ marginBottom: '1.5rem' }}>
          {(['joao', 'paula'] as TripUserId[]).map((id) => {
            const user = TRIP_USERS[id]
            const selected = selectedUser === id
            return (
              <button
                key={id}
                type="button"
                className={`login-user-card ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedUser(id)}
              >
                <UserAvatar userId={id} size={56} />
                <span className="login-user-name">{user.name}</span>
              </button>
            )
          })}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password for {TRIP_USERS[selectedUser].name}
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          {error && (
            <p style={{ color: '#b45309', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : `Continue as ${TRIP_USERS[selectedUser].name}`}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
