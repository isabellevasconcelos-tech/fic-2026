import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/modules', label: 'Trilhas', emoji: '📚' },
  { to: '/profile', label: 'Perfil', emoji: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            <span className="nav-icon">{emoji}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
