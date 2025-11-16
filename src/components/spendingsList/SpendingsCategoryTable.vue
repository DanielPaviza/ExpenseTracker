<script setup lang="ts">
import { NDataTable, NButton, NSpace } from 'naive-ui'
import type { DataTableInst } from 'naive-ui'
import { computed, ref, type Ref } from 'vue'
import { SpendingsColumns } from './SpendingsColumns'
import { Spending } from '@models/Spending'

const dataTableInst: Ref<DataTableInst | null> = ref(null)

function clearFilters() {
  dataTableInst.value?.clearFilters?.()
}

function clearSorter() {
  dataTableInst.value?.clearSorter?.()
}

const { category, spendings: unorderedSpendings } = defineProps<{
  category: string
  spendings: Spending[]
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
  <section class="my-8">
    <h2 class="text-blueLight text-2xl font-bold mb-2 text-left">{{ category }}</h2>
    <div class="overflow-x-auto">
      <n-space vertical :size="12">
        <n-space>
          <n-button @click="clearFilters"> Clear Filters </n-button>
          <n-button @click="clearSorter"> Clear Sorter </n-button>
        </n-space>
        <n-data-table :columns="SpendingsColumns" :data="spendings" bordered striped />
      </n-space>
    </div>
  </section>
</template>
