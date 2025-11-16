<script setup lang="ts">
import SpendingsCategoryTable from '@components/spendingsList/SpendingsCategoryTable.vue'
import { useSpendingsStore } from '@stores/spendingsStore'

const spendingsStore = useSpendingsStore()
</script>
<template>
  <SpendingsCategoryTable category="Test kategorie" :spendings="spendingsStore.spendings" />
</template>
