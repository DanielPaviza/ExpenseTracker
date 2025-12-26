<script setup lang="ts">
  import Loading from '@components/Loading.vue'
  import MarginContainer from '@components/MarginContainer.vue'
  import SpendingsDashboard from '@components/spendingsDashboard/Dashboard.vue'
  import SpendingsList from '@components/spendingsList/SpendingsList.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'

  const spendingsStore = useSpendingsStore()
</script>

<template>
  <MarginContainer>
    <Loading v-if="spendingsStore.isLoading" />
    <template v-else>
      <SpendingsDashboard />
      <SpendingsList />
    </template>
  </MarginContainer>
  <router-view />
</template>
