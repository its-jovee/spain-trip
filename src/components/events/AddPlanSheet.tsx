import { useState } from 'react'
import { format, parseISO, setHours, setMinutes } from 'date-fns'
import type { EventType, Participant, TripEvent } from '../../types'
import { AI_PLAN_ENABLED } from '../../lib/constants'
import { Sheet } from '../ui/Sheet'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (event: Omit<TripEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  defaultDate?: string
}

const TYPES: EventType[] = ['activity', 'restaurant', 'hotel', 'train', 'flight']

export function AddPlanSheet({ open, onClose, onSave, defaultDate }: Props) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('activity')
  const [date, setDate] = useState(defaultDate?.slice(0, 10) ?? format(new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = useState('10:00')
  const [location, setLocation] = useState('')
  const [participants, setParticipants] = useState<Participant>('both')
  const [notes, setNotes] = useState('')
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAiParse() {
    if (!aiText.trim()) return
    setAiLoading(true)
    setAiMessage('')
    try {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      })
      const data = await res.json()
      if (data.enabled && data.event) {
        if (data.event.title) setTitle(data.event.title)
        if (data.event.type) setType(data.event.type)
        if (data.event.startAt) {
          const d = parseISO(data.event.startAt)
          setDate(format(d, 'yyyy-MM-dd'))
          setTime(format(d, 'HH:mm'))
        }
        if (data.event.location) setLocation(data.event.location)
        if (data.event.participants) setParticipants(data.event.participants)
        if (data.event.notes) setNotes(data.event.notes)
        setAiMessage('Parsed — review and save.')
      } else {
        setAiMessage(data.message ?? 'AI quick-add coming soon. Use the form below.')
      }
    } catch {
      setAiMessage('AI quick-add coming soon. Use the form below.')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const [h, m] = time.split(':').map(Number)
      let start = parseISO(`${date}T00:00:00`)
      start = setHours(setMinutes(start, m), h)

      await onSave({
        type,
        title: title.trim(),
        startAt: start.toISOString(),
        location: location.trim() || undefined,
        participants,
        notes: notes.trim() || undefined,
        sortOrder: 99,
      })
      setTitle('')
      setLocation('')
      setNotes('')
      setAiText('')
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add a plan">
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Quick add {AI_PLAN_ENABLED ? '' : '(coming soon)'}</label>
        <textarea
          className="form-textarea"
          placeholder='e.g. "Prado museum Tuesday 10am, just Paula"'
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          rows={2}
        />
        <button
          type="button"
          className="btn-ghost"
          style={{ marginTop: '0.5rem' }}
          onClick={() => void handleAiParse()}
          disabled={aiLoading}
        >
          {aiLoading ? 'Parsing…' : 'Parse with AI'}
        </button>
        {aiMessage && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '0.35rem' }}>{aiMessage}</p>
        )}
      </div>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label">What</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Museum visit, dinner, etc."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value as EventType)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Where</label>
          <input
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Who</label>
          <div className="participant-picker">
            {(['both', 'joao', 'paula'] as Participant[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`participant-option ${participants === p ? 'selected' : ''}`}
                onClick={() => setParticipants(p)}
              >
                {p === 'both' ? 'João & Paula' : p === 'paula' ? 'Paula' : 'João'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional"
            rows={2}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Saving…' : 'Add plan'}
        </button>
      </form>
    </Sheet>
  )
}
