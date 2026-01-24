<script setup lang="ts">
  import Loading from '@components/home/Loading.vue'
  import SpendingsDashboard from '@components/home/spendingsDashboard/Dashboard.vue'
  import SpendingsList from '@components/home/spendingsList/SpendingsList.vue'
  import MarginContainer from '@components/shared/MarginContainer.vue'
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
