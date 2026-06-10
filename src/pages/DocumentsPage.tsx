import { motion } from 'framer-motion'
import { useTripStore } from '../hooks/useTripStore'

export function DocumentsPage() {
  const { documents } = useTripStore()

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Documents</p>
        <h1 className="page-title">Travel papers</h1>
        <p className="page-subtitle">Confirmations, tickets, and insurance</p>
      </header>

      {documents.length === 0 ? (
        <p style={{ color: 'var(--color-ink-muted)' }}>
          No documents yet. Drop your PDFs here when ready — we'll extract the details automatically.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {documents.map((doc, i) => (
            <motion.a
              key={doc.id}
              href={doc.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.1rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  color: 'var(--color-accent)',
                }}
              >
                PDF
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 450 }}>{doc.name}</p>
                <p className="small-caps" style={{ marginTop: '0.15rem' }}>
                  Tap to open
                </p>
              </div>
              <span style={{ color: 'var(--color-ink-faint)' }}>→</span>
            </motion.a>
          ))}
        </div>
      )}

      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: 'var(--color-ink-faint)',
          textAlign: 'center',
        }}
      >
        Real PDFs will appear here once uploaded to Supabase Storage.
      </p>
    </div>
  )
}
