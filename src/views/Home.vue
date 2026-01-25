<script setup lang="ts">
  import SpendingsDashboard from '@components/home/spendingsDashboard/Dashboard.vue'
  import SpendingsList from '@components/home/spendingsList/SpendingsList.vue'
  import MarginContainer from '@components/shared/MarginContainer.vue'
</script>

<template>
  <MarginContainer>
    <SpendingsDashboard />
    <SpendingsList />
  </MarginContainer>
  <router-view />
</template>
