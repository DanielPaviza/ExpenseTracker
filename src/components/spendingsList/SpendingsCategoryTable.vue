<script setup lang="ts">
  import SpendingsDataTable from '@components/spendingsList/SpendingsDataTable.vue'
  import { Spending } from '@models/Spending'

  import { computed } from 'vue'

  const {
    category,
    spendings: unorderedSpendings,
    hideCategoryColumn = false,
  } = defineProps<{
    category: string
    spendings: Spending[]
    hideCategoryColumn?: boolean
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
      :hideCategoryColumn="hideCategoryColumn"
      :title="category"
    />
  </div>
</template>
