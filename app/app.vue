<template>
  <div>
    <el-config-provider :locale="elementLocale" size="default" :z-index="3000">
      <NuxtLayout>
        <LanguageSwitcher />
        <ThemeSwitcher />

        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'
import ko from 'element-plus/es/locale/lang/ko'
import th from 'element-plus/es/locale/lang/th'

const { locale } = useI18n()

const elementLocale = computed(() => {
  const localeMap: Record<string, any> = {
    zh: zhCn,
    en: en,
    ja: ja,
    ko: ko,
    th: th,
  }
  return localeMap[locale.value] ?? zhCn
})
</script>
