<script setup lang="ts">
import type { Spending } from '@models/Spending'
import PriceSummary from '@components/SpendingsDashboard/PriceSummary.vue'

const { spendings } = defineProps<{
  spendings: Spending[]
}>()

</script>
<template>
  <PriceSummary :spendings="spendings" />
</template>
