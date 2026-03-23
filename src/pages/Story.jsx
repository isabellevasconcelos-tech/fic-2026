import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

// ========================
// PERSONAGENS
// ========================
const CHARS = {
  narrator: { name: 'Narrador', emoji: '📜', colorClass: 'text-text-secondary', borderClass: 'border-dark-500' },
  auron: { name: 'Mestre Auron', emoji: '🧙', colorClass: 'neon-text-cyan', borderClass: 'border-neon-cyan/30', title: 'Conselheiro Real de Financas' },
  lira: { name: 'Lira', emoji: '🧝‍♀️', colorClass: 'neon-text-purple', borderClass: 'border-neon-purple/30', title: 'Comerciante do Mercado Central' },
  orik: { name: 'Rei Orik', emoji: '👑', colorClass: 'neon-text-yellow', borderClass: 'border-neon-yellow/30', title: 'Rei de Valoria' },
  player: { name: 'Voce', emoji: '⚔️', colorClass: 'neon-text', borderClass: 'border-neon-green/30', title: 'Jovem Aventureiro(a)' },
}

// ========================
// CAPITULOS
// ========================
const CHAPTERS = [
  {
    id: 1, title: 'O Orcamento do Reino', emoji: '🏰', color: 'neon-green',
    description: 'Aprenda a equilibrar receitas e despesas no Reino de Valoria.',
    xpReward: 60, startingCoins: 100, firstScene: 'c1_s1',
    lessons: [
      'Orcamento = Receitas - Despesas',
      'Despesas obrigatorias (impostos, contas) vem PRIMEIRO',
      'Desejos vs Necessidades: pergunte "eu PRECISO ou eu QUERO?"',
      'Sempre saiba seu saldo antes de gastar',
      'Negociar e uma habilidade valiosa',
    ],
  },
  {
    id: 2, title: 'A Reserva do Dragao', emoji: '🐉', color: 'neon-cyan',
    description: 'Prepare-se para emergencias e aprenda o poder da poupanca.',
    xpReward: 80, startingCoins: 80, firstScene: 'c2_s1',
    lessons: [
      'Reserva de emergencia = 3 a 6 meses de gastos',
      'Comece pequeno, mas comece HOJE',
      'Juros de divida sao o verdadeiro dragao',
      'Regra 50-30-20: necessidades, desejos, poupanca',
      'Emergencias NAO sao "se", sao "quando"',
    ],
  },
  {
    id: 3, title: 'As Sementes de Ouro', emoji: '🌱', color: 'neon-yellow',
    description: 'Faca seu dinheiro crescer e aprenda a investir com sabedoria.',
    xpReward: 100, startingCoins: 120, firstScene: 'c3_s1',
    lessons: [
      'Investir = fazer o dinheiro trabalhar pra voce',
      'Risco e retorno andam juntos',
      'Diversificacao: nunca todos os ovos na mesma cesta',
      'Se parece bom demais pra ser verdade, e golpe',
      'Investimento e maratona, nao sprint',
    ],
  },
]

