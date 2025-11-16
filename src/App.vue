<script setup lang="ts">
import { onMounted } from 'vue'
import SpendingsDashboard from '@components/SpendingsDashboard/Dashboard.vue'
import { useSpendingsStore } from '@stores/spendingsStore'
import SpendingsList from '@components/spendingsList/SpendingsList.vue'

const spendingsStore = useSpendingsStore()

onMounted(async () => {
  await spendingsStore.load()
})
</script>

<template>
  <header class="mb-8 text-center">
    <h1 class="text-4xl font-extrabold tracking-tight text-blue-700">Evidence nákupů</h1>
  </header>
  <SpendingsDashboard :spendings="spendingsStore.spendings" />
  <SpendingsList :spendings="spendingsStore.spendings" />
</template>
