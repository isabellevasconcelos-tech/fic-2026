import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'

// ========================
// FRASES DO MENTOR
// ========================
const GREETINGS = {
  morning: [
    'Bom dia, jovem! Pronto pra mais uma jornada financeira?',
    'O sol nasceu e seu dinheiro precisa de atencao! Bom dia!',
    'Manha e hora de planejar. Vamos nessa?',
  ],
  afternoon: [
    'Boa tarde! Ja deu uma olhada nas suas financas hoje?',
    'Metade do dia ja foi — e o orcamento, como ta?',
    'Tarde de aprendizado! Que tal uma aula rapida?',
  ],
  evening: [
    'Boa noite! Hora de revisar o dia. Gastou consciente?',
    'Noite chegou. Que tal uma reflexao sobre seus gastos de hoje?',
    'Antes de dormir, lembre: cada real guardado e um tijolo do seu futuro.',
  ],
}

const PROGRESS_COMMENTS = {
  zero: [
    'Voce ainda nao comecou nenhuma aula. Que tal dar o primeiro passo? Prometo que vale a pena!',
    'O comeco e sempre o mais dificil. Mas uma aula de 5 minutos pode mudar sua vida financeira.',
    'Todos os mestres ja foram iniciantes. Sua jornada comeca com uma unica aula.',
  ],
  beginner: [
    'Voce ja comecou! Cada aula e um passo a mais rumo a liberdade financeira.',
    'Continue assim! O conhecimento que voce esta adquirindo ja esta te protegendo de armadilhas.',
    'Poucos tem a coragem de aprender sobre dinheiro. Voce e um deles!',
  ],
  intermediate: [
    'Voce esta evoluindo rapido! Ja sabe mais sobre financas que a maioria dos adultos.',
    'Nivel {level}! Impressionante. Seu futuro eu esta orgulhoso de voce.',
    'O conhecimento que voce tem agora vale mais que qualquer investimento. Continue!',
  ],
  advanced: [
    'Mestre das financas! Voce ja pode ensinar outras pessoas. Considere isso!',
    'Poucos chegam onde voce chegou. Voce e um verdadeiro Guardiao das Financas!',
    'Nivel {level}! Voce dominou o basico. Agora e hora de estrategias avancadas.',
  ],
}

const DAILY_TIPS = [
  { icon: '💡', tip: 'Antes de comprar, pergunte: "eu PRECISO ou eu QUERO?" Se for desejo, espere 48h.' },
  { icon: '🏦', tip: 'Pague voce primeiro! No dia que receber, separe 20% antes de gastar qualquer coisa.' },
  { icon: '📱', tip: 'Delete apps de compras por impulso (Shopee, Shein). Compre so pelo computador — reduz 60% dos impulsos.' },
  { icon: '💳', tip: 'Se voce paga so o minimo do cartao, esta pagando 400% de juros ao ano. Renegocie!' },
  { icon: '🎯', tip: 'Defina uma meta especifica: "guardar R$X ate [data]". Metas vagas nunca funcionam.' },
  { icon: '📊', tip: 'Anote TODOS os gastos por 1 semana. Voce vai se assustar com o resultado.' },
  { icon: '☕', tip: 'R$8/dia de cafe = R$2.920/ano. Faca o cafe em casa e invista a diferenca.' },
  { icon: '🛡️', tip: 'Reserva de emergencia PRIMEIRO, investimentos DEPOIS. Sem reserva, qualquer imprevisto vira divida.' },
  { icon: '📈', tip: 'Comece a investir com R$30 no Tesouro Selic. Sim, trinta reais. O habito vale mais que o valor.' },
  { icon: '🧮', tip: 'Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupanca. Simples e funciona.' },
  { icon: '🚫', tip: 'Nunca empreste dinheiro que voce nao pode perder. Se emprestar, considere um presente.' },
  { icon: '🔄', tip: 'Cancele assinaturas que nao usa ha 30 dias. A maioria das pessoas paga 3+ servicos que nao assiste.' },
  { icon: '🤝', tip: 'Sempre negocie. Desconto a vista, frete gratis, cashback — quem nao pede, nao recebe.' },
  { icon: '⚡', tip: 'Juros compostos: R$200/mes investidos a 1%/mes viram R$46.000 em 10 anos. Comece AGORA.' },
  { icon: '🎓', tip: 'Investir em conhecimento e o unico investimento com retorno GARANTIDO. Nunca pare de aprender.' },
  { icon: '🏠', tip: 'Aluguel nao deve passar de 30% da renda. Se passa, busque alternativas antes que vire bola de neve.' },
  { icon: '🍕', tip: 'Cozinhar 4x por semana em vez de pedir delivery economiza ~R$800/mes. E e mais saudavel!' },
  { icon: '📵', tip: 'Desative notificacoes de promocoes. Cada notificacao e uma tentacao planejada pra voce gastar.' },
  { icon: '💪', tip: 'O melhor momento pra comecar foi ontem. O segundo melhor e AGORA.' },
  { icon: '🧠', tip: 'Se alguem promete "dinheiro facil" ou "retorno garantido alto", e golpe. Sem excecoes.' },
]

