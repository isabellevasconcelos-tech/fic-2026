import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Leaderboard() {
  const { user, profile } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [myRank, setMyRank] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [profile])

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(50)

    setLeaders(data || [])

    if (user && data) {
      const me = data.find(l => l.id === profile.id)
      if (me) setMyRank(me)
    }
  }

  const podiumColors = ['neon-yellow', 'neon-green', 'neon-cyan']
  const podiumIcons = ['🥇', '🥈', '🥉']

  return (
    <div className="pb-20 px-4 pt-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold neon-text mb-6">Ranking</h1>

      {/* My Position */}
      {myRank && (
        <div className="card-primary p-4 mb-6">
          <p className="text-xs text-text-muted font-heading mb-2">Sua posição</p>
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-bold neon-text">#{myRank.rank}</span>
            <span className="text-2xl">{myRank.avatar_emoji}</span>
            <div className="flex-1">
              <p className="font-heading font-semibold text-text-primary">{myRank.username}</p>
              <p className="text-xs text-text-muted">Nível {myRank.level} • {myRank.lessons_completed} aulas</p>
            </div>
            <span className="font-display font-bold neon-text">{myRank.xp} XP</span>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaders.map((leader, i) => {
          const isMe = profile && leader.id === profile.id
          const isPodium = i < 3
          return (
            <div
              key={leader.id}
              className={`card-info p-3 flex items-center gap-3 ${
                isMe ? 'border-neon-green/30 bg-neon-green/[0.03]' : ''
              }`}
            >
              <div className="w-8 text-center">
                {isPodium ? (
                  <span className="text-xl">{podiumIcons[i]}</span>
                ) : (
                  <span className="font-display text-sm font-bold text-text-muted">#{leader.rank}</span>
                )}
              </div>
              <span className="text-xl">{leader.avatar_emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-heading font-semibold text-sm truncate ${isMe ? 'text-neon-green' : 'text-text-primary'}`}>
                  {leader.username}
                </p>
                <p className="text-xs text-text-muted">
                  Nv.{leader.level} • {leader.streak_days}🔥
                </p>
              </div>
              <span className={`font-display text-sm font-bold ${isPodium ? `neon-text-${podiumColors[i]}` : 'text-text-secondary'}`}>
                {leader.xp}
              </span>
            </div>
          )
        })}

        {leaders.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <span className="text-4xl block mb-3">🏆</span>
            <p className="font-heading">Nenhum jogador ainda</p>
            <p className="text-sm">Seja o primeiro a completar uma aula!</p>
          </div>
        )}
      </div>
    </div>
  )
}
