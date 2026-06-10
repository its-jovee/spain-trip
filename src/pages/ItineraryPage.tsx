import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTripStore } from '../hooks/useTripStore'
import type { ParticipantFilter, TripEvent } from '../types'
import { groupEventsByDay, filterByParticipant, formatDayHeading } from '../lib/utils'
import { EventCard } from '../components/events/EventCard'
import { FilterBar } from '../components/ui/FilterBar'
import { AddPlanSheet } from '../components/events/AddPlanSheet'
import { MovePlanSheet } from '../components/events/MovePlanSheet'

export function ItineraryPage() {
  const { events, addEvent, moveEvent } = useTripStore()
  const [searchParams] = useSearchParams()
  const dayParam = searchParams.get('day')
  const [filter, setFilter] = useState<ParticipantFilter>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [moveEvent_, setMoveEvent] = useState<TripEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>()

  const filtered = filterByParticipant(events, filter)
  const grouped = groupEventsByDay(filtered)

  const entries = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Itinerary</p>
        <h1 className="page-title">Our plans</h1>
        <p className="page-subtitle">Flights, stays, and everything in between</p>
      </header>

      <FilterBar value={filter} onChange={setFilter} />

      {entries.map(([dayKey, dayEvents], sectionIndex) => {
        const isHighlighted = dayParam && dayKey.startsWith(dayParam)
        return (
          <motion.section
            key={dayKey}
            id={dayKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sectionIndex * 0.04 }}
            style={{
              marginBottom: '2rem',
              scrollMarginTop: '1rem',
              outline: isHighlighted ? '2px solid var(--color-accent)' : 'none',
              borderRadius: 'var(--radius-sm)',
              padding: isHighlighted ? '0.5rem' : 0,
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 450,
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {formatDayHeading(dayKey)}
            </h2>
            {dayEvents.map((event) => (
              <EventCard key={event.id} event={event} onMove={setMoveEvent} />
            ))}
          </motion.section>
        )
      })}

      <button
        type="button"
        className="fab"
        aria-label="Add plan"
        onClick={() => {
          setDefaultDate(undefined)
          setAddOpen(true)
        }}
      >
        +
      </button>

      <AddPlanSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (event) => { await addEvent(event) }}
        defaultDate={defaultDate}
      />

      <MovePlanSheet
        event={moveEvent_}
        open={!!moveEvent_}
        onClose={() => setMoveEvent(null)}
        onMove={moveEvent}
      />
    </div>
  )
}
