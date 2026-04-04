<template>
  <div class="ts-root" ref="rootRef">
    <!-- ── 主按钮：大图标 + 点击循环模式 ── -->
    <button
      class="ts-trigger"
      :class="{ 'panel-open': panelOpen }"
      @click="cycleMode"
      :title="`当前：${modeLabel} — 点击切换`"
    >
      <!-- 滚动舞台：overflow:hidden 保证图标只在圆圈内可见 -->
      <div class="ts-stage">
        <Transition :name="`roll-${rollDir}`">
          <span :key="store.themeMode" class="ts-icon" aria-hidden="true">
            {{ modeEmoji[store.themeMode] }}
          </span>
        </Transition>
      </div>

      <!-- 底部模式点指示器 -->
      <div class="ts-dots">
        <span
          v-for="m in modeDefs"
          :key="m.mode"
          class="ts-dot"
          :class="{ active: store.themeMode === m.mode }"
        />
      </div>
    </button>

    <!-- ── 展开按钮（小箭头） ── -->
    <button
      class="ts-expand-btn"
      @click.stop="panelOpen = !panelOpen"
      :title="panelOpen ? '收起' : '更多选项'"
    >
      <svg
        class="expand-arrow"
        :class="{ open: panelOpen }"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2 8L6 4L10 8"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- ── 展开面板 ── -->
    <Transition name="ts-panel">
      <div v-if="panelOpen" class="ts-panel" @click.stop>
        <!-- 三模式选择器 -->
        <div class="ts-modes">
          <button
            v-for="m in modeDefs"
            :key="m.mode"
            class="ts-mode-btn"
            :class="{ active: store.themeMode === m.mode }"
            @click="selectMode(m.mode)"
          >
            <span class="mode-emoji">{{ m.emoji }}</span>
            <span class="mode-label">{{ m.label }}</span>
          </button>

          <!-- 滑动指示条 -->
          <div class="mode-slider" :style="sliderStyle" />
        </div>

        <div class="ts-sep" />

        <!-- 配色方案 -->
        <div class="ts-colors">
          <button
            v-for="s in schemeDefs"
            :key="s.id"
            class="ts-color-dot"
            :class="{ active: store.colorScheme === s.id }"
            :style="{ background: s.gradient }"
            :title="s.name"
            @click="store.setColorScheme(s.id)"
          >
            <Transition name="check-fade">
              <svg
                v-if="store.colorScheme === s.id"
                class="dot-check"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Transition>
          </button>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层（点击关闭面板） -->
    <Teleport to="body">
      <div v-if="panelOpen" class="ts-backdrop" @click="panelOpen = false" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ThemeMode, ColorScheme } from '~/stores/module/system/type'

const store = useSystemStore()

// ── 模式定义 ──
const modeDefs: { mode: ThemeMode; emoji: string; label: string }[] = [
  { mode: 'light', emoji: '☀️', label: '亮色' },
  { mode: 'dark', emoji: '🌙', label: '暗色' },
  { mode: 'system', emoji: '💻', label: '跟随' },
]

const modeEmoji: Record<ThemeMode, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
}

const modeLabel = computed(() => modeDefs.find(m => m.mode === store.themeMode)?.label ?? '')

// ── 配色方案 ──
const schemeDefs: { id: ColorScheme; name: string; gradient: string }[] = [
  { id: 'indigo', name: 'Indigo', gradient: 'linear-gradient(135deg,#6366f1,#f43f5e)' },
  { id: 'rose', name: 'Rose', gradient: 'linear-gradient(135deg,#e11d48,#a855f7)' },
  { id: 'emerald', name: 'Emerald', gradient: 'linear-gradient(135deg,#059669,#0ea5e9)' },
  { id: 'amber', name: 'Amber', gradient: 'linear-gradient(135deg,#d97706,#dc2626)' },
]

// ── 滚动方向 ──
type RollDir = 'fwd' | 'bwd'
const rollDir = ref<RollDir>('fwd')
const modeOrder: ThemeMode[] = ['light', 'dark', 'system']