const PAGE_CONTEXT = {
  '/': [
    'Bem-vindo ao seu quartel-general financeiro! Explore as ferramentas que preparei pra voce.',
    'Essa e sua base. Daqui voce controla toda sua jornada financeira.',
  ],
  '/modules': [
    'As trilhas de aprendizado sao seu mapa do tesouro. Cada aula te aproxima da liberdade financeira.',
    'Escolha uma trilha e mergulhe! Conhecimento e a arma mais poderosa contra dividas.',
  ],
  '/leaderboard': [
    'O ranking mostra quem esta estudando mais. Mas lembre: a verdadeira competicao e com voce mesmo!',
    'Cada posicao no ranking representa horas de estudo. Suba la!',
  ],
  '/achievements': [
    'Conquistas sao marcas da sua evolucao. Cada uma representa um passo importante.',
    'Tem conquistas secretas escondidas... Continue explorando!',
  ],
  '/profile': [
    'Seu perfil mostra sua evolucao. Olhe pra tras e veja o quanto ja caminhou!',
    'Cada XP representa conhecimento adquirido. Isso ninguem tira de voce.',
  ],
}

const MOTIVATIONAL = [
  'Lembre: todo expert ja foi iniciante. Voce esta no caminho certo.',
  'O fato de voce estar AQUI, aprendendo, ja te coloca a frente de 90% das pessoas.',
  'Dinheiro nao da em arvore, mas conhecimento financeiro da frutos pro resto da vida.',
  'Pequenos habitos, grandes resultados. Uma mudanca por vez.',
  'Voce nao precisa ser perfeito. Precisa ser CONSCIENTE.',
  'Cada decisao financeira boa e uma vitoria. Comemore as pequenas!',
  'Na proxima vez que alguem te oferecer "dinheiro facil", voce ja sabe a resposta.',
  'Seu futuro eu esta torcendo pra voce tomar boas decisoes HOJE.',
]

// ========================
// HELPER FUNCTIONS
// ========================
function getDayHash() {
  const d = new Date()
  return d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate()
}

