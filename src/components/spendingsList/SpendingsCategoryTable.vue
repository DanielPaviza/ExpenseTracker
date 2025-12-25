<script setup lang="ts">
  import { computed } from 'vue'

  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { sortSpendingsByDefault } from '@/utils/tableUtils'

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
  const spendings = computed(() => sortSpendingsByDefault(unorderedSpendings))
</script>

<template>
  <div class="overflow-x-auto my-8">
    <slot
      :data="spendings"
      :title="category"
      :columns="columns"
      :is-collapsed-default="isCollapsedDefault"
    />
  </div>
</template>
