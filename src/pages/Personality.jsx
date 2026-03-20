import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeedback } from '../contexts/FeedbackContext'

// ========================
// PERGUNTAS DO TESTE
// ========================
const QUIZ = [
  {
    id: 1,
    emoji: '💰',
    question: 'Voce recebe R$500 inesperados. O que faz PRIMEIRO?',
    options: [
      { text: 'Ja sei o que comprar!', type: 'impulsivo' },
      { text: 'Guardo tudo na poupanca', type: 'conservador' },
      { text: 'Pago uma divida ou invisto', type: 'planejador' },
      { text: 'Guardo metade e gasto metade', type: 'equilibrado' },
    ],
  },
  {
    id: 2,
    emoji: '🛒',
    question: 'No shopping, voce ve algo que quer mas nao precisa. Custa R$200.',
    options: [
      { text: 'Compro na hora, a vida e curta', type: 'impulsivo' },
      { text: 'Saio da loja e espero 3 dias pra decidir', type: 'planejador' },
      { text: 'Nunca compro nada que nao seja necessidade', type: 'conservador' },
      { text: 'Compro se couber no orcamento do mes', type: 'equilibrado' },
    ],
  },
  {
    id: 3,
    emoji: '📱',
    question: 'Seu celular funciona bem mas lancou o modelo novo. Voce:',
    options: [
      { text: 'Troco! Preciso ter o mais novo', type: 'impulsivo' },
      { text: 'Uso ate estragar completamente', type: 'conservador' },
      { text: 'Troco quando fizer sentido financeiramente', type: 'planejador' },
      { text: 'Pesquiso precos e espero uma boa promocao', type: 'equilibrado' },
    ],
  },
  {
    id: 4,
    emoji: '🍕',
    question: 'Sexta a noite. Seus amigos chamam pra sair. Voce ja gastou bastante essa semana.',
    options: [
      { text: 'Vou! Depois eu me viro', type: 'impulsivo' },
      { text: 'Fico em casa, nao posso gastar', type: 'conservador' },
      { text: 'Vou mas defino um limite de gasto antes', type: 'planejador' },
      { text: 'Sugiro algo mais barato pro grupo', type: 'equilibrado' },
    ],
  },
  {
    id: 5,
    emoji: '💳',
    question: 'Como voce usa seu cartao de credito?',
    options: [
      { text: 'Parcelo tudo, nao olho a fatura', type: 'impulsivo' },
      { text: 'Nao tenho cartao, e perigoso', type: 'conservador' },
      { text: 'Controlo cada gasto numa planilha', type: 'planejador' },
      { text: 'Uso com consciencia, pago a fatura inteira', type: 'equilibrado' },
    ],
  },
  {
    id: 6,
    emoji: '🏦',
    question: 'O que voce pensa sobre investir dinheiro?',
    options: [
      { text: 'Nao penso nisso, vivo o presente', type: 'impulsivo' },
      { text: 'So confio na poupanca', type: 'conservador' },
      { text: 'Estudo opcoes e diversifico', type: 'planejador' },
      { text: 'Invisto um pouco, ainda to aprendendo', type: 'equilibrado' },
    ],
  },
  {
    id: 7,
    emoji: '🚗',
    question: 'Voce precisa ir a um lugar a 3km. Voce:',
    options: [
      { text: 'Uber, sem pensar', type: 'impulsivo' },
      { text: 'Vou a pe pra economizar', type: 'conservador' },
      { text: 'Calculo se vale o custo ou se vou de bus', type: 'planejador' },
      { text: 'Depende da situacao — pressa ou nao', type: 'equilibrado' },
    ],
  },
  {
    id: 8,
    emoji: '🎮',
    question: 'Black Friday: aquele jogo/produto que voce quer ta com 40% off.',
    options: [
      { text: 'Compro agora antes que acabe!', type: 'impulsivo' },
      { text: 'Provavelmente e pegadinha, ignoro', type: 'conservador' },
      { text: 'Verifico historico de precos antes de comprar', type: 'planejador' },
      { text: 'Se eu ja tava querendo e cabe no orcamento, compro', type: 'equilibrado' },
    ],
  },
  {
    id: 9,
    emoji: '📊',
    question: 'Voce sabe quanto gastou no mes passado?',
    options: [
      { text: 'Nem ideia, nao controlo isso', type: 'impulsivo' },
      { text: 'Sei ate o centavo, anoto tudo', type: 'planejador' },
      { text: 'Mais ou menos, fico de olho no saldo', type: 'equilibrado' },
      { text: 'Sei que gastei pouco porque quase nao gasto', type: 'conservador' },
    ],
  },
  {
    id: 10,
    emoji: '🎯',
    question: 'Qual frase mais combina com voce?',
    options: [
      { text: '"Dinheiro e pra gastar, senao nao serve pra nada"', type: 'impulsivo' },
      { text: '"Cada centavo economizado e um centavo ganho"', type: 'conservador' },
      { text: '"Dinheiro e ferramenta — precisa de estrategia"', type: 'planejador' },
      { text: '"Equilibrio entre curtir hoje e planejar amanha"', type: 'equilibrado' },
    ],
  },
]

