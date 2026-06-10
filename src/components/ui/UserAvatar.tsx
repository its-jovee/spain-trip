import { useState } from 'react'
import type { TripUser, TripUserId } from '../../types'
import { TRIP_USERS } from '../../lib/constants'

interface Props {
  userId: TripUserId
  size?: number
  showName?: boolean
}

export function UserAvatar({ userId, size = 28, showName = false }: Props) {
  const user = TRIP_USERS[userId]
  const [imgError, setImgError] = useState(false)

  return (
    <span className="user-avatar-wrap" title={user.name}>
      <span
        className={`user-avatar user-avatar--${userId}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {!imgError ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{user.name.charAt(0)}</span>
        )}
      </span>
      {showName && <span className="user-avatar-name">{user.name}</span>}
    </span>
  )
}

export function UserAvatarGroup({ users, size = 24 }: { users: TripUser[]; size?: number }) {
  return (
    <span className="user-avatar-group">
      {users.map((user, index) => (
        <span key={user.id} className="user-avatar-group-item" style={{ zIndex: users.length - index }}>
          <UserAvatar userId={user.id} size={size} />
        </span>
      ))}
    </span>
  )
}
