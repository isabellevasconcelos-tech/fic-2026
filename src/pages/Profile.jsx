import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ lessons: 0, quizzes: 0, achievements: 0 })

  useEffect(() => {
    if (user) fetchStats()
  }, [user])

  async function fetchStats() {
    const [lessonsRes, quizzesRes, achievementsRes] = await Promise.all([
      supabase.from('user_progress').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('user_quiz_results').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
    ])
    setStats({
      lessons: lessonsRes.count || 0,
      quizzes: quizzesRes.count || 0,
      achievements: achievementsRes.count || 0,
    })
  }

  const xpInLevel = profile.xp % 500
  const xpProgress = (xpInLevel / 500) * 100

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      {/* Profile Header */}
      <div className="card-primary p-6 text-center mb-8">
        <span className="text-5xl mb-3 block icon-pop inline-block">{profile.avatar_emoji}</span>
        <h1 className="page-title">{profile.full_name}</h1>
        <p className="page-subtitle text-sm mt-1">@{profile.username}</p>

        <hr className="divider-glow my-4" />

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-heading text-text-secondary">Nível {profile.level}</span>
            <span className="text-xs text-text-muted">{xpInLevel}/{500} XP</span>
          </div>
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all progress-glow"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card-info p-4 text-center hover-lift">
          <p className="font-display text-2xl font-bold neon-text">{profile.xp}</p>
          <p className="text-text-muted text-xs font-heading mt-1">XP Total</p>
        </div>
        <div className="card-info p-4 text-center hover-lift">
          <p className="font-display text-2xl font-bold neon-text-yellow">{profile.streak_days}🔥</p>
          <p className="text-text-muted text-xs font-heading mt-1">Dias Seguidos</p>
        </div>
        <div className="card-info p-4 text-center hover-lift">
          <p className="font-display text-2xl font-bold neon-text-cyan">{stats.lessons}</p>
          <p className="text-text-muted text-xs font-heading mt-1">Aulas Feitas</p>
        </div>
        <div className="card-info p-4 text-center hover-lift">
          <p className="font-display text-2xl font-bold neon-text-purple">{stats.quizzes}</p>
          <p className="text-text-muted text-xs font-heading mt-1">Quizzes Feitos</p>
        </div>
      </div>

      {/* Achievements */}
      <Link to="/achievements" className="card-secondary p-5 flex items-center justify-between mb-8 block hover-lift">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-heading font-semibold text-text-primary">Conquistas</p>
            <p className="text-xs text-text-muted">{stats.achievements} desbloqueadas</p>
          </div>
        </div>
        <span className="text-neon-cyan text-sm font-heading">Ver todas</span>
      </Link>
    </div>
  )
}
