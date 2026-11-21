import { computed, ref, watchEffect } from 'vue'

import { useSettingsStore } from '@/stores/settingsStore'
import type { ThemeMode } from '@/types/Settings'

// Shared across all callers – the OS preference is tracked once
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemPrefersDark = ref(mediaQuery.matches)
mediaQuery.addEventListener('change', (e) => (systemPrefersDark.value = e.matches))

/**
 * Resolves the effective color theme from settings (light / dark / system)
 * and keeps the `.dark` class on <html> in sync.
 */
export function useTheme() {
  const settingsStore = useSettingsStore()

  const mode = computed<ThemeMode>(() => settingsStore.settings.theme ?? 'system')
  const isDark = computed(() =>
    mode.value === 'system' ? systemPrefersDark.value : mode.value === 'dark',
  )

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  async function setMode(newMode: ThemeMode): Promise<void> {
    await settingsStore.save({ ...settingsStore.settings, theme: newMode })
  }

  async function toggleTheme(): Promise<void> {
    await setMode(isDark.value ? 'light' : 'dark')
  }

  return { mode, isDark, setMode, toggleTheme }
}