const calcDir = (from: ThemeMode, to: ThemeMode): RollDir => {
  const fi = modeOrder.indexOf(from)
  const ti = modeOrder.indexOf(to)
  // 正向：index 增大，或从末位(system)跳回首位(light)
  return ti > fi || (fi === 2 && ti === 0) ? 'fwd' : 'bwd'
}

// 主按钮：循环切换
const cycleMode = () => {
  const cur = store.themeMode
  const next = modeOrder[(modeOrder.indexOf(cur) + 1) % modeOrder.length] || 'dark'
  rollDir.value = 'fwd' // 循环永远是正向
  store.setThemeMode(next)
}

// 面板按钮：直接选择
const selectMode = (mode: ThemeMode) => {
  if (mode === store.themeMode) return
  rollDir.value = calcDir(store.themeMode, mode)
  store.setThemeMode(mode)
}

// ── 面板控制 ──
const panelOpen = ref(false)

// ── 模式滑块位置 ──
const sliderStyle = computed(() => {
  const idx = modeOrder.indexOf(store.themeMode)
  return { transform: `translateX(${idx * 100}%)` }
})
</script>

<style scoped>
/* ━━━ 根容器 ━━━ */
.ts-root {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  user-select: none;
}

/* ━━━ 主触发按钮 ━━━ */
.ts-trigger {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1.5px solid rgba(var(--theme-primary-rgb), 0.22);
  background: rgba(var(--theme-primary-rgb), 0.07);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 20px -2px rgba(var(--theme-primary-rgb), 0.18);
}

.ts-trigger:hover {
  transform: scale(1.07);
  box-shadow: 0 8px 28px -4px rgba(var(--theme-primary-rgb), 0.3);
  border-color: rgba(var(--theme-primary-rgb), 0.4);
  background: rgba(var(--theme-primary-rgb), 0.12);
}

.ts-trigger:active {
  transform: scale(0.96);
}

.ts-trigger.panel-open {
  border-color: var(--theme-primary);
  background: rgba(var(--theme-primary-rgb), 0.14);
}

/* ── 图标滚动舞台 ── */
.ts-stage {
  position: relative;
  width: 36px;
  height: 36px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ts-icon {
  position: absolute;
  font-size: 1.6rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  will-change: transform, opacity;
}

/* ── 三点指示器 ── */
.ts-dots {
  display: flex;
  gap: 3.5px;
  align-items: center;
}

.ts-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(var(--theme-primary-rgb), 0.25);
  transition: all 0.3s ease;
}

.ts-dot.active {
  width: 10px;
  border-radius: 2px;
  background: var(--theme-primary);
}

/* ━━━ 展开箭头按钮 ━━━ */
.ts-expand-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(var(--theme-primary-rgb), 0.15);
  background: rgba(var(--theme-primary-rgb), 0.06);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(var(--theme-primary-rgb), 0.5);
  transition: all 0.2s ease;
}

.ts-expand-btn:hover {
  border-color: rgba(var(--theme-primary-rgb), 0.3);
  color: var(--theme-primary);
  background: rgba(var(--theme-primary-rgb), 0.1);
}

.expand-arrow {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expand-arrow.open {
  transform: rotate(180deg);
}

/* ━━━ 展开面板 ━━━ */
.ts-panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 200px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(var(--theme-primary-rgb), 0.06);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--theme-primary-rgb), 0.14);
  box-shadow:
    0 16px 48px -8px rgba(var(--theme-primary-rgb), 0.18),
    0 4px 16px -4px rgba(0, 0, 0, 0.08);
}

[data-theme='dark'] .ts-panel {
  background: rgba(15, 12, 30, 0.75);
  border-color: rgba(var(--theme-primary-rgb), 0.2);
}

/* ── 模式选择器 ── */
.ts-modes {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(var(--theme-primary-rgb), 0.06);
  border: 1px solid rgba(var(--theme-primary-rgb), 0.1);
}

