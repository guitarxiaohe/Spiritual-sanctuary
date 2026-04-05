import { defineStore } from 'pinia'
import type { SystemState, ColorScheme } from './type'

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
  green: {
    light: { primary: '#16a34a', secondary: '#84cc16' },
    dark: { primary: '#22c55e', secondary: '#a3e635' },
  },
  ocean: {
    light: { primary: '#006bea', secondary: '#06b6d4' },
    dark: { primary: '#3b82f6', secondary: '#22d3ee' },
  },
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    colorScheme: 'indigo',
    language: 'zh-CN',
  }),

  actions: {
    initColorScheme() {
      const savedScheme = localStorage.getItem('colorScheme') as ColorScheme | null
      if (savedScheme && COLOR_MAP[savedScheme]) {
        this.colorScheme = savedScheme
      }
      this._applyColorScheme()
    },

    setColorScheme(scheme: ColorScheme) {
      this.colorScheme = scheme
      this._applyColorScheme()
    },

    _applyColorScheme() {
      const root = document.documentElement
      const isDark = root.getAttribute('data-theme') === 'dark'
      const colors = COLOR_MAP[this.colorScheme][isDark ? 'dark' : 'light']

      root.setAttribute('data-color-scheme', this.colorScheme)

      root.style.setProperty('--theme-primary', colors.primary)
      root.style.setProperty('--theme-secondary', colors.secondary)
      root.style.setProperty('--theme-primary-rgb', hexToRgb(colors.primary))
      root.style.setProperty('--theme-secondary-rgb', hexToRgb(colors.secondary))

      localStorage.setItem('colorScheme', this.colorScheme)
    },
  },
})
