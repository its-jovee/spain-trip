import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'
import { UserAvatar } from '../components/ui/UserAvatar'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const [copied, setCopied] = useState(false)

  const calendarUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/calendar.ics?token=${import.meta.env.VITE_CALENDAR_TOKEN ?? 'your-secret-calendar-token'}`
      : ''

  async function copyCalendarUrl() {
    await navigator.clipboard.writeText(calendarUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return null

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Settings</p>
        <h1 className="page-title">Trip setup</h1>
      </header>

      <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <UserAvatar userId={user.id} size={48} />
          <div>
            <p style={{ fontWeight: 450 }}>{user.name}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>{user.email}</p>
          </div>
        </div>
      </section>

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