// ========================
// CENAS
// ========================
const SCENES = {
  // ---- CAPITULO 1: O Orcamento do Reino ----
  c1_s1: {
    speaker: 'narrator',
    text: 'Voce acaba de chegar ao Reino de Valoria, uma terra onde moedas de ouro sao a base de tudo. Voce carrega uma bolsa com 100 moedas — tudo o que tem no mundo.',
    next: 'c1_s2',
  },
  c1_s2: {
    speaker: 'auron',
    text: 'Bem-vindo a Valoria, jovem viajante! Eu sou Mestre Auron, conselheiro real de financas. Vejo que voce traz algumas moedas... Mas cuidado — neste reino, quem nao controla seu ouro, perde tudo.',
    next: 'c1_s3',
  },
  c1_s3: {
    speaker: 'auron',
    text: 'Sua primeira licao: todo orcamento tem duas partes — o que ENTRA (receitas) e o que SAI (despesas). Se sai mais do que entra, voce esta no vermelho. Simples assim.',
    next: 'c1_s4',
  },
  c1_s4: {
    speaker: 'narrator',
    text: 'Voce chega ao mercado central de Valoria. As barracas transbordam de comida, armas e pocoes. Seu estomago ronca — voce nao come desde ontem.',
    next: 'c1_s5',
  },
  c1_s5: {
    speaker: 'lira',
    text: 'Ola, forasteiro! Sou Lira, dona da maior barraca do mercado. Posso ver que esta com fome. Tenho tres opcoes pra voce:',
    choices: [
      { text: 'Banquete completo (-30 moedas)', coins: -30, reaction: 'Delicioso! Mas 30 moedas e muito... Lira sorri: "Comer bem e importante, mas nao todo dia assim, hein?"', next: 'c1_s6' },
      { text: 'Refeicao simples (-10 moedas)', coins: -10, reaction: 'Uma sopa quente e pao. Lira aprova: "Esperto! Matou a fome sem gastar demais. Isso e equilibrio."', next: 'c1_s6' },
      { text: 'Pedir sobras de graca', coins: 0, reaction: 'Lira franze a testa: "Posso te dar hoje, mas amanha voce precisa se planejar. Ninguem vive de favor pra sempre."', next: 'c1_s6' },
    ],
  },
  c1_s6: {
    speaker: 'narrator',
    text: 'Um mensageiro real chega correndo ao mercado. Ele carrega um decreto com o selo do Rei Orik.',
    next: 'c1_s7',
  },
  c1_s7: {
    speaker: 'orik',
    text: 'Decreto Real: Todo cidadao de Valoria deve pagar o Imposto da Coroa — 20 moedas. Quem nao pagar em 3 dias sera banido do reino.',
    next: 'c1_s8',
  },
  c1_s8: {
    speaker: 'auron',
    text: 'Impostos sao despesas OBRIGATORIAS, jovem. Como aluguel e contas na vida real. Voce nao escolhe se paga — voce TEM que pagar. A questao e: voce se planejou pra isso?',
    autoCoins: -20,
    next: 'c1_s9',
  },
  c1_s9: {
    speaker: 'narrator',
    text: 'Enquanto voce processa a cobranca, um comerciante se aproxima oferecendo um trabalho: carregar caixas no porto por um dia.',
    next: 'c1_s10',
  },
  c1_s10: {
    speaker: 'player',
    text: 'Preciso de mais moedas... Esse trabalho pode ajudar.',
    choices: [
      { text: 'Aceitar o trabalho (+25 moedas)', coins: 25, reaction: 'Voce trabalhou duro o dia todo. Cansado, mas com 25 moedas a mais! Receita extra e sempre bem-vinda.', next: 'c1_s11' },
      { text: 'Recusar e descansar', coins: 0, reaction: 'Voce descansou, mas perdeu a oportunidade de ganhar mais. As vezes descanso e necessario... mas planeje isso.', next: 'c1_s11' },
    ],
  },
  c1_s11: {
    speaker: 'lira',
    text: 'Ei, forasteiro! Tenho uma oferta especial — uma capa encantada por apenas 35 moedas. So tenho uma! E linda, olha so...',
    choices: [
      { text: 'Comprar a capa (-35 moedas)', coins: -35, reaction: 'A capa e linda, mas Mestre Auron balanca a cabeca: "Bonita, mas voce PRECISAVA dela? Desejos vs necessidades, jovem. Essa e a grande armadilha."', next: 'c1_s12' },
      { text: 'Resistir a tentacao', coins: 0, reaction: 'Auron sorri orgulhoso: "Excelente! Saber dizer NAO a um desejo e a habilidade financeira mais poderosa que existe."', next: 'c1_s12' },
      { text: 'Negociar o preco (-15 moedas)', coins: -15, reaction: 'Lira ri: "Esperto! Te dou por 15." Auron aprova: "Negociar e uma arte — nunca aceite o primeiro preco."', next: 'c1_s12' },
    ],
  },
  c1_s12: {
    speaker: 'auron',
    text: 'Muito bem, jovem! Voce sobreviveu ao seu primeiro dia em Valoria. Vamos fazer as contas? Isso se chama BALANCO: tudo que entrou menos tudo que saiu. Nunca durma sem saber seu saldo.',
    next: 'END',
  },

  // ---- CAPITULO 2: A Reserva do Dragao ----
  c2_s1: {
    speaker: 'narrator',
    text: 'Algumas semanas se passaram. Voce ja e conhecido em Valoria e tem um trabalho fixo ganhando 30 moedas por semana. Hoje voce tem 80 moedas guardadas.',
    next: 'c2_s2',
  },
  c2_s2: {
    speaker: 'auron',
    text: 'Jovem, tenho algo importante pra te ensinar hoje. Voce ja ouviu falar do Dragao das Montanhas? Ele aparece quando menos esperamos — assim como emergencias na vida real.',
    next: 'c2_s3',
  },
  c2_s3: {
    speaker: 'auron',
    text: 'Uma RESERVA DE EMERGENCIA e o ouro que voce guarda para imprevistos. Se o dragao atacar e voce nao tiver reserva... voce perde tudo. A regra? Guarde pelo menos o suficiente para 3 semanas sem trabalhar.',
    next: 'c2_s4',
  },
  c2_s4: {
    speaker: 'lira',
    text: 'Acabei de abrir uma conta no Cofre da Guilda! Eles guardam seu ouro em seguranca e ainda pagam 2 moedas extras por semana. Quer abrir uma tambem?',
    choices: [
      { text: 'Guardar 30 moedas no Cofre', coins: -30, reaction: 'Lira aplaude: "Otima escolha! Seu dinheiro guardado la rende mais do que debaixo do colchao." Voce comeca sua reserva!', next: 'c2_s5' },
      { text: 'Guardar 15 moedas no Cofre', coins: -15, reaction: 'Lira da de ombros: "Menos do que eu sugeriria, mas ja e um comeco. O importante e criar o HABITO de guardar."', next: 'c2_s5' },
      { text: 'Nao guardar nada', coins: 0, reaction: 'Lira suspira: "Voce pode se arrepender... Quando a emergencia chegar, e tarde demais pra comecar a guardar."', next: 'c2_s5' },
    ],
  },
  c2_s5: {
    speaker: 'narrator',
    text: 'Uma semana tranquila se passa. Voce recebe seu pagamento de 30 moedas.',
    autoCoins: 30,
    next: 'c2_s6',
  },
  c2_s6: {
    speaker: 'narrator',
    text: 'Seus amigos te convidam para a Feira Noturna de Valoria — musica, jogos e comida. A entrada custa 20 moedas.',
    choices: [
      { text: 'Ir a Feira (-20 moedas)', coins: -20, reaction: 'Noite incrivel! Mas custou... Auron lembra: "Lazer e importante, mas precisa estar no orcamento. Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupanca."', next: 'c2_s7' },
      { text: 'Ir, mas gastar so 10', coins: -10, reaction: 'Voce foi e se divertiu, mas controlou os gastos. Lira comenta: "Da pra se divertir sem gastar tudo. Voce entendeu o jogo!"', next: 'c2_s7' },
      { text: 'Ficar em casa e guardar', coins: 0, reaction: 'Voce economizou, mas Auron observa: "Poupar e otimo, mas viver so pra guardar dinheiro tambem nao e saudavel. Equilibrio, jovem."', next: 'c2_s7' },
    ],
  },
  c2_s7: {
    speaker: 'narrator',
    text: 'ALERTA! O Dragao das Montanhas atacou Valoria! Casas foram destruidas, incluindo parte da sua! O conserto custa 40 moedas.',
    next: 'c2_s8',
  },
  c2_s8: {
    speaker: 'auron',
    text: 'Esta e a emergencia que eu te avisei, jovem! Se voce tem reserva, pode pagar o conserto. Se nao tem... vai precisar pedir emprestado, e DIVIDA e o verdadeiro dragao.',
    next: 'c2_s9',
  },
  c2_s9: {
    speaker: 'player',
    text: 'O conserto custa 40 moedas. Preciso resolver isso...',
    choices: [
      { text: 'Pagar com minhas economias (-40)', coins: -40, requireMin: 40, reaction: 'Voce pagou do proprio bolso! Auron: "VIU? Pra isso serve a reserva de emergencia. Dor agora, mas zero divida!"', next: 'c2_s10' },
      { text: 'Pedir emprestado ao agiota (-55 com juros)', coins: -55, reaction: 'O agiota cobra juros altissimos. Auron: "Divida com juros e uma bola de neve. Na vida real, os juros do cartao de credito chegam a 400% ao ano!"', next: 'c2_s10' },
      { text: 'Pagar metade e improvisar (-20)', coins: -20, requireMin: 20, reaction: 'Voce consertou so o essencial. Nao e ideal, mas evitou divida grande. Auron: "As vezes a solucao nao e perfeita, mas e a possivel."', next: 'c2_s10' },
    ],
  },
  c2_s10: {
    speaker: 'lira',
    text: 'Depois do ataque, o preco dos materiais de construcao triplicou. Tudo fica mais caro em tempos de crise... Assim como na inflacao do mundo real.',
    next: 'c2_s11',
  },
  c2_s11: {
    speaker: 'auron',
    text: 'Viu como tudo esta conectado? Emergencias acontecem, precos sobem, e quem nao se preparou sofre mais. Sua reserva de emergencia e seu escudo contra o dragao.',
    next: 'END',
  },

  // ---- CAPITULO 3: As Sementes de Ouro ----
  c3_s1: {
    speaker: 'narrator',
    text: 'Meses se passaram. Voce se tornou um cidadao respeitado de Valoria, com uma reserva solida de 120 moedas. Mestre Auron tem algo novo para ensinar.',
    next: 'c3_s2',
  },
  c3_s2: {
    speaker: 'auron',
    text: 'Jovem, voce ja dominou o orcamento e a poupanca. Agora vou te ensinar o segredo mais poderoso do reino: fazer seu dinheiro TRABALHAR pra voce.',
    next: 'c3_s3',
  },
  c3_s3: {
    speaker: 'auron',
    text: 'Veja essa semente de ouro. Se voce plantar hoje e esperar, ela vira uma arvore que da frutos de ouro todo ano. Isso e INVESTIR. Voce abre mao de gastar agora para ter MAIS no futuro.',
    next: 'c3_s4',
  },
  c3_s4: {
    speaker: 'lira',
    text: 'Tenho tres opcoes de investimento pra voce, cada uma com risco diferente. Lembre: quanto maior o retorno prometido, maior o risco!',
    choices: [
      { text: 'Cofre da Guilda (seguro, rende +5)', coins: -30, investType: 'safe', reaction: 'Baixo risco, baixo retorno. Como a poupanca ou Tesouro Selic na vida real. Seu dinheiro cresce devagar, mas com seguranca.', next: 'c3_s5' },
      { text: 'Sementes de Ouro (medio, pode render +15)', coins: -30, investType: 'medium', reaction: 'Risco medio, retorno medio. Como fundos de investimento ou acoes de empresas grandes. Pode subir ou cair.', next: 'c3_s5' },
      { text: 'Mina Misteriosa (arriscado, pode render +40)', coins: -30, investType: 'risky', reaction: 'Alto risco, alto retorno OU alta perda. Como criptomoedas ou acoes especulativas. Pode dar muito certo... ou muito errado.', next: 'c3_s5' },
    ],
  },
  c3_s5: {
    speaker: 'narrator',
    text: 'Duas semanas se passam. O resultado do seu investimento chegou...',
    next: 'c3_s6',
  },
  c3_s6: {
    speaker: 'lira',
    text: '', // filled dynamically based on investType
    dynamic: 'investResult',
    next: 'c3_s7',
  },
  c3_s7: {
    speaker: 'orik',
    text: 'Cidadaos de Valoria! Estou lancando o Grande Projeto do Reino — uma nova estrada comercial. Quem investir agora recebera parte dos lucros do comercio por anos!',
    choices: [
      { text: 'Investir 40 moedas no projeto', coins: -40, reaction: 'Rei Orik: "Obrigado pela confianca! Este e um investimento de LONGO PRAZO. Na vida real, isso e como investir em Tesouro Direto — voce empresta pro governo e recebe juros."', next: 'c3_s8' },
      { text: 'Investir 20 moedas (cauteloso)', coins: -20, reaction: 'Auron aprova: "Diversificar e sabio. Nunca coloque todos os ovos na mesma cesta. Investiu, mas guardou reserva."', next: 'c3_s8' },
      { text: 'Nao investir (guardar tudo)', coins: 0, reaction: 'Auron: "Guardar e bom, mas dinheiro parado PERDE valor com o tempo por causa da inflacao. E como deixar agua parada — ela evapora."', next: 'c3_s8' },
    ],
  },
  c3_s8: {
    speaker: 'narrator',
    text: 'Um estranho misterioso se aproxima no mercado, sussurrando sobre um "investimento secreto" que triplica seu ouro em uma semana.',
    next: 'c3_s9',
  },
  c3_s9: {
    speaker: 'player',
    text: 'Hmm... triplicar meu ouro em uma semana? Parece bom demais pra ser verdade...',
    choices: [
      { text: 'Aceitar a oferta (-50 moedas)', coins: -50, reaction: 'ERA GOLPE! O estranho fugiu com seu ouro! Auron: "NUNCA confie em retornos milagrosos. Se parece bom demais pra ser verdade, E GOLPE. Piramides financeiras funcionam assim."', next: 'c3_s10' },
      { text: 'Recusar — parece golpe', coins: 0, reaction: 'Auron abraca voce: "PERFEITO! Voce identificou o golpe! Na vida real, desconfie de qualquer um que prometa retornos garantidos e altissimos."', next: 'c3_s10' },
    ],
  },
  c3_s10: {
    speaker: 'auron',
    text: 'Voce aprendeu a licao mais valiosa de todas: investir e uma maratona, nao uma corrida. Paciencia, diversificacao e educacao sao suas melhores armas.',
    next: 'c3_s11',
  },
  c3_s11: {
    speaker: 'auron',
    text: 'Lembre-se das regras de ouro: 1) Nunca invista o que nao pode perder. 2) Diversifique. 3) Quanto maior o retorno prometido, maior o risco. 4) Se parece bom demais, e golpe.',
    next: 'c3_s12',
  },
  c3_s12: {
    speaker: 'orik',
    text: 'Jovem aventureiro, voce provou ser sabio com suas moedas. Eu te nomeio Guardiao das Financas de Valoria! Que voce leve esse conhecimento para o mundo real.',
    next: 'END',
  },
}

