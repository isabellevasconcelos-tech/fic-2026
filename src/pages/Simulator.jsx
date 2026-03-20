import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

// --- Constantes ---
const WEEKLY_SALARY = 500
const GOAL_ITEM = { name: 'Tenis novo', emoji: '👟', cost: 350 }
const SNACK_COST = 25
const SAVINGS_AMOUNT = 50
const GOAL_SAVE_AMOUNT = 70

const CHOICES = [
  { id: 'spend', emoji: '🍔', label: 'Gastar em lanchinhos', desc: `-R$${SNACK_COST} do saldo`, color: 'neon-pink' },
  { id: 'save', emoji: '💰', label: 'Guardar na poupanca', desc: `+R$${SAVINGS_AMOUNT} na poupanca`, color: 'neon-green' },
  { id: 'goal', emoji: '👟', label: 'Guardar pro objetivo', desc: `+R$${GOAL_SAVE_AMOUNT} pro tenis`, color: 'neon-cyan' },
]

const EVENTS = [
  null, // Dia 1: sem evento
  {
    title: 'Dia de pagar o aluguel!',
    emoji: '🏠',
    description: 'O aluguel venceu. Voce precisa pagar R$150.',
    cost: 150,
    type: 'mandatory',
  },
  {
    title: 'Aniversario do amigo!',
    emoji: '🎂',
    description: 'Seu melhor amigo faz aniversario. Presente custa R$40.',
    cost: 40,
    type: 'choice',
    choiceYes: 'Comprar presente (-R$40)',
    choiceNo: 'Mandar so parabens',
    consequenceYes: 'Seu amigo ficou super feliz! Amizade fortalecida.',
    consequenceNo: 'Seu amigo entendeu, mas ficou um pouco chateado.',
  },
  {
    title: 'Mega promocao!',
    emoji: '🏷️',
    description: 'Aquela camiseta que voce queria esta com 70% off! R$35.',
    cost: 35,
    type: 'choice',
    choiceYes: 'Comprar! Oportunidade unica! (-R$35)',
    choiceNo: 'Resistir a tentacao',
    consequenceYes: 'Voce comprou a camiseta. Bonita, mas foi mais um gasto...',
    consequenceNo: 'Voce resistiu! Disciplina financeira no modo hard.',
  },
  {
    title: 'Emergencia! Celular quebrou',
    emoji: '📱',
    description: 'A tela do seu celular trincou. Conserto custa R$120.',
    cost: 120,
    type: 'mandatory',
  },
  {
    title: 'Choveu forte!',
    emoji: '🌧️',
    description: 'Sem guarda-chuva e longe de casa. Uber custa R$18.',
    cost: 18,
    type: 'choice',
    choiceYes: 'Pegar o Uber (-R$18)',
    choiceNo: 'Esperar a chuva passar',
    consequenceYes: 'Chegou seco em casa, mas gastou.',
    consequenceNo: 'Economizou, mas chegou molhado. Paciencia e economia!',
  },
  {
    title: 'Oportunidade de freela!',
    emoji: '💻',
    description: 'Um amigo te ofereceu um trabalho rapido. Voce ganha R$80!',
    gain: 80,
    type: 'bonus',
  },
]

function calculateXP(balance, savings, goalFund, history) {
  let xp = 30
  if (balance >= 0) xp += 20
  if (savings >= 100) xp += 15
  else if (savings >= 50) xp += 10
  if (goalFund >= GOAL_ITEM.cost) xp += 25
  const saveCount = history.filter(h => h.action === 'save' || h.action === 'goal').length
  if (saveCount >= 4) xp += 10
  return xp
}

