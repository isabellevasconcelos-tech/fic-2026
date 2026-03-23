import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MOTIVATIONAL_PHRASES = [
  { text: 'Cada real guardado hoje é liberdade amanhã.' },
  { text: 'Quem controla o dinheiro, controla a vida.' },
  { text: 'Investir em conhecimento rende os melhores juros.' },
  { text: 'Seu eu do futuro vai agradecer suas escolhas de hoje.' },
  { text: 'Pequenas economias, grandes conquistas.' },
  { text: 'Dinheiro não traz felicidade, mas organização traz paz.' },
  { text: 'O melhor momento pra começar a guardar foi ontem. O segundo melhor é agora.' },
]

const FEATURED_CARD = { to: '/story', emoji: '🎮', label: 'Aprenda Jogando', desc: 'Sua jornada no Reino de Valoria' }

const GRID_CARDS = [
  { to: '/reality-check', emoji: '💀', label: 'Choque de Realidade', desc: 'Gastos e receitas' },
  { to: '/simulator',     emoji: '🐷', label: 'Economia',            desc: 'Simule suas economias' },
  { to: '/profile',       emoji: '📊', label: 'Seu Progresso',       desc: 'Acompanhe sua evolução' },
  { to: '/quiz-battle',   emoji: '⚔️', label: 'Quiz Battle',         desc: 'Teste seus conhecimentos' },
]

function getDailyPhrase() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length]
}

