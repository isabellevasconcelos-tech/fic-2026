import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TopBar() {
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-900/95 border-b border-gold-accent/10">
      <div className="flex items-center justify-between h-14 px-4">
        {/* XP */}
        <Link to="/profile" className="flex items-center gap-1.5 bg-dark-700/60 border border-gold-accent/20 rounded-full px-3 py-1.5 hover:border-gold-accent/40 transition-colors">
          <span className="text-base">🪙</span>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-sm font-bold text-gold-accent">{profile?.xp || 0}</span>
            <span className="text-[9px] text-enchanted-muted/60 font-heading uppercase tracking-wider">XP</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
        {/* Perfil */}
        <Link to="/profile" className="flex items-center gap-2 group p-1">
          <div className="w-10 h-10 rounded-full bg-rose-pastel border border-gold-accent/25 flex items-center justify-center text-lg shrink-0 group-hover:border-gold-accent/50 transition-colors">
            {profile?.avatar_emoji || '💰'}
          </div>
        </Link>

        {/* Menu 3 pontos */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-rose-pastel/30 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-enchanted-muted">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-48 py-1.5 rounded-xl bg-dark-700 border border-gold-accent/15 shadow-xl animate-fade-in z-50">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-enchanted-muted hover:text-enchanted hover:bg-rose-pastel/20 transition-colors font-body"
              >
                <span>👤</span> Meu Perfil
              </Link>
              <Link
                to="/modules"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-enchanted-muted hover:text-enchanted hover:bg-rose-pastel/20 transition-colors font-body"
              >
                <span>📚</span> Trilhas
              </Link>
              <hr className="my-1.5 border-rose-light/20" />
              <button
                onClick={() => { setMenuOpen(false); signOut?.() }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neon-pink hover:bg-rose-pastel/20 transition-colors w-full text-left font-body"
              >
                <span>🚪</span> Sair
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  )
}
