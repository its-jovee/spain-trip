import { motion } from 'framer-motion'
import { useTripStore } from '../hooks/useTripStore'
import { useIdentity } from '../hooks/useIdentity'

export function ChecklistsPage() {
  const { checklists, toggleChecklistItem } = useTripStore()
  const { identity, setIdentity } = useIdentity()

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Checklists</p>
        <h1 className="page-title">Ready to go</h1>
        <p className="page-subtitle">Shared lists — checked items sync between phones</p>
      </header>

      <div className="participant-picker" style={{ marginBottom: '1.5rem' }}>
        {(['jovi', 'paula'] as const).map((who) => (
          <button
            key={who}
            type="button"
            className={`participant-option ${identity === who ? 'selected' : ''}`}
            onClick={() => setIdentity(who)}
          >
            Checking as {who === 'jovi' ? 'Jovi' : 'Paula'}
          </button>
        ))}
      </div>

      {checklists.map((checklist, ci) => {
        const done = checklist.items.filter((i) => i.checked).length
        const total = checklist.items.length

        return (
          <motion.section
            key={checklist.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.06 }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
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
                    borderBottom: ii < checklist.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <motion.input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => void toggleChecklistItem(checklist.id, item.id, identity)}
                    whileTap={{ scale: 0.9 }}
                    style={{ marginTop: '0.2rem', width: '1.1rem', height: '1.1rem', accentColor: 'var(--color-ink)' }}
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
                  {item.checked && item.checkedBy && (
                    <span className="small-caps">{item.checkedBy}</span>
                  )}
                </label>
              ))}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
