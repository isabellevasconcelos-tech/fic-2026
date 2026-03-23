import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

// ========================
// PERGUNTAS
// ========================
const QUESTIONS = [
  // === GASTOS DO DIA-A-DIA ===
  {
    cat: 'gastos',
    scenario: 'Voce ta no shopping e ve um tenis de R$400 "com 50% de desconto". Voce:',
    options: [
      { text: 'Compra na hora, ta pela metade!', correct: false },
      { text: 'Pesquisa o preco real antes', correct: true },
      { text: 'Parcela em 12x sem juros', correct: false },
      { text: 'Compra dois, ta barato', correct: false },
    ],
    explain: 'Muitas lojas inflam o preco pra fazer "desconto". Sempre pesquise antes — sites como Buscape mostram o historico de precos.',
    difficulty: 1,
  },
  {
    cat: 'gastos',
    scenario: 'Seu salario caiu. O que voce corta PRIMEIRO?',
    options: [
      { text: 'Aluguel', correct: false },
      { text: 'Comida', correct: false },
      { text: 'Streaming e assinaturas', correct: true },
      { text: 'Plano de saude', correct: false },
    ],
    explain: 'Corte primeiro os gastos VARIAVEIS e nao essenciais (lazer, assinaturas). Nunca corte necessidades basicas como moradia e alimentacao.',
    difficulty: 1,
  },
  {
    cat: 'gastos',
    scenario: 'Voce compraria algo parcelado sem ver os juros?',
    options: [
      { text: 'Sim, o que importa e a parcela caber', correct: false },
      { text: 'Sim, se for sem juros', correct: false },
      { text: 'Nunca — sempre comparo preco a vista vs parcelado', correct: true },
      { text: 'Depende se eu quero muito', correct: false },
    ],
    explain: '"Sem juros" muitas vezes ja tem juros embutidos no preco. Compare SEMPRE o valor a vista com o total parcelado. A diferenca pode ser 30% ou mais!',
    difficulty: 2,
  },
  {
    cat: 'gastos',
    scenario: 'Black Friday: TV de R$3.000 por R$2.500 em 10x. Voce tem R$2.200 guardados. O que faz?',
    options: [
      { text: 'Parcela — e Black Friday!', correct: false },
      { text: 'Usa os R$2.200 e parcela o resto', correct: false },
      { text: 'Espera, junta mais e compra a vista com desconto', correct: true },
      { text: 'Pega emprestado e paga depois', correct: false },
    ],
    explain: 'Pressa e a inimiga das financas. Se voce ja tem quase o valor, espere um pouco mais e negocie desconto a vista (geralmente 10-15% a menos).',
    difficulty: 2,
  },
  {
    cat: 'gastos',
    scenario: 'Voce recebe R$3.000/mes. Quanto no MAXIMO deveria ir pra aluguel?',
    options: [
      { text: 'R$1.500 (50%)', correct: false },
      { text: 'R$900 (30%)', correct: true },
      { text: 'R$600 (20%)', correct: false },
      { text: 'Tanto faz, o que sobrar ta bom', correct: false },
    ],
    explain: 'A regra e: aluguel nao deve passar de 30% da renda. Mais que isso compromete todo o resto do orcamento e impede voce de poupar.',
    difficulty: 1,
  },
  {
    cat: 'gastos',
    scenario: '"Leva 3, paga 2" numa loja de roupas. Voce so precisa de 1. O que faz?',
    options: [
      { text: 'Leva 3 — e promocao!', correct: false },
      { text: 'Leva so 1 que precisa', correct: true },
      { text: 'Leva 3 e da de presente', correct: false },
      { text: 'Nao compra nada por birra', correct: false },
    ],
    explain: 'So e promocao se voce ia comprar de qualquer jeito. Comprar o que nao precisa so por ser "barato" e a forma mais comum de desperdicar dinheiro.',
    difficulty: 1,
  },

  // === INVESTIMENTOS ===
  {
    cat: 'invest',
    scenario: 'Voce tem R$1.000 sobrando. Onde colocar PRIMEIRO?',
    options: [
      { text: 'Acoes na bolsa', correct: false },
      { text: 'Bitcoin', correct: false },
      { text: 'Reserva de emergencia (CDB/Tesouro Selic)', correct: true },
      { text: 'Poupanca', correct: false },
    ],
    explain: 'Antes de investir em QUALQUER coisa, monte sua reserva de emergencia (3-6 meses de gastos) em algo seguro e liquido como Tesouro Selic ou CDB com liquidez.',
    difficulty: 1,
  },
  {
    cat: 'invest',
    scenario: 'Um amigo fala: "Coloca tudo em cripto, vai triplicar em 1 mes!" Voce:',
    options: [
      { text: 'Investe tudo, confia no amigo', correct: false },
      { text: 'Investe metade por seguranca', correct: false },
      { text: 'Pesquisa antes e investe so o que pode perder', correct: true },
      { text: 'Pede emprestado pra investir mais', correct: false },
    ],
    explain: 'NUNCA invista o que nao pode perder, e NUNCA por dica de amigo sem pesquisar. Cripto e de alto risco. Regra: so invista se entender o produto.',
    difficulty: 2,
  },
  {
    cat: 'invest',
    scenario: 'Qual rende mais que a poupanca com seguranca similar?',
    options: [
      { text: 'Acoes de empresas pequenas', correct: false },
      { text: 'Tesouro Selic', correct: true },
      { text: 'Forex (cambio)', correct: false },
      { text: 'Emprestimo pra amigos', correct: false },
    ],
    explain: 'O Tesouro Selic rende mais que a poupanca, tem garantia do governo federal e liquidez diaria. E o investimento mais seguro do Brasil.',
    difficulty: 1,
  },
  {
    cat: 'invest',
    scenario: 'Voce tem R$500/mes pra investir. Melhor estrategia?',
    options: [
      { text: 'Juntar 6 meses e investir tudo de uma vez', correct: false },
      { text: 'Investir R$500 todo mes (aportes regulares)', correct: true },
      { text: 'Esperar a bolsa cair pra comprar barato', correct: false },
      { text: 'Guardar debaixo do colchao ate ter muito', correct: false },
    ],
    explain: 'Aportes regulares (todo mes) e a melhor estrategia — voce compra na alta E na baixa, fazendo uma media. Isso se chama "preco medio".',
    difficulty: 2,
  },
  {
    cat: 'invest',
    scenario: '"Retorno GARANTIDO de 5% ao MES, sem risco!" O que voce pensa?',
    options: [
      { text: 'Otimo! Vou investir!', correct: false },
      { text: 'Parece bom, vou pesquisar', correct: false },
      { text: 'E golpe — retorno garantido alto nao existe', correct: true },
      { text: 'Invisto pouco pra testar', correct: false },
    ],
    explain: '5% ao mes garantido = GOLPE (piramide financeira). Nenhum investimento legitimo garante isso. A Selic rende ~1% ao mes. Desconfie SEMPRE.',
    difficulty: 2,
  },

  // === DIVIDAS E CREDITO ===
  {
    cat: 'dividas',
    scenario: 'Voce deve R$2.000 no cartao (juros 14%/mes) e R$5.000 no carro (juros 1.5%/mes). Recebeu R$2.000 extra. O que faz?',
    options: [
      { text: 'Paga metade de cada divida', correct: false },
      { text: 'Quita o cartao inteiro', correct: true },
      { text: 'Investe o dinheiro', correct: false },
      { text: 'Guarda pra emergencia', correct: false },
    ],
    explain: 'SEMPRE pague primeiro a divida com maior juros. 14% ao mes no cartao vira mais que 300% ao ano — e a divida mais cara do Brasil!',
    difficulty: 3,
  },
  {
    cat: 'dividas',
    scenario: 'O banco oferece aumentar seu limite do cartao de R$2.000 pra R$8.000. Voce:',
    options: [
      { text: 'Aceita — mais limite e bom', correct: false },
      { text: 'Aceita so se tiver controle dos gastos', correct: true },
      { text: 'Aceita e usa pra emergencias', correct: false },
      { text: 'Pede ainda mais', correct: false },
    ],
    explain: 'Mais limite so e bom se voce TEM CONTROLE. Cartao nao e extensao do salario. Se voce gasta tudo que tem de limite, e armadilha.',
    difficulty: 2,
  },
  {
    cat: 'dividas',
    scenario: 'Voce usa o limite do cheque especial todo mes. Isso e:',
    options: [
      { text: 'Normal, todo mundo faz', correct: false },
      { text: 'Ok se for por pouco tempo', correct: false },
      { text: 'Perigoso — juros do especial sao altissimos', correct: true },
      { text: 'Bom, e dinheiro extra', correct: false },
    ],
    explain: 'Cheque especial cobra juros de ate 8% ao MES (150% ao ano). E um dos creditos mais caros que existem. Use so em emergencia REAL e por poucos dias.',
    difficulty: 1,
  },
  {
    cat: 'dividas',
    scenario: 'Voce nao consegue pagar a fatura do cartao. Melhor opcao?',
    options: [
      { text: 'Paga o minimo e rola o resto', correct: false },
      { text: 'Ignora e espera melhorar', correct: false },
      { text: 'Negocia com o banco um parcelamento com juros menores', correct: true },
      { text: 'Pega emprestimo pra pagar', correct: false },
    ],
    explain: 'O rotativo do cartao cobra ate 400% ao ano! Ligar pro banco e negociar parcelamento com juros menores e SEMPRE melhor que pagar o minimo.',
    difficulty: 2,
  },

  // === ARMADILHAS ===
  {
    cat: 'armadilhas',
    scenario: '"Deposite R$100 e receba R$1.000 em 7 dias!" por WhatsApp. Voce:',
    options: [
      { text: 'Deposita — e so R$100', correct: false },
      { text: 'Pergunta pra quem mandou como funciona', correct: false },
      { text: 'Bloqueia o numero — e golpe', correct: true },
      { text: 'Testa com R$50 primeiro', correct: false },
    ],
    explain: 'Piramide financeira CLASSICA. Os primeiros recebem (com dinheiro dos novos), depois todo mundo perde. Se promete multiplicar dinheiro "facil", e GOLPE.',
    difficulty: 1,
  },
  {
    cat: 'armadilhas',
    scenario: 'Voce viu um produto por R$200 no site oficial. No Instagram, um perfil vende por R$80. Voce:',
    options: [
      { text: 'Compra pelo Instagram — mais barato', correct: false },
      { text: 'Desconfia e compra no site oficial', correct: true },
      { text: 'Compra pelo Insta mas pede nota fiscal', correct: false },
      { text: 'Compra 2, ta muito barato', correct: false },
    ],
    explain: 'Precos muito abaixo do mercado = golpe ou falsificado. Sempre compre em sites oficiais ou lojas conhecidas. No Instagram, muitos perfis vendem produtos falsos.',
    difficulty: 1,
  },
  {
    cat: 'armadilhas',
    scenario: '"Curso que ensina a ganhar R$10.000/mes so com o celular!" por R$497. Voce:',
    options: [
      { text: 'Compra — se der certo paga rapido', correct: false },
      { text: 'Pesquisa reviews reais e desconfia', correct: true },
      { text: 'Parcela pra ficar mais leve', correct: false },
      { text: 'Compra e revende pra amigos', correct: false },
    ],
    explain: 'A maioria desses cursos vende SONHOS, nao conhecimento. Se fosse tao facil, todo mundo seria rico. Desconfie de promessas de dinheiro facil.',
    difficulty: 2,
  },
  {
    cat: 'armadilhas',
    scenario: 'Seu "gerente do banco" liga pedindo senha e dados do cartao pra "atualizar o sistema". Voce:',
    options: [
      { text: 'Passa os dados, e do banco', correct: false },
      { text: 'Confirma so o CPF', correct: false },
      { text: 'Desliga e liga pro banco pelo numero oficial', correct: true },
      { text: 'Pede pra mandar por email', correct: false },
    ],
    explain: 'Banco NUNCA pede senha por telefone. NUNCA. Se ligarem pedindo dados, desligue e ligue voce mesmo pro numero oficial (atras do cartao).',
    difficulty: 1,
  },

  // === VIDA REAL ===
  {
    cat: 'vida',
    scenario: 'Voce tem 20 anos e comeca a investir R$200/mes. Seu amigo comeca aos 30 investindo R$400/mes. Aos 60, quem tem mais?',
    options: [
      { text: 'Seu amigo — investe o dobro', correct: false },
      { text: 'Voce — comecou 10 anos antes', correct: true },
      { text: 'Empata', correct: false },
      { text: 'Impossivel saber', correct: false },
    ],
    explain: 'Juros compostos! Quem comeca antes ganha de quem investe mais, porque o TEMPO e o ingrediente mais poderoso. Comecar cedo e o maior hack financeiro.',
    difficulty: 3,
  },
  {
    cat: 'vida',
    scenario: 'Voce recebeu o 13o salario. Qual a MELHOR ordem de prioridade?',
    options: [
      { text: 'Presente → Viagem → Guardar o que sobrar', correct: false },
      { text: 'Dividas → Reserva → Desejos', correct: true },
      { text: 'Investir tudo na bolsa', correct: false },
      { text: 'Guardar tudo e nao gastar nada', correct: false },
    ],
    explain: 'Ordem inteligente: 1) Quitar dividas (especialmente as com juros altos) 2) Reforcar reserva de emergencia 3) Realizar desejos com o que sobrar.',
    difficulty: 2,
  },
  {
    cat: 'vida',
    scenario: 'Voce ganha R$3.000. Pela regra 50-30-20, quanto vai pra cada categoria?',
    options: [
      { text: 'R$1.500 necessidades / R$900 desejos / R$600 poupanca', correct: true },
      { text: 'R$1.000 cada', correct: false },
      { text: 'R$2.000 necessidades / R$500 desejos / R$500 poupanca', correct: false },
      { text: 'R$1.200 necessidades / R$1.200 desejos / R$600 poupanca', correct: false },
    ],
    explain: 'Regra 50-30-20: 50% necessidades (R$1.500), 30% desejos (R$900), 20% poupanca/investimento (R$600). E um guia simples e eficaz!',
    difficulty: 1,
  },
  {
    cat: 'vida',
    scenario: 'Voce precisa de um carro. Financiamento de 60 meses ou juntar e comprar a vista?',
    options: [
      { text: 'Financia — precisa agora', correct: false },
      { text: 'Junta e compra a vista (ou usado mais barato)', correct: true },
      { text: 'Consorcio', correct: false },
      { text: 'Leasing', correct: false },
    ],
    explain: 'Financiamento de 60 meses pode fazer voce pagar ate 2 carros pelo preco de 1. Se possivel, junte e compre a vista (ou compre um mais barato usado).',
    difficulty: 2,
  },
  {
    cat: 'vida',
    scenario: 'Inflacao de 5% ao ano significa que:',
    options: [
      { text: 'Seu salario aumenta 5%', correct: false },
      { text: 'Tudo fica 5% mais caro (seu dinheiro vale menos)', correct: true },
      { text: 'Voce ganha 5% a mais de juros', correct: false },
      { text: 'Nao afeta quem ganha pouco', correct: false },
    ],
    explain: 'Inflacao = seu dinheiro perde valor. R$100 hoje compra menos que R$100 ha um ano. Por isso dinheiro parado (colchao/poupanca) PERDE poder de compra.',
    difficulty: 1,
  },
  {
    cat: 'vida',
    scenario: 'O que e score de credito e por que importa?',
    options: [
      { text: 'Nota do banco pra te dar mais limite', correct: false },
      { text: 'Pontuacao que mostra se voce e bom pagador', correct: true },
      { text: 'Quanto voce ganha por mes', correct: false },
      { text: 'Numero de compras no cartao', correct: false },
    ],
    explain: 'Score e sua reputacao financeira (0-1000). Score alto = juros menores em emprestimos, mais limite, mais facilidade. Pagar contas em dia aumenta o score.',
    difficulty: 1,
  },
]

