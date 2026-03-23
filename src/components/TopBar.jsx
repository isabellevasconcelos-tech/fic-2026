import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TopBar() {
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuLinks = [
    { to: '/profile', label: 'Meu Perfil', icon: '👤' },
    { to: '/story', label: 'Aprenda Jogando', icon: '🎮' },
    { to: '/reality-check', label: 'Choque de Realidade', icon: '💀' },
    { to: '/simulator', label: 'Economia', icon: '🐷' },
    { to: '/quiz-battle', label: 'Quiz Battle', icon: '⚔️' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-900/95 border-b border-gold-accent/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Home icon + Brand */}
        <Link to="/" className="no-underline flex items-center gap-2 group">
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive('/') ? 'bg-rose-pastel/40 border border-gold-accent/50 shadow-md' : 'group-hover:bg-rose-pastel/20'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${isActive('/') ? 'text-gold-accent' : 'text-enchanted-muted group-hover:text-gold-accent'}`}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className={`text-[9px] font-heading tracking-wider uppercase ${isActive('/') ? 'text-gold-accent' : 'text-enchanted-muted'}`}>
              Home
            </span>
          </div>
          <div className="flex flex-col relative">
            <span className="home-brand-title font-display text-xl tracking-wide relative">
              Money Quest
              <span className="brand-sparkle absolute" style={{ top: '-4px', left: '8px', '--s-color': '#D4AF37', '--s-size': '1.5px', '--s-speed': '2.2s', '--s-delay': '0s' }} />
              <span className="brand-sparkle absolute" style={{ top: '2px', right: '12px', '--s-color': '#C0C0C0', '--s-size': '1px', '--s-speed': '1.8s', '--s-delay': '0.6s' }} />
              <span className="brand-sparkle absolute" style={{ bottom: '0px', left: '45%', '--s-color': '#D4AF37', '--s-size': '1px', '--s-speed': '2.5s', '--s-delay': '1.2s' }} />
            </span>
            <span className="text-[11px] text-enchanted-muted font-heading tracking-[0.15em] italic -mt-0.5">
              Educação Financeira
            </span>
          </div>
        </Link>

        {/* Right: XP + Avatar + Menu */}
        <div className="flex items-center gap-3">
          {/* XP coin */}
          <Link to="/profile" className="no-underline flex flex-col items-center gap-0.5 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-dark-700/60 border border-gold-accent/20 group-hover:border-gold-accent/40 transition-all">
              <span className="text-base">🪙</span>
            </div>
            <span className="text-[9px] font-heading tracking-wider uppercase text-gold-accent font-bold">
              {profile?.xp || 0} xp
            </span>
          </Link>

          {/* Avatar */}
          <Link to="/profile" className="no-underline flex flex-col items-center gap-0.5 group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border transition-all ${
              isActive('/profile') ? 'border-gold-accent/50 shadow-md' : 'border-gold-accent/20 group-hover:border-gold-accent/40'
            }`}
              style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
            >
              {profile?.avatar_emoji || '💰'}
            </div>
            <span className={`text-[9px] font-heading tracking-wider uppercase ${isActive('/profile') ? 'text-gold-accent' : 'text-enchanted-muted'}`}>
              Perfil
            </span>
          </Link>

          {/* Menu button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-none p-0 group"
            >
              <div className="w-9 h-9 flex items-center justify-center text-enchanted-muted group-hover:text-gold-accent transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {menuOpen ? (
                    <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
                  ) : (
                    <path d="M4 6H20M4 12H20M4 18H20" strokeLinecap="round" />
                  )}
                </svg>
              </div>
              <span className="text-[9px] font-heading tracking-wider uppercase text-enchanted-muted">
                Menu
              </span>
            </button>

            {menuOpen && (
              <nav className="absolute right-0 top-14 w-56 py-1.5 rounded-xl bg-dark-700 border border-gold-accent/15 shadow-xl animate-fade-in z-50">
                {menuLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 no-underline font-heading text-sm tracking-widest uppercase transition-colors ${
                      isActive(link.to)
                        ? 'text-gold-accent bg-rose-pastel/20'
                        : 'text-enchanted-muted hover:text-gold-accent hover:bg-rose-pastel/10'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
                <hr className="my-1.5 border-rose-light/10" />
                <button
                  onClick={() => { setMenuOpen(false); signOut?.() }}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-neon-pink hover:bg-rose-pastel/10 transition-colors w-full text-left font-heading tracking-widest uppercase"
                >
                  <span>🚪</span> Sair
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />
    </header>
  )
}