// ========================
// PERFIS DE PERSONALIDADE
// ========================
const PROFILES = {
  impulsivo: {
    emoji: '⚡',
    title: 'O Impulsivo',
    subtitle: 'Vive o agora, pensa depois',
    color: 'neon-pink',
    borderColor: 'border-neon-pink/30',
    bgColor: 'bg-neon-pink/[0.04]',
    percent: '32% dos brasileiros',
    description: 'Voce age rapido e gosta de aproveitar o momento. Isso e otimo pra experiencias, mas pode ser perigoso pro bolso. Voce tende a comprar por emocao e lidar com as consequencias depois.',
    strengths: [
      'Aproveita oportunidades rapido',
      'Generoso com amigos e familia',
      'Nao deixa de viver por medo',
    ],
    weaknesses: [
      'Gastos por impulso drenam seu dinheiro',
      'Pouca ou nenhuma reserva de emergencia',
      'Dividas podem se acumular sem perceber',
    ],
    tips: [
      { icon: '⏰', title: 'Regra das 48h', desc: 'Antes de comprar algo acima de R$50, espere 48 horas. Se ainda quiser, compre.' },
      { icon: '🔒', title: 'Automatize a poupanca', desc: 'Separe 20% do salario NO DIA que receber — o que sobrar e pra gastar sem culpa.' },
      { icon: '📱', title: 'Delete apps de compras', desc: 'Remova Shopee, Shein, AliExpress do celular. Comprar so pelo computador reduz impulso.' },
      { icon: '💰', title: 'Orcamento de "besteira"', desc: 'Separe R$X/mes pra gastar livremente. Quando acabar, acabou. Zero culpa, zero exagero.' },
      { icon: '🎯', title: 'Lista antes de sair', desc: 'Nunca va ao mercado/shopping sem lista. Compre SO o que esta na lista.' },
    ],
    challenge: 'Tente ficar 7 dias sem comprar nada que nao seja essencial. Anote cada impulso que resistiu.',
  },
  conservador: {
    emoji: '🛡️',
    title: 'O Conservador',
    subtitle: 'Seguranca acima de tudo',
    color: 'neon-cyan',
    borderColor: 'border-neon-cyan/30',
    bgColor: 'bg-neon-cyan/[0.04]',
    percent: '24% dos brasileiros',
    description: 'Voce valoriza seguranca e evita riscos. Guardar dinheiro te da tranquilidade. Isso e uma base solida, mas o medo de perder pode te impedir de GANHAR mais.',
    strengths: [
      'Disciplina financeira forte',
      'Reserva de emergencia garantida',
      'Dificilmente cai em golpes',
    ],
    weaknesses: [
      'Dinheiro parado perde valor (inflacao)',
      'Pode perder oportunidades de investimento',
      'As vezes deixa de viver por medo de gastar',
    ],
    tips: [
      { icon: '📈', title: 'Diversifique aos poucos', desc: 'Comece com Tesouro Selic (seguro como poupanca, rende mais). Depois explore CDBs e fundos.' },
      { icon: '💡', title: 'Inflacao e seu inimigo silencioso', desc: 'R$1.000 na poupanca hoje vale R$940 daqui um ano. Seu dinheiro PRECISA render acima da inflacao.' },
      { icon: '🎉', title: 'Orcamento de lazer', desc: 'Separe 10-15% pra curtir SEM CULPA. Guardar tudo e tao prejudicial quanto gastar tudo.' },
      { icon: '📚', title: 'Estude investimentos', desc: 'Conhecimento reduz medo. Comece por Tesouro Direto e CDB — sao tao seguros quanto poupanca.' },
      { icon: '⚖️', title: 'Regra do equilibrio', desc: 'Pra cada R$1 que guarda a mais, gaste R$0.50 em algo que te faz feliz. Dinheiro e meio, nao fim.' },
    ],
    challenge: 'Essa semana, invista R$50 em algo que NAO seja poupanca. Tesouro Selic e um otimo comeco.',
  },
  planejador: {
    emoji: '📋',
    title: 'O Planejador',
    subtitle: 'Estrategista das financas',
    color: 'neon-green',
    borderColor: 'border-neon-green/30',
    bgColor: 'bg-neon-green/[0.04]',
    percent: '18% dos brasileiros',
    description: 'Voce e metódico, analisa antes de agir e tem metas claras. Raramente e pego de surpresa. Seu desafio? Nao se tornar rigido demais e saber quando flexibilizar.',
    strengths: [
      'Controle total das financas',
      'Metas claras e atingiveis',
      'Investimentos bem pensados',
    ],
    weaknesses: [
      'Pode ser rigido demais consigo mesmo',
      'Analise excessiva paralisa decisoes',
      'Estresse quando algo sai do plano',
    ],
    tips: [
      { icon: '🧘', title: 'Flexibilidade planejada', desc: 'Reserve 5-10% do orcamento como "fundo flexivel" — pra imprevistos que nao sao emergencia.' },
      { icon: '🚀', title: 'Arrisque calculado', desc: 'Separe 5-10% pra investimentos de maior risco. Se perder, nao afeta seus planos. Se ganhar, acelera.' },
      { icon: '🎯', title: 'Metas de experiencia', desc: 'Alem de metas financeiras, crie metas de experiencia: viagens, cursos, momentos. Dinheiro serve pra viver.' },
      { icon: '👥', title: 'Ensine outros', desc: 'Seu conhecimento pode ajudar amigos e familia. Ensinar consolida seu proprio aprendizado.' },
      { icon: '📊', title: 'Revise o plano', desc: 'A cada 3 meses, revise metas e estrategia. O mercado muda, sua vida muda — seu plano tambem deve.' },
    ],
    challenge: 'Essa semana, gaste R$50 em algo espontaneo (sem planejar!) que te faca feliz. Flexibilidade e uma habilidade.',
  },
  equilibrado: {
    emoji: '⚖️',
    title: 'O Equilibrado',
    subtitle: 'O melhor dos dois mundos',
    color: 'neon-yellow',
    borderColor: 'border-neon-yellow/30',
    bgColor: 'bg-neon-yellow/[0.04]',
    percent: '26% dos brasileiros',
    description: 'Voce consegue curtir o presente sem destruir o futuro. Tem consciencia financeira e sabe dosar. Seu proximo passo e otimizar o que ja faz bem.',
    strengths: [
      'Equilibrio entre gastar e guardar',
      'Bom senso nas decisoes',
      'Adaptavel a diferentes situacoes',
    ],
    weaknesses: [
      'Pode acomodar e parar de evoluir',
      'As vezes falta intensidade nas metas',
      'Pode subestimar o poder dos juros compostos',
    ],
    tips: [
      { icon: '📈', title: 'Suba o nivel', desc: 'Voce ja tem a base. Agora estude investimentos mais avancados: acoes, FIIs, ETFs. Seu equilibrio te protege.' },
      { icon: '🎯', title: 'Metas ambiciosas', desc: 'Defina uma meta grande (casa, carro, viagem) e crie um plano. Voce tem disciplina pra chegar la.' },
      { icon: '💡', title: 'Automatize mais', desc: 'Se ainda nao faz, automatize investimentos mensais. "Pagar voce primeiro" e o proximo nivel.' },
      { icon: '🔄', title: 'Aumente aos poucos', desc: 'A cada aumento de renda, aumente a % que investe em 5%. Voce nao sentira a diferenca, mas o futuro sim.' },
      { icon: '📚', title: 'Mentorar alguem', desc: 'Ajude um amigo impulsivo a se organizar. Ensinar e a melhor forma de consolidar conhecimento.' },
    ],
    challenge: 'Nesse mes, aumente sua taxa de investimento em 5%. Se guardava 20%, tente 25%.',
  },
}

