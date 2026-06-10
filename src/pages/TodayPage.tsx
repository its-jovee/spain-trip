import { motion } from 'framer-motion'
import { useTripStore } from '../hooks/useTripStore'
import { getCurrentOrNextEvent, getUpcomingEvents, formatRelativeCountdown, formatEventDate, formatEventTime } from '../lib/utils'
import { EventCard } from '../components/events/EventCard'
import { TRIP_START } from '../lib/constants'

export function TodayPage() {
  const { events } = useTripStore()
  const current = getCurrentOrNextEvent(events)
  const upcoming = getUpcomingEvents(events, 4)
  const now = new Date()
  const beforeTrip = now < TRIP_START

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Today</p>
        <h1 className="page-title">
          {beforeTrip ? 'Countdown' : current ? 'Up next' : 'All clear'}
        </h1>
        <p className="page-subtitle">
          {beforeTrip
            ? `Departure ${formatRelativeCountdown(TRIP_START.toISOString())}`
            : current
              ? `${current.title} — ${formatEventTime(current.startAt)}`
              : 'Nothing scheduled right now'}
        </p>
      </header>

      {beforeTrip && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}
        >
          <p className="small-caps" style={{ marginBottom: '0.5rem' }}>
            Until GRU → MAD
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400 }}>
            {formatRelativeCountdown(TRIP_START.toISOString())}
          </p>
        </motion.div>
      )}

      {current && !beforeTrip && (
        <section style={{ marginBottom: '2rem' }}>
          <p className="small-caps" style={{ marginBottom: '0.75rem' }}>
            Now / Next
          </p>
          <EventCard event={current} />
        </section>
      )}

      <section>
        <p className="small-caps" style={{ marginBottom: '0.75rem' }}>
          Coming up
        </p>
        {upcoming.length === 0 ? (
          <p style={{ color: 'var(--color-ink-muted)' }}>No upcoming plans yet — add some from Calendar.</p>
        ) : (
          upcoming.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div style={{ marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
                {formatEventDate(event.startAt)}
              </div>
              <EventCard event={event} compact />
            </motion.div>
          ))
        )}
      </section>
    </div>
  )
}
