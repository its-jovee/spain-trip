import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TripEvent } from '../../types'
import { EVENT_TYPE_LABELS } from '../../lib/constants'
import { formatEventTime } from '../../lib/utils'
import { ParticipantChip } from '../ui/ParticipantChip'

interface Props {
  event: TripEvent
  onMove?: (event: TripEvent) => void
  compact?: boolean
}

export function EventCard({ event, onMove, compact = false }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      className="card event-card"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: compact ? '0.5rem' : '0.75rem', overflow: 'hidden' }}
    >
      <button
        type="button"
        className="event-card-header"
        onClick={() => !compact && setExpanded((v) => !v)}
        onContextMenu={(e) => {
          e.preventDefault()
          onMove?.(event)
        }}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: compact ? '0.65rem 0.85rem' : '1rem 1.1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="small-caps">{EVENT_TYPE_LABELS[event.type]}</span>
            <ParticipantChip participant={event.participants} />
          </div>
          <h3 style={{ fontSize: compact ? '0.95rem' : '1.05rem', fontWeight: 450 }}>{event.title}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '0.15rem' }}>
            {formatEventTime(event.startAt)}
            {event.location && ` · ${event.location}`}
          </p>
        </div>
        {!compact && (
          <span style={{ color: 'var(--color-ink-faint)', fontSize: '1.1rem', lineHeight: 1 }}>
            {expanded ? '−' : '+'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.1rem 1.1rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.85rem',
              }}
            >
              {event.confirmationCode && (
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span className="small-caps">Confirmation </span>
                  <strong>{event.confirmationCode}</strong>
                </p>
              )}
              {event.notes && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '0.75rem' }}>
                  {event.notes}
                </p>
              )}
              {event.details && (
                <dl style={{ margin: 0, fontSize: '0.85rem' }}>
                  {Object.entries(event.details).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <dt className="small-caps" style={{ minWidth: '5rem' }}>
                        {key}
                      </dt>
                      <dd style={{ margin: 0 }}>{val}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {onMove && (
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ marginTop: '0.75rem', padding: 0 }}
                  onClick={() => onMove(event)}
                >
                  Move to another day →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
