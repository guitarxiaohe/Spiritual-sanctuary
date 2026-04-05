<template>
  <div class="ls-root" ref="rootRef">
    <button
      class="ls-trigger"
      :class="{ 'panel-open': panelOpen }"
      @click="panelOpen = !panelOpen"
      :title="$t('common.language')"
    >
      <div class="ls-stage">
        <Transition name="flag-switch">
          <span :key="currentLocale" class="ls-flag" aria-hidden="true">
            {{ currentFlag }}
          </span>
        </Transition>
      </div>

      <div class="ls-label">
        {{ currentLocaleName }}
      </div>
    </button>

    <Transition name="ls-panel">
      <div v-if="panelOpen" class="ls-panel" @click.stop>
        <div class="ls-panel-title">
          <span class="title-icon">🌐</span>
          <span class="title-text">{{ $t('common.language') }}</span>
        </div>

        <div class="ls-sep" />

        <div class="ls-options">
          <button
            v-for="locale in locales"
            :key="locale.code"
            class="ls-option"
            :class="{ active: locale.code === currentLocale }"
            @click="switchLanguage(locale.code)"
          >
            <span class="option-flag">{{ locale.flag }}</span>
            <span class="option-name">{{ locale.name }}</span>
            <Transition name="check-fade">
              <svg
                v-if="locale.code === currentLocale"
                class="option-check"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Transition>
          </button>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <div v-if="panelOpen" class="ls-backdrop" @click="panelOpen = false" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const panelOpen = ref(false)

const currentLocale = computed(() => locale.value)

const currentFlag = computed(() => {
  const current = locales.value.find(l => l.code === locale.value)
  return current?.flag ?? '🌐'
})

const currentLocaleName = computed(() => {
  const current = locales.value.find(l => l.code === locale.value)
  return current?.name ?? 'Language'
})

const switchLanguage = async (code: string) => {
  if (code === locale.value) {
    panelOpen.value = false
    return
  }
  await setLocale(code)
  panelOpen.value = false
}
</script>

<style scoped>
.ls-root {
  position: fixed;
  top: 1rem;
  right: 5rem;
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}

.ls-trigger {
  position: relative;
  height: 40px;
  padding: 0 14px;
  border-radius: 20px;
  border: 1.5px solid rgba(var(--theme-primary-rgb), 0.22);
  background: rgba(var(--theme-primary-rgb), 0.07);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 20px -2px rgba(var(--theme-primary-rgb), 0.18);
}

.ls-trigger:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 28px -4px rgba(var(--theme-primary-rgb), 0.3);
  border-color: rgba(var(--theme-primary-rgb), 0.4);
  background: rgba(var(--theme-primary-rgb), 0.12);
}

.ls-trigger:active {
  transform: scale(0.98);
}

.ls-trigger.panel-open {
  border-color: var(--theme-primary);
  background: rgba(var(--theme-primary-rgb), 0.14);
}

.ls-stage {
  position: relative;
  width: 24px;
  height: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ls-flag {
  position: absolute;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  will-change: transform, opacity;
}

.ls-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--theme-primary);
  white-space: nowrap;
}

.ls-panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 200px;
  padding: 10px;
  border-radius: 16px;
  background: rgba(var(--theme-primary-rgb), 0.06);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--theme-primary-rgb), 0.14);
  box-shadow:
    0 16px 48px -8px rgba(var(--theme-primary-rgb), 0.18),
    0 4px 16px -4px rgba(0, 0, 0, 0.08);
}

[data-theme='dark'] .ls-panel {
  background: rgba(15, 12, 30, 0.75);
  border-color: rgba(var(--theme-primary-rgb), 0.2);
}

.ls-panel-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
}

.title-icon {
  font-size: 1.1rem;
}

.title-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--theme-primary);
}

.ls-sep {
  height: 1px;
  background: rgba(var(--theme-primary-rgb), 0.08);
  margin: 8px 0;
}

.ls-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ls-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--theme-text);
}

.ls-option:hover {
  background: rgba(var(--theme-primary-rgb), 0.1);
}

.ls-option.active {
  background: rgba(var(--theme-primary-rgb), 0.15);
}

.option-flag {
  font-size: 1.3rem;
}

.option-name {
  flex: 1;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 500;
}

.option-check {
  color: var(--theme-primary);
}

.ls-backdrop {
  position: fixed;
  inset: 0;
  z-index: 997;
}

.flag-switch-leave-active {
  animation: flag-exit 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}
.flag-switch-enter-active {
  animation: flag-enter 0.35s cubic-bezier(0, 0.55, 0.45, 1) forwards;
}

@keyframes flag-exit {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) scale(0.8);
    opacity: 0;
  }
}

@keyframes flag-enter {
  0% {
    transform: translateY(20px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.ls-panel-enter-active {
  animation: panel-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.ls-panel-leave-active {
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

@media (max-width: 480px) {
  .ls-root {
    top: 0.75rem;
    right: 4rem;
  }

  .ls-trigger {
    height: 36px;
    padding: 0 10px;
  }

  .ls-stage {
    width: 20px;
    height: 20px;
  }

  .ls-flag {
    font-size: 1rem;
  }

  .ls-label {
    font-size: 0.75rem;
  }

  .ls-panel {
    width: 180px;
  }
}
</style>
