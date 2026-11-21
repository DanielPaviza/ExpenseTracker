<script setup lang="ts">
  import {
    NConfigProvider,
    NDialogProvider,
    NGlobalStyle,
    NMessageProvider,
    csCZ,
    darkTheme,
    dateCsCZ,
    dateEnUS,
    enUS,
  } from 'naive-ui'

  import { computed } from 'vue'

  import AppShell from '@/components/layout/AppShell.vue'
  import { useOnAppCloseActions } from '@/composables/useOnAppCloseActions'
  import { useTheme } from '@/composables/useTheme'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { darkThemeOverrides, lightThemeOverrides } from '@/theme/naiveTheme'

  useOnAppCloseActions()

  const { isDark } = useTheme()
  const settingsStore = useSettingsStore()

  const theme = computed(() => (isDark.value ? darkTheme : null))
  const themeOverrides = computed(() => (isDark.value ? darkThemeOverrides : lightThemeOverrides))
  const isCzech = computed(() => settingsStore.settings.languageCode === 'cs')
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="isCzech ? csCZ : enUS"
    :date-locale="isCzech ? dateCsCZ : dateEnUS"
  >
    <NGlobalStyle />
    <NDialogProvider>
      <NMessageProvider placement="bottom-right">
        <AppShell />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
