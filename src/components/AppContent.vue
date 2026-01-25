<script setup lang="ts">
  import Header from '@components/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'

  import { onMounted } from 'vue'

  import Loading from '@/components/shared/Loading.vue'
  import { useSettingsStore } from '@/stores/settingsStore'

  const spendingsStore = useSpendingsStore()
  const settingsStore = useSettingsStore()

  onMounted(async () => {
    await spendingsStore.load()
    await settingsStore.load()
  })
</script>

<template>
  <Loading v-if="spendingsStore.isLoading || settingsStore.isLoading" />
  <template v-else>
    <Header />
    <router-view />
  </template>
</template>
