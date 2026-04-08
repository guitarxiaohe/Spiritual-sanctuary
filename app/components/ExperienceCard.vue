<template>
  <div
    ref="cardRef"
    class="experience-card"
    :class="[`fly-${flyDirection}`, { visible: isVisible }]"
    :style="{ '--card-delay': `${index * 120}ms` }"
  >
    <div
      ref="innerRef"
      class="experience-card__inner"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <div class="experience-card__glow" :style="glowStyle"></div>
      <div class="experience-card__accent"></div>
      <div class="experience-card__header">
        <span class="experience-card__company">{{ company }}</span>
        <span class="experience-card__period">{{ period }}</span>
      </div>
      <div class="experience-card__role">{{ role }}</div>
      <p class="experience-card__description">{{ description }}</p>
      <div class="experience-card__tags">
        <span v-for="tag in tags" :key="tag" class="experience-card__tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  type FlyDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  const DIRECTIONS: FlyDirection[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

  const props = defineProps<{
    company: string
    role: string
    period: string
    description: string
    tags: string[]
    index: number
  }>()

  const flyDirection = DIRECTIONS[props.index % 4]

  const cardRef = ref<HTMLElement | null>(null)
  const innerRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const glowX = ref(50)
  const glowY = ref(50)
  const rotateX = ref(0)
  const rotateY = ref(0)

  const glowStyle = computed(() => ({
    background: `radial-gradient(circle at ${glowX.value}% ${glowY.value}%, rgba(var(--theme-primary-rgb), 0.15), transparent 60%)`,
  }))

  let observer: IntersectionObserver | null = null

  function handleMouseMove(e: MouseEvent) {
    const el = innerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    glowX.value = (x / rect.width) * 100
    glowY.value = (y / rect.height) * 100

    const maxRotate = 15
    rotateY.value = ((x - centerX) / centerX) * maxRotate
    rotateX.value = -((y - centerY) / centerY) * maxRotate

    el.style.transform = `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(1.02, 1.02, 1.02)`
  }

  function handleMouseLeave() {
    const el = innerRef.value
    if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  onMounted(() => {
    const el = cardRef.value
    if (!el) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible.value = entry.isIntersecting
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
</script>
