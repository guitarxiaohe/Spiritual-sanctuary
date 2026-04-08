<template>
  <header class="navbar-3d">
    <div class="nav-container">
      <div class="logo" @click="scrollToTop">
        <div class="logo-3d">
          <span class="logo-emoji">🫧</span>
          <span class="logo-highlight">港湾</span>
        </div>
      </div>

      <nav class="nav-links">
        <a
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          :class="['nav-link', { active: currentPath === item.path }]"
          @click.prevent="navigate(item.path)"
        >
          <span class="link-text">{{ item.name }}</span>
          <span class="link-glow"></span>
        </a>
      </nav>

      <div class="nav-actions">
        <button
          class="theme-toggle"
          @click="toggleDark()"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <div class="toggle-3d">
            <span class="toggle-icon">{{ isDark ? '🌙' : '☀️' }}</span>
          </div>
        </button>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="menu-icon" :class="{ open: mobileMenuOpen }">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <a
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          class="mobile-nav-link"
          :class="{ active: currentPath === item.path }"
          @click.prevent="navigate(item.path)"
        >
          {{ item.name }}
        </a>
      </div>
    </Transition>
  </header>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()
  const currentPath = computed(() => route.path)

  const navItems = [
    { name: '首页', path: '/' },
    { name: '发布故事', path: '/create' },
  ]

  const { isDark, toggleDark } = useTheme()

  const mobileMenuOpen = ref(false)

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
    document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
  }

  const navigate = (path) => {
    router.push(path)
    mobileMenuOpen.value = false
    document.body.style.overflow = ''
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentPath.value !== '/') {
      router.push('/')
    }
  }

  const handleResize = () => {
    if (window.innerWidth > 768 && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
      document.body.style.overflow = ''
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.body.style.overflow = ''
  })
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .navbar-3d {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    padding: 0.75rem 2rem;
    background: rgba(var(--theme-primary-rgb), 0.08);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(var(--theme-primary-rgb), 0.2);
    transition: all 0.3s ease;
  }

  .nav-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    perspective: 1000px;
  }

  .logo {
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: translateY(-2px) rotateX(5deg);
  }

  .logo-3d {
    background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
    padding: 0.5rem 1.2rem;
    border-radius: 12px;
    transform: rotateX(10deg) translateZ(10px);
    box-shadow: 0 10px 20px -5px rgba(var(--theme-primary-rgb), 0.3);
    transition: all 0.3s;
  }

  .logo-emoji {
    font-size: 1.3rem;
    line-height: 1;
  }

  .logo-highlight {
    font-weight: 700;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 0.02em;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    position: relative;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem 0;
    color: var(--theme-primary);
    transition: all 0.3s;
    transform-style: preserve-3d;
  }

  .nav-link .link-text {
    position: relative;
    z-index: 2;
  }

  .nav-link .link-glow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary));
    transition: width 0.3s ease;
    box-shadow: 0 0 8px var(--theme-primary);
  }

  .nav-link:hover {
    transform: translateY(-2px);
    text-shadow: 0 0 8px rgba(var(--theme-primary-rgb), 0.5);
  }

  .nav-link:hover .link-glow {
    width: 100%;
  }

  .nav-link.active {
    font-weight: 700;
    text-shadow: 0 0 12px rgba(var(--theme-primary-rgb), 0.6);
  }

  .nav-link.active .link-glow {
    width: 100%;
    height: 3px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    width: 44px;
    height: 44px;
    perspective: 200px;
  }

  .toggle-3d {
    width: 100%;
    height: 100%;
    background: rgba(var(--theme-primary-rgb), 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transform-style: preserve-3d;
    transition:
      transform 0.4s ease,
      background 0.2s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .theme-toggle:hover .toggle-3d {
    transform: rotateX(10deg) translateZ(5px);
    background: rgba(var(--theme-primary-rgb), 0.25);
  }

  .toggle-icon {
    font-size: 1.3rem;
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .theme-toggle:hover .toggle-icon {
    transform: scale(1.2) rotate(12deg);
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(var(--theme-primary-rgb), 0.1);
  }

  .menu-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 100%;
    height: 100%;
  }

  .menu-icon span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--theme-primary);
    transition: all 0.3s;
    border-radius: 2px;
  }

  .menu-icon.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .menu-icon.open span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-menu {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background: rgba(var(--theme-primary-rgb), 0.95);
    backdrop-filter: blur(20px);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 999;
  }

  .mobile-nav-link {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0.75rem;
    text-align: center;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .mobile-nav-link.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }

  .mobile-nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.3s ease;
  }

  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  @media (max-width: 768px) {
    .navbar-3d {
      padding: 0.75rem 1rem;
    }

    .nav-links {
      display: none;
    }

    .mobile-menu-btn {
      display: flex;
    }
  }
</style>
