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

// Card destaque (full-width)
const FEATURED_CARD = { to: '/story', emoji: '🎮', label: 'Aprenda Jogando', desc: 'Sua jornada no Reino de Valoria' }

// Grid cards
const GRID_CARDS = [
  { to: '/chat',          emoji: '🧙', label: 'Fale com Auron',      desc: 'Tire suas dúvidas' },
  { to: '/reality-check', emoji: '💀', label: 'Choque de Realidade', desc: 'Gastos e receitas' },
  { to: '/modules',       emoji: '📚', label: 'Suas Trilhas',        desc: 'Educação financeira' },
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
    <div className="pb-28 px-4 pt-2 animate-fade-in">

      {/* ── Título ── */}
      <div className="text-center pt-6 pb-4 relative">
        {/* Sparkles */}
        <span className="text-gold-accent/30 text-xs absolute top-4 left-[20%]">✦</span>
        <span className="text-gold-accent/20 text-[10px] absolute top-10 right-[18%]">✦</span>
        <span className="text-gold-accent/15 text-sm absolute top-6 right-[30%]">⭑</span>
        <span className="text-gold-accent/25 text-xs absolute bottom-8 left-[25%]">✦</span>
        <span className="text-gold-accent/15 text-[10px] absolute bottom-10 right-[22%]">✦</span>

        <h1
          className="font-display text-[2.6rem] font-bold text-gold-accent tracking-wider leading-[1.05]"
          style={{ textShadow: '0 0 30px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3), 0 2px 6px rgba(0,0,0,0.8)' }}
        >
          Money<br />Quest
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mt-3 mb-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-accent/40" />
          <span className="text-gold-accent/60 text-[10px]">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-accent/40" />
        </div>

        <p className="text-[11px] font-heading font-semibold text-gold-accent/70 uppercase tracking-[0.2em]">
          Educação Financeira
        </p>
        <p className="text-xs text-enchanted-muted/60 font-body italic mt-1">
          Sua jornada financeira começa aqui.
        </p>
      </div>

      {/* ── Card Destaque (full-width) ── */}
      <Link
        to={FEATURED_CARD.to}
        className="card-primary rounded-2xl flex items-center gap-4 p-4 pr-5 mb-4 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.12), 0 0 40px rgba(212,175,55,0.06), inset 0 0 15px rgba(212,175,55,0.03)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 shadow-lg"
          style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
        >
          {FEATURED_CARD.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-heading text-sm font-bold text-enchanted uppercase tracking-wider block">
            {FEATURED_CARD.label}
          </span>
          <span className="text-enchanted-muted/60 text-xs font-body block mt-0.5">
            {FEATURED_CARD.desc}
          </span>
        </div>
        <svg className="w-5 h-5 text-gold-accent/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* ── Grid de Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        {GRID_CARDS.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="group card-primary rounded-2xl flex flex-col items-center justify-center text-center p-4 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-accent/40 active:scale-[0.97]"
            style={{ boxShadow: '0 0 12px rgba(212,175,55,0.12), 0 0 30px rgba(212,175,55,0.06), inset 0 0 12px rgba(212,175,55,0.03)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg mb-2.5"
              style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
            >
              {card.emoji}
            </div>
            <span className="font-heading text-xs font-bold text-enchanted uppercase tracking-wider block leading-tight">
              {card.label}
            </span>
            <span className="text-enchanted-muted/50 text-[11px] font-body block mt-1">
              {card.desc}
            </span>
          </Link>
        ))}
      </div>

    </div>
  )
}