function getConsequence(balance, savings, goalFund, spendCount) {
  if (balance < 0) return {
    emoji: '😰', title: 'Voce ficou no vermelho!',
    message: 'Gastou mais do que ganhou. Na vida real, isso significa dividas e juros altissimos. A regra de ouro: nunca gaste mais do que ganha.',
    color: 'neon-pink',
    tip: 'Tente a tecnica do "espere 24h": antes de comprar algo por impulso, espere um dia. Se ainda quiser, compre.',
  }
  if (goalFund >= GOAL_ITEM.cost) return {
    emoji: '🎉', title: 'Objetivo alcancado!',
    message: `Voce conseguiu comprar o ${GOAL_ITEM.name}! Planejamento e disciplina funcionam. Quando voce define um objetivo e poupa com consistencia, conquista o que quer.`,
    color: 'neon-green',
    tip: 'Parabens! Aplique essa mesma estrategia na vida real: defina um objetivo, calcule quanto precisa poupar por mes e automatize.',
  }
  if (savings >= 150) return {
    emoji: '🏦', title: 'Poupador nato!',
    message: 'Voce construiu uma boa reserva! Na vida real, ter uma reserva de emergencia e o primeiro passo para liberdade financeira.',
    color: 'neon-cyan',
    tip: 'Agora coloque essa reserva para render! CDB com liquidez diaria ou Tesouro Selic sao otimas opcoes.',
  }
  if (spendCount >= 5) return {
    emoji: '🍔', title: 'Gastou quase tudo em lanchinhos...',
    message: `Pequenos gastos diarios parecem inofensivos, mas somados destroem seu orcamento. R$${SNACK_COST}/dia = R$${SNACK_COST * 30}/mes! Pense nisso.`,
    color: 'neon-yellow',
    tip: 'Tente levar marmita e limitar gastos com lanchinhos a 2x por semana. Sua carteira (e sua saude) agradecem!',
  }
  return {
    emoji: '⚖️', title: 'Equilibrado!',
    message: 'Voce encontrou um meio termo entre gastar e poupar. Na vida real, o ideal e a regra 50-30-20: 50% necessidades, 30% desejos, 20% poupanca.',
    color: 'neon-purple',
    tip: 'Aplique a regra 50-30-20 no seu dinheiro real. Comece anotando todos os seus gastos por 30 dias!',
  }
}

