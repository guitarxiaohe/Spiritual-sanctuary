import { useDark } from '@vueuse/core'

export default defineNuxtPlugin(() => {
  const store = useSystemStore()

  useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  store.initColorScheme()
})
