import { useMessage } from 'naive-ui'

import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useAppNavigation } from '@/composables/useAppNavigation'
import { useTheme } from '@/composables/useTheme'
import { useSpendingsStore } from '@/stores/spendingsStore'

export type ShortcutDefinition = { keys: string[]; labelKey: string }

/** Single source of truth for the shortcuts help dialog */
export const SHORTCUTS: ShortcutDefinition[] = [
  { keys: ['Ctrl', 'N'], labelKey: 'shortcuts.newPurchase' },
  { keys: ['Ctrl', 'S'], labelKey: 'shortcuts.save' },
  { keys: ['Ctrl', 'K'], labelKey: 'shortcuts.categories' },
  { keys: ['Ctrl', '1'], labelKey: 'shortcuts.dashboard' },
  { keys: ['Ctrl', '2'], labelKey: 'shortcuts.spendings' },
  { keys: ['Ctrl', ','], labelKey: 'shortcuts.settings' },
  { keys: ['Ctrl', 'Shift', 'L'], labelKey: 'shortcuts.toggleTheme' },
  { keys: ['?'], labelKey: 'shortcuts.help' },
  { keys: ['Esc'], labelKey: 'shortcuts.close' },
]

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName.toUpperCase())
  )
}

export function useKeyboardShortcuts(handlers: {
  openCategoryPicker: () => void
  toggleShortcutsHelp: () => void
}): void {
  const { t } = useI18n()
  const message = useMessage()
  const route = useRoute()
  const store = useSpendingsStore()
  const { toggleTheme } = useTheme()
  const { goToSection, openNewSpending, openSettings } = useAppNavigation()

  // A drawer (form / settings / bulk edit) is open when a child route is matched
  const isOverlayOpen = (): boolean => route.matched.length > 1

  async function save(): Promise<void> {
    if (!store.pendingChanges) return
    try {
      await store.save()
      message.success(t('messages.changesSavedSuccessfully'))
    } catch (error) {
      console.error('Save error:', error)
      message.error(t('messages.errorSavingChanges'))
    }
  }

  function onKeydown(e: KeyboardEvent): void {
    const ctrl = e.ctrlKey || e.metaKey
    const key = e.key.toLowerCase()

    if (ctrl && !e.shiftKey && key === 's') {
      e.preventDefault()
      void save()
      return
    }

    if (ctrl && e.shiftKey && key === 'l') {
      e.preventDefault()
      void toggleTheme()
      return
    }

    // Remaining shortcuts navigate – ignore them while a drawer is open
    if (isOverlayOpen()) return

    if (ctrl && !e.shiftKey) {
      const actions: Record<string, () => unknown> = {
        n: () => openNewSpending(),
        k: handlers.openCategoryPicker,
        ',': () => openSettings(),
        '1': () => goToSection('dashboard'),
        '2': () => goToSection('spendings'),
      }
      const action = actions[key]
      if (action) {
        e.preventDefault()
        action()
      }
      return
    }

    if (e.key === '?' && !isTypingTarget(e.target)) {
      e.preventDefault()
      handlers.toggleShortcutsHelp()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
