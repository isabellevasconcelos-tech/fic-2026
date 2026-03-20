import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Achievements() {
  const { user, profile } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [earnedIds, setEarnedIds] = useState(new Set())

  useEffect(() => {
    fetchAchievements()
  }, [profile])

  async function fetchAchievements() {
    const { data: all } = await supabase
      .from('achievements')
      .select('*')
      .order('category')

    setAchievements(all || [])

    if (user) {
      const { data: earned } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', profile.id)
      setEarnedIds(new Set((earned || []).map(e => e.achievement_id)))
    }
  }

  const categories = {
    learning: { label: 'Aprendizado', icon: '📚' },
    quiz: { label: 'Quizzes', icon: '🧠' },
    general: { label: 'Geral', icon: '⭐' },
    streak: { label: 'Sequência', icon: '🔥' },
  }

  const grouped = {}
  for (const a of achievements) {
    if (!grouped[a.category]) grouped[a.category] = []
    grouped[a.category].push(a)
  }

  const totalEarned = earnedIds.size
  const total = achievements.length

  return (
    <div className="pb-24 px-4 pt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h1 className="page-title">Conquistas</h1>
        <span className="text-sm font-heading text-text-muted">{totalEarned}/{total}</span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-neon-yellow to-neon-green rounded-full transition-all"
          style={{ width: total ? `${(totalEarned / total) * 100}%` : '0%' }}
        />
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <h2 className="font-heading text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span>{categories[cat]?.icon || '🏆'}</span>
            {categories[cat]?.label || cat}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map(achievement => {
              const isEarned = earnedIds.has(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`card-info p-4 text-center transition-all ${
                    isEarned
                      ? 'border-state-success/30 bg-state-success/[0.03]'
                      : 'opacity-50 grayscale'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {achievement.is_secret && !isEarned ? '❓' : achievement.icon}
                  </span>
                  <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
                    {achievement.is_secret && !isEarned ? '???' : achievement.title}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {achievement.is_secret && !isEarned
                      ? 'Conquista secreta'
                      : achievement.description}
                  </p>
                  <p className="text-xs font-heading mt-2 text-neon-yellow">+{achievement.xp_bonus} XP</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {achievements.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <span className="text-4xl block mb-3">🏆</span>
          <p className="font-heading">Carregando conquistas...</p>
        </div>
      )}
    </div>
  )
}
