<script setup lang="ts">
  import MarginContainer from '@components/shared/MarginContainer.vue'
  import SpendingsDashboard from '@components/spendingsDashboard/Dashboard.vue'
  import SpendingsList from '@components/spendingsList/SpendingsList.vue'
</script>

<template>
  <MarginContainer>
    <SpendingsDashboard />
    <hr class="mt-8 mb-6 border-blueLight/40" />
    <SpendingsList />
  </MarginContainer>
  <router-view />
</template>