// Shuffle array
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
export default function Personality() {
  const navigate = useNavigate()
  const feedback = useFeedback()

  const [phase, setPhase] = useState('intro') // intro | quiz | analyzing | result
  const [questions] = useState(() =>
    QUIZ.map(q => ({ ...q, options: shuffle(q.options) }))
  )
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [analyzeStep, setAnalyzeStep] = useState(0)

  function startQuiz() {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
    setPhase('quiz')
  }

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    feedback?.trigger('tap')
    const type = questions[current].options[idx].type
    const newAnswers = [...answers, type]
    setAnswers(newAnswers)

    setTimeout(() => {
      setSelected(null)
      if (current + 1 >= questions.length) {
        analyze(newAnswers)
      } else {
        setCurrent(c => c + 1)
      }
    }, 500)
  }

  function analyze(allAnswers) {
    setPhase('analyzing')
    setAnalyzeStep(0)

    // Count types
    const counts = { impulsivo: 0, conservador: 0, planejador: 0, equilibrado: 0 }
    for (const a of allAnswers) counts[a]++

    // Determine dominant type
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const dominant = sorted[0][0]

    // Build percentages
    const total = allAnswers.length
    const breakdown = {}
    for (const [key, val] of Object.entries(counts)) {
      breakdown[key] = Math.round((val / total) * 100)
    }

    // Animate analysis steps
    const steps = [
      'Analisando suas respostas...',
      'Mapeando padroes de comportamento...',
      'Identificando seu perfil dominante...',
      'Gerando dicas personalizadas...',
    ]
    let step = 0
    const interval = setInterval(() => {
      step++
      setAnalyzeStep(step)
      if (step >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setResult({ type: dominant, breakdown, profile: PROFILES[dominant] })
          setPhase('result')
          feedback?.trigger('reveal')
          feedback?.trigger('complete', { emoji: PROFILES[dominant].emoji, title: PROFILES[dominant].title, subtitle: 'Perfil financeiro identificado!' })
        }, 600)
      }
    }, 800)
  }

  // ========================
  // INTRO
  // ========================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen px-4 pt-6 pb-12 bg-dark-900 animate-fade-in">
        <button onClick={() => navigate('/')} className="text-text-muted text-sm font-heading hover:text-text-secondary mb-6 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🧬</span>
          <h1 className="page-title text-2xl mb-3">Personalidade Financeira</h1>
          <p className="page-subtitle text-sm max-w-xs mx-auto leading-relaxed">
            Responda 10 perguntas sobre seus habitos e descubra qual e seu perfil financeiro — com dicas feitas pra VOCE.
          </p>
        </div>

        {/* Preview dos perfis */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {Object.entries(PROFILES).map(([key, p]) => (
            <div key={key} className={`neon-card p-3 text-center ${p.borderColor}`}>
              <span className="text-2xl block mb-1">{p.emoji}</span>
              <p className={`font-heading text-sm font-bold text-${p.color}`}>{p.title}</p>
              <p className="text-[10px] text-text-muted">{p.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="neon-card p-4 mb-6 border-dark-500">
          <div className="flex items-center gap-3 text-center justify-center">
            <div>
              <span className="text-xl">📝</span>
              <p className="text-[11px] text-text-muted font-heading">10 perguntas</p>
            </div>
            <div className="w-px h-8 bg-dark-500" />
            <div>
              <span className="text-xl">⏱️</span>
              <p className="text-[11px] text-text-muted font-heading">~2 minutos</p>
            </div>
            <div className="w-px h-8 bg-dark-500" />
            <div>
              <span className="text-xl">🎯</span>
              <p className="text-[11px] text-text-muted font-heading">Dicas pessoais</p>
            </div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-bold py-4 rounded-xl hover:bg-neon-green/20 transition-all text-lg"
        >
          Descobrir meu perfil
        </button>
      </div>
    )
  }

  // ========================
  // QUIZ
  // ========================
  if (phase === 'quiz') {
    const q = questions[current]
    const progress = ((current + 1) / questions.length) * 100

    return (
      <div className="min-h-screen px-4 pt-4 pb-8 bg-dark-900">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { if (current === 0) setPhase('intro'); else setCurrent(c => c - 1) }}
            className="text-text-muted hover:text-text-secondary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-text-muted font-heading">{current + 1}/{questions.length}</span>
        </div>

        {/* Question */}
        <div className="animate-slide-up" key={current}>
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3">{q.emoji}</span>
            <p className="font-heading text-base text-text-primary leading-relaxed px-2">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-neon-green/10 border-neon-green/50 scale-[1.02]'
                      : selected !== null
                        ? 'bg-dark-800 border-dark-600 opacity-40'
                        : 'bg-dark-700 border-dark-500 hover:border-neon-cyan/30 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-dark-400 text-text-muted'
                    }`}>
                      {isSelected ? '✓' : String.fromCharCode(65 + idx)}
                    </div>
                    <p className={`font-heading text-sm ${isSelected ? 'text-neon-green' : 'text-text-primary'}`}>
                      {opt.text}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ========================
  // ANALYZING
  // ========================
  if (phase === 'analyzing') {
    const steps = [
      'Analisando suas respostas...',
      'Mapeando padroes de comportamento...',
      'Identificando seu perfil dominante...',
      'Gerando dicas personalizadas...',
    ]

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
        <div className="text-center max-w-xs">
          <span className="text-5xl block mb-6 animate-neon-flicker">🧬</span>

          <div className="space-y-3 mb-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  i <= analyzeStep ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  i < analyzeStep
                    ? 'bg-neon-green/20 text-neon-green'
                    : i === analyzeStep
                      ? 'bg-neon-cyan/20 text-neon-cyan animate-neon-flicker'
                      : 'bg-dark-700 text-dark-500'
                }`}>
                  {i < analyzeStep ? '✓' : i === analyzeStep ? '...' : ''}
                </div>
                <p className={`text-sm font-heading ${
                  i <= analyzeStep ? 'text-text-secondary' : 'text-dark-500'
                }`}>{step}</p>
              </div>
            ))}
          </div>

          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-700"
              style={{ width: `${((analyzeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ========================
  // RESULT
  // ========================
  if (phase === 'result' && result) {
    const { profile: p, breakdown } = result
    const barOrder = Object.entries(breakdown).sort((a, b) => b[1] - a[1])

    return (
      <div className="min-h-screen px-4 pt-6 pb-12 bg-dark-900 animate-fade-in">
        {/* Header */}
        <div className={`neon-card p-6 text-center mb-6 ${p.borderColor} ${p.bgColor}`}>
          <span className="text-6xl block mb-3">{p.emoji}</span>
          <h1 className="page-title text-2xl mb-1">{p.title}</h1>
          <p className="page-subtitle text-sm">{p.subtitle}</p>
          <p className="text-[11px] text-text-muted mt-2 font-heading">{p.percent} tem esse perfil</p>
        </div>

        {/* Description */}
        <div className="neon-card p-5 mb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{p.description}</p>
        </div>

        {/* Breakdown */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Seu perfil detalhado</h3>
          <div className="space-y-3">
            {barOrder.map(([key, pct]) => {
              const prof = PROFILES[key]
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{prof.emoji}</span>
                      <span className={`font-heading text-xs ${key === result.type ? `text-${prof.color} font-bold` : 'text-text-muted'}`}>
                        {prof.title}
                      </span>
                    </div>
                    <span className={`font-display text-xs font-bold ${key === result.type ? `text-${prof.color}` : 'text-text-muted'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-${prof.color}`}
                      style={{ width: `${pct}%`, transitionDelay: '200ms' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="neon-card p-4 border-neon-green/20">
            <h3 className="font-heading text-xs font-semibold text-neon-green mb-3 flex items-center gap-1">
              <span>💪</span> Pontos Fortes
            </h3>
            <div className="space-y-2">
              {p.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-neon-green text-[10px] mt-1">✓</span>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="neon-card p-4 border-neon-pink/20">
            <h3 className="font-heading text-xs font-semibold text-neon-pink mb-3 flex items-center gap-1">
              <span>⚠️</span> Cuidado com
            </h3>
            <div className="space-y-2">
              {p.weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-neon-pink text-[10px] mt-1">!</span>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Tips */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🎯</span> Dicas personalizadas pra voce
          </h3>
          <div className="space-y-4">
            {p.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-heading text-sm font-semibold text-text-primary mb-0.5">{tip.title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge */}
        <div className={`neon-card p-5 mb-6 ${p.borderColor} ${p.bgColor}`}>
          <h3 className="font-heading text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>🔥</span> Desafio da semana
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{p.challenge}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={startQuiz}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            🔄 Refazer o Teste
          </button>
          <button
            onClick={() => navigate('/reality-check')}
            className="w-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink font-heading font-semibold py-3 rounded-lg hover:bg-neon-pink/20 transition-all"
          >
            💀 Ver Choque de Realidade
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

  return null
}
