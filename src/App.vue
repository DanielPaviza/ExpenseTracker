<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NConfigProvider } from 'naive-ui'

  import { onMounted } from 'vue'

  const spendingsStore = useSpendingsStore()

  onMounted(async () => {
    await spendingsStore.load()
  })
</script>

<template>
  <NConfigProvider>
    <Header />
    <router-view />
  </NConfigProvider>
</template>