export default function Home() {
  const { profile } = useAuth()
  const dailyPhrase = useMemo(() => getDailyPhrase(), [])

  return (
    <div className="animate-fade-in py-6 sm:py-10">
      <div className="enchanted-book">
        <div className="book-cover">
          {/* Spine */}
          <div className="book-spine" />

          {/* Page edges (right) */}
          <div className="book-page-edges" />

          {/* Bookmark ribbon */}
          <div className="book-bookmark" />

          {/* Page content */}
          <div className="book-page">

            {/* ── Title Page ── */}
            <div className="book-title-area">
              {/* Top ornament — double line with star */}
              <div className="book-ornament mb-4">
                <span className="book-ornament-line" />
                <svg width="12" height="12" viewBox="0 0 8 8" className="text-gold-accent/30">
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                </svg>
                <span className="book-ornament-line" />
              </div>
              <div className="book-ornament mb-4" style={{ width: '50%', margin: '0 auto 1rem' }}>
                <span className="book-ornament-line" />
                <svg width="22" height="22" viewBox="0 0 8 8" className="text-gold-accent/60">
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                </svg>
                <span className="book-ornament-line" />
              </div>

              <h1 className="font-display text-5xl sm:text-6xl font-black home-brand-title leading-tight relative inline-block">
                Money
                <br />
                Quest
                <span className="brand-sparkle absolute" style={{ top: '-12px', left: '10%', '--s-color': '#FFD700', '--s-size': '2.5px', '--s-speed': '2s', '--s-delay': '0s' }} />
                <span className="brand-sparkle absolute" style={{ top: '-6px', right: '2%', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '1.7s', '--s-delay': '0.6s' }} />
                <span className="brand-sparkle absolute" style={{ bottom: '0px', left: '35%', '--s-color': '#FFD700', '--s-size': '2px', '--s-speed': '2.2s', '--s-delay': '0.3s' }} />
                <span className="brand-sparkle absolute" style={{ top: '40%', left: '-8px', '--s-color': '#C0C0C0', '--s-size': '1.5px', '--s-speed': '1.9s', '--s-delay': '1s' }} />
                <span className="brand-sparkle absolute" style={{ top: '30%', right: '-6px', '--s-color': '#FFD700', '--s-size': '1.5px', '--s-speed': '2.4s', '--s-delay': '0.8s' }} />
              </h1>

              <p className="font-heading text-xs sm:text-sm text-gold-accent/70 uppercase tracking-[0.35em] mt-3 font-semibold">
                Educação Financeira
              </p>

              <p className="text-enchanted-muted text-sm italic mt-2 mb-1">
                {dailyPhrase.text}
              </p>

              {/* Bottom ornament */}
              <div className="book-ornament mt-3" style={{ width: '50%', margin: '0.75rem auto 0' }}>
                <span className="book-ornament-line" />
                <svg width="22" height="22" viewBox="0 0 8 8" className="text-gold-accent/60">
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                </svg>
                <span className="book-ornament-line" />
              </div>
            </div>

            {/* ═══ Card Destaque — Aprenda Jogando ═══ */}
            <Link
              to={FEATURED_CARD.to}
              className="block no-underline group relative mb-5 rounded-xl overflow-hidden border-2 border-gold-accent/40 transition-all duration-500 hover:border-gold-accent/70 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              style={{
                background: 'linear-gradient(135deg, rgba(53,36,24,0.8) 0%, rgba(42,14,20,0.5) 50%, rgba(53,36,24,0.7) 100%)',
              }}
            >
              {/* Top gold bar */}
              <div className="h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent" />

              <div className="flex items-center gap-4 p-4 sm:p-5 relative">
                {/* Icon — wax seal style */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 border-gold-accent/50 shadow-[0_0_15px_rgba(212,175,55,0.15),inset_0_2px_4px_rgba(255,255,255,0.05)] group-hover:border-gold-accent/80 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-500"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
                >
                  {FEATURED_CARD.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-heading text-sm sm:text-base text-enchanted uppercase tracking-widest block">
                    {FEATURED_CARD.label}
                  </span>
                  <span className="text-enchanted-muted text-xs sm:text-sm block mt-0.5">
                    {FEATURED_CARD.desc}
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center group-hover:bg-gold-accent/20 group-hover:border-gold-accent/50 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-accent group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom gold bar */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-rose-accent/40 to-transparent" />

              {/* Corner sparkles */}
              <span className="brand-sparkle absolute" style={{ top: '6px', right: '14px', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2s', '--s-delay': '0s' }} />
              <span className="brand-sparkle absolute" style={{ bottom: '6px', left: '14px', '--s-color': '#FFD700', '--s-size': '1.5px', '--s-speed': '1.8s', '--s-delay': '0.7s' }} />
            </Link>

            {/* ═══ Menu Items — grid de cards com selos de cera ═══ */}
            <div className="grid grid-cols-2 gap-3">
              {GRID_CARDS.map((card, i) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="no-underline group block"
                >
                  <div className="home-menu-card flex flex-col items-center text-center gap-2 py-4 px-2 rounded-xl border border-gold-accent/35 transition-all duration-400 hover:border-gold-accent/70 active:scale-[0.97]"
                    style={{
                      background: 'linear-gradient(155deg, rgba(55,40,24,0.6), rgba(35,22,15,0.65))',
                      boxShadow: '0 2px 15px rgba(0,0,0,0.35), 0 0 15px rgba(212,175,55,0.1), 0 0 30px rgba(212,175,55,0.05), inset 0 1px 0 rgba(212,175,55,0.08)',
                    }}
                  >
                    {/* Wax seal icon */}
                    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl border-2 border-gold-accent/55 group-hover:border-gold-accent/80 group-hover:scale-110 transition-all duration-400 relative"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 40%, #5A1420 80%, #3A0E15)',
                        boxShadow: '0 3px 15px rgba(0,0,0,0.45), 0 0 20px rgba(139,26,43,0.25), 0 0 10px rgba(212,175,55,0.1), inset 0 1px 4px rgba(255,255,255,0.1)',
                      }}
                    >
                      {card.emoji}
                      {/* Outer ring */}
                      <span className="absolute inset-[-5px] rounded-full border border-gold-accent/15 pointer-events-none" />
                      {/* Sparkle */}
                      <span className="brand-sparkle absolute" style={{ top: '-3px', right: '6px', '--s-color': '#FFD700', '--s-size': '2px', '--s-speed': '2s', '--s-delay': `${i * 0.3}s` }} />
                    </div>

                    <span className="font-heading text-xs text-gold-accent uppercase tracking-[0.15em]">
                      {card.label}
                    </span>
                    <span className="text-enchanted-muted text-[10px] leading-tight -mt-1">
                      {card.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Bottom ornament ── */}
            <div className="book-ornament mt-5 mb-1">
              <span className="book-ornament-line" />
              <span className="text-gold-accent/20 text-[10px] font-heading tracking-widest uppercase">Fim</span>
              <span className="book-ornament-line" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
