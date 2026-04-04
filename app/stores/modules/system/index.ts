import { defineStore } from 'pinia'
import type { SystemState, ColorScheme, ThemeMode } from './type'

const COLOR_MAP: Record<
  ColorScheme,
  {
    light: { primary: string; secondary: string }
    dark: { primary: string; secondary: string }
  }
> = {
  indigo: {
    light: { primary: '#6366f1', secondary: '#f43f5e' },
    dark: { primary: '#8b5cf6', secondary: '#ec4899' },
  },
  rose: {
    light: { primary: '#e11d48', secondary: '#a855f7' },
    dark: { primary: '#f43f5e', secondary: '#c084fc' },
  },
  emerald: {
    light: { primary: '#059669', secondary: '#0ea5e9' },
    dark: { primary: '#10b981', secondary: '#38bdf8' },
  },
  amber: {
    light: { primary: '#d97706', secondary: '#dc2626' },
    dark: { primary: '#f59e0b', secondary: '#ef4444' },
  },
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// 模块级变量：保存系统偏好监听器的清理函数
let _cleanupSystemListener: (() => void) | null = null

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    theme: 'light',
    themeMode: 'system',
    colorScheme: 'indigo',
    language: 'zh-CN',
  }),

  getters: {
    isDark: state => state.theme === 'dark',
    isSystemMode: state => state.themeMode === 'system',
  },

  actions: {
    initTheme() {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode | null
      const savedScheme = localStorage.getItem('colorScheme') as ColorScheme | null

      if (savedScheme && COLOR_MAP[savedScheme]) {
        this.colorScheme = savedScheme
      }

      // 默认跟随系统
      this.setThemeMode(savedMode ?? 'system')
    },

    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode

      // 清理旧的系统监听器
      if (_cleanupSystemListener) {
        _cleanupSystemListener()
        _cleanupSystemListener = null
      }

      if (mode === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        this.theme = mq.matches ? 'dark' : 'light'

        const handler = (e: MediaQueryListEvent) => {
          this.theme = e.matches ? 'dark' : 'light'
          this._applyTheme()
        }
        mq.addEventListener('change', handler)
        _cleanupSystemListener = () => mq.removeEventListener('change', handler)
      } else {
        this.theme = mode
      }

      this._applyTheme()
      localStorage.setItem('themeMode', mode)
    },

    /** 保留向后兼容，切换亮/暗（跳过 system） */
    toggleTheme() {
      const next: ThemeMode =
        this.themeMode === 'light' ? 'dark' : this.themeMode === 'dark' ? 'system' : 'light'
      this.setThemeMode(next)
    },

    setColorScheme(scheme: ColorScheme) {
      this.colorScheme = scheme
      this._applyTheme()
    },

    _applyTheme() {
      const root = document.documentElement
      const mode = this.isDark ? 'dark' : 'light'
      const colors = COLOR_MAP[this.colorScheme][mode]

      root.setAttribute('data-theme', mode)
      root.setAttribute('data-color-scheme', this.colorScheme)

      // 主题色
      root.style.setProperty('--theme-primary', colors.primary)
      root.style.setProperty('--theme-secondary', colors.secondary)
      root.style.setProperty('--theme-primary-rgb', hexToRgb(colors.primary))
      root.style.setProperty('--theme-secondary-rgb', hexToRgb(colors.secondary))

      // 文字 & 背景——通过 JS 显式赋值，保证 CSS transition 两个方向都触发
      if (this.isDark) {
        root.style.setProperty('--theme-text', '#f0f0f0')
        root.style.setProperty('--theme-text-muted', '#9ca3af')
        root.style.setProperty('--theme-bg', '#0f0f0f')
      } else {
        root.style.setProperty('--theme-text', '#0f0f0f')
        root.style.setProperty('--theme-text-muted', '#4b5563')
        root.style.setProperty('--theme-bg', '#ffffff')
      }

      localStorage.setItem('colorScheme', this.colorScheme)
    },
  },
})
