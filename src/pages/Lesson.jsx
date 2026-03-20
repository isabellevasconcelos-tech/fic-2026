import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const feedback = useFeedback()
  const [lesson, setLesson] = useState(null)
  const [mod, setMod] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [xpGained, setXpGained] = useState(null)

  useEffect(() => {
    fetchLesson()
  }, [id, user])

  async function fetchLesson() {
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*, module:modules(*)')
      .eq('id', id)
      .single()

    if (!lessonData) return
    setLesson(lessonData)
    setMod(lessonData.module)

    const { count } = await supabase
      .from('quizzes')
      .select('id', { count: 'exact', head: true })
      .eq('lesson_id', id)
    setHasQuiz(count > 0)

    if (user) {
      const { data: prog } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', profile.id)
        .eq('lesson_id', id)
      setIsCompleted(prog && prog.length > 0)
    }
  }

  async function handleComplete() {
    if (isCompleted || completing) return
    setCompleting(true)

    if (user) {
      await supabase.from('user_progress').insert({
        user_id: profile.id,
        lesson_id: id
      })
      await supabase.rpc('add_xp', {
        p_user_id: profile.id,
        p_amount: lesson.xp_reward
      })
      await refreshProfile()
    }

    setXpGained(lesson.xp_reward)
    setIsCompleted(true)
    setCompleting(false)
    feedback?.trigger('xp', { amount: lesson.xp_reward, label: 'Aula concluida!' })
    feedback?.trigger('complete', { emoji: '📖', title: 'Aula Concluida!', subtitle: lesson.title })
    if (profile) feedback?.checkLevelUp(profile.level)
    setTimeout(() => setXpGained(null), 2000)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      {xpGained && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-xp-float">
          <div className="bg-neon-green/20 border border-neon-green/50 rounded-full px-6 py-2 font-display font-bold neon-text">
            +{xpGained} XP
          </div>
        </div>
      )}

      {mod && (
        <Link
          to={`/modules/${mod.slug}`}
          className="text-text-muted text-sm font-heading hover:text-text-secondary mb-4 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {mod.title}
        </Link>
      )}

      <div className="mb-6">
        <h1 className="page-title text-xl mb-2">{lesson.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span>{lesson.duration_minutes} min de leitura</span>
          <span>•</span>
          <span className="text-neon-green">{lesson.xp_reward} XP</span>
          {isCompleted && (
            <>
              <span>•</span>
              <span className="text-neon-green">✓ Concluída</span>
            </>
          )}
        </div>
      </div>

      <div className="lesson-content neon-card p-5 mb-6">
        <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="flex-1 bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all disabled:opacity-50"
            >
              {completing ? 'Marcando...' : `Concluir Aula (+${lesson.xp_reward} XP)`}
            </button>
          )}
          {hasQuiz && (
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className={`${isCompleted ? 'flex-1' : ''} bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 px-6 rounded-lg hover:bg-neon-cyan/20 transition-all`}
            >
              {isCompleted ? 'Fazer Quiz' : 'Quiz'}
            </button>
          )}
          {isCompleted && !hasQuiz && (
            <div className="flex-1 bg-dark-700 border border-neon-green/20 text-neon-green font-heading font-semibold py-3 rounded-lg text-center">
              ✓ Aula Concluída
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
