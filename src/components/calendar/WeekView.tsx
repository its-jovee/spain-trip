import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
import type { ParticipantFilter, TripEvent } from '../../types'
import { eventsForDay, filterByParticipant } from '../../lib/utils'
import { EventCard } from '../events/EventCard'

interface Props {
  days: Date[]
  events: TripEvent[]
  filter: ParticipantFilter
  onReorder: (dayKey: string, orderedIds: string[]) => void
  onMove: (event: TripEvent) => void
  onAddPlan: (date: Date) => void
}

function SortableEvent({ event, onMove }: { event: TripEvent; onMove: (e: TripEvent) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EventCard event={event} onMove={onMove} compact />
    </div>
  )
}

export function WeekView({ days, events, filter, onReorder, onMove, onAddPlan }: Props) {
  const filtered = filterByParticipant(events, filter)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(day: Date, dayEvents: TripEvent[]) {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const ids = dayEvents.map((e) => e.id)
      const oldIndex = ids.indexOf(active.id as string)
      const newIndex = ids.indexOf(over.id as string)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = [...ids]
      reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, active.id as string)
      onReorder(format(day, 'yyyy-MM-dd'), reordered)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {days.map((day) => {
        const dayEvents = eventsForDay(filtered, day)
        const isToday = isSameDay(day, new Date())

        return (
          <motion.section
            key={day.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '0.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 450,
                  borderBottom: isToday ? '2px solid var(--color-ink)' : 'none',
                  paddingBottom: isToday ? '0.15rem' : 0,
                }}
              >
                {format(day, 'EEE d MMM')}
              </h3>
              <button type="button" className="btn-ghost" onClick={() => onAddPlan(day)}>
                + Add
              </button>
            </div>

            {dayEvents.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-faint)', padding: '0.5rem 0' }}>
                Nothing planned
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd(day, dayEvents)}
              >
                <SortableContext items={dayEvents.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  {dayEvents.map((event) => (
                    <SortableEvent key={event.id} event={event} onMove={onMove} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </motion.section>
        )
      })}
    </div>
  )
}
