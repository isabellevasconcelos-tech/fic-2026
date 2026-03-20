import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { supabase } from '../lib/supabase'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const feedback = useFeedback()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    fetchQuiz()
  }, [lessonId])

  async function fetchQuiz() {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')
    setQuestions(data || [])
  }

  function handleSelect(index) {
    if (answered) return
    setSelected(index)
  }

  function handleConfirm() {
    if (selected === null || answered) return
    const q = questions[current]
    const isCorrect = selected === q.correct_index
    setAnswered(true)
    setAnswers(prev => [...prev, { questionId: q.id, selected, isCorrect }])
    if (isCorrect) {
      feedback?.trigger('correct', { points: q.xp_reward })
    } else {
      feedback?.trigger('wrong')
    }
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      finishQuiz()
    }
  }

  async function finishQuiz() {
    const score = answers.filter(a => a.isCorrect).length
    const total = questions.length
    const xp = answers.reduce((acc, a, i) => acc + (a.isCorrect ? questions[i].xp_reward : 0), 0)
    setXpEarned(xp)
    setFinished(true)

    if (user) {
      await supabase.from('user_quiz_results').insert({
        user_id: profile.id,
        lesson_id: lessonId,
        score,
        total_questions: total,
        xp_earned: xp,
        answers: answers.map((a, i) => ({
          question_id: questions[i].id,
          selected: a.selected,
          correct: a.isCorrect
        }))
      })

      if (xp > 0) {
        await supabase.rpc('add_xp', { p_user_id: profile.id, p_amount: xp })
        await refreshProfile()
      }
    }
    if (xp > 0) feedback?.trigger('xp', { amount: xp, label: 'Quiz concluido!' })
    const isPerfect = answers.filter(a => a.isCorrect).length === questions.length
    feedback?.trigger('complete', { emoji: isPerfect ? '🌟' : '🎉', title: isPerfect ? 'Perfeito!' : 'Quiz Completo!', subtitle: `${xp} XP` })
    if (profile) feedback?.checkLevelUp(profile.level)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (finished) {
    const score = answers.filter(a => a.isCorrect).length
    const total = questions.length
    const pct = Math.round((score / total) * 100)
    const isPerfect = pct === 100

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
        <div className="w-full max-w-sm animate-fade-in text-center">
          <div className="neon-card p-8">
            <div className="text-6xl mb-4">{isPerfect ? '🌟' : pct >= 70 ? '🎉' : '📚'}</div>
            <h1 className="page-title text-2xl mb-2">
              {isPerfect ? 'Perfeito!' : pct >= 70 ? 'Muito Bem!' : 'Continue Praticando!'}
            </h1>
            <p className="text-text-secondary mb-4">
              Você acertou <span className="neon-text font-bold">{score}</span> de <span className="font-bold">{total}</span> perguntas
            </p>

            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-dark-600)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={isPerfect ? 'var(--color-neon-green)' : 'var(--color-neon-cyan)'}
                  strokeWidth="3"
                  strokeDasharray={`${pct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl font-bold neon-text">{pct}%</span>
              </div>
            </div>

            {xpEarned > 0 && (
              <p className="text-neon-green font-heading font-semibold mb-6">+{xpEarned} XP ganhos!</p>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/lesson/${lessonId}`)}
                className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-2.5 rounded-lg hover:bg-neon-cyan/20 transition-all"
              >
                Voltar à Aula
              </button>
              <button
                onClick={() => navigate('/modules')}
                className="w-full bg-dark-700 border border-dark-500 text-text-secondary font-heading font-semibold py-2.5 rounded-lg hover:border-dark-400 transition-all"
              >
                Ver Trilhas
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options

  return (
    <div className="min-h-screen px-4 pt-6 pb-8 bg-dark-900">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/lesson/${lessonId}`)} className="text-text-muted hover:text-text-secondary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted font-heading">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="animate-slide-up">
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-6">{q.question}</h2>

        <div className="space-y-3 mb-6">
          {options.map((opt, i) => {
            let style = 'bg-dark-700 border-dark-500 text-text-primary hover:border-state-success/30'
            if (answered) {
              if (i === q.correct_index) style = 'bg-state-success/10 border-state-success/50 text-state-success'
              else if (i === selected && i !== q.correct_index) style = 'bg-state-error/10 border-state-error/50 text-state-error'
              else style = 'bg-dark-700 border-dark-500 text-text-muted opacity-50'
            } else if (i === selected) {
              style = 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan'
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${style}`}
              >
                <span className="font-heading text-sm">{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="neon-card p-4 mb-6 animate-slide-up">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-neon-yellow">Explicação: </span>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {!answered ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-heading font-semibold py-3 rounded-lg hover:bg-neon-green/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-heading font-semibold py-3 rounded-lg hover:bg-neon-cyan/20 transition-all"
          >
            {current < questions.length - 1 ? 'Próxima' : 'Ver Resultado'}
          </button>
        )}
      </div>
    </div>
  )
}
