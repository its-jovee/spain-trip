import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(passcode)
    } catch {
      setError('Incorrect passcode')
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
          Jovi & Paula
        </p>
        <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Spain Trip
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>
          Enter your shared passcode to continue
        </p>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="passcode">
              Passcode
            </label>
            <input
              id="passcode"
              className="form-input"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          {error && (
            <p style={{ color: '#b45309', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Opening…' : 'Enter'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
