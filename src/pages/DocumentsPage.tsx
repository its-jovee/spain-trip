import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTripStore } from '../hooks/useTripStore'

export function DocumentsPage() {
  const { documents } = useTripStore()
  const [opening, setOpening] = useState<string | null>(null)

  async function openDocument(docId: string, url?: string) {
    if (!url || url === '#') {
      alert('PDF not available yet. Run: npm run upload-pdfs')
      return
    }
    setOpening(docId)
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpening(null)
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="small-caps">Documents</p>
        <h1 className="page-title">Travel papers</h1>
        <p className="page-subtitle">Confirmations, tickets, and insurance</p>
      </header>

      {documents.length === 0 ? (
        <p style={{ color: 'var(--color-ink-muted)' }}>No documents yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {documents.map((doc, i) => (
            <motion.button
              key={doc.id}
              type="button"
              className="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => void openDocument(doc.id, doc.url)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.1rem',
                textAlign: 'left',
                width: '100%',
                cursor: doc.url ? 'pointer' : 'not-allowed',
                opacity: doc.url ? 1 : 0.6,
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
                  {opening === doc.id ? 'Opening…' : doc.url ? 'Tap to open' : 'Upload pending'}
                </p>
              </div>
              <span style={{ color: 'var(--color-ink-faint)' }}>→</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
