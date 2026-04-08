export default defineNuxtConfig({
  srcDir: 'app',

  extends: [
    // 统一配置
    './layers/base',
    // vite
    './layers/vite',
  ],

  i18n: {
    locales: [
      { code: 'zh', name: '中文', flag: '🇨🇳', file: 'zh.ts' },
      { code: 'en', name: 'English', flag: '🇺🇸', file: 'en.ts' },
      { code: 'ja', name: '日本語', flag: '🇯🇵', file: 'ja.ts' },
      { code: 'ko', name: '한국어', flag: '🇰🇷', file: 'ko.ts' },
      { code: 'th', name: 'ไทย', flag: '🇹🇭', file: 'th.ts' },
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales',
    detection: {
      browserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_locale',
        fallbackLocale: 'zh',
      },
    },
  },
})
