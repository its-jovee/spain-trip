import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addMonths, subMonths, addWeeks, subWeeks, format, startOfDay } from 'date-fns'
import { useTripStore } from '../hooks/useTripStore'
import type { ParticipantFilter, TripEvent } from '../types'
import { getMonthDays, getWeekDays } from '../lib/utils'
import { FilterBar } from '../components/ui/FilterBar'
import { MonthView } from '../components/calendar/MonthView'
import { WeekView } from '../components/calendar/WeekView'
import { AddPlanSheet } from '../components/events/AddPlanSheet'
import { MovePlanSheet } from '../components/events/MovePlanSheet'

type ViewMode = 'month' | 'week'

export function CalendarPage() {
  const navigate = useNavigate()
  const { events, addEvent, moveEvent, reorderEvents } = useTripStore()
  const [view, setView] = useState<ViewMode>('month')
  const [anchor, setAnchor] = useState(new Date())
  const [filter, setFilter] = useState<ParticipantFilter>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [moveEvent_, setMoveEvent] = useState<TripEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>()

  const monthDays = getMonthDays(anchor)
  const weekDays = getWeekDays(anchor)

  function navigatePrev() {
    setAnchor(view === 'month' ? subMonths(anchor, 1) : subWeeks(anchor, 1))
  }

  function navigateNext() {
    setAnchor(view === 'month' ? addMonths(anchor, 1) : addWeeks(anchor, 1))
  }

  function handleDayClick(day: Date) {
    navigate(`/itinerary?day=${format(day, 'yyyy-MM-dd')}`)
  }

  function handleAddPlan(day: Date) {
    setDefaultDate(startOfDay(day).toISOString())
    setAddOpen(true)
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Calendar</p>
        <h1 className="page-title">{format(anchor, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d")}</h1>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className={`filter-btn ${view === 'month' ? 'active' : ''}`}
          onClick={() => setView('month')}
        >
          Month
        </button>
        <button
          type="button"
          className={`filter-btn ${view === 'week' ? 'active' : ''}`}
          onClick={() => setView('week')}
        >
          Week
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn-ghost" onClick={navigatePrev}>
          ←
        </button>
        <button type="button" className="btn-ghost" onClick={() => setAnchor(new Date())}>
          Today
        </button>
        <button type="button" className="btn-ghost" onClick={navigateNext}>
          →
        </button>
      </div>

      <FilterBar value={filter} onChange={setFilter} />

      {view === 'month' ? (
        <MonthView
          anchor={anchor}
          events={events}
          filter={filter}
          days={monthDays}
          onDayClick={handleDayClick}
          onAddPlan={handleAddPlan}
        />
      ) : (
        <WeekView
          days={weekDays}
          events={events}
          filter={filter}
          onReorder={(dayKey, ids) => void reorderEvents(dayKey, ids)}
          onMove={setMoveEvent}
          onAddPlan={handleAddPlan}
        />
      )}

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
