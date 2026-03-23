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

const BUYABLE = [
  { min: 300, emoji: '📱', label: 'iPhone 15', price: 5000, field: 'yearly' },
  { min: 50, emoji: '✈️', label: 'Viagem internacional', price: 8000, field: 'yearly' },
  { min: 150, emoji: '👟', label: 'Nike Air Jordan', price: 1800, field: 'yearly' },
  { min: 40, emoji: '🏠', label: 'Entrada de um AP (10 anos)', price: 60000, field: 'decade' },
]

const TOTAL_STEPS = 7

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

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function RealityCheck() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(new Set(['snack', 'coffee']))

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

  const investedYearly = useMemo(() => {
    const r = 0.01
    const pmt = monthly
    const calc = (months) => {
      if (pmt === 0) return 0
      return Math.round(pmt * (Math.pow(1 + r, months) - 1) / r)
    }
    return { y1: calc(12), y5: calc(60), y10: calc(120) }
  }, [monthly])

  const animDaily = useAnimatedNumber(daily)
  const animMonthly = useAnimatedNumber(monthly)
  const animYearly = useAnimatedNumber(yearly)
  const animInvest10 = useAnimatedNumber(step === 4 ? investedYearly.y10 : 0, 1200)

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

  const canBuy = useMemo(() =>
    BUYABLE.filter(b => {
      const val = b.field === 'yearly' ? yearly : decade
      return val >= b.price * 0.8 && daily >= b.min / 10
    }).slice(0, 4)
  , [yearly, decade, daily])

  function next() {
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    if (step === 0) navigate('/')
    else setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-lg border-b border-dark-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={back} className="text-text-muted hover:text-text-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-muted font-heading">{step + 1}/{TOTAL_STEPS}</span>
        </div>
      </div>

      <div className="px-4 pb-12 animate-fade-in" key={step}>

        {/* ====== STEP 0: Seletor ====== */}
        {step === 0 && (
          <div>
            <div className="text-center py-8">
              <span className="text-6xl block mb-4">💀</span>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                Pra onde vai seu <span className="neon-text-pink">dinheiro</span>?
              </h2>
              <p className="text-text-muted text-sm font-heading max-w-xs mx-auto">
                Selecione seus gastos diarios e veja o estrago.
              </p>
            </div>

            <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>👇</span> Selecione o que voce gasta
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-8">
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

            {daily > 0 && (
              <div className="text-center mb-4">
                <span className="text-sm text-text-muted font-heading">Total selecionado: </span>
                <span className="font-display text-lg font-bold text-neon-pink">R${daily}/dia</span>
              </div>
            )}

            <button
              onClick={next}
              disabled={daily === 0}
              className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-4 rounded-xl hover:bg-neon-pink/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Ver o estrago →
            </button>
          </div>
        )}

        {/* ====== STEP 1: O Estrago ====== */}
        {step === 1 && (
          <div className="pt-8">
            <div className="neon-card p-5 border-neon-pink/20 relative overflow-hidden mb-8">
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-neon-pink/5 blur-3xl" />

              <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📊</span> O estrago
              </h3>

              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por dia</span>
                  <span className="font-display text-lg font-bold text-neon-pink">R${animDaily}</span>
                </div>
                <AnimatedBar value={daily} max={100} color="bg-neon-pink/60" />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por semana</span>
                  <span className="font-display text-lg font-bold text-neon-pink">R${weekly}</span>
                </div>
                <AnimatedBar value={weekly} max={700} color="bg-neon-pink/70" delay={100} />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Por mes</span>
                  <span className="font-display text-2xl font-bold text-neon-pink">
                    R${animMonthly.toLocaleString('pt-BR')}
                  </span>
                </div>
                <AnimatedBar value={monthly} max={3000} color="bg-gradient-to-r from-neon-pink to-neon-purple" delay={200} />
              </div>

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

            <button
              onClick={next}
              className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-4 rounded-xl hover:bg-neon-pink/20 transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ====== STEP 2: Frases de choque ====== */}
        {step === 2 && (
          <div className="pt-8">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">😱</span>
              <h2 className="font-display text-xl font-bold text-text-primary">Voce sabia?</h2>
            </div>

            <div className="space-y-3 mb-8">
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

            <button
              onClick={next}
              className="w-full bg-neon-yellow/10 border border-neon-yellow/40 text-neon-yellow font-heading font-semibold py-4 rounded-xl hover:bg-neon-yellow/20 transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ====== STEP 3: O que dava pra comprar ====== */}
        {step === 3 && (
          <div className="pt-8">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">🎯</span>
              <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                O que dava pra comprar
              </h2>
              <p className="text-text-muted text-sm font-heading">com esse dinheiro</p>
            </div>

            <div className="neon-card p-5 border-neon-cyan/20 mb-4">
              <div className="space-y-4">
                {canBuy.length > 0 ? canBuy.map((item, i) => {
                  const val = item.field === 'yearly' ? yearly : decade
                  const pct = Math.min((val / item.price) * 100, 100)
                  const months = Math.ceil(item.price / monthly)
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="font-heading text-sm text-text-primary">{item.label}</span>
                        </div>
                        <span className="text-xs text-text-muted font-heading">
                          R${item.price.toLocaleString('pt-BR')} • {months} meses
                        </span>
                      </div>
                      <AnimatedBar value={pct} max={100} color="bg-gradient-to-r from-neon-cyan to-neon-green" delay={i * 100} />
                    </div>
                  )
                }) : (
                  BUYABLE.slice(0, 3).map((item, i) => {
                    const months = Math.ceil(item.price / (monthly || 1))
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.emoji}</span>
                            <span className="font-heading text-sm text-text-primary">{item.label}</span>
                          </div>
                          <span className="text-xs text-text-muted font-heading">
                            R${item.price.toLocaleString('pt-BR')} • {months} meses
                          </span>
                        </div>
                        <AnimatedBar value={yearly} max={item.price} color="bg-gradient-to-r from-neon-cyan to-neon-green" delay={i * 100} />
                      </div>
                    )
                  })
                )}
              </div>
              <p className="text-[11px] text-text-muted text-center font-heading mt-4">
                Tudo isso so redirecionando o que voce gasta em besteira
              </p>
            </div>

            <button
              onClick={next}
              className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-4 rounded-xl hover:bg-neon-cyan/20 transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ====== STEP 4: E se investisse? ====== */}
        {step === 4 && (
          <div className="pt-8">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">📈</span>
              <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                E se voce <span className="neon-text">investisse</span>?
              </h2>
              <p className="text-text-muted text-sm font-heading">Rendimento de ~1% ao mes (juros compostos)</p>
            </div>

            <div className="neon-card p-5 border-neon-green/20 relative overflow-hidden mb-8">
              <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-neon-green/5 blur-3xl" />

              <div className="space-y-4">
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
            </div>

            <button
              onClick={next}
              className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-4 rounded-xl hover:bg-neon-green/20 transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ====== STEP 5: Comparacao ====== */}
        {step === 5 && (
          <div className="pt-8">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">⚖️</span>
              <h2 className="font-display text-xl font-bold text-text-primary">Pra voce visualizar</h2>
            </div>

            <div className="space-y-3 mb-8">
              <div className="neon-card p-4 border-dark-500 animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-heading text-sm text-text-primary">
                      Voce trabalha <span className="neon-text-pink font-bold">{Math.round((yearly / 1500) * 22)} dias</span> por ano
                    </p>
                    <p className="text-xs text-text-muted">so pra pagar essas besteiras (salario de R$1.500)</p>
                  </div>
                </div>
              </div>

              <div className="neon-card p-4 border-dark-500 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-heading text-sm text-text-primary">
                      R${yearly.toLocaleString('pt-BR')}/ano = <span className="neon-text-yellow font-bold">{Math.round(yearly / 100)} notas</span> de R$100
                    </p>
                    <p className="text-xs text-text-muted">Imagine uma pilha dessas notas... indo pro lixo</p>
                  </div>
                </div>
              </div>

              <div className="neon-card p-4 border-dark-500 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍕</span>
                  <div>
                    <p className="font-heading text-sm text-text-primary">
                      Equivale a <span className="neon-text-cyan font-bold">{Math.round(monthly / 4)} pizzas</span> por mes
                    </p>
                    <p className="text-xs text-text-muted">Ou {Math.round(yearly / 30)} refeicoes completas por ano</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={next}
              className="w-full bg-neon-purple/10 border border-neon-purple/40 text-neon-purple font-heading font-semibold py-4 rounded-xl hover:bg-neon-purple/20 transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ====== STEP 6: Mensagem final ====== */}
        {step === 6 && (
          <div className="pt-8">
            <div className="text-center mb-8">
              <span className="text-5xl block mb-3">🧠</span>
              <h2 className="font-display text-xl font-bold text-text-primary mb-3">A escolha e sua</h2>
              <p className="text-sm text-text-secondary font-heading max-w-xs mx-auto mb-4 leading-relaxed">
                Nao estamos dizendo pra nunca gastar. Mas <span className="text-neon-green font-semibold">consciencia</span> e
                o primeiro passo. Agora voce sabe o preco real dos seus habitos.
              </p>
              <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 rounded-full px-5 py-2">
                <span className="text-sm">💡</span>
                <p className="text-xs font-heading text-neon-green">
                  Cortar <span className="font-bold">50%</span> desses gastos ja te daria R${Math.round(yearly / 2).toLocaleString('pt-BR')}/ano
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/simulator')}
                className="w-full bg-neon-purple/10 border border-neon-purple/40 text-neon-purple font-heading font-semibold py-3 rounded-lg hover:bg-neon-purple/20 transition-all"
              >
                🎮 Testar no Simulador
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
        )}

      </div>
    </div>
  )
}
