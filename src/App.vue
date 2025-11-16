<script setup lang="ts">
import { onMounted } from 'vue'
import SpendingsDashboard from '@components/SpendingsDashboard/Dashboard.vue'
import { useSpendingsStore } from '@stores/spendingsStore'
import Header from '@components/Header.vue'

import SpendingsList from '@components/spendingsList/SpendingsList.vue'
import Loading from '@components/Loading.vue'

const spendingsStore = useSpendingsStore()

onMounted(async () => {
  await spendingsStore.load()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-8">
      <Header />
      <Loading v-if="spendingsStore.isLoading" />
      <template v-else>
        <SpendingsDashboard />
        <SpendingsList />
      </template>
    </div>
  </div>
</template>
