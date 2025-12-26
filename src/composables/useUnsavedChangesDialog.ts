import { useSpendingsStore } from '@stores/spendingsStore'

import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUnsavedChangesDialog(): void {
  const { t } = useI18n()
  const store = useSpendingsStore()

  onMounted(async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const appWindow = getCurrentWindow()

    const unlisten = await appWindow.onCloseRequested(async (event) => {
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
            await appWindow.destroy()
          } catch (e) {
            console.error('Error closing window:', e)
          }
        }
      }
    })

    // Cleanup on unmount
    onBeforeUnmount(() => {
      unlisten()
    })
  })
}
