export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 导入自定义主题文件，用于覆盖 Element Plus 变量
          additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
          api: 'modern-compiler', // 使用现代编译器 API 避免警告 [citation:1]
        },
      },
    },
    optimizeDeps: {
      include: [
        'dayjs',
        // 如果使用了 dayjs 的插件，也需要包含进来
        // 'dayjs/plugin/advancedFormat',
        'lodash-unified',
      ],
    },
  },
})