/* 滑动指示条（在按钮下层） */
.mode-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% / 3);
  height: 100%;
  background: rgba(var(--theme-primary-rgb), 0.14);
  border-radius: 9px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 0;
}

.ts-mode-btn {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s;
}

.mode-emoji {
  font-size: 1rem;
  line-height: 1;
}

.mode-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(var(--theme-primary-rgb), 0.5);
  transition: color 0.2s;
}

.ts-mode-btn.active .mode-label {
  color: var(--theme-primary);
  font-weight: 700;
}

/* ── 分割线 ── */
.ts-sep {
  height: 1px;
  background: rgba(var(--theme-primary-rgb), 0.08);
  margin: 10px 0;
}

/* ── 配色圆点 ── */
.ts-colors {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.ts-color-dot {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s;
}

.ts-color-dot:hover {
  transform: scale(1.18);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
}

.ts-color-dot.active {
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2.5px rgba(var(--theme-primary-rgb), 0.4);
  transform: scale(1.08);
}

.dot-check {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

/* ━━━ 遮罩 ━━━ */
.ts-backdrop {
  position: fixed;
  inset: 0;
  z-index: 997;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROLLING ANIMATION — FORWARD (正方向滚动)
   太阳/月亮 向右滚出，下一个从左滚入
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.roll-fwd-leave-active {
  animation: roll-exit-right 0.42s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}
.roll-fwd-enter-active {
  animation: roll-enter-left 0.42s cubic-bezier(0, 0.55, 0.45, 1) forwards;
}

@keyframes roll-exit-right {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  30% {
    transform: translate(10%, 8%) rotate(120deg) scale(0.85);
    opacity: 1;
  }
  100% {
    transform: translate(130%, 0) rotate(360deg) scale(0.5);
    opacity: 0;
  }
}

@keyframes roll-enter-left {
  0% {
    transform: translate(-130%, 0) rotate(-360deg) scale(0.5);
    opacity: 0;
  }
  70% {
    transform: translate(-8%, 8%) rotate(-60deg) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROLLING ANIMATION — BACKWARD (反方向滚动)
   向左滚出，下一个从右滚入
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.roll-bwd-leave-active {
  animation: roll-exit-left 0.42s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}
.roll-bwd-enter-active {
  animation: roll-enter-right 0.42s cubic-bezier(0, 0.55, 0.45, 1) forwards;
}

@keyframes roll-exit-left {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  30% {
    transform: translate(-10%, 8%) rotate(-120deg) scale(0.85);
    opacity: 1;
  }
  100% {
    transform: translate(-130%, 0) rotate(-360deg) scale(0.5);
    opacity: 0;
  }
}

@keyframes roll-enter-right {
  0% {
    transform: translate(130%, 0) rotate(360deg) scale(0.5);
    opacity: 0;
  }
  70% {
    transform: translate(8%, 8%) rotate(60deg) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* ━━━ 面板展开/收起 ━━━ */
.ts-panel-enter-active {
  animation: panel-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.ts-panel-leave-active {
  animation: panel-out 0.22s ease-in forwards;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.92);
    transform-origin: top right;
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    transform-origin: top right;
  }
}

@keyframes panel-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    transform-origin: top right;
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
    transform-origin: top right;
  }
}

/* ━━━ 对勾淡入淡出 ━━━ */
.check-fade-enter-active {
  transition: all 0.2s ease;
}
.check-fade-leave-active {
  transition: all 0.15s ease;
}
.check-fade-enter-from,
.check-fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* ━━━ 响应式 ━━━ */
@media (max-width: 480px) {
  .ts-root {
    top: 0.75rem;
    right: 0.75rem;
  }

  .ts-trigger {
    width: 52px;
    height: 52px;
  }

  .ts-stage {
    width: 30px;
    height: 30px;
  }

  .ts-icon {
    font-size: 1.35rem;
  }
}
</style>
