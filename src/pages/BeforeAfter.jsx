import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

// ========================
// HISTORIAS DE TRANSFORMACAO
// ========================
const STORIES = [
  {
    id: 'lucas',
    name: 'Lucas, 19 anos',
    avatar: '👦',
    title: 'De zerado a R$3.000 guardados',
    before: {
      label: 'Antes',
      habits: [
        { icon: '🍔', text: 'iFood todo dia', cost: 'R$750/mes' },
        { icon: '🛍️', text: 'Shopee toda semana', cost: 'R$400/mes' },
        { icon: '🚗', text: 'Uber pra tudo', cost: 'R$300/mes' },
        { icon: '💳', text: 'Cartao sempre no limite', cost: 'R$200/mes juros' },
      ],
      savings: 0,
      debt: 2800,
      emoji: '😰',
      quote: '"Meu salario acabava no dia 10"',
    },
    after: {
      label: 'Depois de 6 meses',
      habits: [
        { icon: '🍳', text: 'Cozinha em casa', save: 'Economiza R$500/mes' },
        { icon: '📋', text: 'Lista antes de comprar', save: 'Economiza R$350/mes' },
        { icon: '🚌', text: 'Transporte publico', save: 'Economiza R$200/mes' },
        { icon: '✅', text: 'Paga fatura inteira', save: 'Economiza R$200/mes juros' },
      ],
      savings: 3000,
      debt: 0,
      emoji: '😎',
      quote: '"Tenho reserva de emergencia pela primeira vez na vida"',
    },
    tip: 'Comecou cortando o iFood pra 2x/semana. So isso ja salvou R$400/mes.',
    timeMonths: 6,
  },
  {
    id: 'ana',
    name: 'Ana, 22 anos',
    avatar: '👩',
    title: 'Saiu das dividas e comecou a investir',
    before: {
      label: 'Antes',
      habits: [
        { icon: '💳', text: '3 cartoes no rotativo', cost: 'R$1.200/mes juros' },
        { icon: '🛒', text: 'Compras parceladas em tudo', cost: 'R$800/mes parcelas' },
        { icon: '🤷', text: 'Zero controle de gastos', cost: 'Sem ideia pra onde ia' },
        { icon: '😢', text: 'Nome sujo no SPC', cost: 'Sem credito' },
      ],
      savings: 0,
      debt: 8500,
      emoji: '😩',
      quote: '"Tinha medo de abrir o app do banco"',
    },
    after: {
      label: 'Depois de 12 meses',
      habits: [
        { icon: '📊', text: 'Planilha de gastos', save: 'Controle total' },
        { icon: '💰', text: 'Negociou dividas com 60% desconto', save: 'Pagou R$3.400 ao inves de R$8.500' },
        { icon: '🏦', text: 'R$200/mes no Tesouro Selic', save: 'Rendendo mais que poupanca' },
        { icon: '✨', text: 'Nome limpo!', save: 'Score 750+' },
      ],
      savings: 2400,
      debt: 0,
      emoji: '🤩',
      quote: '"Pela primeira vez meu dinheiro trabalha PRA mim"',
    },
    tip: 'Primeiro passo: ligou pro banco e negociou. Reducao de 60% na divida na hora.',
    timeMonths: 12,
  },
  {
    id: 'pedro',
    name: 'Pedro, 17 anos',
    avatar: '🧑',
    title: 'Juntou R$1.500 pra comprar seu PC',
    before: {
      label: 'Antes',
      habits: [
        { icon: '🍫', text: 'R$15/dia na cantina', cost: 'R$330/mes' },
        { icon: '🎮', text: 'Skins de jogo toda semana', cost: 'R$120/mes' },
        { icon: '🥤', text: 'Energetico todo dia', cost: 'R$240/mes' },
        { icon: '🤦', text: 'Pedia dinheiro pros pais', cost: 'Zero independencia' },
      ],
      savings: 0,
      debt: 0,
      emoji: '😕',
      quote: '"Queria um PC gamer mas nunca conseguia juntar"',
    },
    after: {
      label: 'Depois de 5 meses',
      habits: [
        { icon: '🥪', text: 'Leva lanche de casa', save: 'Economiza R$250/mes' },
        { icon: '🎮', text: 'Battle pass so 1x por temporada', save: 'Economiza R$100/mes' },
        { icon: '💧', text: 'Garrafa d\'agua de casa', save: 'Economiza R$200/mes' },
        { icon: '💪', text: 'Meta clara: PC gamer', save: 'R$300/mes guardado' },
      ],
      savings: 1500,
      debt: 0,
      emoji: '🔥',
      quote: '"Comprei meu PC SEM pedir nada pra ninguem"',
    },
    tip: 'Colocou foto do PC como tela de bloqueio. Toda vez que ia gastar, via a meta.',
    timeMonths: 5,
  },
  {
    id: 'maria',
    name: 'Maria, 25 anos',
    avatar: '👩‍🦱',
    title: 'De salario em salario a viagem internacional',
    before: {
      label: 'Antes',
      habits: [
        { icon: '☕', text: 'Starbucks todo dia', cost: 'R$450/mes' },
        { icon: '👗', text: 'Fast fashion toda semana', cost: 'R$600/mes' },
        { icon: '📱', text: '5 assinaturas de streaming', cost: 'R$180/mes' },
        { icon: '🤷‍♀️', text: 'Sobrava R$0 no fim do mes', cost: 'Zero poupanca' },
      ],
      savings: 0,
      debt: 1200,
      emoji: '😤',
      quote: '"Ganhava bem mas nao sobrava NADA"',
    },
    after: {
      label: 'Depois de 8 meses',
      habits: [
        { icon: '☕', text: 'Cafe em casa (melhor ate)', save: 'Economiza R$380/mes' },
        { icon: '👗', text: 'Brechó e compras planejadas', save: 'Economiza R$450/mes' },
        { icon: '📱', text: '2 streamings (os que usa de vdd)', save: 'Economiza R$120/mes' },
        { icon: '✈️', text: 'Meta: Europa', save: 'R$800/mes investido' },
      ],
      savings: 6400,
      debt: 0,
      emoji: '✈️',
      quote: '"Fui pra Portugal com dinheiro proprio. Melhor sensacao do mundo."',
    },
    tip: 'Regra: pra cada R$1 que gastava em desejo, guardava R$1 pra viagem.',
    timeMonths: 8,
  },
]

