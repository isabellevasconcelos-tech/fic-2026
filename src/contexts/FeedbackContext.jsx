import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const FeedbackContext = createContext(null)
export const useFeedback = () => useContext(FeedbackContext)

// ========================
// SOUND ENGINE (Web Audio API — zero arquivos externos)
// ========================
class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (this.ctx) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {}
  }

  play(type) {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') this.ctx.resume()
    try {
      const now = this.ctx.currentTime
      switch (type) {
        case 'tap': this._beep(800, 0.06, 'sine', 0.15); break
        case 'success': this._beep(523, 0.1, 'sine', 0.2); this._beep(659, 0.1, 'sine', 0.2, 0.1); this._beep(784, 0.15, 'sine', 0.2, 0.2); break
        case 'error': this._beep(400, 0.12, 'square', 0.12); this._beep(300, 0.2, 'square', 0.12, 0.12); break
        case 'xp': this._beep(600, 0.08, 'sine', 0.18); this._beep(800, 0.08, 'sine', 0.18, 0.08); this._beep(1000, 0.12, 'sine', 0.18, 0.16); break
        case 'levelup': this._chord([523, 659, 784], 0.4, 0.2); this._chord([587, 740, 880], 0.5, 0.2, 0.35); break
        case 'coins': this._beep(1200, 0.04, 'sine', 0.12); this._beep(1500, 0.04, 'sine', 0.12, 0.06); this._beep(1800, 0.06, 'sine', 0.12, 0.12); break
        case 'streak': this._beep(500, 0.06, 'sine', 0.15); this._beep(700, 0.06, 'sine', 0.15, 0.06); this._beep(900, 0.06, 'sine', 0.15, 0.12); this._beep(1100, 0.1, 'sine', 0.15, 0.18); break
        case 'complete': this._chord([523, 659, 784, 1047], 0.6, 0.25); break
        case 'reveal': this._beep(400, 0.15, 'triangle', 0.1); this._beep(600, 0.2, 'triangle', 0.15, 0.15); break
      }
    } catch {}
  }

  _beep(freq, duration, type = 'sine', volume = 0.2, delay = 0) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, this.ctx.currentTime + delay)
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + delay + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(this.ctx.currentTime + delay)
    osc.stop(this.ctx.currentTime + delay + duration + 0.05)
  }

  _chord(freqs, duration, volume = 0.15, delay = 0) {
    for (const f of freqs) this._beep(f, duration, 'sine', volume / freqs.length, delay)
  }
}

const soundEngine = new SoundEngine()

// ========================
// SPARKLE PARTICLES
// ========================
function Sparkles({ count = 12, color = '#4ADE80', originX = 50, originY = 50 }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + Math.random() * 30
    const distance = 40 + Math.random() * 60
    const size = 3 + Math.random() * 5
    const duration = 0.5 + Math.random() * 0.5
    const delay = Math.random() * 0.2
    return { angle, distance, size, duration, delay, id: i }
  })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${originX}%`,
            top: `${originY}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            animation: `sparkle-fly ${p.duration}s ease-out ${p.delay}s forwards`,
            '--spark-x': `${Math.cos(p.angle * Math.PI / 180) * p.distance}px`,
            '--spark-y': `${Math.sin(p.angle * Math.PI / 180) * p.distance}px`,
          }}
        />
      ))}
    </div>
  )
}

