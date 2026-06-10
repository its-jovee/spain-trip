import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Today', icon: '◎' },
  { to: '/itinerary', label: 'Plans', icon: '≡' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/documents', label: 'Docs', icon: '▤' },
  { to: '/checklists', label: 'Lists', icon: '☑' },
  { to: '/settings', label: 'More', icon: '⋯' },
]

export function BottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--nav-height) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        background: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 40,
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            fontSize: '0.65rem',
            fontVariant: 'small-caps',
            letterSpacing: '0.06em',
            color: isActive ? 'var(--color-ink)' : 'var(--color-ink-faint)',
            textDecoration: 'none',
            padding: '0.35rem 0.5rem',
          })}
        >
          <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
