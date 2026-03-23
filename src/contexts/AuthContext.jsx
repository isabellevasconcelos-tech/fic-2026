import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

const DEFAULT_PROFILE = {
  id: null,
  username: 'explorador',
  full_name: 'Explorador',
  avatar_emoji: '🚀',
  age: null,
  xp: 0,
  level: 1,
  streak_days: 0,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(DEFAULT_PROFILE)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data || DEFAULT_PROFILE)
    setLoading(false)
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  async function createProfile({ username, full_name, avatar_emoji, age }) {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
    if (authError) throw authError

    const userId = authData.user.id

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username,
        full_name,
        avatar_emoji,
        age,
        xp: 0,
        level: 1,
        streak_days: 0,
      })

    if (profileError) throw profileError
    await fetchProfile(userId)
  }

  async function updateProfile({ username, full_name, avatar_emoji, age }) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ username, full_name, avatar_emoji, age, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) throw error
    await fetchProfile(user.id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(DEFAULT_PROFILE)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, createProfile, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
