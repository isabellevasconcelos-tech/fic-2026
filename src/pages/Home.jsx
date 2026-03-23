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

const FEATURE_CARDS = [
  { to: '/chat',          emoji: '🧙', label: 'Fale com Auron',      desc: 'Tire suas dúvidas' },
  { to: '/reality-check', emoji: '💀', label: 'Choque de Realidade', desc: 'Gastos e receitas' },
  { to: '/story',         emoji: '🎮', label: 'Aprenda Jogando',     desc: 'Histórias interativas' },
  { to: '/modules',       emoji: '📚', label: 'Suas Trilhas',        desc: 'Educação financeira' },
  { to: '/simulator',     emoji: '🐷', label: 'Economia',            desc: 'Simule suas economias' },
  { to: '/profile',       emoji: '📊', label: 'Seu Progresso',       desc: 'Acompanhe sua evolução' },
]

function getDailyPhrase() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length]
}

export default function Home() {
  const { profile } = useAuth()
  const dailyPhrase = useMemo(() => getDailyPhrase(), [])

  return (
    <div className="pb-28 px-4 pt-4 animate-fade-in flex flex-col gap-3">

      {/* ── Título ── */}
      <div className="text-center py-2">
        <h1
          className="font-display text-4xl font-bold text-gold-accent tracking-wide leading-none inline-block"
          style={{ textShadow: '0 0 24px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3), 0 2px 6px rgba(0,0,0,0.8)' }}
        >
          MoneyQuest
        </h1>
        <p className="text-xs text-enchanted-muted font-heading tracking-[0.12em] mt-1.5">
          Sua jornada financeira começa aqui
        </p>
      </div>

      {/* ── Pensamento do Dia ── */}
      <div className="card-primary p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-lg"
            style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
          >
            💡
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-heading text-xs font-semibold text-enchanted uppercase tracking-widest block">
              Pensamento do Dia
            </span>
            <span className="text-enchanted-muted/70 text-[11px] font-body block mt-0.5 italic leading-relaxed">
              "{dailyPhrase.text}"
            </span>
          </div>
        </div>
      </div>

      {/* ── Explorar ── */}
      <div>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-enchanted tracking-wide mb-3 px-1">
          Explorar
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {FEATURE_CARDS.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="group card-primary rounded-2xl flex items-center gap-3 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-accent/40 active:scale-[0.97]"
              style={{ boxShadow: '0 0 12px rgba(212,175,55,0.15), 0 0 30px rgba(212,175,55,0.08), inset 0 0 12px rgba(212,175,55,0.03)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-lg"
                style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
              >
                {card.emoji}
              </div>
              <div className="min-w-0">
                <span className="font-heading text-xs font-semibold text-enchanted block leading-tight">
                  {card.label}
                </span>
                <span className="text-enchanted-muted/50 text-[11px] font-body block mt-0.5">
                  {card.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
