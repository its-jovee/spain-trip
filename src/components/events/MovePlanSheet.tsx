import { useState } from 'react'
import { format, parseISO, setHours, setMinutes } from 'date-fns'
import type { TripEvent } from '../../types'
import { formatEventDate, formatEventTime } from '../../lib/utils'
import { Sheet } from '../ui/Sheet'

interface Props {
  event: TripEvent | null
  open: boolean
  onClose: () => void
  onMove: (eventId: string, newStartAt: string) => Promise<void>
}

function MovePlanForm({
  event,
  onMove,
  onClose,
}: {
  event: TripEvent
  onMove: (eventId: string, newStartAt: string) => Promise<void>
  onClose: () => void
}) {
  const start = parseISO(event.startAt)
  const [date, setDate] = useState(format(start, 'yyyy-MM-dd'))
  const [time, setTime] = useState(format(start, 'HH:mm'))
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const [h, m] = time.split(':').map(Number)
      let newStart = parseISO(`${date}T00:00:00`)
      newStart = setHours(setMinutes(newStart, m), h)
      await onMove(event.id, newStart.toISOString())
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '1.25rem' }}>
        <strong>{event.title}</strong>
        <br />
        Currently {formatEventDate(event.startAt)} at {formatEventTime(event.startAt)}
      </p>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">New date</label>
            <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">New time</label>
            <input className="form-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Moving…' : 'Move plan'}
        </button>
      </form>
    </>
  )
}

export function MovePlanSheet({ event, open, onClose, onMove }: Props) {
  return (
    <Sheet open={open} onClose={onClose} title="Move plan">
      {event && <MovePlanForm key={event.id} event={event} onMove={onMove} onClose={onClose} />}
    </Sheet>
  )
}
