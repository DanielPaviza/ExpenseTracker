<script setup lang="ts">
  import { computed } from 'vue'

  import SpendingTableGroup from '@/components/spendingsList/SpendingTableGroup.vue'
  import TableFilterRow from '@/components/spendingsList/dataTable/shared/TableFilterRow.vue'
  import TableFooter from '@/components/spendingsList/dataTable/shared/TableFooter.vue'
  import TableHeader from '@/components/spendingsList/dataTable/shared/TableHeader.vue'
  import TableRow from '@/components/spendingsList/dataTable/shared/TableRow.vue'
  import { useTableFilter } from '@/composables/table/useTableFilter'
  import { useTableGrouping } from '@/composables/table/useTableGrouping'
  import { useTableSort } from '@/composables/table/useTableSort'
  import type { Spending } from '@/types/Spending'
  import { type SpendingColumn } from '@/types/SpendingColumn'
  import { SortState, SortType } from '@/types/TableGroupSort'
  import { calculateTotalPrice } from '@/utils/tableUtils'

  const {
    spendings,
    columns,
    showGroupedData,
    tableGroupSortState,
    tableGroupSortType,
    currentViewKey,
  } = defineProps<{
    spendings: Spending[]
    columns: SpendingColumn[]
    showGroupedData: boolean
    tableGroupSortState: SortState
    tableGroupSortType: SortType
    currentViewKey: string
  }>()

  // Use composables for filtering and sorting
  const { columnFilters, filteredData, columnFilterOptions } = useTableFilter(
    () => spendings,
    () => columns,
  )

  const {
    sortState: spendingSortState,
    sortedData: sortedSpendings,
    updateSort: updateSpendingSort,
  } = useTableSort(
    () => filteredData.value,
    () => columns,
  )
  const { groupedData } = useTableGrouping(
    () => sortedSpendings.value,
    () => tableGroupSortState,
    () => tableGroupSortType,
  )

  const totalCountSpendings = computed(() => filteredData.value.length)
  const totalPrice = computed(() => calculateTotalPrice(filteredData.value))

  function updateFilter(key: string, value: string): void {
    columnFilters.value[key] = value
  }
</script>

<template>
  <table class="border-collapse w-full">
    <TableHeader
      :columns="columns"
      :sort-state="spendingSortState"
      @update:sort="updateSpendingSort"
    />

    <TableFilterRow
      :columns="columns"
      :column-filters="columnFilters"
      :column-filter-options="columnFilterOptions"
      @update:filter="updateFilter"
    />

    <tbody>
      <template v-if="!showGroupedData">
        <TableRow
          v-for="(sortedItem, index) in sortedSpendings"
          :key="`sorted-${index}`"
          :row="sortedItem"
          :row-index="index"
          :columns="columns"
        />
      </template>
      <template v-else>
        <template v-for="group in groupedData" :key="`group-${group.tableGroup}`">
          <SpendingTableGroup
            :table-group-name="group.tableGroup"
            :items="group.items"
            :columns="columns"
            :current-view-key="currentViewKey"
          />
        </template>
      </template>
    </tbody>

    <TableFooter
      :total-count="totalCountSpendings"
      :total-price="totalPrice"
      :column-count="columns.length"
    />
  </table>
</template>

<style scoped>
  table {
    box-shadow:
      0 4px 6px -1px rgba(59, 130, 246, 0.1),
      0 2px 4px -1px rgba(59, 130, 246, 0.06);
  }

  :deep(.hideColumnsSelect .n-base-selection) {
    border: 1px solid rgba(59, 130, 246, 0.4);
  }
</style>
