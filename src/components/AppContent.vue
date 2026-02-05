<script setup lang="ts">
  import Header from '@components/header/Header.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'

  import { computed, onMounted } from 'vue'

  import Loading from '@/components/shared/Loading.vue'
  import { useSettingsStore } from '@/stores/settingsStore'

  const spendingsStore = useSpendingsStore()
  const settingsStore = useSettingsStore()

  onMounted(async () => {
    await spendingsStore.load()
    await settingsStore.load()
  })

  const isLoading = computed(() => {
    return spendingsStore.isLoading || settingsStore.isLoading
  })
</script>

<template>
  <Loading v-if="isLoading" />
  <template v-else>
    <Header />
    <router-view />
  </template>
</template>