// ========================
// ANIMATED NUMBER
// ========================
function AnimatedNumber({ value, duration = 1000, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const start = 0
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (value - start) * eased))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => ref.current && cancelAnimationFrame(ref.current)
  }, [value])

  return <>{prefix}{display.toLocaleString('pt-BR')}{suffix}</>
}

// ========================
// SCROLL REVEAL
// ========================
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.15 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function BeforeAfter() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const feedback = useFeedback()
  const [activeStory, setActiveStory] = useState(0)
  const [showAfter, setShowAfter] = useState(false)
  const [userGoal, setUserGoal] = useState(null)
  const [userStats, setUserStats] = useState({ lessons: 0, quizzes: 0 })

  // Fetch user progress for the "your journey" section
  useEffect(() => {
    if (user) fetchStats()
  }, [user])

  async function fetchStats() {
    const [l, q] = await Promise.all([
      supabase.from('user_progress').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('user_quiz_results').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
    ])
    setUserStats({ lessons: l.count || 0, quizzes: q.count || 0 })
  }

  const story = STORIES[activeStory]

  function revealAfter() {
    setShowAfter(true)
    feedback?.trigger('reveal')
    setTimeout(() => feedback?.trigger('success', { emoji: '🎉', title: 'Transformacao!', subtitle: story.title }), 600)
  }

  function nextStory() {
    setShowAfter(false)
    setActiveStory(i => (i + 1) % STORIES.length)
    feedback?.trigger('tap')
  }

  function prevStory() {
    setShowAfter(false)
    setActiveStory(i => (i - 1 + STORIES.length) % STORIES.length)
    feedback?.trigger('tap')
  }

  // Estimated user savings potential
  const savingsPotential = useMemo(() => {
    const base = (userStats.lessons * 85) + (userStats.quizzes * 40)
    return base
  }, [userStats])

  // User journey phase
  const journeyPhase = useMemo(() => {
    const total = userStats.lessons + userStats.quizzes
    if (total === 0) return { emoji: '🌱', label: 'Comecando', color: 'text-text-muted', message: 'Voce esta no comeco da jornada. Cada passo conta!' }
    if (total < 5) return { emoji: '🌿', label: 'Brotando', color: 'neon-text', message: 'Ja deu os primeiros passos! O conhecimento esta crescendo.' }
    if (total < 10) return { emoji: '🌳', label: 'Crescendo', color: 'neon-text-cyan', message: 'Voce ja aprendeu bastante. Continue assim!' }
    return { emoji: '🏆', label: 'Florindo', color: 'neon-text-yellow', message: 'Voce esta dominando suas financas. Impressionante!' }
  }, [userStats])

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-lg border-b border-dark-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-text-muted hover:text-text-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title text-sm">ANTES vs DEPOIS</h1>
          <span className="text-xs text-text-muted font-heading">{activeStory + 1}/{STORIES.length}</span>
        </div>
      </div>

      <div className="px-4 pb-12">

        {/* ==================== */}
        {/* HERO                 */}
        {/* ==================== */}
        <div className="text-center py-6 animate-fade-in">
          <span className="text-5xl block mb-3">🔄</span>
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">
            Historias <span className="neon-text">reais</span> de transformacao
          </h2>
          <p className="text-text-muted text-sm font-heading max-w-xs mx-auto">
            Pessoas comuns que mudaram seus habitos financeiros. Veja o antes e depois.
          </p>
        </div>

        {/* ==================== */}
        {/* STORY SELECTOR       */}
        {/* ==================== */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveStory(i); setShowAfter(false); feedback?.trigger('tap') }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                i === activeStory
                  ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
                  : 'bg-dark-700 border-dark-500 text-text-muted hover:border-dark-400'
              }`}
            >
              <span className="text-lg">{s.avatar}</span>
              <span className="font-heading text-xs font-semibold">{s.name.split(',')[0]}</span>
            </button>
          ))}
        </div>

        {/* ==================== */}
        {/* STORY CARD           */}
        {/* ==================== */}
        <Reveal key={story.id}>
          {/* Profile header */}
          <div className="neon-card p-5 mb-4 text-center">
            <span className="text-4xl block mb-2">{story.avatar}</span>
            <h3 className="font-heading text-lg font-bold text-text-primary">{story.name}</h3>
            <p className="font-display text-sm font-bold neon-text mt-1">{story.title}</p>
          </div>

          {/* BEFORE */}
          <div className="neon-card p-5 mb-1 border-neon-pink/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-neon-pink/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{story.before.emoji}</span>
              <div>
                <h4 className="font-display text-sm font-bold text-neon-pink">{story.before.label}</h4>
                <p className="text-[11px] text-text-muted font-heading">O ponto de partida</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              {story.before.habits.map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-neon-pink/[0.03] border border-neon-pink/10 rounded-xl p-3">
                  <span className="text-lg shrink-0">{h.icon}</span>
                  <span className="font-heading text-sm text-text-secondary flex-1">{h.text}</span>
                  <span className="text-xs font-heading text-neon-pink shrink-0">{h.cost}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted font-heading mb-1">Guardado</p>
                <p className="font-display text-lg font-bold text-neon-pink">R$0</p>
              </div>
              <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted font-heading mb-1">Dividas</p>
                <p className="font-display text-lg font-bold text-neon-pink">
                  {story.before.debt > 0 ? `R$${story.before.debt.toLocaleString('pt-BR')}` : 'R$0'}
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-text-muted font-heading mt-4 italic">
              {story.before.quote}
            </p>
          </div>

          {/* ARROW / REVEAL BUTTON */}
          <div className="flex justify-center py-3">
            {!showAfter ? (
              <button
                onClick={revealAfter}
                className="bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-bold px-8 py-3 rounded-full hover:bg-neon-green/20 transition-all hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <span>Ver a transformacao</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-neon-green animate-fade-in">
                <div className="w-8 h-px bg-neon-green/30" />
                <svg className="w-6 h-6 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="w-8 h-px bg-neon-green/30" />
              </div>
            )}
          </div>

          {/* AFTER */}
          {showAfter && (
            <div className="animate-slide-up">
              <div className="neon-card p-5 mb-4 border-neon-green/20 relative overflow-hidden">
                <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-neon-green/5 blur-2xl" />

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{story.after.emoji}</span>
                  <div>
                    <h4 className="font-display text-sm font-bold neon-text">{story.after.label}</h4>
                    <p className="text-[11px] text-text-muted font-heading">{story.timeMonths} meses de mudanca</p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  {story.after.habits.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-neon-green/[0.03] border border-neon-green/10 rounded-xl p-3 animate-slide-up"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <span className="text-lg shrink-0">{h.icon}</span>
                      <span className="font-heading text-sm text-text-secondary flex-1">{h.text}</span>
                      <span className="text-xs font-heading text-neon-green shrink-0">{h.save}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-text-muted font-heading mb-1">Guardado</p>
                    <p className="font-display text-lg font-bold neon-text">
                      R$<AnimatedNumber value={story.after.savings} />
                    </p>
                  </div>
                  <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-text-muted font-heading mb-1">Dividas</p>
                    <p className="font-display text-lg font-bold neon-text">R$0</p>
                  </div>
                </div>

                <p className="text-center text-sm text-text-secondary font-heading mt-4 italic">
                  {story.after.quote}
                </p>
              </div>

              {/* Dica chave */}
              <div className="neon-card p-4 mb-4 border-neon-yellow/20">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">💡</span>
                  <div>
                    <p className="font-heading text-xs font-semibold text-neon-yellow mb-1">Dica que mudou tudo</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{story.tip}</p>
                  </div>
                </div>
              </div>

              {/* Comparacao numerica */}
              <div className="neon-card p-5 mb-4">
                <h4 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">O impacto em numeros</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-text-muted font-heading">Divida</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neon-pink font-heading line-through">R${story.before.debt.toLocaleString('pt-BR')}</span>
                        <span className="text-xs">→</span>
                        <span className="text-xs neon-text font-heading font-bold">R$0</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-neon-pink to-neon-green rounded-full transition-all duration-1000" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-text-muted font-heading">Poupanca</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neon-pink font-heading">R$0</span>
                        <span className="text-xs">→</span>
                        <span className="text-xs neon-text font-heading font-bold">R${story.after.savings.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-1000"
                        style={{ width: '100%', transitionDelay: '300ms' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-text-muted font-heading">Humor financeiro</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{story.before.emoji}</span>
                        <span className="text-xs">→</span>
                        <span className="text-lg">{story.after.emoji}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-yellow to-neon-green rounded-full transition-all duration-1000"
                        style={{ width: '100%', transitionDelay: '600ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={prevStory}
              className="flex-1 bg-dark-700 border border-dark-500 text-text-secondary font-heading font-semibold py-3 rounded-lg hover:border-dark-400 transition-all"
            >
              ← Anterior
            </button>
            <button
              onClick={nextStory}
              className="flex-1 bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
            >
              Proxima →
            </button>
          </div>
        </Reveal>

        {/* ==================== */}
        {/* SUA JORNADA          */}
        {/* ==================== */}
        <Reveal className="mb-8">
          <div className="neon-card p-5 border-neon-green/20 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-neon-green/5 blur-3xl" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🪞</span>
              <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider">Sua propria jornada</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{journeyPhase.emoji}</span>
              <div>
                <p className={`font-display text-lg font-bold ${journeyPhase.color}`}>{journeyPhase.label}</p>
                <p className="text-xs text-text-muted font-heading">{journeyPhase.message}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold neon-text">{userStats.lessons}</p>
                <p className="text-[10px] text-text-muted font-heading">Aulas</p>
              </div>
              <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold neon-text-cyan">{userStats.quizzes}</p>
                <p className="text-[10px] text-text-muted font-heading">Quizzes</p>
              </div>
              <div className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold neon-text-yellow">{profile?.xp || 0}</p>
                <p className="text-[10px] text-text-muted font-heading">XP</p>
              </div>
            </div>

            {savingsPotential > 0 && (
              <div className="bg-neon-green/[0.04] border border-neon-green/15 rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted font-heading mb-1">Potencial de economia estimado</p>
                <p className="font-display text-xl font-bold neon-text">
                  R$<AnimatedNumber value={savingsPotential} />/mes
                </p>
                <p className="text-[10px] text-text-muted font-heading mt-1">Baseado no conhecimento adquirido</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* ==================== */}
        {/* SEU ANTES vs DEPOIS  */}
        {/* ==================== */}
        <Reveal className="mb-8">
          <div className="neon-card p-5">
            <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✍️</span> Crie seu proprio "antes vs depois"
            </h3>

            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Qual e o seu objetivo financeiro? Escolha uma meta e comece sua transformacao hoje.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { emoji: '🏦', label: 'Reserva de emergencia', value: 'reserva' },
                { emoji: '🚗', label: 'Comprar algo grande', value: 'compra' },
                { emoji: '💳', label: 'Sair das dividas', value: 'divida' },
                { emoji: '📈', label: 'Comecar a investir', value: 'investir' },
              ].map(goal => (
                <button
                  key={goal.value}
                  onClick={() => { setUserGoal(goal.value); feedback?.trigger('tap') }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    userGoal === goal.value
                      ? 'bg-neon-green/10 border-neon-green/40 scale-[1.03]'
                      : 'bg-dark-800/50 border-dark-600 hover:border-dark-400'
                  }`}
                >
                  <span className="text-2xl block mb-1">{goal.emoji}</span>
                  <p className={`font-heading text-xs font-semibold ${userGoal === goal.value ? 'text-neon-green' : 'text-text-primary'}`}>
                    {goal.label}
                  </p>
                </button>
              ))}
            </div>

            {userGoal && (
              <div className="mt-4 p-4 bg-neon-green/[0.04] border border-neon-green/15 rounded-xl animate-slide-up">
                <p className="font-heading text-sm font-semibold neon-text mb-2">
                  {userGoal === 'reserva' && '🏦 Meta: Reserva de Emergencia'}
                  {userGoal === 'compra' && '🚗 Meta: Compra Planejada'}
                  {userGoal === 'divida' && '💳 Meta: Zerar Dividas'}
                  {userGoal === 'investir' && '📈 Meta: Primeiro Investimento'}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {userGoal === 'reserva' && 'Comece guardando R$50/mes. Em 6 meses voce tera R$300 — ja e um comeco! Use o Tesouro Selic pra render mais que poupanca.'}
                  {userGoal === 'compra' && 'Defina o valor, divida pelos meses, e guarde todo mes. Coloque foto do item como tela do celular — funciona!'}
                  {userGoal === 'divida' && 'Liste todas as dividas, comece pela de MAIOR juros. Ligue pro banco e negocie — desconto de 40-60% e comum!'}
                  {userGoal === 'investir' && 'Abra conta em uma corretora (e gratis). Comece com Tesouro Selic — a partir de R$30. Invista todo mes, mesmo pouco.'}
                </p>
                <button
                  onClick={() => navigate('/modules')}
                  className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-heading font-semibold py-2.5 rounded-lg hover:bg-neon-green/20 transition-all text-sm"
                >
                  Comecar a aprender →
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/reality-check')}
            className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-3 rounded-lg hover:bg-neon-pink/20 transition-all"
          >
            💀 Choque de Realidade
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-dark-700 border border-dark-500 text-text-secondary font-heading font-semibold py-3 rounded-lg hover:border-dark-400 transition-all"
          >
            Voltar ao Inicio
          </button>
        </div>
      </div>
    </div>
  )
}
