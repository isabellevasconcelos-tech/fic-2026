import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

// Desafios diários rotativos baseados no dia do ano
const ALL_CHALLENGES = [
  { text: 'Complete 1 aula hoje', icon: '📖', target: 'lesson', xp: 50 },
  { text: 'Acerte 100% em um quiz', icon: '🎯', target: 'quiz', xp: 80 },
  { text: 'Anote todos os seus gastos de hoje', icon: '📝', target: 'habit', xp: 30 },
  { text: 'Leia sobre reserva de emergência', icon: '🏦', target: 'lesson', xp: 50 },
  { text: 'Pesquise a taxa Selic atual', icon: '🔍', target: 'research', xp: 30 },
  { text: 'Calcule seus gastos fixos do mês', icon: '🧮', target: 'habit', xp: 40 },
  { text: 'Complete 2 aulas seguidas', icon: '⚡', target: 'lesson', xp: 100 },
  { text: 'Descubra seu Score de crédito', icon: '💳', target: 'research', xp: 30 },
  { text: 'Faça um quiz de investimentos', icon: '📈', target: 'quiz', xp: 60 },
  { text: 'Separe 20% da sua renda hoje', icon: '💰', target: 'habit', xp: 50 },
  { text: 'Revise a regra 50-30-20', icon: '📊', target: 'lesson', xp: 40 },
  { text: 'Cancele 1 assinatura que não usa', icon: '✂️', target: 'habit', xp: 60 },
]

function getDailyChallenges() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  const shuffled = [...ALL_CHALLENGES].sort((a, b) => {
    const ha = ((dayOfYear * 31 + ALL_CHALLENGES.indexOf(a) * 7) % 97)
    const hb = ((dayOfYear * 31 + ALL_CHALLENGES.indexOf(b) * 7) % 97)
    return ha - hb
  })
  return shuffled.slice(0, 3)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const TABS = [
  { id: 'inicio', label: 'Painel', icon: '◈' },
  { id: 'jogar', label: 'Arena', icon: '⚡' },
  { id: 'explorar', label: 'Scanner', icon: '◉' },
]

