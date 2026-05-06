import Head from 'next/head'
import { useEffect, useRef } from 'react'
import styles from '../../styles/dev/sakura.module.css'

type Petal = {
  u: number
  v: number
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  color: string
}

const PETAL_COLORS = ['#ffd1dc', '#ffc0cb', '#ffb7c5', '#ffe4ec', '#ff9ab8']
const REPEL_RADIUS = 140
const REPEL_FORCE_PER_SPEED = 0.15
const REPEL_FORCE_MAX = 5
const ROTATION_PER_SPEED = 0.01
const ROTATION_KICK_MAX = 0.2
const POINTER_SPEED_THRESHOLD = 0.5
const SPRING_K = 0.04
const FRICTION = 0.86
const ROTATION_FRICTION = 0.92

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  const s = p.size
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.moveTo(0, s)
  ctx.bezierCurveTo(s * 0.9, s * 0.6, s * 0.7, -s * 0.4, 0, -s)
  ctx.bezierCurveTo(s * 0.15, -s * 0.7, -s * 0.15, -s * 0.7, 0, -s * 0.85)
  ctx.bezierCurveTo(-s * 0.7, -s * 0.4, -s * 0.9, s * 0.6, 0, s)
  ctx.fill()
  ctx.restore()
}

export default function Sakura() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const petalsRef = useRef<Petal[]>([])
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    active: false,
  })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyMargin = document.body.style.margin
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'

    const restoreBodyStyles = () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.margin = prevBodyMargin
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = window.devicePixelRatio || 1

    const seedPetals = (w: number, h: number) => {
      const cellSize = 9
      const maxPetals = 25000
      let cols = Math.ceil(w / cellSize)
      let rows = Math.ceil(h / cellSize)
      if (cols * rows > maxPetals) {
        const scale = Math.sqrt((cols * rows) / maxPetals)
        cols = Math.max(1, Math.floor(cols / scale))
        rows = Math.max(1, Math.floor(rows / scale))
      }
      const cellW = w / cols
      const cellH = h / rows
      const petals: Petal[] = []
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const jitterX = (Math.random() - 0.5) * cellW
          const jitterY = (Math.random() - 0.5) * cellH
          const x = (col + 0.5) * cellW + jitterX
          const y = (row + 0.5) * cellH + jitterY
          petals.push({
            u: x / w,
            v: y / h,
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: 0,
            size: 6 + Math.random() * 6,
            color:
              PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          })
        }
      }
      petalsRef.current = petals
    }

    const remapPetals = (w: number, h: number) => {
      petalsRef.current.forEach((p) => {
        const nx = p.u * w
        const ny = p.v * h
        p.baseX = nx
        p.baseY = ny
        p.x = nx
        p.y = ny
        p.vx = 0
        p.vy = 0
      })
    }

    const applyCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height)
      petalsRef.current.forEach((p) => drawPetal(ctx, p))
    }

    applyCanvasSize()
    seedPetals(width, height)

    if (reduceMotion) {
      renderStatic()
      let resizeTimer: ReturnType<typeof setTimeout> | null = null
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          applyCanvasSize()
          remapPetals(width, height)
          renderStatic()
        }, 100)
      }
      window.addEventListener('resize', onResize)
      return () => {
        if (resizeTimer) clearTimeout(resizeTimer)
        window.removeEventListener('resize', onResize)
        restoreBodyStyles()
      }
    }

    const setPointer = (x: number, y: number) => {
      const ptr = pointerRef.current
      if (!ptr.active) {
        ptr.prevX = x
        ptr.prevY = y
      }
      ptr.x = x
      ptr.y = y
      ptr.active = true
    }
    const clearPointer = () => {
      const ptr = pointerRef.current
      ptr.x = -9999
      ptr.y = -9999
      ptr.prevX = -9999
      ptr.prevY = -9999
      ptr.active = false
    }

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY)
    const onMouseLeave = () => clearPointer()
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setPointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => clearPointer()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('touchstart', onTouchMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        applyCanvasSize()
        remapPetals(width, height)
      }, 100)
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      const pointer = pointerRef.current
      let pointerSpeed = 0
      if (pointer.active) {
        const mdx = pointer.x - pointer.prevX
        const mdy = pointer.y - pointer.prevY
        pointerSpeed = Math.sqrt(mdx * mdx + mdy * mdy)
        pointer.prevX = pointer.x
        pointer.prevY = pointer.y
      }
      const repelStrength = Math.min(
        pointerSpeed * REPEL_FORCE_PER_SPEED,
        REPEL_FORCE_MAX
      )
      const rotationKick = Math.min(
        pointerSpeed * ROTATION_PER_SPEED,
        ROTATION_KICK_MAX
      )
      const moving = pointerSpeed > POINTER_SPEED_THRESHOLD

      ctx.clearRect(0, 0, width, height)
      const petals = petalsRef.current
      for (let i = 0; i < petals.length; i += 1) {
        const p = petals[i]
        if (pointer.active && moving) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < REPEL_RADIUS * REPEL_RADIUS) {
            const dist = Math.sqrt(dist2) || 0.0001
            const force = (1 - dist / REPEL_RADIUS) * repelStrength
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            p.rotationSpeed += (Math.random() - 0.5) * rotationKick
          }
        }
        p.vx += (p.baseX - p.x) * SPRING_K
        p.vy += (p.baseY - p.y) * SPRING_K
        p.vx *= FRICTION
        p.vy *= FRICTION
        p.rotationSpeed *= ROTATION_FRICTION
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        drawPetal(ctx, p)
      }
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      if (resizeTimer) clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchstart', onTouchMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('resize', onResize)
      restoreBodyStyles()
    }
  }, [])

  return (
    <>
      <Head>
        <title>桜</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </>
  )
}
