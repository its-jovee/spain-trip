import type { Participant } from '../../types'
import { PARTICIPANT_LABELS, PARTICIPANT_MONOGRAM } from '../../lib/constants'

interface Props {
  participant: Participant
  showLabel?: boolean
}

export function ParticipantChip({ participant, showLabel = false }: Props) {
  return (
    <span className={`chip chip--${participant}`} title={PARTICIPANT_LABELS[participant]}>
      {showLabel ? PARTICIPANT_LABELS[participant] : PARTICIPANT_MONOGRAM[participant]}
    </span>
  )
}