function pickRandom(arr, seed = 0) {
  return arr[(getDayHash() + seed) % arr.length]
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

function getProgressLevel(profile) {
  if (!profile || profile.xp === 0) return 'zero'
  if (profile.level <= 2) return 'beginner'
  if (profile.level <= 5) return 'intermediate'
  return 'advanced'
}

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function Mentor() {
  const { profile } = useAuth()
  const feedback = useFeedback()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenToday, setHasSeenToday] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  // Show bubble hint after 3 seconds on first visit
  useEffect(() => {
    const lastSeen = localStorage.getItem('moneyquest_mentor_seen')
    const today = new Date().toDateString()
    if (lastSeen !== today) {
      const t = setTimeout(() => setShowBubble(true), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  // Hide bubble when panel opens
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false)
      setHasSeenToday(true)
      localStorage.setItem('moneyquest_mentor_seen', new Date().toDateString())
    }
  }, [isOpen])

  // Build messages
  const messages = useMemo(() => {
    const msgs = []
    const time = getTimeOfDay()
    const level = getProgressLevel(profile)

    // 1. Greeting
    msgs.push({
      type: 'greeting',
      text: pickRandom(GREETINGS[time], 0),
    })

    // 2. Page context
    const pageMsgs = PAGE_CONTEXT[location.pathname]
    if (pageMsgs) {
      msgs.push({
        type: 'context',
        text: pickRandom(pageMsgs, 1),
      })
    }

    // 3. Progress comment
    let progressText = pickRandom(PROGRESS_COMMENTS[level], 2)
    if (profile) {
      progressText = progressText.replace('{level}', profile.level)
    }
    msgs.push({
      type: 'progress',
      text: progressText,
    })

    // 4. Daily tip
    const tip = DAILY_TIPS[getDayHash() % DAILY_TIPS.length]
    msgs.push({
      type: 'tip',
      icon: tip.icon,
      label: 'Dica do dia',
      text: tip.tip,
    })

    // 5. Motivation
    msgs.push({
      type: 'motivation',
      text: pickRandom(MOTIVATIONAL, 3),
    })

    return msgs
  }, [profile, location.pathname])

  // Quick actions based on context
  const actions = useMemo(() => {
    const acts = []
    if (location.pathname !== '/modules') {
      acts.push({ label: 'Fazer uma aula', icon: '📚', path: '/modules' })
    }
    if (location.pathname !== '/quiz-battle') {
      acts.push({ label: 'Quiz Battle', icon: '🧠', path: '/quiz-battle' })
    }
    if (location.pathname !== '/reality-check') {
      acts.push({ label: 'Choque de Realidade', icon: '💀', path: '/reality-check' })
    }
    if (location.pathname !== '/personality') {
      acts.push({ label: 'Teste de Perfil', icon: '🧬', path: '/personality' })
    }
    return acts.slice(0, 3)
  }, [location.pathname])

  // Streak info
  const streakMessage = useMemo(() => {
    if (!profile) return null
    if (profile.streak_days === 0) return 'Voce ainda nao tem uma sequencia. Que tal comecar hoje?'
    if (profile.streak_days < 3) return `${profile.streak_days} dia(s) seguido(s)! Continue pra desbloquear bonus.`
    if (profile.streak_days < 7) return `${profile.streak_days} dias de sequencia! Voce esta pegando o ritmo!`
    return `${profile.streak_days} dias seguidos! Voce e imparavel! 🔥`
  }, [profile])

  return (
    <>
      {/* Floating bubble hint */}
      {showBubble && !isOpen && (
        <div className="fixed bottom-24 right-4 z-[60] animate-slide-up max-w-[200px]">
          <div className="bg-dark-700 border border-neon-cyan/30 rounded-2xl rounded-br-sm p-3 shadow-lg">
            <p className="text-xs text-text-secondary font-heading">
              Ola! Sou Mestre Auron, seu mentor financeiro. Toque em mim pra dicas! 🧙
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { setIsOpen(!isOpen); feedback?.trigger('tap') }}
        className={`fixed bottom-24 right-4 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bg-dark-700 border border-dark-500 rotate-0'
            : 'bg-dark-700 border border-neon-cyan/30 hover:border-neon-cyan/60 hover:scale-110'
        }`}
        style={!isOpen ? {
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.15), 0 0 40px rgba(0, 229, 255, 0.05)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        } : {}}
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🧙</span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center" onClick={() => setIsOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm animate-fade-in" />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg bg-dark-800 border-t border-neon-cyan/20 rounded-t-3xl px-4 pt-5 pb-24 max-h-[75vh] overflow-y-auto animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-dark-500 rounded-full mx-auto mb-4" />

            {/* Mentor header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                <span className="text-2xl">🧙</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-text-primary">Mestre Auron</h3>
                <p className="text-[11px] text-neon-cyan font-heading">Seu mentor financeiro</p>
              </div>
              {profile && (
                <div className="ml-auto text-right">
                  <p className="text-xs text-text-muted font-heading">Nv. {profile.level}</p>
                  <p className="text-xs neon-text font-display font-bold">{profile.xp} XP</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="space-y-3 mb-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {msg.type === 'tip' ? (
                    <div className="bg-neon-yellow/[0.05] border border-neon-yellow/15 rounded-2xl rounded-tl-sm p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">{msg.icon}</span>
                        <span className="text-[10px] text-neon-yellow font-heading font-semibold uppercase tracking-wider">{msg.label}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{msg.text}</p>
                    </div>
                  ) : (
                    <div className={`rounded-2xl rounded-tl-sm p-3.5 ${
                      msg.type === 'greeting' ? 'bg-neon-cyan/[0.05] border border-neon-cyan/15' :
                      msg.type === 'motivation' ? 'bg-neon-green/[0.05] border border-neon-green/15' :
                      'bg-dark-700 border border-dark-500'
                    }`}>
                      <p className="text-sm text-text-secondary leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Streak */}
              {streakMessage && (
                <div className="bg-dark-700 border border-dark-500 rounded-2xl rounded-tl-sm p-3.5 animate-slide-up"
                  style={{ animationDelay: `${messages.length * 80}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <p className="text-sm text-text-secondary">{streakMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="mb-4">
              <p className="text-[10px] text-text-muted font-heading uppercase tracking-wider mb-2">Sugestoes pra voce</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(act.path); setIsOpen(false); feedback?.trigger('tap') }}
                    className="shrink-0 flex items-center gap-2 bg-dark-700 border border-dark-500 rounded-xl px-3.5 py-2.5 hover:border-neon-cyan/30 transition-all"
                  >
                    <span className="text-base">{act.icon}</span>
                    <span className="font-heading text-xs text-text-secondary whitespace-nowrap">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fun fact */}
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl p-3 text-center">
              <p className="text-[10px] text-text-muted font-heading">
                🧙 "Na duvida, guarde. Na certeza, invista. Na pressa, respire."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
