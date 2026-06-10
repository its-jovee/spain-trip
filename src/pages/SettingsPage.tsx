import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useIdentity } from '../hooks/useIdentity'
import { isSupabaseConfigured } from '../lib/supabase'

export function SettingsPage() {
  const { logout } = useAuth()
  const { identity, setIdentity } = useIdentity()
  const [copied, setCopied] = useState(false)

  const calendarUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/calendar.ics?token=${import.meta.env.VITE_CALENDAR_TOKEN ?? 'your-secret-token'}`
      : ''

  async function copyCalendarUrl() {
    await navigator.clipboard.writeText(calendarUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Settings</p>
        <h1 className="page-title">Trip setup</h1>
      </header>

      <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 450, marginBottom: '0.5rem' }}>Install on your phone</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          <strong>iPhone:</strong> Safari → Share → Add to Home Screen
          <br />
          <strong>Android:</strong> Chrome menu → Install app / Add to Home Screen
        </p>
      </section>

      <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 450, marginBottom: '0.5rem' }}>Calendar feed</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '0.75rem' }}>
          Subscribe once in Google or Apple Calendar — it updates automatically when plans change.
        </p>
        <button type="button" className="btn-primary" onClick={() => void copyCalendarUrl()}>
          {copied ? 'Copied!' : 'Copy calendar URL'}
        </button>
      </section>

      <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 450, marginBottom: '0.5rem' }}>Your identity</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '0.75rem' }}>
          Used when checking off list items so your partner knows who did what.
        </p>
        <div className="participant-picker">
          {(['jovi', 'paula'] as const).map((who) => (
            <button
              key={who}
              type="button"
              className={`participant-option ${identity === who ? 'selected' : ''}`}
              onClick={() => setIdentity(who)}
            >
              {who === 'jovi' ? 'Jovi' : 'Paula'}
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 450, marginBottom: '0.5rem' }}>Sync status</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
          {isSupabaseConfigured
            ? 'Connected to Supabase — changes sync live between phones.'
            : 'Running locally — add Supabase credentials to enable live sync.'}
        </p>
      </section>

      <button type="button" className="btn-ghost" onClick={() => void logout()}>
        Sign out
      </button>
    </div>
  )
}
