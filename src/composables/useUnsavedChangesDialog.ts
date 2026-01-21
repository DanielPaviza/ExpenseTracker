import { useSpendingsStore } from '@stores/spendingsStore'

import type { Window } from '@tauri-apps/api/window'

import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUnsavedChangesDialog(): void {
  const { t } = useI18n()
  const store = useSpendingsStore()
  const appWindow = ref<Window | null>(null)

  onMounted(async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    appWindow.value = getCurrentWindow()
  })

  // Cleanup on unmount
  onBeforeUnmount(async () => {
    const unlisten = await appWindow.value?.onCloseRequested(async (event) => {
      if (store.pendingChanges) {
        event.preventDefault()

        const { ask } = await import('@tauri-apps/plugin-dialog')
        const shouldClose = await ask(t('dialogs.unsavedChangesContent'), {
          title: t('dialogs.unsavedChangesTitle'),
          kind: 'warning',
          okLabel: t('dialogs.closeWithoutSaving'),
          cancelLabel: t('dialogs.cancel'),
        })

        if (shouldClose) {
          try {
            await appWindow.value?.destroy()
          } catch (e) {
            console.error('Error closing window:', e)
          }
        }
      }
    })

    unlisten?.()
  })
}
