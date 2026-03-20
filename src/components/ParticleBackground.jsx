import { useEffect, useRef } from 'react'

// ========================
// PARTICLE BACKGROUND
// Canvas-based — zero dependencias
// Estrelas + particulas flutuantes + linhas de energia entre particulas proximas
// ========================
export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const dimensionsRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Colors from theme
    const COLORS = [
      { r: 52, g: 211, b: 153 },   // neon-green  #34D399
      { r: 34, g: 211, b: 238 },   // neon-cyan   #22D3EE
      { r: 168, g: 85, b: 247 },   // neon-purple #A855F7
      { r: 244, g: 114, b: 182 },  // neon-pink   #F472B6
      { r: 250, g: 204, b: 21 },   // neon-yellow #FACC15
    ]

    const CONFIG = {
      particleCount: 60,
      starCount: 80,
      maxSpeed: 0.3,
      connectionDistance: 120,
      connectionOpacity: 0.08,
      mouseRadius: 150,
      mouseForce: 0.02,
      particleMinSize: 1,
      particleMaxSize: 2.5,
      starMinSize: 0.3,
      starMaxSize: 1.2,
      twinkleSpeed: 0.02,
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w, h }

      // Adjust particle count for mobile
      if (w < 600) {
        CONFIG.particleCount = 30
        CONFIG.starCount = 50
        CONFIG.connectionDistance = 80
      }
    }

    function createParticle(w, h) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
        vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
        size: CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize),
        color,
        opacity: 0.15 + Math.random() * 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
      }
    }

    function createStar(w, h) {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: CONFIG.starMinSize + Math.random() * (CONFIG.starMaxSize - CONFIG.starMinSize),
        opacity: 0.1 + Math.random() * 0.4,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: CONFIG.twinkleSpeed * (0.5 + Math.random()),
      }
    }

    function init() {
      resize()
      const { w, h } = dimensionsRef.current
      const particles = []
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(createParticle(w, h))
      }
      // Stars (static background)
      const stars = []
      for (let i = 0; i < CONFIG.starCount; i++) {
        stars.push(createStar(w, h))
      }
      particlesRef.current = { particles, stars }
    }

    function draw(time) {
      const { w, h } = dimensionsRef.current
      const { particles, stars } = particlesRef.current
      const mouse = mouseRef.current

      // Clear
      ctx.clearRect(0, 0, w, h)

      // ---- STARS ----
      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase)
        const alpha = star.opacity * twinkle
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 234, 242, ${alpha})`
        ctx.fill()
      }

      // ---- CONNECTIONS (energy lines) ----
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONFIG.connectionDistance) {
            const opacity = CONFIG.connectionOpacity * (1 - dist / CONFIG.connectionDistance)
            const c1 = particles[i].color
            const c2 = particles[j].color
            // Gradient line between particle colors
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`)
            gradient.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Connection to mouse
        const mdx = particles[i].x - mouse.x
        const mdy = particles[i].y - mouse.y
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < CONFIG.mouseRadius) {
          const opacity = 0.12 * (1 - mDist / CONFIG.mouseRadius)
          const c = particles[i].color
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // ---- PARTICLES ----
      for (const p of particles) {
        // Pulse
        p.pulsePhase += p.pulseSpeed
        const pulse = 0.7 + 0.3 * Math.sin(p.pulsePhase)

        // Mouse interaction — gentle push
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < CONFIG.mouseRadius && mDist > 0) {
          const force = CONFIG.mouseForce * (1 - mDist / CONFIG.mouseRadius)
          p.vx += (mdx / mDist) * force
          p.vy += (mdy / mDist) * force
        }

        // Damping
        p.vx *= 0.999
        p.vy *= 0.999

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > CONFIG.maxSpeed * 2) {
          p.vx = (p.vx / speed) * CONFIG.maxSpeed * 2
          p.vy = (p.vy / speed) * CONFIG.maxSpeed * 2
        }

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw glow
        const alpha = p.opacity * pulse
        const c = p.color
        const glowSize = p.size * 4

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        glow.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.4})`)
        glow.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    // Mouse/touch tracking
    function handlePointer(e) {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    }

    function handlePointerLeave() {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    // Init
    init()
    animRef.current = requestAnimationFrame(draw)

    window.addEventListener('resize', () => {
      resize()
      // Re-create particles for new dimensions
      const { w, h } = dimensionsRef.current
      const { particles, stars } = particlesRef.current
      // Just re-wrap any out-of-bounds
      for (const p of particles) {
        if (p.x > w) p.x = Math.random() * w
        if (p.y > h) p.y = Math.random() * h
      }
      for (const s of stars) {
        if (s.x > w) s.x = Math.random() * w
        if (s.y > h) s.y = Math.random() * h
      }
    })

    canvas.addEventListener('mousemove', handlePointer)
    canvas.addEventListener('touchmove', handlePointer, { passive: true })
    canvas.addEventListener('mouseleave', handlePointerLeave)
    canvas.addEventListener('touchend', handlePointerLeave)

    return () => {
      cancelAnimationFrame(animRef.current)
      canvas.removeEventListener('mousemove', handlePointer)
      canvas.removeEventListener('touchmove', handlePointer)
      canvas.removeEventListener('mouseleave', handlePointerLeave)
      canvas.removeEventListener('touchend', handlePointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  )
}
