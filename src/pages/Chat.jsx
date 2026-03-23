import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AURON_RESPONSES = [
  {
    keywords: ['orcamento', 'orçamento', 'organizar', 'planejar', 'planejamento'],
    reply: 'Orcamento e simples: anote tudo que ENTRA e tudo que SAI. A regra basica e gastar menos do que ganha. Tente a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupanca.',
  },
  {
    keywords: ['poupar', 'poupanca', 'poupança', 'guardar', 'economizar', 'economia'],
    reply: 'Comece pequeno! Guarde pelo menos 10% de tudo que receber. O segredo nao e o valor, e o HABITO. Com o tempo, voce se acostuma e ate aumenta esse percentual.',
  },
  {
    keywords: ['investir', 'investimento', 'investimentos', 'renda', 'rendimento'],
    reply: 'Investir e fazer o dinheiro trabalhar pra voce. Comece pelo basico: Tesouro Direto e CDBs sao otimas portas de entrada. Lembre-se: quanto maior o retorno prometido, maior o risco!',
  },
  {
    keywords: ['divida', 'dívida', 'dividas', 'dívidas', 'dever', 'devendo', 'emprestimo'],
    reply: 'Dividas com juros altos sao o maior inimigo das suas financas. Priorize pagar as dividas mais caras primeiro (cartao de credito, cheque especial). Negocie sempre que possivel!',
  },
  {
    keywords: ['cartao', 'cartão', 'credito', 'crédito'],
    reply: 'Cartao de credito nao e dinheiro extra! Use como ferramenta, nao como muleta. Pague SEMPRE a fatura total. Os juros do rotativo podem passar de 400% ao ano — e o maior vilao financeiro.',
  },
  {
    keywords: ['emergencia', 'emergência', 'reserva', 'imprevisto'],
    reply: 'Sua reserva de emergencia deve cobrir de 3 a 6 meses dos seus gastos mensais. Guarde num lugar seguro e com liquidez, como Tesouro Selic ou CDB com liquidez diaria. Emergencias NAO sao "se", sao "quando".',
  },
  {
    keywords: ['salario', 'salário', 'renda', 'ganhar', 'dinheiro'],
    reply: 'Nao importa quanto voce ganha, importa quanto voce GUARDA. Pessoas que ganham muito e gastam tudo estao em pior situacao do que quem ganha pouco e poupa. Controle e tudo!',
  },
  {
    keywords: ['meta', 'metas', 'objetivo', 'objetivos', 'sonho', 'sonhos'],
    reply: 'Defina metas SMART: Especificas, Mensuraveis, Alcancaveis, Relevantes e com Prazo. Em vez de "quero guardar dinheiro", diga "vou guardar R$200 por mes durante 12 meses para minha viagem".',
  },
  {
    keywords: ['golpe', 'golpes', 'piramide', 'pirâmide', 'fraude', 'scam'],
    reply: 'Se alguem promete retornos garantidos e altissimos, DESCONFIE. Piramides financeiras funcionam assim: pagam os primeiros com o dinheiro dos novos. Quando para de entrar gente, desmorona. Se parece bom demais, e golpe!',
  },
  {
    keywords: ['cripto', 'bitcoin', 'criptomoeda', 'criptomoedas', 'crypto'],
    reply: 'Criptomoedas sao investimentos de ALTO RISCO. Nunca invista mais do que voce pode perder. Entenda o que esta comprando antes de investir. E cuidado com "dicas quentes" e influenciadores.',
  },
  {
    keywords: ['acao', 'ações', 'acoes', 'bolsa', 'ação'],
    reply: 'A bolsa de valores e para longo prazo. Nao tente "adivinhar" o mercado. Diversifique seus investimentos e invista com regularidade. Fundos de indice (ETFs) sao otimos para comecar.',
  },
  {
    keywords: ['oi', 'ola', 'olá', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite', 'hello'],
    reply: 'Ola, jovem aventureiro! Sou o Mestre Auron, seu conselheiro financeiro. Me pergunte qualquer coisa sobre dinheiro, investimentos, poupanca ou orcamento. Estou aqui pra te ajudar!',
  },
  {
    keywords: ['obrigado', 'obrigada', 'valeu', 'thanks', 'brigado', 'brigada'],
    reply: 'Por nada! Lembre-se: conhecimento financeiro e o melhor investimento que existe. Retorno garantido e pra vida toda. Continue aprendendo!',
  },
  {
    keywords: ['ajuda', 'help', 'ajudar', 'o que', 'como', 'duvida', 'dúvida'],
    reply: 'Posso te ajudar com varios temas! Pergunte sobre: orcamento, poupanca, investimentos, dividas, cartao de credito, reserva de emergencia, metas financeiras, golpes e muito mais.',
  },
  {
    keywords: ['imposto', 'impostos', 'ir', 'declarar', 'declaracao'],
    reply: 'Impostos sao obrigacoes que todo cidadao tem. O importante e se organizar: guarde recibos, acompanhe seus rendimentos e, quando chegar a hora de declarar, estara tudo pronto. Planejamento evita dor de cabeca!',
  },
  {
    keywords: ['mesada', 'mesadas', 'dinheiro dos pais'],
    reply: 'Se voce recebe mesada, ja esta no jogo! Separe em 3 partes: uma pra gastar agora, uma pra guardar pra algo que quer, e uma pra reserva. Esse habito agora vai te fazer um adulto financeiramente forte.',
  },
]

const FALLBACK_REPLIES = [
  'Boa pergunta! Financas podem parecer complicadas, mas o basico e simples: gaste menos do que ganha, poupe uma parte e invista o resto. Quer saber mais sobre algum desses temas?',
  'Hmm, nao tenho certeza sobre isso. Mas posso te ajudar com orcamento, poupanca, investimentos, dividas e muito mais. Sobre o que quer conversar?',
  'Interessante! No mundo das financas, a regra numero um e: nunca gaste mais do que voce ganha. Quer que eu explique mais sobre algum tema especifico?',
  'Como seu conselheiro financeiro, recomendo que voce foque nos fundamentos: controle seus gastos, crie uma reserva de emergencia e comece a investir cedo. Me pergunte sobre qualquer um desses!',
]

function getAuronReply(message) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  for (const entry of AURON_RESPONSES) {
    for (const kw of entry.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (lower.includes(kwNorm)) {
        return entry.reply
      }
    }
  }

  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
}

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      from: 'auron',
      text: 'Saudacoes, jovem aventureiro! Eu sou o Mestre Auron, conselheiro real de financas do Reino de Valoria. Me pergunte qualquer coisa sobre dinheiro que eu te ajudo!',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setTyping(true)

    // Simula tempo de resposta
    setTimeout(() => {
      const reply = getAuronReply(text)
      setMessages(prev => [...prev, { from: 'auron', text: reply }])
      setTyping(false)
    }, 800 + Math.random() * 700)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-dark-900">

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-dark-900/95 border-b border-gold-accent/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-rose-pastel/30 transition-colors"
          >
            <svg className="w-5 h-5 text-enchanted-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 shadow-lg"
            style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}
          >
            🧙
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-enchanted leading-tight">Mestre Auron</p>
            <p className="text-[10px] text-enchanted-muted/60">Conselheiro Financeiro</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            {msg.from === 'auron' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-1 shadow" style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}>
                🧙
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.from === 'user'
                  ? 'bg-gold-accent/15 border border-gold-accent/25 rounded-br-md'
                  : 'card-primary rounded-bl-md'
              }`}
            >
              <p className={`text-sm leading-relaxed ${msg.from === 'user' ? 'text-enchanted' : 'text-enchanted-muted'}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start animate-slide-up">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-1 shadow" style={{ background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)' }}>
              🧙
            </div>
            <div className="card-primary rounded-2xl rounded-bl-md px-5 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-enchanted-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-enchanted-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-enchanted-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 bg-dark-900/95 backdrop-blur-md border-t border-gold-accent/10 px-4 pt-3 pb-6">
        <div className="flex items-end gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao Auron..."
            className="flex-1 bg-dark-700/60 border border-rose-light/15 rounded-xl px-4 py-3 text-sm text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center shrink-0 hover:bg-gold-accent/25 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gold-accent">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
