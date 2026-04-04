<template>
  <section class="tech-section">
    <div class="tech-section__header">
      <h2 class="tech-section__title">技术栈</h2>
    </div>
    <div class="tech-grid">
      <div
        v-for="tech in techs"
        :key="tech.name"
        class="tech-item"
        @mousemove="handleMouseMove"
      >
        <span class="tech-item__icon">{{ tech.icon }}</span>
        <span class="tech-item__name">{{ tech.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Tech {
  name: string
  icon: string
}

const techs: Tech[] = [
  { name: 'Vue', icon: '⚡' },
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Nuxt', icon: '💚' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Vite', icon: '🔶' },
  { name: 'SCSS', icon: '🎨' },
  { name: 'Pinia', icon: '🍍' },
  { name: 'Git', icon: '📦' },
  { name: 'Docker', icon: '🐳' },
  { name: 'ECharts', icon: '📊' },
  { name: 'Tailwind', icon: '🌊' },
]

function handleMouseMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  el.style.setProperty('--mouse-x', `${x}%`)
  el.style.setProperty('--mouse-y', `${y}%`)
}
</script>
