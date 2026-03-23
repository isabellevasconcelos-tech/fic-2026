import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const AVATAR_OPTIONS = ['🚀', '🧙', '🦊', '🐉', '👑', '⚔️', '🎮', '💎', '🔥', '🌟', '🦁', '🐺', '🦅', '🎯', '🏆', '🛡️']

function AvatarSelector({ value, onChange }) {
  return (
    <div>
      <label className="section-title block mb-3 text-center">Escolha seu Avatar</label>
      <div className="flex flex-wrap gap-2 justify-center">
        {AVATAR_OPTIONS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 ${
              value === emoji
                ? 'border-2 border-gold-accent scale-110 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'border border-dark-500 hover:border-gold-accent/40'
            }`}
            style={{
              background: value === emoji
                ? 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)'
                : '#2e1824',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

function AgeInput({ value, onChange }) {
  return (
    <div>
      <label className="section-title block mb-2">Idade</label>
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(e.target.value ? parseInt(e.target.value) : null)}
        placeholder="Sua idade"
        min={8}
        max={99}
        className="w-full px-4 py-3 rounded-xl bg-dark-700/60 border border-rose-light/15 text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
      />
    </div>
  )
}

export default function Profile() {
  const { user, profile, createProfile, updateProfile, signOut } = useAuth()
  const [stats, setStats] = useState({ lessons: 0, quizzes: 0 })
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', username: '', avatar_emoji: '🚀', age: null })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) fetchStats()
  }, [user])

  useEffect(() => {
    if (user && profile.id) {
      setForm({ full_name: profile.full_name, username: profile.username, avatar_emoji: profile.avatar_emoji, age: profile.age })
    }
  }, [user, profile])

  async function fetchStats() {
    const [lessonsRes, quizzesRes] = await Promise.all([
      supabase.from('user_progress').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('user_quiz_results').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
    ])
    setStats({
      lessons: lessonsRes.count || 0,
      quizzes: quizzesRes.count || 0,
    })
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.full_name.trim() || !form.username.trim()) {
      setError('Preencha nome e apelido.')
      return
    }
    if (!form.age || form.age < 8 || form.age > 99) {
      setError('Informe sua idade (8-99).')
      return
    }
    setSaving(true)
    setError('')
    try {
      await createProfile({
        full_name: form.full_name.trim(),
        username: form.username.trim().toLowerCase().replace(/\s+/g, '_'),
        avatar_emoji: form.avatar_emoji,
        age: form.age,
      })
    } catch (err) {
      setError(err.message || 'Erro ao criar perfil.')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!form.full_name.trim() || !form.username.trim()) {
      setError('Preencha nome e apelido.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateProfile({
        full_name: form.full_name.trim(),
        username: form.username.trim().toLowerCase().replace(/\s+/g, '_'),
        avatar_emoji: form.avatar_emoji,
        age: form.age,
      })
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil.')
    } finally {
      setSaving(false)
    }
  }

  // ── Guest: Create Profile Form ──
  if (!user) {
    return (
      <div className="pb-28 px-5 pt-6 animate-fade-in">
        <div className="card-primary p-6 mb-6">
          <h1 className="page-title text-center mb-2">Criar Perfil</h1>
          <p className="text-enchanted-muted text-sm text-center mb-6">
            Crie seu perfil para salvar seu progresso no Reino de Valoria.
          </p>

          <form onSubmit={handleCreate} className="space-y-5">
            <AvatarSelector value={form.avatar_emoji} onChange={v => setForm(f => ({ ...f, avatar_emoji: v }))} />

            <div>
              <label className="section-title block mb-2">Nome</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Seu nome"
                maxLength={40}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/60 border border-rose-light/15 text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="section-title block mb-2">Apelido</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="seu_apelido"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/60 border border-rose-light/15 text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
              />
            </div>

            <AgeInput value={form.age} onChange={v => setForm(f => ({ ...f, age: v }))} />

            {error && <p className="text-state-error text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm transition-all duration-300 active:scale-[0.97] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #A02035, #7B1D2A)',
                border: '1.5px solid rgba(212,175,55,0.4)',
                color: '#f5e6c8',
                boxShadow: '0 0 20px rgba(212,175,55,0.1), 0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {saving ? 'Criando...' : 'Criar Perfil'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Logged in: Edit Mode ──
  if (editing) {
    return (
      <div className="pb-28 px-5 pt-6 animate-fade-in">
        <div className="card-primary p-6 mb-6">
          <h1 className="page-title text-center mb-6">Editar Perfil</h1>

          <form onSubmit={handleUpdate} className="space-y-5">
            <AvatarSelector value={form.avatar_emoji} onChange={v => setForm(f => ({ ...f, avatar_emoji: v }))} />

            <div>
              <label className="section-title block mb-2">Nome</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Seu nome"
                maxLength={40}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/60 border border-rose-light/15 text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="section-title block mb-2">Apelido</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="seu_apelido"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/60 border border-rose-light/15 text-enchanted placeholder:text-enchanted-muted/40 font-body focus:outline-none focus:border-gold-accent/30 transition-colors"
              />
            </div>

            <AgeInput value={form.age} onChange={v => setForm(f => ({ ...f, age: v }))} />

            {error && <p className="text-state-error text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setEditing(false); setError('') }}
                className="flex-1 py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm border border-dark-500 text-enchanted-muted hover:border-gold-accent/30 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm transition-all duration-300 active:scale-[0.97] disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #A02035, #7B1D2A)',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                  color: '#f5e6c8',
                  boxShadow: '0 0 20px rgba(212,175,55,0.1), 0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ── Logged in: View Profile ──
  const xpInLevel = profile.xp % 500
  const xpProgress = (xpInLevel / 500) * 100

  return (
    <div className="pb-28 px-5 pt-6 animate-fade-in">
      <div className="card-primary p-6 text-center mb-8">
        <span className="text-5xl mb-3 block icon-pop inline-block">{profile.avatar_emoji}</span>
        <h1 className="page-title">{profile.full_name}</h1>
        <p className="page-subtitle text-sm mt-1">@{profile.username}</p>
        {profile.age && <p className="text-text-muted text-xs font-heading mt-1">{profile.age} anos</p>}

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

      <div className="space-y-3">
        <button
          onClick={() => setEditing(true)}
          className="w-full py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm transition-all duration-300 active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #A02035, #7B1D2A)',
            border: '1.5px solid rgba(212,175,55,0.4)',
            color: '#f5e6c8',
            boxShadow: '0 0 20px rgba(212,175,55,0.1), 0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Editar Perfil
        </button>
        <button
          onClick={signOut}
          className="w-full py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm border border-dark-500 text-enchanted-muted hover:border-state-error/40 hover:text-state-error transition-all duration-300 active:scale-[0.97]"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