export default function Home() {
  const { user, profile } = useAuth()
  const [progress, setProgress] = useState({ completed: 0, total: 0 })
  const [modulesProgress, setModulesProgress] = useState([])
  const [quizStats, setQuizStats] = useState({ total: 0, perfect: 0 })
  const [tab, setTab] = useState('inicio')
  const dailyChallenges = useMemo(() => getDailyChallenges(), [])

  useEffect(() => {
    fetchData()
  }, [profile])

  async function fetchData() {
    const [modulesRes, lessonsRes, progressRes, quizRes] = await Promise.all([
      supabase.from('modules').select('*, lessons(id)').order('order_index'),
      supabase.from('lessons').select('id').eq('is_published', true),
      user ? supabase.from('user_progress').select('lesson_id').eq('user_id', profile.id) : { data: [] },
      user ? supabase.from('user_quiz_results').select('score, total_questions').eq('user_id', profile.id) : { data: [] },
    ])

    const completedSet = new Set((progressRes.data || []).map(p => p.lesson_id))

    setProgress({
      completed: completedSet.size,
      total: lessonsRes.data?.length || 0
    })

    setModulesProgress((modulesRes.data || []).map(mod => {
      const total = mod.lessons?.length || 0
      const done = mod.lessons?.filter(l => completedSet.has(l.id)).length || 0
      return { ...mod, done, total }
    }))

    const quizData = quizRes.data || []
    setQuizStats({
      total: quizData.length,
      perfect: quizData.filter(q => q.score === q.total_questions).length
    })
  }

  const estimatedSavings = useMemo(() => {
    return progress.completed * 85
  }, [progress.completed])

  const xpProgress = profile ? ((profile.xp % 500) / 500) * 100 : 0
  const pctComplete = progress.total ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="page-title">
            {profile?.full_name || profile?.username || 'Operador'}
          </h1>
          <p className="page-subtitle text-xs mt-1">Central de Controle Ativa</p>
        </div>
        <Link to="/profile" className="text-4xl icon-pop">
          {profile?.avatar_emoji || '🚀'}
        </Link>
      </div>

      {/* Acesso Rapido — sempre visivel */}
      <div className="grid grid-cols-3 gap-3 mb-20">
        <Link to="/modules" className="card-info p-4 flex flex-col items-center gap-2 text-center hover:border-neon-green/20 hover-lift">
          <div className="w-11 h-11 rounded-xl bg-neon-green/10 flex items-center justify-center icon-pop">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <p className="font-heading text-xs font-semibold text-text-primary">Continuar</p>
            <p className="text-[10px] text-text-muted">Proxima aula</p>
          </div>
        </Link>

        <Link to="/achievements" className="card-info p-4 flex flex-col items-center gap-2 text-center hover:border-neon-purple/20 hover-lift">
          <div className="w-11 h-11 rounded-xl bg-neon-purple/10 flex items-center justify-center icon-pop">
            <span className="text-xl">🎖️</span>
          </div>
          <div>
            <p className="font-heading text-xs font-semibold text-text-primary">Conquistas</p>
            <p className="text-[10px] text-text-muted">{quizStats.perfect} perfeitos</p>
          </div>
        </Link>

        <Link to="/profile" className="card-info p-4 flex flex-col items-center gap-2 text-center hover:border-neon-yellow/20 hover-lift">
          <div className="w-11 h-11 rounded-xl bg-neon-yellow/10 flex items-center justify-center icon-pop">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <p className="font-heading text-xs font-semibold text-text-primary">Perfil</p>
            <p className="text-[10px] text-text-muted">Seus dados</p>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-dark-800 rounded-xl p-1.5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-heading font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-dark-600 text-text-primary shadow-md'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <span className="text-sm">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ============================== */}
      {/* TAB: PAINEL                    */}
      {/* ============================== */}
      {tab === 'inicio' && (
        <div className="space-y-8 animate-fade-in">
          {/* Status do Sistema */}
          <div className="card-primary p-6">
            <h2 className="section-title mb-5">Status do Sistema</h2>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center">
                <p className="font-display text-2xl font-bold neon-text">{profile?.xp || 0}</p>
                <p className="text-text-muted text-[10px] font-heading mt-1">XP Total</p>
              </div>
              <div className="text-center border-x border-dark-500/50">
                <p className="font-display text-2xl font-bold neon-text-cyan">Nv.{profile?.level || 1}</p>
                <p className="text-text-muted text-[10px] font-heading mt-1">Nivel</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold neon-text-yellow">{profile?.streak_days || 0}🔥</p>
                <p className="text-text-muted text-[10px] font-heading mt-1">Sequencia</p>
              </div>
            </div>

            <hr className="divider-glow mb-5" />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Proximo nivel</span>
                  <span className="text-xs text-text-muted font-heading">{profile?.xp % 500 || 0}/500 XP</span>
                </div>
                <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500 progress-glow"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-text-muted font-heading">Aulas concluidas</span>
                  <span className="text-xs font-heading neon-text">{progress.completed}/{progress.total} ({pctComplete}%)</span>
                </div>
                <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transition-all duration-500 progress-glow"
                    style={{ width: `${pctComplete}%` }}
                  />
                </div>
              </div>
            </div>

            {modulesProgress.length > 0 && (<>
              <hr className="divider-subtle mt-5 mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {modulesProgress.map(mod => {
                  const pct = mod.total ? (mod.done / mod.total) * 100 : 0
                  return (
                    <Link key={mod.id} to={`/modules/${mod.slug}`} className="text-center group">
                      <div className="relative w-11 h-11 mx-auto mb-1.5">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-dark-600)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none"
                            stroke={mod.color}
                            strokeWidth="3"
                            strokeDasharray={`${pct * 0.88} 88`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm">{mod.icon}</span>
                      </div>
                      <p className="text-[10px] text-text-muted font-heading truncate group-hover:text-text-secondary transition-colors">{mod.done}/{mod.total}</p>
                    </Link>
                  )
                })}
              </div>
            </>)}
          </div>

          {/* Grana em Dia */}
          <div className="card-primary p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-neon-green/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💸</span>
              <h2 className="section-title">Grana em Dia</h2>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className="font-display text-3xl font-bold neon-text">
                R${estimatedSavings.toLocaleString('pt-BR')}
              </span>
              <span className="text-text-muted text-xs mb-1 font-heading">estimado</span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Baseado no conhecimento adquirido em {progress.completed} {progress.completed === 1 ? 'aula' : 'aulas'} —
              cada aula te ajuda a evitar gastos desnecessarios e tomar melhores decisoes financeiras.
            </p>

            <hr className="divider-subtle mb-4" />

            <div className="grid grid-cols-3 gap-3">
              <div className="card-info p-3 text-center">
                <p className="text-neon-green text-xs font-display font-bold">R${Math.round(estimatedSavings * 0.45).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-text-muted mt-1">Gastos evitados</p>
              </div>
              <div className="card-info p-3 text-center">
                <p className="text-neon-cyan text-xs font-display font-bold">R${Math.round(estimatedSavings * 0.30).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-text-muted mt-1">Juros evitados</p>
              </div>
              <div className="card-info p-3 text-center">
                <p className="text-neon-yellow text-xs font-display font-bold">R${Math.round(estimatedSavings * 0.25).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-text-muted mt-1">Rendimentos</p>
              </div>
            </div>
          </div>

          {/* Missoes Diarias */}
          <div className="card-secondary p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h2 className="section-title">Missoes Diarias</h2>
              </div>
              <span className="text-[10px] text-text-muted font-heading bg-dark-800 px-2.5 py-1 rounded-full">
                Renova em {24 - new Date().getHours()}h
              </span>
            </div>

            <div className="space-y-3">
              {dailyChallenges.map((challenge, i) => (
                <div key={i} className="flex items-center gap-3 card-info p-3.5">
                  <span className="text-xl shrink-0">{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading text-text-primary">{challenge.text}</p>
                    <p className="text-[11px] text-neon-green font-heading mt-0.5">+{challenge.xp} XP</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-dark-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================== */}
      {/* TAB: ARENA                     */}
      {/* ============================== */}
      {tab === 'jogar' && (
        <div className="space-y-8 animate-fade-in">
          {/* Modo Campanha */}
          <Link to="/story" className="card-primary p-6 relative overflow-hidden block group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-neon-cyan/5 blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-neon-yellow/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⚔️</span>
              <h2 className="section-title">Modo Campanha</h2>
              <span className="text-[10px] text-neon-yellow font-heading bg-gradient-to-r from-neon-yellow/20 via-neon-yellow/5 to-neon-yellow/20 bg-[length:200%_100%] px-2.5 py-0.5 rounded-full ml-auto tag-shimmer">DIFERENCIAL</span>
            </div>

            <h3 className="font-display text-lg font-bold neon-text-cyan mb-2">O Reino de Valoria</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Uma aventura RPG onde suas decisoes financeiras mudam a historia. Conheca personagens, desbloqueie capitulos!
            </p>

            <div className="flex items-center gap-3 text-xs font-heading mb-4">
              <span className="text-neon-cyan">🧙 Mentor</span>
              <span className="text-neon-purple">🧝‍♀️ Comerciante</span>
              <span className="text-neon-yellow">👑 Rei</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-green group-hover:text-neon-cyan transition-colors">
              <span>Iniciar aventura</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Modo Combate */}
          <Link to="/quiz-battle" className="card-secondary p-6 relative overflow-hidden block group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-neon-green/5 blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-neon-cyan/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧠</span>
              <h2 className="section-title">Modo Combate</h2>
              <span className="text-[10px] text-neon-green font-heading bg-gradient-to-r from-neon-green/20 via-neon-green/5 to-neon-green/20 bg-[length:200%_100%] px-2.5 py-0.5 rounded-full ml-auto tag-shimmer">BATTLE</span>
            </div>

            <h3 className="font-display text-lg font-bold neon-text mb-2">Quiz Battle</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Responda contra o relogio, acumule streaks e bata seu recorde. Nada de quiz chato!
            </p>

            <div className="flex items-center gap-3 text-xs font-heading mb-4">
              <span className="text-text-muted">⏳ 15s</span>
              <span className="text-text-muted">🔥 Streaks</span>
              <span className="text-text-muted">🏆 Recorde</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-green group-hover:text-neon-cyan transition-colors">
              <span>Desafiar agora</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Simulacao */}
          <Link to="/simulator" className="card-secondary p-6 relative overflow-hidden block group">
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-neon-purple/5 blur-2xl" />
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-neon-cyan/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎮</span>
              <h2 className="section-title">Simulacao</h2>
              <span className="text-[10px] text-neon-purple font-heading bg-gradient-to-r from-neon-purple/20 via-neon-purple/5 to-neon-purple/20 bg-[length:200%_100%] px-2.5 py-0.5 rounded-full ml-auto tag-shimmer">NOVO</span>
            </div>

            <h3 className="font-display text-lg font-bold neon-text-purple mb-2">Simulador de Vida Real</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Receba um salario, tome decisoes e veja as consequencias. Aprenda na pratica!
            </p>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-cyan group-hover:text-neon-green transition-colors">
              <span>Jogar agora</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Analise Neural */}
          <Link to="/personality" className="card-primary p-6 relative overflow-hidden block group">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-neon-yellow/5 blur-2xl" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-neon-green/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧬</span>
              <h2 className="section-title">Analise Neural</h2>
              <span className="text-[10px] text-neon-yellow font-heading bg-gradient-to-r from-neon-yellow/20 via-neon-yellow/5 to-neon-yellow/20 bg-[length:200%_100%] px-2.5 py-0.5 rounded-full ml-auto tag-shimmer">NOVO</span>
            </div>

            <h3 className="font-display text-lg font-bold neon-text-yellow mb-2">Personalidade Financeira</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Descubra se voce e impulsivo, planejador, conservador ou equilibrado — com dicas feitas pra voce.
            </p>

            <div className="flex items-center gap-3 text-xs font-heading mb-4">
              <span className="text-neon-pink">⚡ Impulsivo</span>
              <span className="text-neon-green">📋 Planejador</span>
              <span className="text-neon-cyan">🛡️ Conservador</span>
              <span className="text-neon-yellow">⚖️ Equilibrado</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-yellow group-hover:text-neon-green transition-colors">
              <span>Fazer o teste</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      {/* ============================== */}
      {/* TAB: SCANNER                   */}
      {/* ============================== */}
      {tab === 'explorar' && (
        <div className="space-y-8 animate-fade-in">
          {/* Alerta Vermelho */}
          <Link to="/reality-check" className="card-primary p-6 relative overflow-hidden block group">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-neon-pink/5 blur-2xl" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-neon-purple/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💀</span>
              <h2 className="section-title">Alerta Vermelho</h2>
              <span className="text-[10px] text-neon-pink font-heading bg-gradient-to-r from-neon-pink/20 via-neon-pink/5 to-neon-pink/20 bg-[length:200%_100%] px-2.5 py-0.5 rounded-full ml-auto tag-shimmer">CHOQUE</span>
            </div>

            <h3 className="font-display text-lg font-bold neon-text-pink mb-2">Choque de Realidade</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              R$10/dia em besteira = R$3.650/ano. Veja o estrago dos seus habitos com graficos animados.
            </p>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-pink group-hover:text-neon-purple transition-colors">
              <span>Ver o impacto</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Casos Reais */}
          <Link to="/before-after" className="card-secondary p-6 relative overflow-hidden block group">
            <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-neon-green/5 blur-2xl" />

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔄</span>
              <h2 className="section-title">Casos Reais</h2>
            </div>

            <h3 className="font-display text-lg font-bold neon-text mb-2">Antes vs Depois</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Veja historias reais de quem mudou seus habitos financeiros. De zerado a guardando dinheiro.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-neon-pink font-heading bg-neon-pink/10 px-2.5 py-1 rounded-full">😰 Antes</span>
              <span className="text-xs text-text-muted">→</span>
              <span className="text-xs text-neon-green font-heading bg-neon-green/10 px-2.5 py-1 rounded-full">😎 Depois</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading text-neon-green group-hover:text-neon-cyan transition-colors">
              <span>Ver historias</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Base de Dados */}
          <Link to="/modules" className="card-secondary p-6 block group">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📚</span>
              <h2 className="section-title">Base de Dados</h2>
            </div>

            <h3 className="font-display text-lg font-bold neon-text-cyan mb-2">Trilhas de Estudo</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Aulas organizadas por tema — orcamento, investimentos, credito e mais. Cada aula da XP!
            </p>

            {modulesProgress.length > 0 && (
              <div className="flex gap-2 mb-4">
                {modulesProgress.slice(0, 4).map(mod => (
                  <div key={mod.id} className="flex items-center gap-1.5 card-info px-2.5 py-1.5 rounded-lg">
                    <span className="text-sm">{mod.icon}</span>
                    <span className="text-[10px] text-text-muted font-heading">{mod.done}/{mod.total}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-heading text-neon-cyan group-hover:text-neon-green transition-colors">
              <span>Ver trilhas</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Conquistas */}
          <Link to="/achievements" className="card-secondary p-6 flex items-center gap-4 hover-lift block group">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">🎖️</span>
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-text-primary">Conquistas</p>
              <p className="text-[11px] text-text-muted">{quizStats.perfect} quizzes perfeitos</p>
            </div>
            <svg className="w-4 h-4 text-text-muted group-hover:text-neon-purple group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
