<script setup lang="ts">
import type { Spending } from '@models/Spending'
import SpendingsCategoryTable from './SpendingsCategoryTable.vue';

const { spendings } = defineProps<{
  spendings: Spending[]
}>()
</script>
<template>
  <SpendingsCategoryTable category="Test" :spendings="spendings" />
</template>
