import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/modules', label: 'Controle', emoji: '📊' },
  { to: '/achievements', label: 'Missões', emoji: '🎯' },
  { to: '/profile', label: 'Perfil', emoji: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
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