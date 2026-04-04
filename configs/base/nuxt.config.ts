export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxtjs/color-mode'],
  css: ['element-plus/dist/index.css', 'assets/css/index.scss'],
  runtimeConfig: {
    public: {
      // 自定义的公共配置项
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
