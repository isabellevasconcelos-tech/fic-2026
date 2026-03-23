import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ========================
// GASTOS COMUNS DO DIA-A-DIA
// ========================
const EXPENSES = [
  { id: 'coffee', emoji: '☕', label: 'Cafezinho', daily: 8, desc: 'Cafe na padaria todo dia' },
  { id: 'snack', emoji: '🍫', label: 'Lanchinho', daily: 10, desc: 'Salgado, chocolate, besteira...' },
  { id: 'uber', emoji: '🚗', label: 'Uber/99', daily: 15, desc: 'Corridinha "rapida"' },
  { id: 'cig', emoji: '🚬', label: 'Cigarro', daily: 12, desc: 'Maco por dia' },
  { id: 'delivery', emoji: '🛵', label: 'iFood', daily: 25, desc: 'Almocar por delivery' },
  { id: 'subs', emoji: '📱', label: 'Apps/Assinaturas', daily: 5, desc: 'Streaming, jogos, apps' },
  { id: 'impulse', emoji: '🛍️', label: 'Compra por impulso', daily: 8, desc: 'Shopee, promoção...' },
  { id: 'beer', emoji: '🍺', label: 'Cervejinha', daily: 15, desc: 'Happy hour, bar, rolê' },
]


// Animated counter hook
function useAnimatedNumber(target, duration = 800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const start = value
    const diff = target - start
    if (diff === 0) return
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(start + diff * eased))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }

    ref.current = requestAnimationFrame(tick)
    return () => ref.current && cancelAnimationFrame(ref.current)
  }, [target])

  return value
}

