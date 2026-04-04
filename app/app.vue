<template>
  <div>
    <el-config-provider :locale="elementLocale" size="default" :z-index="3000">
      <NuxtLayout>
        <ThemeSwitcher />

        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>
<script setup lang="ts">
import { useSystemStore } from './stores'

const systemStore = useSystemStore()

const elementLocale = computed(() => {
  return systemStore.theme === 'dark' ? 'zh-cn' : 'en'
})
</script>
