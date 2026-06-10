import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useTripStore } from '../hooks/useTripStore'
import { UserAvatar } from '../components/ui/UserAvatar'

export function ChecklistsPage() {
  const { user } = useAuth()
  const { checklists, toggleChecklistItem } = useTripStore()

  if (!user) return null

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Checklists</p>
        <h1 className="page-title">Ready to go</h1>
        <p className="page-subtitle">
          Checking off as <strong>{user.name}</strong> — syncs between phones
        </p>
      </header>

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
                    onChange={() => void toggleChecklistItem(checklist.id, item.id, user.id)}
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
                    <UserAvatar userId={item.checkedBy} size={22} />
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
