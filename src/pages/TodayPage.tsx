import { motion } from 'framer-motion'
import { isToday, parseISO } from 'date-fns'
import { useTripStore } from '../hooks/useTripStore'
import {
  getCurrentOrNextEvent,
  getDepartureEvent,
  getTripPhase,
  getUpcomingEvents,
  formatDepartureCountdown,
  formatEventDate,
  formatEventTime,
} from '../lib/utils'
import { EventCard } from '../components/events/EventCard'

export function TodayPage() {
  const { events } = useTripStore()
  const departure = getDepartureEvent(events)
  const phase = getTripPhase(events)
  const current = getCurrentOrNextEvent(events)
  const upcoming = getUpcomingEvents(events, 4)

  const heading =
    phase === 'before'
      ? 'Countdown'
      : phase === 'departure-day'
        ? 'Departure day'
        : phase === 'after'
          ? 'Welcome home'
          : current
            ? 'Up next'
            : 'All clear'

  const subtitle = (() => {
    if (phase === 'before' && departure) {
      return `GRU → MAD ${formatDepartureCountdown(departure.startAt)}`
    }
    if (phase === 'departure-day' && departure) {
      return `Flight at ${formatEventTime(departure.startAt)} tonight`
    }
    if (phase === 'after') {
      return 'Hope Spain was wonderful'
    }
    if (current) {
      return `${current.title} — ${formatEventTime(current.startAt)}`
    }
    return 'Nothing scheduled right now'
  })()

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Today</p>
        <h1 className="page-title">{heading}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </header>

      {(phase === 'before' || phase === 'departure-day') && departure && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}
        >
          <p className="small-caps" style={{ marginBottom: '0.5rem' }}>
            {phase === 'departure-day' ? 'Tonight — GRU → MAD' : 'Until departure'}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400 }}>
            {formatDepartureCountdown(departure.startAt)}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '0.5rem' }}>
            {formatEventDate(departure.startAt)} · {formatEventTime(departure.startAt)}
          </p>
        </motion.div>
      )}

      {phase === 'during' && current && (
        <section style={{ marginBottom: '2rem' }}>
          <p className="small-caps" style={{ marginBottom: '0.75rem' }}>
            Now / Next
          </p>
          <EventCard event={current} />
        </section>
      )}

      {phase !== 'after' && (
        <section>
          <p className="small-caps" style={{ marginBottom: '0.75rem' }}>
            Coming up
          </p>
          {upcoming.length === 0 ? (
            <p style={{ color: 'var(--color-ink-muted)' }}>No upcoming plans — add some from Plans.</p>
          ) : (
            upcoming.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{ marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
                  {isToday(parseISO(event.startAt)) ? 'Today' : formatEventDate(event.startAt)}
                </div>
                <EventCard event={event} compact />
              </motion.div>
            ))
          )}
        </section>
      )}
    </div>
  )
}
