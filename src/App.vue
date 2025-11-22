<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'

  import { onMounted } from 'vue'

  const spendingsStore = useSpendingsStore()

  onMounted(async () => {
    await spendingsStore.load()
  })
</script>

<template>
  <NConfigProvider>
    <NDialogProvider>
      <NMessageProvider>
        <Header />
        <router-view />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
