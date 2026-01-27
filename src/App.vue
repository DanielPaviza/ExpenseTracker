<script setup lang="ts">
  import AppContent from '@components/AppContent.vue'
  import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'

  import { useOnAppCloseActions } from '@/composables/useOnAppCloseActions'

  useOnAppCloseActions()
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
