export type ColorScheme = 'indigo' | 'rose' | 'emerald' | 'amber'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface SystemState {
  /** 实际生效的主题（由 themeMode 决定） */
  theme: 'light' | 'dark'
  /** 用户选择的模式：亮色 / 暗色 / 跟随系统 */
  themeMode: ThemeMode
  /** 主题色方案 */
  colorScheme: ColorScheme
  /** 系统语言 */
  language: string
}
