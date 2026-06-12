import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TripLeg } from '../types'
import { useAuth } from '../hooks/useAuth'
import { useTripStore } from '../hooks/useTripStore'
import { TRIP_LEGS } from '../lib/checklists'
import { UserAvatar } from '../components/ui/UserAvatar'

export function ChecklistsPage() {
  const { user } = useAuth()
  const { checklists, toggleChecklistItem } = useTripStore()
  const [activeLeg, setActiveLeg] = useState<TripLeg>('gru-mad')

  const legChecklists = useMemo(
    () => checklists.filter((c) => c.leg === activeLeg),
    [checklists, activeLeg],
  )

  const legProgress = useMemo(() => {
    const done = legChecklists.reduce((n, c) => n + c.items.filter((i) => i.checked).length, 0)
    const total = legChecklists.reduce((n, c) => n + c.items.length, 0)
    return { done, total }
  }, [legChecklists])

  const activeMeta = TRIP_LEGS.find((l) => l.id === activeLeg)!

  if (!user) return null

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Checklists</p>
        <h1 className="page-title">Ready to go</h1>
        <p className="page-subtitle">
          {activeMeta.subtitle} · checking as <strong>{user.name}</strong>
        </p>
      </header>

      <div className="leg-tabs" role="tablist" aria-label="Trip leg">
        {TRIP_LEGS.map((leg) => {
          const lists = checklists.filter((c) => c.leg === leg.id)
          const done = lists.reduce((n, c) => n + c.items.filter((i) => i.checked).length, 0)
          const total = lists.reduce((n, c) => n + c.items.length, 0)
          const complete = total > 0 && done === total

          return (
            <button
              key={leg.id}
              type="button"
              role="tab"
              aria-selected={activeLeg === leg.id}
              className={`leg-tab ${activeLeg === leg.id ? 'active' : ''} ${complete ? 'complete' : ''}`}
              onClick={() => setActiveLeg(leg.id)}
            >
              <span className="leg-tab-label">{leg.label}</span>
              {total > 0 && (
                <span className="leg-tab-count">
                  {done}/{total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="small-caps" style={{ marginBottom: '1.25rem', color: 'var(--color-ink-muted)' }}>
        {legProgress.done}/{legProgress.total} done on this leg
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLeg}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {legChecklists.map((checklist) => {
            const done = checklist.items.filter((i) => i.checked).length
            const total = checklist.items.length

            return (
              <section key={checklist.id} style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.35rem',
                  }}
                >
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 450 }}>{checklist.title}</h2>
                  <span className="small-caps">
                    {done}/{total}
                  </span>
                </div>
                {checklist.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginBottom: '0.75rem' }}>
                    {checklist.description}
                  </p>
                )}

                <div className="card" style={{ overflow: 'hidden' }}>
                  {checklist.items.map((item, ii) => (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        borderBottom:
                          ii < checklist.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <motion.input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => void toggleChecklistItem(checklist.id, item.id, user.id)}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          marginTop: '0.2rem',
                          width: '1.1rem',
                          height: '1.1rem',
                          accentColor: 'var(--color-ink)',
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: '0.95rem',
                          textDecoration: item.checked ? 'line-through' : 'none',
                          color: item.checked ? 'var(--color-ink-faint)' : 'var(--color-ink)',
                        }}
                      >
                        {item.text}
                      </span>
                      {item.checked && item.checkedBy && <UserAvatar userId={item.checkedBy} size={22} />}
                    </label>
                  ))}
                </div>
              </section>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
