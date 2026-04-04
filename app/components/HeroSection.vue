<template>
  <section class="hero-section">
    <div class="hero-section__bg"></div>
    <ClientOnly>
      <ParallaxBackground />
    </ClientOnly>
    <div class="hero-section__content" :style="contentStyle">
      <h1 class="hero-section__title">GuitarXiaohe</h1>
      <p class="hero-section__subtitle">Frontend Developer</p>
      <p class="hero-section__description">
        专注于构建高性能、高可用的 Web 应用，热爱探索前沿技术与极致交互体验
      </p>
    </div>
    <div class="hero-section__scroll-hint">
      <span>SCROLL</span>
      <div class="hero-section__arrow"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)

const contentStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.3}px)`,
  opacity: Math.max(0, 1 - scrollY.value / 500),
}))

function handleScroll() {
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
