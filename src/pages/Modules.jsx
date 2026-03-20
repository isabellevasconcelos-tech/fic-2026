import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Modules() {
  const { slug } = useParams()

  if (slug) return <ModuleDetail slug={slug} />
  return <ModuleList />
}

function ModuleList() {
  const [modules, setModules] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchModules()
  }, [profile])

  async function fetchModules() {
    const { data: mods } = await supabase
      .from('modules')
      .select('*, lessons(id)')
      .order('order_index')

    setModules(mods || [])

    if (user) {
      const { data: prog } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', profile.id)
      const completed = new Set((prog || []).map(p => p.lesson_id))
      const map = {}
      for (const mod of (mods || [])) {
        const total = mod.lessons?.length || 0
        const done = mod.lessons?.filter(l => completed.has(l.id)).length || 0
        map[mod.id] = { done, total }
      }
      setProgressMap(map)
    }
  }

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      <h1 className="page-title mb-12">Trilhas</h1>
      <div className="space-y-6">
        {modules.map(mod => {
          const prog = progressMap[mod.id] || { done: 0, total: 0 }
          const pct = prog.total ? (prog.done / prog.total) * 100 : 0
          return (
            <Link key={mod.id} to={`/modules/${mod.slug}`} className="card-secondary p-5 block">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{mod.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-semibold text-text-primary">{mod.title}</h2>
                  <p className="text-sm text-text-muted">{mod.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: mod.color }}
                  />
                </div>
                <span className="text-xs font-heading text-text-muted whitespace-nowrap">{prog.done}/{prog.total}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ModuleDetail({ slug }) {
  const [mod, setMod] = useState(null)
  const [lessons, setLessons] = useState([])
  const [completedIds, setCompletedIds] = useState(new Set())
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchModule()
  }, [slug, user])

  async function fetchModule() {
    const { data: modData } = await supabase
      .from('modules')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!modData) return
    setMod(modData)

    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', modData.id)
      .order('order_index')

    setLessons(lessonData || [])

    if (user) {
      const { data: prog } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', profile.id)
      setCompletedIds(new Set((prog || []).map(p => p.lesson_id)))
    }
  }

  if (!mod) {
    return (
      <div className="pb-20 px-4 pt-6">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full mx-auto" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      <Link to="/modules" className="text-text-muted text-sm font-heading hover:text-text-secondary mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{mod.icon}</span>
        <div>
          <h1 className="font-heading text-xl font-bold text-text-primary">{mod.title}</h1>
          <p className="text-sm text-text-muted">{lessons.length} aulas • {mod.total_xp} XP total</p>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const isCompleted = completedIds.has(lesson.id)
          return (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.id}`}
              className="card-info p-4 flex items-center gap-4 block"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                  isCompleted
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/40'
                    : 'bg-dark-600 text-text-muted border border-dark-500'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-text-primary text-sm">{lesson.title}</h3>
                <p className="text-xs text-text-muted flex items-center gap-2">
                  <span>{lesson.duration_minutes} min</span>
                  <span>•</span>
                  <span>{lesson.xp_reward} XP</span>
                </p>
              </div>
              {isCompleted && <span className="text-neon-green text-xs font-heading">Concluída</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
