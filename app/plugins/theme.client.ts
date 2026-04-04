/**
 * 主题初始化插件（仅客户端）
 *
 * 在任何组件 mount 之前运行，从 localStorage 恢复主题色和明暗模式，
 * 避免 @pinia/nuxt SSR hydration 用服务端默认 state 覆盖用户保存的偏好。
 */
export default defineNuxtPlugin(() => {
  const store = useSystemStore()
  store.initTheme()
})
