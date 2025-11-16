<script setup lang="ts">
import PriceSummary from '@components/SpendingsDashboard/PriceSummary.vue'
import UnpaidSummary from '@components/SpendingsDashboard/UnpaidSummary.vue'
</script>
<template>
  <div class="flex flex-wrap justify-between">
    <PriceSummary />
    <UnpaidSummary />
  </div>
</template>