export default function Simulator() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const feedback = useFeedback()

  const [phase, setPhase] = useState('intro') // intro | playing | event | summary
  const [day, setDay] = useState(1)
  const [balance, setBalance] = useState(WEEKLY_SALARY)
  const [savings, setSavings] = useState(0)
  const [goalFund, setGoalFund] = useState(0)
  const [history, setHistory] = useState([])
  const [choiceMade, setChoiceMade] = useState(false)
  const [eventResult, setEventResult] = useState(null)
  const [balanceChange, setBalanceChange] = useState(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [finishing, setFinishing] = useState(false)

  function showChange(amount) {
    setBalanceChange({ amount: Math.abs(amount), positive: amount > 0 })
    setTimeout(() => setBalanceChange(null), 1500)
  }

  function handleChoice(choice) {
    if (choiceMade) return
    setChoiceMade(true)
    feedback?.trigger('tap')

    let entry = { day, action: choice.id }

    if (choice.id === 'spend') {
      setBalance(b => b - SNACK_COST)
      showChange(-SNACK_COST)
      entry.amount = -SNACK_COST
    } else if (choice.id === 'save') {
      setBalance(b => b - SAVINGS_AMOUNT)
      setSavings(s => s + SAVINGS_AMOUNT)
      showChange(-SAVINGS_AMOUNT)
      entry.amount = SAVINGS_AMOUNT
    } else {
      setBalance(b => b - GOAL_SAVE_AMOUNT)
      setGoalFund(g => g + GOAL_SAVE_AMOUNT)
      showChange(-GOAL_SAVE_AMOUNT)
      entry.amount = GOAL_SAVE_AMOUNT
    }

    setHistory(h => [...h, entry])

    // Check if there's an event for today
    const event = EVENTS[day - 1]
    if (event) {
      setTimeout(() => setPhase('event'), 800)
    }
  }

  function handleEventChoice(accepted) {
    const event = EVENTS[day - 1]
    if (event.type === 'choice') {
      if (accepted) {
        setBalance(b => b - event.cost)
        showChange(-event.cost)
        setEventResult(event.consequenceYes)
      } else {
        setEventResult(event.consequenceNo)
      }
    }
  }

  function handleMandatoryOrBonus() {
    const event = EVENTS[day - 1]
    if (event.type === 'mandatory') {
      setBalance(b => b - event.cost)
      showChange(-event.cost)
    } else if (event.type === 'bonus') {
      setBalance(b => b + event.gain)
      showChange(event.gain)
    }
  }

  function nextDay() {
    if (day >= 7) {
      finishGame()
    } else {
      setDay(d => d + 1)
      setChoiceMade(false)
      setPhase('playing')
      setEventResult(null)
    }
  }

  async function finishGame() {
    if (finishing) return
    setFinishing(true)

    const xp = calculateXP(balance, savings, goalFund, history)
    setXpEarned(xp)
    setPhase('summary')

    if (user && xp > 0) {
      await supabase.rpc('add_xp', { p_user_id: profile.id, p_amount: xp })
      await refreshProfile()
    }
    feedback?.trigger('xp', { amount: xp, label: 'Simulacao concluida!' })
    feedback?.trigger('complete', { emoji: '🎮', title: 'Simulacao Completa!', subtitle: `${xp} XP ganhos` })
    if (profile) feedback?.checkLevelUp(profile.level)
    setFinishing(false)
  }

  function resetGame() {
    setPhase('intro')
    setDay(1)
    setBalance(WEEKLY_SALARY)
    setSavings(0)
    setGoalFund(0)
    setHistory([])
    setChoiceMade(false)
    setEventResult(null)
    setBalanceChange(null)
    setXpEarned(0)
    setFinishing(false)
  }

  // =====================
  // FASE: INTRO
  // =====================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen px-4 pt-8 pb-8 bg-dark-900 animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">🎮</span>
          <h1 className="page-title text-2xl mb-3">Simulador de Vida Real</h1>
          <p className="page-subtitle text-sm">Tome decisoes financeiras e veja as consequencias</p>
        </div>

        <div className="neon-card p-5 mb-4">
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Voce vai receber um <span className="text-neon-green font-semibold">salario de R${WEEKLY_SALARY}</span> e
            precisara tomar decisoes financeiras durante <span className="text-neon-cyan font-semibold">7 dias</span>.
          </p>

          <div className="flex items-center gap-3 bg-dark-800/50 rounded-xl p-3 mb-4">
            <span className="text-2xl">{GOAL_ITEM.emoji}</span>
            <div>
              <p className="font-heading font-semibold text-sm text-text-primary">Seu objetivo: {GOAL_ITEM.name}</p>
              <p className="text-xs text-text-muted">Custa R${GOAL_ITEM.cost} — sera que voce consegue?</p>
            </div>
          </div>

          <p className="text-xs text-text-muted font-heading uppercase tracking-wider mb-3">Suas opcoes diarias:</p>
          <div className="space-y-2">
            {CHOICES.map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-dark-800/50 rounded-xl p-3">
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <p className="font-heading font-medium text-sm text-text-primary">{c.label}</p>
                  <p className="text-xs text-text-muted">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neon-card p-4 mb-6 border-neon-yellow/20">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              Eventos inesperados vao acontecer durante a semana — aluguel, emergencias, oportunidades.
              <span className="text-neon-yellow font-medium"> Esteja preparado!</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setPhase('playing')}
          className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3.5 rounded-lg hover:bg-neon-green/20 transition-all text-lg"
        >
          Comecar Simulacao
        </button>
      </div>
    )
  }

  // =====================
  // FASE: SUMMARY
  // =====================
  if (phase === 'summary') {
    const spendCount = history.filter(h => h.action === 'spend').length
    const saveCount = history.filter(h => h.action === 'save').length
    const goalCount = history.filter(h => h.action === 'goal').length
    const totalSpentSnacks = spendCount * SNACK_COST
    const consequence = getConsequence(balance, savings, goalFund, spendCount)
    const reachedGoal = goalFund >= GOAL_ITEM.cost

    return (
      <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900 animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-2">🏁</span>
          <h1 className="page-title text-2xl">Fim da Semana!</h1>
        </div>

        {/* Resultado principal */}
        <div className={`neon-card p-5 mb-4 border-${consequence.color}/30`}>
          <div className="text-center mb-4">
            <span className="text-5xl block mb-2">{consequence.emoji}</span>
            <h2 className={`font-display text-xl font-bold neon-text-${consequence.color} mb-2`}>{consequence.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{consequence.message}</p>
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Resumo Financeiro</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className={`font-display text-lg font-bold ${balance >= 0 ? 'neon-text' : 'text-neon-pink'}`}>
                R${balance}
              </p>
              <p className="text-[11px] text-text-muted">Saldo</p>
            </div>
            <div className="text-center border-x border-dark-500">
              <p className="font-display text-lg font-bold neon-text-cyan">R${savings}</p>
              <p className="text-[11px] text-text-muted">Poupanca</p>
            </div>
            <div className="text-center">
              <p className={`font-display text-lg font-bold ${reachedGoal ? 'neon-text' : 'neon-text-yellow'}`}>
                R${goalFund}
              </p>
              <p className="text-[11px] text-text-muted">{GOAL_ITEM.emoji} Objetivo</p>
            </div>
          </div>

          {/* Objetivo */}
          <div className={`rounded-xl p-3 mb-4 ${reachedGoal ? 'bg-neon-green/10 border border-neon-green/30' : 'bg-dark-800/50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-heading text-text-primary">{GOAL_ITEM.emoji} {GOAL_ITEM.name}</span>
              <span className={`text-xs font-heading ${reachedGoal ? 'text-neon-green' : 'text-text-muted'}`}>
                R${goalFund}/R${GOAL_ITEM.cost}
              </span>
            </div>
            <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${reachedGoal ? 'bg-neon-green' : 'bg-neon-cyan'}`}
                style={{ width: `${Math.min((goalFund / GOAL_ITEM.cost) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <p className="text-xs text-text-muted font-heading mb-2">Suas escolhas:</p>
          <div className="flex justify-between">
            {history.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-lg">
                  {h.action === 'spend' ? '🍔' : h.action === 'save' ? '💰' : '👟'}
                </span>
                <span className="text-[10px] text-text-muted">D{h.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estatisticas */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Estatisticas</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">🍔 Vezes que gastou</span>
              <span className="font-heading font-semibold text-text-primary">{spendCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">💰 Vezes que poupou</span>
              <span className="font-heading font-semibold text-text-primary">{saveCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">👟 Vezes que guardou pro objetivo</span>
              <span className="font-heading font-semibold text-text-primary">{goalCount}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dark-500">
              <span className="text-sm text-text-secondary">Total gasto em lanchinhos</span>
              <span className="font-heading font-semibold text-neon-pink">R${totalSpentSnacks}</span>
            </div>
          </div>
        </div>

        {/* Dica */}
        <div className="neon-card p-4 mb-4 border-neon-yellow/20">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-xs font-heading font-semibold text-neon-yellow mb-1">Dica financeira</p>
              <p className="text-xs text-text-secondary leading-relaxed">{consequence.tip}</p>
            </div>
          </div>
        </div>

        {/* XP */}
        {xpEarned > 0 && (
          <div className="text-center mb-6">
            <p className="font-display text-lg font-bold neon-text">+{xpEarned} XP ganhos!</p>
          </div>
        )}

        {/* Acoes */}
        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            Jogar Novamente
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-dark-700 border border-dark-500 text-text-secondary font-heading font-semibold py-3 rounded-lg hover:border-dark-400 transition-all"
          >
            Voltar ao Inicio
          </button>
        </div>
      </div>
    )
  }

  // =====================
  // FASE: EVENT
  // =====================
  if (phase === 'event') {
    const event = EVENTS[day - 1]

    return (
      <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900">
        {/* Balance change floating badge */}
        {balanceChange && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-xp-float">
            <div className={`${balanceChange.positive ? 'bg-neon-green/20 border-neon-green/50 neon-text' : 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink'} border rounded-full px-6 py-2 font-display font-bold`}>
              {balanceChange.positive ? '+' : '-'}R${balanceChange.amount}
            </div>
          </div>
        )}

        {/* Day header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-300"
              style={{ width: `${(day / 7) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-muted font-heading">Dia {day}/7</span>
        </div>

        {/* Balance bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-text-muted">Saldo</p>
              <p className={`font-display text-xl font-bold ${balance >= 0 ? 'neon-text' : 'text-neon-pink'}`}>R${balance}</p>
            </div>
          </div>
          <div className="flex gap-3 text-right">
            <div>
              <p className="text-[10px] text-text-muted">💰 Poupanca</p>
              <p className="font-heading text-sm font-semibold text-neon-cyan">R${savings}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">👟 Objetivo</p>
              <p className="font-heading text-sm font-semibold text-neon-yellow">R${goalFund}</p>
            </div>
          </div>
        </div>

        {/* Event card */}
        <div className="animate-slide-up">
          <div className="neon-card p-5 border-neon-yellow/30 mb-6">
            <div className="text-center mb-4">
              <span className="text-4xl block mb-2">{event.emoji}</span>
              <p className="text-xs font-heading text-neon-yellow uppercase tracking-wider mb-1 animate-neon-flicker">Evento!</p>
              <h2 className="font-heading text-lg font-bold text-text-primary">{event.title}</h2>
            </div>

            <p className="text-sm text-text-secondary text-center leading-relaxed mb-4">{event.description}</p>

            {event.type === 'mandatory' && !eventResult && (
              <button
                onClick={() => { handleMandatoryOrBonus(); setEventResult('done') }}
                className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-3 rounded-lg"
              >
                Pagar -R${event.cost}
              </button>
            )}

            {event.type === 'bonus' && !eventResult && (
              <button
                onClick={() => { handleMandatoryOrBonus(); setEventResult('done') }}
                className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg"
              >
                Receber +R${event.gain} 🎉
              </button>
            )}

            {event.type === 'choice' && !eventResult && (
              <div className="space-y-2">
                <button
                  onClick={() => handleEventChoice(true)}
                  className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-3 rounded-lg hover:bg-neon-pink/20 transition-all"
                >
                  {event.choiceYes}
                </button>
                <button
                  onClick={() => handleEventChoice(false)}
                  className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all"
                >
                  {event.choiceNo}
                </button>
              </div>
            )}

            {eventResult && eventResult !== 'done' && (
              <div className="bg-dark-800/50 rounded-xl p-3 mb-4 animate-slide-up">
                <p className="text-sm text-text-secondary text-center">{eventResult}</p>
              </div>
            )}
          </div>

          {eventResult && (
            <button
              onClick={nextDay}
              className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all animate-slide-up"
            >
              {day >= 7 ? 'Ver Resultado' : 'Proximo Dia →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // =====================
  // FASE: PLAYING
  // =====================
  const event = EVENTS[day - 1]

  return (
    <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900">
      {/* Balance change floating badge */}
      {balanceChange && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-xp-float">
          <div className={`${balanceChange.positive ? 'bg-neon-green/20 border-neon-green/50 neon-text' : 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink'} border rounded-full px-6 py-2 font-display font-bold`}>
            {balanceChange.positive ? '+' : '-'}R${balanceChange.amount}
          </div>
        </div>
      )}

      {/* Day header / progress */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => { if (confirm('Tem certeza que quer sair? Seu progresso sera perdido.')) navigate('/') }} className="text-text-muted hover:text-text-secondary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-300"
            style={{ width: `${(day / 7) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted font-heading">Dia {day}/7</span>
      </div>

      {/* Balance + mini stats */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-text-muted">Saldo</p>
          <p className={`font-display text-2xl font-bold transition-all ${balance >= 0 ? 'neon-text' : 'text-neon-pink'}`}>
            R${balance}
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[10px] text-text-muted">💰 Poupanca</p>
            <p className="font-heading text-sm font-semibold text-neon-cyan">R${savings}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted">👟 Objetivo</p>
            <p className="font-heading text-sm font-semibold text-neon-yellow">R${goalFund}/{GOAL_ITEM.cost}</p>
          </div>
        </div>
      </div>

      {/* Daily choice */}
      <div className="animate-slide-up">
        <div className="neon-card p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">☀️</span>
            <h2 className="font-heading text-base font-semibold text-text-primary">O que voce vai fazer hoje?</h2>
          </div>

          <div className="space-y-3">
            {CHOICES.map(choice => {
              const isSelected = choiceMade && history[history.length - 1]?.action === choice.id
              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={choiceMade}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? `bg-${choice.color}/10 border-${choice.color}/50`
                      : choiceMade
                        ? 'bg-dark-700 border-dark-500 opacity-40'
                        : 'bg-dark-700 border-dark-500 hover:border-neon-green/30'
                  }`}
                >
                  <span className="text-2xl">{choice.emoji}</span>
                  <div>
                    <p className="font-heading font-semibold text-sm text-text-primary">{choice.label}</p>
                    <p className="text-xs text-text-muted">{choice.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Next day button (only if choice made and no event) */}
        {choiceMade && !event && (
          <button
            onClick={nextDay}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all animate-slide-up"
          >
            {day >= 7 ? 'Ver Resultado' : 'Proximo Dia →'}
          </button>
        )}
      </div>
    </div>
  )
}
