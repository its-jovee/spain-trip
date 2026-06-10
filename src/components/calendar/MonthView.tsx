import { format, isSameDay, isSameMonth, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import type { ParticipantFilter, TripEvent } from '../../types'
import { eventsForDay, filterByParticipant } from '../../lib/utils'
interface Props {
  anchor: Date
  events: TripEvent[]
  filter: ParticipantFilter
  onDayClick: (date: Date) => void
  onAddPlan: (date: Date) => void
  days: Date[]
}

export function MonthView({ anchor, events, filter, onDayClick, onAddPlan, days }: Props) {
  const filtered = filterByParticipant(events, filter)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '0.5rem',
        }}
      >
        {weekDays.map((d) => (
          <div key={d} className="small-caps" style={{ textAlign: 'center', padding: '0.25rem' }}>
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {days.map((day) => {
          const dayEvents = eventsForDay(filtered, day)
          const inMonth = isSameMonth(day, anchor)
          const isToday = isSameDay(day, new Date())

          return (
            <motion.button
              key={day.toISOString()}
              type="button"
              layout
              onClick={() => onDayClick(day)}
              onDoubleClick={() => onAddPlan(day)}
              style={{
                aspectRatio: '1',
                minHeight: '3.5rem',
                padding: '0.25rem',
                border: isToday ? '2px solid var(--color-ink)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                background: inMonth ? 'white' : 'var(--color-paper-dark)',
                opacity: inMonth ? 1 : 0.5,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  color: isToday ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                }}
              >
                {format(day, 'd')}
              </span>
              {dayEvents.slice(0, 2).map((e) => (
                <span
                  key={e.id}
                  style={{
                    fontSize: '0.55rem',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--color-ink-muted)',
                  }}
                >
                  {format(parseISO(e.startAt), 'HH:mm')} {e.title}
                </span>
              ))}
              {dayEvents.length > 2 && (
                <span style={{ fontSize: '0.5rem', color: 'var(--color-ink-faint)' }}>
                  +{dayEvents.length - 2}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', marginTop: '0.75rem', textAlign: 'center' }}>
        Tap a day to view · double-tap to add
      </p>
    </div>
  )
}
