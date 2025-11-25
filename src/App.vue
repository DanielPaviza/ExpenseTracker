<script setup lang="ts">
  import AppContent from '@components/AppContent.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'

  import { onBeforeMount, onMounted } from 'vue'

  const store = useSpendingsStore()

  onMounted(async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const appWindow = getCurrentWindow()

    const unlisten = await appWindow.onCloseRequested(async (event) => {
      if (store.pendingChanges) {
        event.preventDefault()

        const { ask } = await import('@tauri-apps/plugin-dialog')
        const shouldClose = await ask(
          'Máte neuložené změny. Opravdu chcete ukončit aplikaci bez uložení?',
          {
            title: 'Neuložené změny',
            kind: 'warning',
            okLabel: 'Ukončit bez uložení',
            cancelLabel: 'Zrušit',
          },
        )

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
    onBeforeMount(() => {
      unlisten()
    })
  })
</script>

<template>
  <NConfigProvider>
    <NDialogProvider>
      <NMessageProvider>
        <AppContent />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