// ========================
// CONFETTI
// ========================
function Confetti({ count = 30 }) {
  const colors = ['#4ADE80', '#22D3EE', '#FACC15', '#A855F7', '#F87171']
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: 10 + Math.random() * 80,
    delay: Math.random() * 0.8,
    duration: 1 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 6,
    drift: -30 + Math.random() * 60,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            '--conf-drift': `${p.drift}px`,
            '--conf-rot': `${p.rotation}deg`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

// ========================
// TOAST NOTIFICATION
// ========================
function FeedbackToast({ item, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, item.duration || 2500)
    return () => clearTimeout(t)
  }, [])

  const configs = {
    xp: { bg: 'bg-state-success/15 border-state-success/40', textColor: 'state-success', glow: 'shadow-state-success/20' },
    levelup: { bg: 'bg-neon-yellow/15 border-neon-yellow/40', textColor: 'neon-text-yellow', glow: 'shadow-neon-yellow/20' },
    streak: { bg: 'bg-state-alert/15 border-state-alert/40', textColor: 'state-alert', glow: 'shadow-state-alert/20' },
    achievement: { bg: 'bg-neon-purple/15 border-neon-purple/40', textColor: 'neon-text-purple', glow: 'shadow-neon-purple/20' },
    coins: { bg: 'bg-neon-yellow/15 border-neon-yellow/40', textColor: 'neon-text-yellow', glow: 'shadow-neon-yellow/20' },
    complete: { bg: 'bg-neon-cyan/15 border-neon-cyan/40', textColor: 'neon-text-cyan', glow: 'shadow-neon-cyan/20' },
    success: { bg: 'bg-state-success/15 border-state-success/40', textColor: 'state-success', glow: 'shadow-state-success/20' },
    error: { bg: 'bg-state-error/15 border-state-error/40', textColor: 'state-error', glow: 'shadow-state-error/20' },
  }
  const cfg = configs[item.type] || configs.success

  return (
    <div className={`relative border rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm animate-toast-in ${cfg.bg} ${cfg.glow}`}>
      {item.sparkle && <Sparkles color={item.sparkleColor || '#00FF88'} count={item.sparkleCount || 10} />}
      <div className="flex items-center gap-3 relative z-10">
        <span className="text-2xl shrink-0">{item.emoji}</span>
        <div>
          {item.title && <p className={`font-display text-sm font-bold ${cfg.textColor}`}>{item.title}</p>}
          {item.subtitle && <p className="text-xs text-text-muted font-heading">{item.subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

// ========================
// LEVEL UP OVERLAY
// ========================
function LevelUpOverlay({ level, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-dark-900/80 backdrop-blur-sm animate-fade-in">
      <Confetti count={40} />
      <div className="text-center animate-slide-up relative">
        <Sparkles count={20} color="#FFD600" originX={50} originY={40} />
        <span className="text-7xl block mb-4">⭐</span>
        <h2 className="font-display text-3xl font-bold neon-text-yellow mb-2 animate-neon-flicker">LEVEL UP!</h2>
        <p className="font-display text-5xl font-bold text-text-primary mb-2">{level}</p>
        <p className="text-text-muted font-heading text-sm">Continue evoluindo!</p>
      </div>
    </div>
  )
}

// ========================
// SCREEN FLASH
// ========================
function ScreenFlash({ color = 'neon-green' }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[90] bg-${color}/10 animate-screen-flash`}
    />
  )
}

// ========================
// FLOATING TEXT
// ========================
function FloatingText({ text, color = 'neon-text', x = 50, y = 50 }) {
  return (
    <div
      className="fixed pointer-events-none z-[95] animate-float-up"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translateX(-50%)' }}
    >
      <span className={`font-display text-2xl font-bold ${color}`} style={{ textShadow: '0 0 20px currentColor' }}>
        {text}
      </span>
    </div>
  )
}

// ========================
// PROVIDER
// ========================
export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [levelUp, setLevelUp] = useState(null)
  const [flash, setFlash] = useState(null)
  const [floats, setFloats] = useState([])
  const [confetti, setConfetti] = useState(false)
  const idRef = useRef(0)
  const prevLevelRef = useRef(null)

  // Init sound on first interaction
  useEffect(() => {
    const initSound = () => {
      soundEngine.init()
      document.removeEventListener('click', initSound)
      document.removeEventListener('touchstart', initSound)
    }
    document.addEventListener('click', initSound)
    document.addEventListener('touchstart', initSound)
    return () => {
      document.removeEventListener('click', initSound)
      document.removeEventListener('touchstart', initSound)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const removeFloat = useCallback((id) => {
    setFloats(prev => prev.filter(f => f.id !== id))
  }, [])

  const trigger = useCallback((type, data = {}) => {
    const id = ++idRef.current

    switch (type) {
      case 'xp': {
        soundEngine.play('xp')
        setToasts(prev => [...prev, {
          id, type: 'xp',
          emoji: '✨',
          title: `+${data.amount} XP`,
          subtitle: data.label || 'Experiencia ganha!',
          sparkle: true, sparkleColor: '#4ADE80', sparkleCount: 8,
          duration: 2000,
        }])
        setFlash({ color: 'state-success', id })
        setTimeout(() => setFlash(null), 500)
        setFloats(prev => [...prev, { id, text: `+${data.amount} XP`, color: 'state-success', x: data.x || 50, y: data.y || 40 }])
        setTimeout(() => removeFloat(id), 1500)
        break
      }

      case 'levelup': {
        soundEngine.play('levelup')
        setLevelUp(data.level)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 4000)
        break
      }

      case 'streak': {
        soundEngine.play('streak')
        setToasts(prev => [...prev, {
          id, type: 'streak',
          emoji: '🔥',
          title: `${data.count}x Streak!`,
          subtitle: `Multiplicador ${Math.min(data.count, 5)}x ativo`,
          sparkle: true, sparkleColor: '#FACC15', sparkleCount: 6,
          duration: 1800,
        }])
        break
      }

      case 'alert': {
        soundEngine.play('tap')
        setToasts(prev => [...prev, {
          id, type: 'streak',
          emoji: data.emoji || '⚠️',
          title: data.title || 'Atenção!',
          subtitle: data.subtitle,
          duration: data.duration || 2500,
        }])
        setFlash({ color: 'state-alert', id })
        setTimeout(() => setFlash(null), 400)
        break
      }

      case 'correct': {
        soundEngine.play('success')
        setFlash({ color: 'state-success', id })
        setTimeout(() => setFlash(null), 400)
        if (data.points) {
          setFloats(prev => [...prev, { id, text: `+${data.points}`, color: 'state-success', x: data.x || 50, y: data.y || 30 }])
          setTimeout(() => removeFloat(id), 1200)
        }
        break
      }

      case 'wrong': {
        soundEngine.play('error')
        setFlash({ color: 'state-error', id })
        setTimeout(() => setFlash(null), 400)
        break
      }

      case 'coins': {
        soundEngine.play('coins')
        const positive = data.amount > 0
        setToasts(prev => [...prev, {
          id, type: 'coins',
          emoji: positive ? '💰' : '💸',
          title: `${positive ? '+' : ''}${data.amount} moedas`,
          subtitle: data.label || (positive ? 'Moedas ganhas!' : 'Moedas gastas'),
          sparkle: positive, sparkleColor: '#FACC15', sparkleCount: 6,
          duration: 1800,
        }])
        break
      }

      case 'complete': {
        soundEngine.play('complete')
        setToasts(prev => [...prev, {
          id, type: 'complete',
          emoji: data.emoji || '🎉',
          title: data.title || 'Completo!',
          subtitle: data.subtitle || 'Muito bem!',
          sparkle: true, sparkleColor: '#22D3EE', sparkleCount: 12,
          duration: 3000,
        }])
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)
        break
      }

      case 'achievement': {
        soundEngine.play('complete')
        setToasts(prev => [...prev, {
          id, type: 'achievement',
          emoji: data.emoji || '🏆',
          title: data.title || 'Conquista!',
          subtitle: data.subtitle || 'Nova conquista desbloqueada!',
          sparkle: true, sparkleColor: '#A855F7', sparkleCount: 14,
          duration: 3500,
        }])
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3500)
        break
      }

      case 'tap': {
        soundEngine.play('tap')
        break
      }

      case 'reveal': {
        soundEngine.play('reveal')
        setFlash({ color: 'neon-cyan', id })
        setTimeout(() => setFlash(null), 500)
        break
      }

      case 'success': {
        soundEngine.play('success')
        if (data.title) {
          setToasts(prev => [...prev, {
            id, type: 'success',
            emoji: data.emoji || '✅',
            title: data.title,
            subtitle: data.subtitle,
            duration: 2000,
          }])
        }
        break
      }
    }
  }, [])

  // Level check helper
  const checkLevelUp = useCallback((newLevel) => {
    if (prevLevelRef.current !== null && newLevel > prevLevelRef.current) {
      trigger('levelup', { level: newLevel })
    }
    prevLevelRef.current = newLevel
  }, [trigger])

  return (
    <FeedbackContext.Provider value={{ trigger, checkLevelUp, soundEngine }}>
      {children}

      {/* Toast stack */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map(toast => (
          <FeedbackToast key={toast.id} item={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Floating texts */}
      {floats.map(f => (
        <FloatingText key={f.id} text={f.text} color={f.color} x={f.x} y={f.y} />
      ))}

      {/* Screen flash */}
      {flash && <ScreenFlash key={flash.id} color={flash.color} />}

      {/* Level up overlay */}
      {levelUp && <LevelUpOverlay level={levelUp} onDone={() => setLevelUp(null)} />}

      {/* Confetti */}
      {confetti && <Confetti count={35} />}
    </FeedbackContext.Provider>
  )
}