// Dynamic text for investment result
const INVEST_RESULTS = {
  safe: { text: 'Seu investimento no Cofre rendeu +5 moedas. Pouco? Sim. Mas voce nao perdeu nada. Consistencia e seguranca sao a chave!', coins: 5 },
  medium: { text: 'As Sementes de Ouro brotaram! +15 moedas de lucro. Um bom retorno pra um risco moderado. Parabens pela escolha equilibrada!', coins: 15 },
  risky: { text: 'A Mina Misteriosa desabou! Voce perdeu 25 moedas. Auron: "Por isso nunca invista o que voce nao pode perder."', coins: -25 },
}

// ========================
// COMPONENTE PRINCIPAL
// ========================
export default function Story() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const feedback = useFeedback()

  const [phase, setPhase] = useState('menu')
  const [chapter, setChapter] = useState(null)
  const [sceneId, setSceneId] = useState(null)
  const [coins, setCoins] = useState(0)
  const [coinChange, setCoinChange] = useState(null)
  const [choicesMade, setChoicesMade] = useState([])
  const [reaction, setReaction] = useState(null)
  const [investType, setInvestType] = useState(null)
  const [chaptersCompleted, setChaptersCompleted] = useState([])
  const [xpEarned, setXpEarned] = useState(0)
  const [awarding, setAwarding] = useState(false)

  // Load progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moneyquest_story_progress')
      if (saved) setChaptersCompleted(JSON.parse(saved).chaptersCompleted || [])
    } catch {}
  }, [])

  function saveProgress(chapterId) {
    const updated = [...new Set([...chaptersCompleted, chapterId])]
    setChaptersCompleted(updated)
    try { localStorage.setItem('moneyquest_story_progress', JSON.stringify({ chaptersCompleted: updated })) } catch {}
  }

  function showCoinChange(amount) {
    setCoinChange({ amount: Math.abs(amount), positive: amount > 0 })
    setTimeout(() => setCoinChange(null), 1500)
  }

  function startChapter(ch) {
    setChapter(ch)
    setCoins(ch.startingCoins)
    setSceneId(ch.firstScene)
    setChoicesMade([])
    setReaction(null)
    setInvestType(null)
    setXpEarned(0)
    setPhase('playing')
  }

  function getScene() {
    if (!sceneId) return null
    const scene = SCENES[sceneId]
    if (!scene) return null
    // Handle dynamic scene
    if (scene.dynamic === 'investResult') {
      const result = INVEST_RESULTS[investType] || INVEST_RESULTS.safe
      return { ...scene, text: result.text, autoCoins: result.coins }
    }
    return scene
  }

  function handleAdvance(scene) {
    setReaction(null)
    // Apply auto coins
    if (scene.autoCoins) {
      setCoins(c => c + scene.autoCoins)
      showCoinChange(scene.autoCoins)
    }
    if (scene.next === 'END') {
      finishChapter()
    } else {
      setSceneId(scene.next)
    }
  }

  function handleChoice(choice) {
    feedback?.trigger('tap')
    if (choice.coins) {
      setCoins(c => c + choice.coins)
      showCoinChange(choice.coins)
      feedback?.trigger('coins', { amount: choice.coins })
    }
    if (choice.investType) setInvestType(choice.investType)
    setChoicesMade(prev => [...prev, { sceneId, text: choice.text, coins: choice.coins || 0 }])
    setReaction(choice.reaction)
  }

  function advanceAfterReaction(choice) {
    setReaction(null)
    if (choice.next === 'END') {
      finishChapter()
    } else {
      setSceneId(choice.next)
    }
  }

  async function finishChapter() {
    if (awarding) return
    setAwarding(true)
    const xp = chapter.xpReward
    setXpEarned(xp)
    saveProgress(chapter.id)
    setPhase('summary')

    if (user && xp > 0) {
      await supabase.rpc('add_xp', { p_user_id: profile.id, p_amount: xp })
      await refreshProfile()
    }
    feedback?.trigger('xp', { amount: xp, label: `Capitulo ${chapter.id} concluido!` })
    feedback?.trigger('complete', { emoji: chapter.emoji, title: 'Capitulo Concluido!', subtitle: chapter.title })
    if (profile) feedback?.checkLevelUp(profile.level)
    setAwarding(false)
  }

  function getAvailableChoices(scene) {
    if (!scene.choices) return null
    return scene.choices.filter(c => c.requireMin === undefined || coins >= c.requireMin)
  }

  // Scene count for progress bar
  function getSceneIndex() {
    if (!chapter) return { current: 0, total: 1 }
    const prefix = `c${chapter.id}_`
    const sceneIds = Object.keys(SCENES).filter(k => k.startsWith(prefix))
    const idx = sceneIds.indexOf(sceneId)
    return { current: idx + 1, total: sceneIds.length }
  }

  // ========================
  // MENU
  // ========================
  if (phase === 'menu') {
    return (
      <div className="min-h-screen px-4 pt-6 pb-20 bg-dark-900 animate-fade-in">
        <button onClick={() => navigate('/')} className="text-text-muted text-sm font-heading hover:text-text-secondary mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">📜</span>
          <h1 className="page-title text-2xl mb-3">Historia Interativa</h1>
          <p className="page-subtitle text-sm">Sua jornada financeira no Reino de Valoria</p>
        </div>

        <div className="space-y-4">
          {CHAPTERS.map((ch, i) => {
            const isUnlocked = ch.id === 1 || chaptersCompleted.includes(ch.id - 1)
            const isDone = chaptersCompleted.includes(ch.id)
            return (
              <button
                key={ch.id}
                onClick={() => isUnlocked && startChapter(ch)}
                disabled={!isUnlocked}
                className={`w-full text-left neon-card p-5 transition-all ${
                  isUnlocked ? `border-${ch.color}/30 hover:border-${ch.color}/50` : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{ch.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-base font-bold text-text-primary">Cap. {ch.id}: {ch.title}</h2>
                      {!isUnlocked && <span className="text-sm">🔒</span>}
                      {isDone && <span className="text-neon-green text-xs font-heading">✓</span>}
                    </div>
                    <p className="text-xs text-text-muted mt-1">{ch.description}</p>
                    <p className="text-[11px] mt-2 font-heading">
                      {!isUnlocked ? (
                        <span className="text-text-muted">Complete o capitulo {ch.id - 1} para desbloquear</span>
                      ) : isDone ? (
                        <span className="text-neon-green">Concluido • Jogar novamente • {ch.xpReward} XP</span>
                      ) : (
                        <span className={`text-${ch.color}`}>{ch.xpReward} XP • {ch.startingCoins} moedas iniciais</span>
                      )}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ========================
  // SUMMARY
  // ========================
  if (phase === 'summary') {
    const coinsGained = choicesMade.filter(c => c.coins > 0).reduce((a, c) => a + c.coins, 0)
    const coinsSpent = choicesMade.filter(c => c.coins < 0).reduce((a, c) => a + Math.abs(c.coins), 0)
    const nextChapter = CHAPTERS.find(c => c.id === chapter.id + 1)
    const nextUnlocked = nextChapter && chaptersCompleted.includes(chapter.id)

    return (
      <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900 animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-2">{chapter.emoji}</span>
          <h1 className="page-title text-xl">Capitulo {chapter.id} Concluido!</h1>
          <p className="page-subtitle text-sm mt-1">{chapter.title}</p>
        </div>

        {/* Saldo final */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Resumo Financeiro</h3>
          <div className="text-center mb-3">
            <span className="text-3xl">💰</span>
            <p className={`font-display text-2xl font-bold ${coins >= 0 ? 'neon-text-yellow' : 'text-neon-pink'}`}>{coins} moedas</p>
            <p className="text-xs text-text-muted">Saldo final</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-dark-800/50 rounded-lg p-2">
              <p className="font-heading text-sm font-bold text-text-primary">{chapter.startingCoins}</p>
              <p className="text-[10px] text-text-muted">Inicial</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-2">
              <p className="font-heading text-sm font-bold text-neon-green">+{coinsGained}</p>
              <p className="text-[10px] text-text-muted">Ganhou</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-2">
              <p className="font-heading text-sm font-bold text-neon-pink">-{coinsSpent}</p>
              <p className="text-[10px] text-text-muted">Gastou</p>
            </div>
          </div>
        </div>

        {/* Licoes */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">📚 O que voce aprendeu</h3>
          <div className="space-y-2">
            {chapter.lessons.map((lesson, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-neon-green text-sm mt-0.5">✓</span>
                <p className="text-sm text-text-secondary">{lesson}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Escolhas */}
        <div className="neon-card p-5 mb-4">
          <h3 className="font-heading text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">📝 Suas escolhas</h3>
          <div className="space-y-2">
            {choicesMade.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-dark-800/50 rounded-lg p-2">
                <p className="text-xs text-text-secondary flex-1">{c.text}</p>
                {c.coins !== 0 && (
                  <span className={`text-xs font-heading ml-2 ${c.coins > 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {c.coins > 0 ? '+' : ''}{c.coins}
                  </span>
                )}
              </div>
            ))}
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
          {nextUnlocked && nextChapter && (
            <button
              onClick={() => startChapter(nextChapter)}
              className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all"
            >
              Proximo Capitulo: {nextChapter.title} →
            </button>
          )}
          <button
            onClick={() => startChapter(chapter)}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            Jogar Novamente
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="w-full bg-dark-700 border border-dark-500 text-text-secondary font-heading font-semibold py-3 rounded-lg hover:border-dark-400 transition-all"
          >
            Voltar ao Menu
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 text-base font-heading font-bold rounded-2xl transition-all active:scale-[0.97]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)',
              boxShadow: '0 0 20px rgba(212,175,55,0.2), 0 4px 12px rgba(0,0,0,0.4)',
              color: '#f5e6c8',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            🏠 Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  // ========================
  // TELA FINAL
  // ========================
  if (phase === 'finished') {
    const allDone = CHAPTERS.every(ch => chaptersCompleted.includes(ch.id))

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-8 bg-dark-900 animate-fade-in">
        <div className="text-center max-w-sm">
          <span className="text-7xl block mb-6">{allDone ? '👑' : '🏆'}</span>

          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-gold-accent leading-tight mb-4"
            style={{ textShadow: '0 0 20px rgba(212,175,55,0.6), 0 0 50px rgba(212,175,55,0.25)' }}
          >
            {allDone ? 'Jornada Completa!' : 'Parabéns, Aventureiro!'}
          </h1>

          <p className="text-base text-text-secondary leading-relaxed mb-3">
            {allDone
              ? 'Voce completou todos os capitulos do Reino de Valoria! Agora voce e um verdadeiro Guardiao das Financas.'
              : `Voce concluiu o capitulo "${chapter.title}" com sucesso!`
            }
          </p>

          <p className="text-sm text-text-muted leading-relaxed mb-8">
            {allDone
              ? 'Use o conhecimento adquirido para transformar sua vida financeira no mundo real.'
              : 'Continue sua jornada para desbloquear novos capitulos e se tornar um mestre das financas.'
            }
          </p>

          {xpEarned > 0 && (
            <div className="neon-card p-4 rounded-2xl mb-8 inline-block">
              <p className="font-display text-xl font-bold neon-text">+{xpEarned} XP</p>
              <p className="text-[11px] text-text-muted mt-1">conquistados neste capitulo</p>
            </div>
          )}

          <div className="space-y-4 w-full">
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 text-base font-heading font-bold rounded-2xl transition-all active:scale-[0.97]"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)',
                boxShadow: '0 0 20px rgba(212,175,55,0.2), 0 4px 12px rgba(0,0,0,0.4)',
                color: '#f5e6c8',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              Voltar ao Início
            </button>

            <button
              onClick={() => setPhase('menu')}
              className="w-full py-3 text-sm font-heading font-semibold text-text-muted rounded-2xl border border-dark-500 hover:border-dark-400 transition-all"
            >
              Escolher outro capítulo
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ========================
  // PLAYING
  // ========================
  const scene = getScene()
  if (!scene) return null

  const char = CHARS[scene.speaker]
  const choices = getAvailableChoices(scene)
  const { current: sceneNum, total: sceneTotal } = getSceneIndex()
  const lastChoice = reaction ? choicesMade[choicesMade.length - 1] : null

  return (
    <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900">
      {/* Coin change floating badge */}
      {coinChange && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-xp-float">
          <div className={`${coinChange.positive ? 'bg-neon-green/20 border-neon-green/50 neon-text' : 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink'} border rounded-full px-6 py-2 font-display font-bold`}>
            {coinChange.positive ? '+' : '-'}{coinChange.amount} moedas
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => { if (confirm('Tem certeza que quer sair? Seu progresso neste capitulo sera perdido.')) setPhase('menu') }}
          className="text-text-muted hover:text-text-secondary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-300"
            style={{ width: `${(sceneNum / sceneTotal) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted font-heading">{sceneNum}/{sceneTotal}</span>
      </div>

      {/* Coins */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-xs text-text-muted font-heading">Cap. {chapter.id}</div>
        <div className="flex items-center gap-1.5 bg-dark-700 rounded-full px-3 py-1.5">
          <span className="text-sm">💰</span>
          <span className={`font-display text-sm font-bold ${coins >= 0 ? 'neon-text-yellow' : 'text-neon-pink'}`}>{coins}</span>
        </div>
      </div>

      {/* Character & Dialogue */}
      <div className="animate-slide-up" key={sceneId + (reaction ? '_r' : '')}>
        {/* Character */}
        <div className="text-center mb-6">
          <span className="text-6xl block mb-3">{char.emoji}</span>
          <p className={`font-heading text-lg font-bold ${char.colorClass}`}>{char.name}</p>
          {char.title && <p className="text-xs text-text-muted mt-1">{char.title}</p>}
        </div>

        {/* Dialogue */}
        <div className={`neon-card p-7 mb-6 rounded-2xl ${char.borderClass}`}>
          <p className="text-base text-text-secondary leading-relaxed">{scene.text}</p>
        </div>

        {/* Reaction (after choosing) */}
        {reaction && (
          <div className="neon-card p-7 mb-6 rounded-2xl border-neon-yellow/20 animate-slide-up">
            <p className="text-base text-text-secondary leading-relaxed">{reaction}</p>
          </div>
        )}

        {/* Choices or Advance button */}
        {!reaction && choices && choices.length > 0 && (
          <div className="space-y-4">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-5 rounded-2xl border bg-dark-700 border-dark-500 hover:border-neon-green/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <p className="font-heading text-base text-text-primary leading-snug">{choice.text}</p>
              </button>
            ))}
          </div>
        )}

        {!reaction && !choices && (
          <button
            onClick={() => handleAdvance(scene)}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-4 text-base rounded-2xl hover:bg-neon-cyan/20 transition-all"
          >
            Continuar →
          </button>
        )}

        {reaction && lastChoice && (
          <button
            onClick={() => advanceAfterReaction(lastChoice)}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-4 text-base rounded-2xl hover:bg-neon-cyan/20 transition-all animate-slide-up"
          >
            Continuar →
          </button>
        )}
      </div>
    </div>
  )
}
