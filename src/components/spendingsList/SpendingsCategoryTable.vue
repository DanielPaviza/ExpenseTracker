<script setup lang="ts">
  import SpendingsDataTable from '@components/spendingsList/SpendingsDataTable.vue'

  import { computed } from 'vue'

  import { Spending } from '@/types/Spending'
  import { SpendingColumn } from '@/types/SpendingColumn'

  const {
    category,
    spendings: unorderedSpendings,
    columns,
    isCollapsedDefault = false,
  } = defineProps<{
    category: string
    spendings: Spending[]
    columns: SpendingColumn[]
    isCollapsedDefault?: boolean
  }>()

  // Default order by category and createdAt
  const spendings = computed(() => {
    return [...unorderedSpendings].sort((a, b) => {
      if (a.category === b.category) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return a.category.localeCompare(b.category)
    })
  })
</script>

<template>
  <div class="overflow-x-auto my-8">
    <SpendingsDataTable
      :data="spendings"
      :columns="columns"
      :title="category"
      :is-collapsed-default="isCollapsedDefault"
    />
  </div>
</template>
