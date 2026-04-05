import { useDark, useToggle } from '@vueuse/core'
import type { ColorScheme } from '~/stores/modules/system/type'

export const useTheme = () => {
  const store = useSystemStore()

  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const toggleDark = useToggle(isDark)

  const isTransitioning = ref(false)

  const toggleThemeWithTransition = async () => {
    if (isTransitioning.value) return

    const goingDark = !isDark.value
    isTransitioning.value = true

    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    overlay.setAttribute('data-direction', goingDark ? 'to-dark' : 'to-light')

    const sunMoon = document.createElement('div')
    sunMoon.className = 'theme-transition-icon'
    sunMoon.innerHTML = goingDark ? '🌙' : '☀️'
    overlay.appendChild(sunMoon)

    document.body.appendChild(overlay)

    await new Promise(r => setTimeout(r, 50))

    overlay.classList.add('expanding')

    await new Promise(r => setTimeout(r, 400))

    toggleDark()

    await new Promise(r => setTimeout(r, 50))

    overlay.classList.remove('expanding')
    overlay.classList.add('collapsing')

    await new Promise(r => setTimeout(r, 400))

    overlay.remove()
    isTransitioning.value = false
  }

  return {
    isDark,
    toggleDark: toggleThemeWithTransition,
    isTransitioning,
    colorScheme: computed(() => store.colorScheme),
    setColorScheme: (scheme: ColorScheme) => store.setColorScheme(scheme),
  }
}
