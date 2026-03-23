import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAgeGroup } from '../lib/ageContent'

const AURON_RESPONSES = {
  child: [
    { keywords: ['orcamento', 'orçamento', 'organizar', 'planejar'], reply: 'Orcamento e tipo um plano pro seu dinheiro! Anote tudo que voce ganha (mesada, presentes) e tudo que gasta. A regra e simples: tente nao gastar TUDO de uma vez!' },
    { keywords: ['poupar', 'poupanca', 'poupança', 'guardar', 'economizar'], reply: 'Guardar dinheiro e como colecionar! Cada moedinha que voce guarda vai crescendo. Tente guardar um pouquinho toda vez que ganhar dinheiro — nem que seja R$1!' },
    { keywords: ['investir', 'investimento', 'rendimento'], reply: 'Investir e quando voce coloca seu dinheiro pra trabalhar pra voce! E como plantar uma semente: voce cuida dela e com o tempo ela vira uma arvore grande. Quanto mais cedo comecar, melhor!' },
    { keywords: ['divida', 'dívida', 'dever', 'devendo'], reply: 'Divida e quando voce gasta mais do que tem e fica devendo. E importante evitar isso! Se voce quer comprar algo caro, e melhor juntar o dinheiro primeiro do que pedir emprestado.' },
    { keywords: ['golpe', 'golpes', 'piramide', 'fraude'], reply: 'Se alguem falar que voce vai ganhar muito dinheiro facil e rapido, CUIDADO! Isso geralmente e golpe. Dinheiro de verdade vem com esforco e paciencia. Na duvida, fale com um adulto de confianca!' },
    { keywords: ['mesada', 'mesadas', 'dinheiro dos pais'], reply: 'A mesada e seu primeiro treino com dinheiro! Divida em 3: uma parte pra gastar no que quiser, uma pra guardar pra algo especial, e uma pro cofrinho. Voce vai ver como e legal ver o dinheiro crescer!' },
    { keywords: ['oi', 'ola', 'olá', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite'], reply: 'Ola, jovem aventureiro! Sou o Mestre Auron! Estou aqui pra te ensinar tudo sobre dinheiro de um jeito divertido. Me pergunta qualquer coisa!' },
    { keywords: ['obrigado', 'obrigada', 'valeu', 'brigado'], reply: 'De nada! Voce esta no caminho certo aprendendo sobre dinheiro. Continue assim que voce vai longe!' },
    { keywords: ['ajuda', 'help', 'ajudar', 'duvida', 'dúvida'], reply: 'Posso te ajudar com varias coisas! Pergunte sobre mesada, como guardar dinheiro, por que economizar, golpes e muito mais!' },
    { keywords: ['meta', 'metas', 'objetivo', 'sonho'], reply: 'Quer comprar algo legal? Faca assim: descubra quanto custa, quanto voce consegue guardar por semana e calcule quantas semanas precisa. E tipo uma missao de jogo!' },
  ],
  teen: [
    { keywords: ['orcamento', 'orçamento', 'organizar', 'planejar', 'planejamento'], reply: 'Orcamento e simples: anote tudo que ENTRA e tudo que SAI. A regra basica e gastar menos do que ganha. Tente a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupanca.' },
    { keywords: ['poupar', 'poupanca', 'poupança', 'guardar', 'economizar', 'economia'], reply: 'Comece pequeno! Guarde pelo menos 10% de tudo que receber. O segredo nao e o valor, e o HABITO. Com o tempo, voce se acostuma e ate aumenta esse percentual.' },
    { keywords: ['investir', 'investimento', 'investimentos', 'renda', 'rendimento'], reply: 'Investir e fazer o dinheiro trabalhar pra voce. Comece pelo basico: Tesouro Direto e CDBs sao otimas portas de entrada. Lembre-se: quanto maior o retorno prometido, maior o risco!' },
    { keywords: ['divida', 'dívida', 'dividas', 'dívidas', 'dever', 'devendo', 'emprestimo'], reply: 'Dividas com juros altos sao o maior inimigo das suas financas. Priorize pagar as dividas mais caras primeiro (cartao de credito, cheque especial). Negocie sempre que possivel!' },
    { keywords: ['cartao', 'cartão', 'credito', 'crédito'], reply: 'Cartao de credito nao e dinheiro extra! Use como ferramenta, nao como muleta. Pague SEMPRE a fatura total. Os juros do rotativo podem passar de 400% ao ano.' },
    { keywords: ['emergencia', 'emergência', 'reserva', 'imprevisto'], reply: 'Sua reserva de emergencia deve cobrir de 3 a 6 meses dos seus gastos. Guarde num lugar seguro e com liquidez, como Tesouro Selic. Emergencias NAO sao "se", sao "quando".' },
    { keywords: ['salario', 'salário', 'renda', 'ganhar', 'dinheiro'], reply: 'Nao importa quanto voce ganha, importa quanto voce GUARDA. Pessoas que ganham muito e gastam tudo estao em pior situacao do que quem ganha pouco e poupa.' },
    { keywords: ['meta', 'metas', 'objetivo', 'objetivos', 'sonho', 'sonhos'], reply: 'Defina metas claras! Em vez de "quero guardar dinheiro", diga "vou guardar R$200 por mes durante 12 meses para minha viagem". Ter um objetivo concreto facilita tudo.' },
    { keywords: ['golpe', 'golpes', 'piramide', 'pirâmide', 'fraude', 'scam'], reply: 'Se alguem promete retornos garantidos e altissimos, DESCONFIE. Piramides financeiras pagam os primeiros com dinheiro dos novos. Se parece bom demais, e golpe!' },
    { keywords: ['cripto', 'bitcoin', 'criptomoeda', 'crypto'], reply: 'Criptomoedas sao investimentos de ALTO RISCO. Nunca invista mais do que voce pode perder. Cuidado com "dicas quentes" e influenciadores.' },
    { keywords: ['acao', 'ações', 'acoes', 'bolsa', 'ação'], reply: 'A bolsa de valores e para longo prazo. Nao tente "adivinhar" o mercado. Diversifique e invista com regularidade. Fundos de indice (ETFs) sao otimos pra comecar.' },
    { keywords: ['oi', 'ola', 'olá', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite'], reply: 'Ola, jovem aventureiro! Sou o Mestre Auron, seu conselheiro financeiro. Me pergunte qualquer coisa sobre dinheiro!' },
    { keywords: ['obrigado', 'obrigada', 'valeu', 'brigado'], reply: 'Por nada! Conhecimento financeiro e o melhor investimento que existe. Continue aprendendo!' },
    { keywords: ['ajuda', 'help', 'ajudar', 'duvida', 'dúvida'], reply: 'Posso te ajudar com: orcamento, poupanca, investimentos, dividas, cartao de credito, reserva de emergencia, metas, golpes e mais.' },
    { keywords: ['mesada', 'mesadas', 'dinheiro dos pais'], reply: 'Se voce recebe mesada, ja esta no jogo! Separe em 3 partes: gastar, guardar pra algo que quer, e reserva. Esse habito vai te fazer um adulto financeiramente forte.' },
  ],
  adult: [
    { keywords: ['orcamento', 'orçamento', 'organizar', 'planejar', 'planejamento'], reply: 'A regra 50-30-20 e um bom ponto de partida: 50% necessidades, 30% desejos, 20% investimentos. Mas o ideal e personalizar conforme sua realidade. O importante e ter controle total do fluxo de caixa.' },
    { keywords: ['poupar', 'poupanca', 'poupança', 'guardar', 'economizar', 'economia'], reply: 'Poupanca na caderneta rende abaixo da inflacao — seu dinheiro perde valor. Considere CDBs, Tesouro Selic ou fundos DI para reserva. Para metas de medio/longo prazo, diversifique entre renda fixa e variavel.' },
    { keywords: ['investir', 'investimento', 'investimentos', 'renda', 'rendimento'], reply: 'Monte uma carteira diversificada: renda fixa (Tesouro, CDB, LCI/LCA) para seguranca, acoes e ETFs para crescimento, e FIIs para renda passiva. O mais importante e comecar e manter consistencia.' },
    { keywords: ['divida', 'dívida', 'dividas', 'dívidas', 'dever', 'devendo', 'emprestimo'], reply: 'Priorize quitar dividas com juros altos (rotativo do cartao pode passar de 400%/ano). Considere portabilidade de credito e renegociacao. Use a estrategia avalanche (maior juros primeiro) ou bola de neve (menor saldo primeiro).' },
    { keywords: ['cartao', 'cartão', 'credito', 'crédito'], reply: 'Cartao de credito pode ser um aliado: acumule milhas, use o periodo de carencia e SEMPRE pague a fatura total. Nunca entre no rotativo. Se nao consegue controlar, congele o cartao.' },
    { keywords: ['emergencia', 'emergência', 'reserva', 'imprevisto'], reply: 'Reserva de emergencia: 6 a 12 meses de despesas em aplicacao com liquidez diaria (Tesouro Selic, CDB DI). Nao e investimento, e seguro. Sem ela, qualquer imprevisto vira divida.' },
    { keywords: ['salario', 'salário', 'renda', 'ganhar', 'dinheiro'], reply: 'Foque em aumentar renda E reduzir gastos. Invista em skills que valorizam no mercado. Crie fontes de renda passiva. E lembre-se: seu maior ativo e sua capacidade de gerar renda.' },
    { keywords: ['meta', 'metas', 'objetivo', 'objetivos', 'sonho'], reply: 'Use metas SMART com timeline: curto prazo (ate 1 ano) em renda fixa, medio prazo (1-5 anos) diversificado, longo prazo (5+ anos) com mais renda variavel. Automatize aportes mensais.' },
    { keywords: ['golpe', 'golpes', 'piramide', 'pirâmide', 'fraude', 'scam'], reply: 'Desconfie de retornos acima de 2% ao mes. Verifique se a empresa tem registro na CVM. Piramides e esquemas Ponzi prometem retornos irreais. Se nao tem lastro real, e golpe.' },
    { keywords: ['cripto', 'bitcoin', 'criptomoeda', 'crypto'], reply: 'Cripto pode compor 5-10% de uma carteira diversificada. Foque em projetos consolidados (BTC, ETH). Use exchanges regulamentadas. Guarde em cold wallet para valores maiores. Nunca invista o que nao pode perder.' },
    { keywords: ['imposto', 'impostos', 'ir', 'declarar', 'declaracao'], reply: 'Planejamento tributario e essencial. Use PGBL para deduzir ate 12% da renda bruta no IR. LCI, LCA e debentures incentivadas sao isentas de IR. Organize seus informes de rendimento o ano todo.' },
    { keywords: ['oi', 'ola', 'olá', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite'], reply: 'Saudacoes! Sou o Mestre Auron. Posso te ajudar com estrategias de investimento, planejamento financeiro, gestao de dividas e muito mais. O que precisa?' },
    { keywords: ['obrigado', 'obrigada', 'valeu', 'brigado'], reply: 'Disponha! Educacao financeira e um investimento que paga dividendos pro resto da vida. Continue buscando conhecimento!' },
    { keywords: ['ajuda', 'help', 'ajudar', 'duvida', 'dúvida'], reply: 'Posso ajudar com: orcamento, investimentos, dividas, cartao de credito, reserva de emergencia, acoes, cripto, imposto de renda, metas financeiras e mais.' },
  ],
}

const FALLBACK_REPLIES = {
  child: [
    'Boa pergunta! Dinheiro pode parecer complicado, mas e facil: nao gaste tudo de uma vez e guarde um pouquinho! Quer saber mais?',
    'Hmm, nao sei bem sobre isso. Mas posso te ensinar sobre mesada, como guardar dinheiro e evitar golpes! O que quer saber?',
    'Sabia que guardar dinheiro e tipo um jogo? Quanto mais voce guarda, mais pontos voce faz! Me pergunta qualquer coisa!',
  ],
  teen: [
    'Boa pergunta! Financas podem parecer complicadas, mas o basico e simples: gaste menos do que ganha, poupe uma parte e invista o resto. Quer saber mais?',
    'Hmm, nao tenho certeza sobre isso. Mas posso te ajudar com orcamento, poupanca, investimentos, dividas e muito mais. Sobre o que quer conversar?',
    'Interessante! No mundo das financas, a regra numero um e: nunca gaste mais do que voce ganha. Quer que eu explique mais sobre algum tema?',
    'Recomendo que voce foque nos fundamentos: controle seus gastos, crie uma reserva de emergencia e comece a investir cedo. Me pergunte sobre qualquer um desses!',
  ],
  adult: [
    'Para responder melhor, preciso de mais contexto. Mas posso ajudar com investimentos, planejamento tributario, gestao de dividas, aposentadoria e mais. Qual area te interessa?',
    'Interessante! Os pilares da saude financeira sao: orcamento controlado, reserva de emergencia, dividas zeradas e investimentos diversificados. Sobre qual quer conversar?',
    'Recomendo focar em: zerar dividas caras, montar reserva de 6-12 meses, e investir consistentemente todo mes. Me pergunte sobre qualquer um desses temas!',
  ],
}

function getAuronReply(message, ageGroup) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const responses = AURON_RESPONSES[ageGroup] || AURON_RESPONSES.teen
  for (const entry of responses) {
    for (const kw of entry.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (lower.includes(kwNorm)) return entry.reply
    }
  }
  const fallbacks = FALLBACK_REPLIES[ageGroup] || FALLBACK_REPLIES.teen
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export default function Mentor() {
  const [isOpen, setIsOpen] = useState(false)
  const { profile } = useAuth()
  const ageGroup = getAgeGroup(profile.age)

  return (
    <>
      {isOpen && <AuronChatPanel onClose={() => setIsOpen(false)} ageGroup={ageGroup} />}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[5.5rem] right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)',
          border: '2px solid rgba(212,175,55,0.4)',
          boxShadow: '0 0 20px rgba(212,175,55,0.3), 0 4px 16px rgba(0,0,0,0.4)',
          animation: isOpen ? 'none' : 'auron-pulse 3s ease-in-out infinite',
        }}
        title="Fale com Auron"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🧙</span>
        )}

        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: '2px solid rgba(212,175,55,0.5)',
              animation: 'auron-ring 3s ease-in-out infinite',
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes auron-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.3), 0 4px 16px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 30px rgba(212,175,55,0.5), 0 4px 20px rgba(0,0,0,0.5); }
        }
        @keyframes auron-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </>
  )
}

