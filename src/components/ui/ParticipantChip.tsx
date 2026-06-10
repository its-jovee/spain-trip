import type { Participant } from '../../types'
import { PARTICIPANT_LABELS } from '../../lib/constants'
import { participantsToUsers } from '../../lib/users'
import { UserAvatarGroup } from './UserAvatar'

interface Props {
  participant: Participant
  showLabel?: boolean
}

export function ParticipantChip({ participant, showLabel = false }: Props) {
  const users = participantsToUsers(participant)

  return (
    <span className="participant-chip" title={PARTICIPANT_LABELS[participant]}>
      <UserAvatarGroup users={users} size={22} />
      {showLabel && <span className="participant-chip-label">{PARTICIPANT_LABELS[participant]}</span>}
    </span>
  )
}
