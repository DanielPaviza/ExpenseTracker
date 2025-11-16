<script setup lang="ts">
import { onMounted } from 'vue'
import SpendingsDashboard from '@components/SpendingsDashboard/Dashboard.vue'
import { useSpendingsStore } from '@stores/spendingsStore'

import SpendingsList from '@components/spendingsList/SpendingsList.vue'
import Loading from '@components/Loading.vue'

const spendingsStore = useSpendingsStore()

onMounted(async () => {
  await spendingsStore.load()
})
</script>

<template>
  <header class="mb-8 text-center">
    <h1 class="text-4xl font-extrabold tracking-tight text-blue-700">Evidence nákupů</h1>
  </header>
  <!-- Tailwind test element: should be red with white text and padding -->
  <div class="bg-red-500 text-white p-4 mb-4 text-center rounded">
    Tailwind test: This should be red with white text.
  </div>
  <Loading v-if="spendingsStore.isLoading" />
  <template v-else>
    <SpendingsDashboard />
    <SpendingsList />
  </template>
</template>