const WELCOME_MSG = {
  child: 'Ola, aventureiro! Eu sou o Mestre Auron! Estou aqui pra te ensinar tudo sobre dinheiro de um jeito legal e divertido. Me pergunta qualquer coisa!',
  teen: 'Saudacoes, jovem aventureiro! Eu sou o Mestre Auron, conselheiro real de financas do Reino de Valoria. Me pergunte qualquer coisa sobre dinheiro que eu te ajudo!',
  adult: 'Saudacoes! Sou o Mestre Auron, seu consultor financeiro. Posso ajudar com investimentos, planejamento, gestao de dividas e estrategias financeiras. Como posso ajudar?',
}

function AuronChatPanel({ onClose, ageGroup }) {
  const [unrolled, setUnrolled] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: WELCOME_MSG[ageGroup] || WELCOME_MSG.teen,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setUnrolled(true))
    })
  }, [])

  function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const reply = getAuronReply(text, ageGroup)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setLoading(false)
    }, 800 + Math.random() * 700)
  }

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 z-[9998] w-[calc(100vw-1.5rem)] sm:w-[380px]">
      <div className="papyrus-scroll" style={{ maxWidth: '100%' }}>
        <div
          className="papyrus-roll papyrus-roll-top"
          style={{
            transform: unrolled ? 'translateY(0)' : 'translateY(200px)',
            transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        <div
          className="papyrus-body flex flex-col overflow-hidden"
          style={{
            padding: 0,
            maxHeight: unrolled ? '480px' : '0px',
            opacity: unrolled ? 1 : 0,
            transition: 'max-height 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.5s ease-in 0.5s',
          }}
        >
          {/* Header */}
          <div className="relative text-center px-4 pt-5 pb-3 border-b" style={{ borderColor: 'rgba(200,168,78,0.15)' }}>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 border-2 border-gold-accent/40"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)',
                boxShadow: '0 0 15px rgba(212,175,55,0.15)',
              }}
            >
              🧙
            </div>

            <h3 className="font-display text-lg leading-tight" style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.2)' }}>
              Mestre Auron
            </h3>
            <p className="font-heading text-[10px] uppercase tracking-[0.25em] mt-0.5" style={{ color: 'rgba(212,175,55,0.5)' }}>
              Conselheiro Financeiro
            </p>

            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-10" style={{ background: 'rgba(212,175,55,0.3)' }} />
              <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: 'rgba(212,175,55,0.4)' }}>
                <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
              </svg>
              <div className="h-px w-10" style={{ background: 'rgba(212,175,55,0.3)' }} />
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.6 }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '300px', minHeight: '180px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                  style={
                    msg.role === 'assistant'
                      ? {
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.15)',
                          borderRadius: '4px 14px 14px 14px',
                          color: 'rgba(240,230,214,0.8)',
                          fontFamily: '"Lora", serif',
                        }
                      : {
                          background: 'rgba(139,26,43,0.15)',
                          border: '1px solid rgba(139,26,43,0.25)',
                          borderRadius: '14px 4px 14px 14px',
                          color: 'rgba(240,230,214,0.85)',
                          fontFamily: '"Lora", serif',
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3.5 py-2.5 text-sm"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: '4px 14px 14px 14px',
                    color: 'rgba(212,175,55,0.5)',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="flex gap-2 px-4 py-3 border-t"
            style={{ borderColor: 'rgba(212,175,55,0.15)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte ao Auron..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'rgba(240,230,214,0.85)',
                fontFamily: '"Lora", serif',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #D4AF37)',
                border: '1px solid rgba(212,175,55,0.4)',
                boxShadow: '0 2px 8px rgba(139,105,20,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,230,214,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
        </div>

        <div
          className="papyrus-roll papyrus-roll-bottom"
          style={{
            transform: unrolled ? 'translateY(0)' : 'translateY(-200px)',
            transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>
    </div>
  )
}
