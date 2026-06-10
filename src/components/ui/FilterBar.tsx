import type { ParticipantFilter } from '../../types'
import { PARTICIPANT_LABELS } from '../../lib/constants'

interface Props {
  value: ParticipantFilter
  onChange: (value: ParticipantFilter) => void
}

const OPTIONS: ParticipantFilter[] = ['all', 'both', 'joao', 'paula']

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="filter-bar">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`filter-btn ${value === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt === 'all' ? 'Everyone' : PARTICIPANT_LABELS[opt]}
        </button>
      ))}
    </div>
  )
}