// Categorias
const CATEGORIES = {
  all: { label: 'Modo Rapido', emoji: '⚡', desc: 'Mix de tudo', color: 'neon-green' },
  gastos: { label: 'Gastos do Dia', emoji: '🛒', desc: 'Habitos de consumo', color: 'neon-pink' },
  invest: { label: 'Investimentos', emoji: '📈', desc: 'Onde colocar dinheiro', color: 'neon-cyan' },
  dividas: { label: 'Dividas', emoji: '💳', desc: 'Credito e juros', color: 'neon-purple' },
  armadilhas: { label: 'Armadilhas', emoji: '🚨', desc: 'Golpes e ciladas', color: 'neon-yellow' },
  vida: { label: 'Vida Real', emoji: '🏠', desc: 'Decisoes do dia-a-dia', color: 'neon-green' },
}

const TIMER_SECONDS = 15
const BASE_POINTS = 100
const SPEED_BONUS_MAX = 50
const QUESTIONS_PER_ROUND = 10

// Shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function QuizBattle() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()

  const [phase, setPhase] = useState('menu') // menu | countdown | playing | result
  const [category, setCategory] = useState('all')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)
  const [countdownNum, setCountdownNum] = useState(3)
  const [highScore, setHighScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [xpCollected, setXpCollected] = useState(false)
  const [collectingXp, setCollectingXp] = useState(false)
  const feedback = useFeedback()
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Load high scores
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('moneyquest_quiz_battle') || '{}')
      setHighScore(saved.highScore || 0)
    } catch {}
  }, [])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return
    startTimeRef.current = Date.now()
    setTimer(TIMER_SECONDS)

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, TIMER_SECONDS - elapsed)
      setTimer(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        handleTimeout()
      }
    }, 50)

    return () => clearInterval(timerRef.current)
  }, [phase, current, selected])

  function startGame(cat) {
    setCategory(cat)
    const pool = cat === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.cat === cat)
    const picked = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length))
    // Shuffle options for each question
    const prepared = picked.map(q => ({
      ...q,
      options: shuffle(q.options),
    }))
    setQuestions(prepared)
    setCurrent(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setCorrect(0)
    setSelected(null)
    setShowExplain(false)
    setAnswers([])
    setXpCollected(false)
    setCollectingXp(false)
    setCountdownNum(3)
    setPhase('countdown')
  }

  // Countdown 3-2-1
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdownNum <= 0) {
      setPhase('playing')
      return
    }
    const t = setTimeout(() => setCountdownNum(c => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, countdownNum])

  function handleTimeout() {
    setSelected(-1) // timeout marker
    setStreak(0)
    setAnswers(prev => [...prev, { q: current, correct: false, timeout: true }])
    setShowExplain(true)
  }

  function handleSelect(idx) {
    if (selected !== null) return
    clearInterval(timerRef.current)

    const isCorrect = questions[current].options[idx].correct
    const elapsed = TIMER_SECONDS - timer
    const speedBonus = isCorrect ? Math.round(SPEED_BONUS_MAX * (1 - elapsed / TIMER_SECONDS)) : 0
    const streakMultiplier = isCorrect ? Math.min(streak + 1, 5) : 0
    const points = isCorrect ? (BASE_POINTS + speedBonus) * streakMultiplier : 0

    setSelected(idx)

    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      setCorrect(c => c + 1)
      setScore(s => s + points)
      feedback?.trigger('correct', { points })
      if (newStreak >= 3) feedback?.trigger('streak', { count: newStreak })
    } else {
      setStreak(0)
      feedback?.trigger('wrong')
    }

    setAnswers(prev => [...prev, { q: current, correct: isCorrect, timeout: false, points }])
    setShowExplain(true)
  }

  function nextQuestion() {
    setSelected(null)
    setShowExplain(false)

    if (current + 1 >= questions.length) {
      finishGame()
    } else {
      setCurrent(c => c + 1)
    }
  }

  async function finishGame() {
    const finalScore = score
    // Save high score
    if (finalScore > highScore) {
      setHighScore(finalScore)
      try {
        localStorage.setItem('moneyquest_quiz_battle', JSON.stringify({ highScore: finalScore }))
      } catch {}
    }

    feedback?.trigger('complete', { emoji: '🧠', title: 'Quiz Completo!', subtitle: `${finalScore.toLocaleString('pt-BR')} pontos` })
    setPhase('result')
  }

  async function collectXp() {
    const xpAmount = Math.round(score / 20)
    if (!user || xpAmount <= 0) return
    setCollectingXp(true)
    try {
      await supabase.rpc('add_xp', { p_user_id: profile.id, p_amount: xpAmount })
      await refreshProfile()
      setXpCollected(true)
      feedback?.trigger('xp', { amount: xpAmount, label: 'XP coletado!' })
      feedback?.checkLevelUp(profile.level)
    } catch {
      setCollectingXp(false)
    }
  }

  // ========================
  // MENU
  // ========================
  if (phase === 'menu') {
    return (
      <div className="min-h-screen px-4 pt-6 pb-12 bg-dark-900 animate-fade-in">
        <button onClick={() => navigate('/')} className="text-text-muted text-sm font-heading hover:text-text-secondary mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🧠</span>
          <h1 className="page-title text-2xl mb-3">Quiz Battle</h1>
          <p className="page-subtitle text-sm">Responda rapido, acumule pontos, bata seu recorde!</p>
          {highScore > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded-full px-4 py-1.5">
              <span className="text-sm">🏆</span>
              <span className="font-display text-sm font-bold neon-text-yellow">Recorde: {highScore.toLocaleString('pt-BR')} pts</span>
            </div>
          )}
        </div>

        {/* Regras rapidas */}
        <div className="neon-card p-4 mb-6 border-dark-500">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-xl block mb-1">⏳</span>
              <p className="text-[11px] text-text-muted font-heading">{TIMER_SECONDS}s por pergunta</p>
            </div>
            <div>
              <span className="text-xl block mb-1">🔥</span>
              <p className="text-[11px] text-text-muted font-heading">Streak = multiplicador</p>
            </div>
            <div>
              <span className="text-xl block mb-1">⚡</span>
              <p className="text-[11px] text-text-muted font-heading">Rapido = bonus</p>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Escolha o tema</h3>
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = key === 'all' ? QUESTIONS.length : QUESTIONS.filter(q => q.cat === key).length
            return (
              <button
                key={key}
                onClick={() => startGame(key)}
                className={`w-full text-left neon-card p-4 flex items-center gap-4 hover:border-${cat.color}/40 transition-all`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-text-primary">{cat.label}</h3>
                  <p className="text-xs text-text-muted">{cat.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted font-heading">{count} perguntas</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ========================
  // COUNTDOWN 3-2-1
  // ========================
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center animate-fade-in" key={countdownNum}>
          {countdownNum > 0 ? (
            <>
              <span className="font-display text-8xl font-bold neon-text block animate-neon-flicker">
                {countdownNum}
              </span>
              <p className="text-text-muted font-heading mt-4">Prepare-se...</p>
            </>
          ) : (
            <>
              <span className="font-display text-5xl font-bold neon-text block animate-neon-flicker">
                VAI!
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  // ========================
  // RESULT
  // ========================
  if (phase === 'result') {
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    const xpEarned = Math.round(score / 20)
    const isNewRecord = score >= highScore && score > 0

    const getGrade = () => {
      if (accuracy >= 90) return { emoji: '🏆', label: 'MESTRE', color: 'neon-yellow' }
      if (accuracy >= 70) return { emoji: '⭐', label: 'EXPERT', color: 'neon-green' }
      if (accuracy >= 50) return { emoji: '👍', label: 'BOM', color: 'neon-cyan' }
      return { emoji: '📚', label: 'ESTUDANTE', color: 'neon-purple' }
    }
    const grade = getGrade()

    return (
      <div className="min-h-screen px-4 pt-6 pb-12 bg-dark-900 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-6xl block mb-3">{grade.emoji}</span>
          <h1 className="page-title text-2xl mb-1">Quiz Completo!</h1>
          <p className={`font-heading font-bold text-${grade.color}`}>{grade.label}</p>
          {isNewRecord && (
            <div className="mt-2 inline-flex items-center gap-1 bg-neon-yellow/10 border border-neon-yellow/30 rounded-full px-3 py-1 animate-neon-flicker">
              <span className="text-sm">🎉</span>
              <span className="text-xs font-heading neon-text-yellow">NOVO RECORDE!</span>
            </div>
          )}
        </div>

        {/* Score card */}
        <div className="card-primary p-5 mb-4 text-center">
          <p className="font-display text-4xl font-bold neon-text mb-1">
            {score.toLocaleString('pt-BR')}
          </p>
          <p className="text-text-muted text-sm font-heading">pontos</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="card-info p-3 text-center">
            <p className="font-display text-xl font-bold neon-text-cyan">{correct}/{questions.length}</p>
            <p className="text-[10px] text-text-muted font-heading mt-1">Acertos</p>
          </div>
          <div className="card-info p-3 text-center">
            <p className="font-display text-xl font-bold neon-text-yellow">{accuracy}%</p>
            <p className="text-[10px] text-text-muted font-heading mt-1">Precisao</p>
          </div>
          <div className="card-info p-3 text-center">
            <p className="font-display text-xl font-bold neon-text-purple">{bestStreak}🔥</p>
            <p className="text-[10px] text-text-muted font-heading mt-1">Melhor Streak</p>
          </div>
        </div>

        {/* Collect XP */}
        {xpEarned > 0 && user && (
          <div className="mb-4">
            {xpCollected ? (
              <div className="text-center py-3 animate-fade-in">
                <span className="font-display text-lg font-bold neon-text">+{xpEarned} XP coletado!</span>
              </div>
            ) : (
              <button
                onClick={collectXp}
                disabled={collectingXp}
                className="w-full py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-base transition-all duration-300 active:scale-[0.97] disabled:opacity-60 animate-fade-in"
                style={{
                  background: 'linear-gradient(135deg, #A02035, #7B1D2A)',
                  border: '2px solid rgba(212,175,55,0.6)',
                  color: '#f5e6c8',
                  boxShadow: '0 0 25px rgba(212,175,55,0.2), 0 4px 15px rgba(0,0,0,0.4)',
                }}
              >
                {collectingXp ? 'Coletando...' : `⭐ Coletar ${xpEarned} XP`}
              </button>
            )}
          </div>
        )}

        {/* Answers review */}
        <div className="neon-card p-4 mb-6">
          <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Suas respostas</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {answers.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  a.correct ? 'bg-state-success/20 text-state-success' : a.timeout ? 'bg-state-alert/20 text-state-alert' : 'bg-state-error/20 text-state-error'
                }`}>
                  {a.correct ? '✓' : a.timeout ? '⏳' : '✗'}
                </span>
                <span className="text-text-muted flex-1 truncate font-heading">
                  {questions[a.q]?.scenario.slice(0, 50)}...
                </span>
                {a.points > 0 && (
                  <span className="text-state-success font-heading font-bold">+{a.points}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => startGame(category)}
            className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all"
          >
            🔄 Jogar Novamente
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            Trocar Categoria
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

  // ========================
  // PLAYING
  // ========================
  const q = questions[current]
  const catInfo = CATEGORIES[q.cat] || CATEGORIES.all
  const timerPct = (timer / TIMER_SECONDS) * 100
  const timerColor = timer > 8 ? 'bg-state-success' : timer > 4 ? 'bg-state-alert' : 'bg-state-error'
  const timerGlow = timer > 8 ? '' : timer > 4 ? 'shadow-state-alert/20 shadow-lg' : 'shadow-state-error/30 shadow-lg animate-neon-flicker'

  return (
    <div className="min-h-screen px-4 pt-4 pb-8 bg-dark-900">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => { if (confirm('Sair do quiz? Seu progresso sera perdido.')) setPhase('menu') }}
          className="text-text-muted hover:text-text-secondary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-neon-yellow/10 border border-neon-yellow/30 rounded-full px-2.5 py-0.5 animate-slide-up">
              <span className="text-xs">🔥</span>
              <span className="font-display text-xs font-bold neon-text-yellow">{streak}x</span>
            </div>
          )}
          {/* Score */}
          <div className="flex items-center gap-1 bg-dark-700 rounded-full px-3 py-1">
            <span className="text-xs">⭐</span>
            <span className="font-display text-sm font-bold neon-text">{score.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-text-muted font-heading">{current + 1}/{questions.length}</span>
        <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-cyan rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer bar */}
      <div className={`h-2 bg-dark-700 rounded-full overflow-hidden mb-5 ${timerGlow}`}>
        <div
          className={`h-full rounded-full transition-[width] duration-100 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Timer number */}
      <div className="text-center mb-4">
        <span className={`font-display text-3xl font-bold ${
          timer > 8 ? 'text-text-secondary' : timer > 4 ? 'state-alert' : 'state-error animate-neon-flicker'
        }`}>
          {Math.ceil(timer)}
        </span>
      </div>

      {/* Question */}
      <div className="animate-slide-up" key={current}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{catInfo.emoji}</span>
          <span className="text-[11px] text-text-muted font-heading uppercase">{catInfo.label}</span>
          {q.difficulty >= 3 && <span className="text-[10px] text-state-error font-heading bg-state-error/10 px-1.5 py-0.5 rounded-full">DIFICIL</span>}
        </div>

        <div className="neon-card p-5 mb-5">
          <p className="font-heading text-base text-text-primary leading-relaxed">{q.scenario}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {q.options.map((opt, idx) => {
            let btnClass = 'bg-dark-700 border-dark-500 hover:border-neon-cyan/30'
            if (selected !== null) {
              if (opt.correct) {
                btnClass = 'bg-state-success/10 border-state-success/50'
              } else if (idx === selected && !opt.correct) {
                btnClass = 'bg-state-error/10 border-state-error/50'
              } else {
                btnClass = 'bg-dark-800 border-dark-600 opacity-50'
              }
            }
            if (selected === -1 && opt.correct) {
              btnClass = 'bg-state-success/10 border-state-success/50'
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    selected !== null && opt.correct
                      ? 'border-state-success text-state-success bg-state-success/10'
                      : selected === idx && !opt.correct
                        ? 'border-state-error text-state-error bg-state-error/10'
                        : 'border-dark-400 text-text-muted'
                  }`}>
                    {selected !== null && opt.correct ? '✓' :
                     selected === idx && !opt.correct ? '✗' :
                     String.fromCharCode(65 + idx)}
                  </div>
                  <p className={`font-heading text-sm ${
                    selected !== null && opt.correct ? 'text-state-success font-semibold' :
                    selected === idx && !opt.correct ? 'text-state-error' :
                    'text-text-primary'
                  }`}>{opt.text}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplain && (
          <div className="animate-slide-up">
            <div className={`neon-card p-4 mb-4 ${
              selected !== -1 && questions[current].options[selected]?.correct
                ? 'border-state-success/20'
                : 'border-state-error/20'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {selected !== -1 && questions[current].options[selected]?.correct ? (
                  <>
                    <span className="text-lg">✅</span>
                    <span className="font-heading font-bold text-state-success text-sm">Correto!</span>
                    {streak > 1 && <span className="text-xs font-heading neon-text-yellow ml-auto">🔥 {streak}x streak!</span>}
                  </>
                ) : (
                  <>
                    <span className="text-lg">{selected === -1 ? '⏰' : '❌'}</span>
                    <span className="font-heading font-bold text-state-error text-sm">
                      {selected === -1 ? 'Tempo esgotado!' : 'Errou!'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{q.explain}</p>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
            >
              {current + 1 < questions.length ? 'Proxima Pergunta →' : 'Ver Resultado →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
