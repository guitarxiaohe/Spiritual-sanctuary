export default defineNuxtConfig({
  srcDir: 'app',
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  css: ['element-plus/dist/index.css', 'assets/css/index.scss'],
  runtimeConfig: {
    public: {
      apiBase: 'https://api.example.com',
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '-mode',
  },

  compatibilityDate: '2025-07-15',
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
})