// Animated bar
function AnimatedBar({ value, max, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? (value / max) * 100 : 0), 50 + delay)
    return () => clearTimeout(t)
  }, [value, max])

  return (
    <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${Math.min(width, 100)}%` }}
      />
    </div>
  )
}

// Intersection observer for scroll reveal
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

// Section that fades in on scroll
function RevealSection({ children, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  )
}

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function RealityCheck() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set(['snack', 'coffee']))
  const [showInvest, setShowInvest] = useState(false)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Calculos
  const daily = useMemo(() =>
    EXPENSES.filter(e => selected.has(e.id)).reduce((sum, e) => sum + e.daily, 0)
  , [selected])

  const weekly = daily * 7
  const monthly = Math.round(daily * 30.4)
  const yearly = daily * 365
  const fiveYears = yearly * 5
  const decade = yearly * 10

  // Se investisse com juros compostos (1% ao mes ~ 12.68% ao ano)
  const investedYearly = useMemo(() => {
    // Investindo "monthly" por mes durante 1 ano, 5 anos, 10 anos a 1% am
    const r = 0.01 // 1% ao mes
    const pmt = monthly
    const calc = (months) => {
      if (pmt === 0) return 0
      // FV = PMT * ((1+r)^n - 1) / r
      return Math.round(pmt * (Math.pow(1 + r, months) - 1) / r)
    }
    return { y1: calc(12), y5: calc(60), y10: calc(120) }
  }, [monthly])

  // Animated values
  const animDaily = useAnimatedNumber(daily)
  const animMonthly = useAnimatedNumber(monthly)
  const animYearly = useAnimatedNumber(yearly)
  const animInvest10 = useAnimatedNumber(showInvest ? investedYearly.y10 : 0, 1200)

  // Shock phrases
  const shockPhrases = useMemo(() => {
    const phrases = []
    if (monthly >= 300) phrases.push({ text: `R$${monthly.toLocaleString('pt-BR')}/mes e mais que muita gente ganha de salario minimo`, icon: '😱' })
    if (yearly >= 3600) phrases.push({ text: `Em 1 ano voce queima R$${yearly.toLocaleString('pt-BR')} — da pra comprar um carro usado`, icon: '🚗' })
    if (yearly >= 1800) phrases.push({ text: `Sao ${Math.round(yearly / 1500)} salarios minimos jogados fora por ano`, icon: '💸' })
    if (monthly >= 100) phrases.push({ text: `Se investisse R$${monthly}/mes por 10 anos, teria R$${investedYearly.y10.toLocaleString('pt-BR')}`, icon: '📈' })
    if (daily >= 25) phrases.push({ text: `Voce gasta mais com besteira do que muita gente gasta com comida`, icon: '🤯' })
    if (phrases.length === 0) phrases.push({ text: `Mesmo R$${daily}/dia vira R$${yearly.toLocaleString('pt-BR')} no ano. Nao subestime!`, icon: '⚡' })
    return phrases.slice(0, 3)
  }, [daily, monthly, yearly, investedYearly])

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header fixo */}
      <div className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-lg border-b border-dark-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-text-muted hover:text-text-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title text-sm">CHOQUE DE REALIDADE</h1>
          <div className="flex items-center gap-1.5 bg-dark-700 rounded-full px-3 py-1">
            <span className="text-xs">💰</span>
            <span className={`font-display text-xs font-bold ${daily > 0 ? 'text-neon-pink' : 'text-text-muted'}`}>
              -R${animDaily}/dia
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12">

        {/* ==================== */}
        {/* HERO                 */}
        {/* ==================== */}
        <div className="text-center py-8 animate-fade-in">
          <span className="text-6xl block mb-4">💀</span>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
            Pra onde vai seu <span className="neon-text-pink">dinheiro</span>?
          </h2>
          <p className="text-text-muted text-sm font-heading max-w-xs mx-auto">
            Selecione seus gastos diarios e veja o estrago no fim do mes, do ano, e da decada.
          </p>
        </div>

        {/* ==================== */}
        {/* SELETOR DE GASTOS    */}
        {/* ==================== */}
        <RevealSection className="mb-8">
          <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>👇</span> Selecione o que voce gasta
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {EXPENSES.map(exp => {
              const isOn = selected.has(exp.id)
              return (
                <button
                  key={exp.id}
                  onClick={() => toggle(exp.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-300 ${
                    isOn
                      ? 'bg-neon-pink/[0.06] border-neon-pink/40 scale-[1.02]'
                      : 'bg-dark-800/50 border-dark-600 hover:border-dark-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{exp.emoji}</span>
                    <span className={`font-heading text-sm font-semibold ${isOn ? 'text-neon-pink' : 'text-text-primary'}`}>
                      {exp.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-text-muted truncate flex-1">{exp.desc}</p>
                    <span className={`text-xs font-display font-bold ml-2 ${isOn ? 'text-neon-pink' : 'text-text-muted'}`}>
                      R${exp.daily}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </RevealSection>

        {/* ==================== */}
        {/* CONTADORES ANIMADOS  */}
        {/* ==================== */}
        {daily > 0 && (
          <RevealSection className="mb-8">
            <div className="neon-card p-5 border-neon-pink/20 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-neon-pink/5 blur-3xl" />

              <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📊</span> O estrago
              </h3>

              {/* Daily */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por dia</span>
                  <span className="font-display text-lg font-bold text-neon-pink">R${animDaily}</span>
                </div>
                <AnimatedBar value={daily} max={100} color="bg-neon-pink/60" />
              </div>

              {/* Weekly */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por semana</span>
                  <span className="font-display text-lg font-bold text-neon-pink">R${weekly}</span>
                </div>
                <AnimatedBar value={weekly} max={700} color="bg-neon-pink/70" delay={100} />
              </div>

              {/* Monthly */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por mes</span>
                  <span className="font-display text-2xl font-bold text-neon-pink">
                    R${animMonthly.toLocaleString('pt-BR')}
                  </span>
                </div>
                <AnimatedBar value={monthly} max={3000} color="bg-gradient-to-r from-neon-pink to-neon-purple" delay={200} />
              </div>

              {/* Yearly */}
              <div className="mb-2">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por ano</span>
                  <span className="font-display text-3xl font-bold text-text-primary">
                    R${animYearly.toLocaleString('pt-BR')}
                  </span>
                </div>
                <AnimatedBar value={yearly} max={36000} color="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan" delay={300} />
              </div>

              <p className="text-[11px] text-text-muted text-right font-heading mt-2">
                Em 5 anos: <span className="text-neon-pink font-bold">R${fiveYears.toLocaleString('pt-BR')}</span>
                {' '}• Em 10 anos: <span className="text-neon-pink font-bold">R${decade.toLocaleString('pt-BR')}</span>
              </p>
            </div>
          </RevealSection>
        )}

        {/* ==================== */}
        {/* FRASES DE CHOQUE     */}
        {/* ==================== */}
        {daily > 0 && (
          <RevealSection className="mb-8">
            <div className="space-y-3">
              {shockPhrases.map((phrase, i) => (
                <div
                  key={i}
                  className="neon-card p-4 border-neon-yellow/20 animate-slide-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{phrase.icon}</span>
                    <p className="font-heading text-sm text-text-secondary leading-relaxed">{phrase.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* ======================== */}
        {/* E SE INVESTISSE?         */}
        {/* ======================== */}
        {daily > 0 && (
          <RevealSection className="mb-8">
            <div className="neon-card p-5 border-neon-green/20 relative overflow-hidden">
              <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-neon-green/5 blur-3xl" />

              <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>📈</span> E se voce INVESTISSE esse dinheiro?
              </h3>
              <p className="text-[11px] text-text-muted mb-4 font-heading">Rendimento de ~1% ao mes (juros compostos)</p>

              {!showInvest ? (
                <button
                  onClick={() => setShowInvest(true)}
                  className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all"
                >
                  Revelar o poder dos juros compostos
                </button>
              ) : (
                <div className="space-y-4 animate-slide-up">
                  {/* Visual bars */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-green/50" />
                        <span className="text-xs text-text-muted font-heading">1 ano guardando</span>
                      </div>
                      <span className="font-display text-sm font-bold text-text-secondary">
                        R${yearly.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-green" />
                        <span className="text-xs text-text-muted font-heading">1 ano investindo</span>
                      </div>
                      <span className="font-display text-sm font-bold neon-text">
                        R${investedYearly.y1.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <AnimatedBar value={investedYearly.y1} max={investedYearly.y10} color="bg-neon-green/60" delay={0} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan/50" />
                        <span className="text-xs text-text-muted font-heading">5 anos guardando</span>
                      </div>
                      <span className="font-display text-sm font-bold text-text-secondary">
                        R${fiveYears.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                        <span className="text-xs text-text-muted font-heading">5 anos investindo</span>
                      </div>
                      <span className="font-display text-sm font-bold neon-text-cyan">
                        R${investedYearly.y5.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <AnimatedBar value={investedYearly.y5} max={investedYearly.y10} color="bg-gradient-to-r from-neon-green to-neon-cyan" delay={100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-yellow/50" />
                        <span className="text-xs text-text-muted font-heading">10 anos guardando</span>
                      </div>
                      <span className="font-display text-sm font-bold text-text-secondary">
                        R${decade.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-yellow" />
                        <span className="text-xs text-text-muted font-heading">10 anos investindo</span>
                      </div>
                      <span className="font-display text-2xl font-bold neon-text-yellow">
                        R${animInvest10.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <AnimatedBar value={investedYearly.y10} max={investedYearly.y10} color="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-yellow" delay={200} />
                  </div>

                  {investedYearly.y10 > 0 && (
                    <div className="text-center pt-2 border-t border-dark-600">
                      <p className="text-xs text-text-muted font-heading mb-1">Diferenca entre guardar e investir em 10 anos:</p>
                      <p className="font-display text-xl font-bold neon-text">
                        +R${(investedYearly.y10 - decade).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-[11px] text-neon-green font-heading">So de juros compostos, sem fazer NADA</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </RevealSection>
        )}

        {/* ======================== */}
        {/* MENSAGEM FINAL          */}
        {/* ======================== */}
        <RevealSection className="mb-6">
          <div className="text-center py-6">
            <span className="text-5xl block mb-3">🧠</span>
            <h2 className="font-display text-xl font-bold text-text-primary mb-3">
              {daily === 0 ? 'Selecione seus gastos acima' : 'A escolha e sua'}
            </h2>
            {daily > 0 && (
              <>
                <p className="text-sm text-text-secondary font-heading max-w-xs mx-auto mb-4 leading-relaxed">
                  Nao estamos dizendo pra nunca gastar. Mas <span className="text-neon-green font-semibold">consciencia</span> e
                  o primeiro passo. Agora voce sabe o preco real dos seus habitos.
                </p>
                <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 rounded-full px-5 py-2">
                  <span className="text-sm">💡</span>
                  <p className="text-xs font-heading text-neon-green">Cortar <span className="font-bold">50%</span> desses gastos ja te daria R${Math.round(yearly / 2).toLocaleString('pt-BR')}/ano</p>
                </div>
              </>
            )}
          </div>
        </RevealSection>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/simulator')}
            className="w-full bg-neon-purple/10 border border-neon-purple/40 text-neon-purple font-heading font-semibold py-3 rounded-lg hover:bg-neon-purple/20 transition-all"
          >
            🎮 Testar no Simulador de Vida Real
          </button>
          <button
            onClick={() => navigate('/modules')}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            📚 Aprender a Investir
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
