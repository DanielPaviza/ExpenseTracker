<script setup lang="ts">
import { computed } from 'vue';
import type { Spending } from '../models/Spending';
import DashboardHeader from './DashboardHeader.vue';
import PriceSummary from './PriceSummary.vue';
import SpendingsTable from './SpendingsTable.vue';

const { spendings } = defineProps<{ 
    spendings: Spending[] 
}>();

const categories = computed(() => {
  const cats = new Set<string>();
  for (const s of spendings) cats.add(s.Category);
  return Array.from(cats);
});
</script>
<template>
  <DashboardHeader />
  <PriceSummary :spendings="spendings" />
  <div v-for="cat in categories" :key="cat">
    <SpendingsTable :category="cat" :spendings="spendings.filter(s => s.Category === cat)" />
  </div>
</template>
