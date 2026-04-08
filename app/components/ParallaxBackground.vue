<template>
  <canvas ref="canvasRef" class="parallax-canvas"></canvas>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  interface Particle {
    x: number
    y: number
    baseX: number
    baseY: number
    size: number
    opacity: number
    speed: number
  }

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let ctx: CanvasRenderingContext2D | null = null
  let particles: Particle[] = []
  let mouseX = 0
  let mouseY = 0
  let animationId = 0
  let width = 0
  let height = 0

  const PARTICLE_COUNT = 80
  const CONNECTION_DISTANCE = 150
  const PARALLAX_STRENGTH = 0.03

  function initParticles() {
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
      })
    }
  }

  function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const primaryRGB = isDark ? '139, 92, 246' : '99, 102, 241'
    const secondaryRGB = isDark ? '236, 72, 153' : '244, 63, 94'

    // 更新粒子位置（视差 + 浮动）
    const time = Date.now() * 0.001
    for (const p of particles) {
      const offsetX = (mouseX - width / 2) * PARALLAX_STRENGTH * p.speed
      const offsetY = (mouseY - height / 2) * PARALLAX_STRENGTH * p.speed
      p.x = p.baseX + offsetX + Math.sin(time * p.speed + p.baseX * 0.01) * 15
      p.y = p.baseY + offsetY + Math.cos(time * p.speed + p.baseY * 0.01) * 15
    }

    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${primaryRGB}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // 绘制粒子
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${secondaryRGB}, ${p.opacity})`
      ctx.fill()
    }

    animationId = requestAnimationFrame(draw)
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  function handleResize() {
    if (!canvasRef.value) return
    width = window.innerWidth
    height = window.innerHeight
    canvasRef.value.width = width
    canvasRef.value.height = height
    initParticles()
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    if (!ctx) return

    handleResize()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    draw()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
  })
</script>

<style scoped>
  .parallax-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
