import type { ThemeMode, ColorScheme } from '~/stores/module/system/type'

/**
 * 全局主题 composable
 * 任何组件 import 或直接调用即可控制主题
 *
 * 示例：
 *   const { isDark, themeMode, setThemeMode, setColorScheme } = useTheme()
 */
export const useTheme = () => {
  const store = useSystemStore()

  return {
    /** 当前实际生效的明暗（由 themeMode 推导） */
    isDark: computed(() => store.isDark),
    /** 用户选择的模式：'light' | 'dark' | 'system' */
    themeMode: computed(() => store.themeMode),
    /** 当前配色方案 */
    colorScheme: computed(() => store.colorScheme),
    /** 设置模式 */
    setThemeMode: (mode: ThemeMode) => store.setThemeMode(mode),
    /** 切换明暗（light→dark→system 循环） */
    toggleTheme: () => store.toggleTheme(),
    /** 设置配色方案 */
    setColorScheme: (scheme: ColorScheme) => store.setColorScheme(scheme),
  }
}
