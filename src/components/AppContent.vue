<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { useMessage } from 'naive-ui'

  import { onMounted } from 'vue'

  const spendingsStore = useSpendingsStore()
  const message = useMessage()

  onMounted(async () => {
    try {
      await spendingsStore.load()
    } catch (error) {
      message.error('Chyba při načítání dat')
      console.error('Load error:', error)
    }
  })
</script>

<template>
  <Header />
  <router-view />
</template>
