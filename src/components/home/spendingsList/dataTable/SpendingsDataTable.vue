<script setup lang="ts">
  import { NCollapseTransition } from 'naive-ui'

  import { computed, ref } from 'vue'

  import TableGroup from '@/components/home/spendingsList/TableGroup.vue'
  import CollapsedTableView from '@/components/home/spendingsList/dataTable/shared/CollapsedTableView.vue'
  import TableFilterRow from '@/components/home/spendingsList/dataTable/shared/TableFilterRow.vue'
  import TableFooter from '@/components/home/spendingsList/dataTable/shared/TableFooter.vue'
  import TableHeader from '@/components/home/spendingsList/dataTable/shared/TableHeader.vue'
  import TableRow from '@/components/home/spendingsList/dataTable/shared/TableRow.vue'
  import TableToolbar from '@/components/home/spendingsList/dataTable/shared/TableToolbar.vue'
  import { useTableFilter } from '@/composables/useTableFilter'
  import { useTableGrouping } from '@/composables/useTableGrouping'
  import { useTableSort } from '@/composables/useTableSort'
  import type { Spending } from '@/types/Spending'
  import { type SpendingColumn } from '@/types/SpendingColumn'
  import { calculateTotalPrice } from '@/utils/tableUtils'

  const {
    data,
    title = '',
    columns,
    isCollapsedDefault = false,
  } = defineProps<{
    data: Spending[]
    title?: string
    columns: SpendingColumn[]
    isCollapsedDefault?: boolean
  }>()

  const isCollapsed = ref(isCollapsedDefault)

  // Use composables for filtering and sorting
  const { columnFilters, filteredData, columnFilterOptions, hasActiveFilters, clearFilters } =
    useTableFilter(
      () => data,
      () => columns,
    )

  const { sortState, sortedData, updateSort, clearSort } = useTableSort(
    () => filteredData.value,
    () => columns,
  )

  const { groupedData } = useTableGrouping(() => sortedData.value)

  const totalCountSpendings = computed(() => sortedData.value.length)
  const totalPrice = computed(() => calculateTotalPrice(sortedData.value))

  const hasActiveFiltersOrSorting = computed(() => {
    return sortState.value.key !== null || hasActiveFilters.value
  })

  function clearAllFiltersAndSorting(): void {
    clearFilters()
    clearSort()
  }

  function toggleCollapse(): void {
    isCollapsed.value = !isCollapsed.value
  }

  function updateFilter(key: string, value: string): void {
    columnFilters.value[key] = value
  }
</script>

<template>
  <CollapsedTableView
    v-if="isCollapsed"
    key="collapsed"
    :title="title"
    :total-price="totalPrice"
    @toggle-collapse="toggleCollapse"
  />
  <n-collapse-transition :show="!isCollapsed">
    <TableToolbar
      :title="title"
      :is-collapsed="isCollapsed"
      :has-active-filters-or-sorting="hasActiveFiltersOrSorting"
      @toggle-collapse="toggleCollapse"
      @clear-filters="clearAllFiltersAndSorting"
    />

    <table class="border-collapse w-full">
      <TableHeader :columns="columns" :sort-state="sortState" @update:sort="updateSort" />

      <TableFilterRow
        :columns="columns"
        :column-filters="columnFilters"
        :column-filter-options="columnFilterOptions"
        @update:filter="updateFilter"
      />

      <tbody>
        <template v-for="(group, groupIndex) in groupedData" :key="`group-${groupIndex}`">
          <!-- Regular item without tableGroup -->
          <template v-if="group.type === 'item' && group.item">
            <TableRow :row="group.item" :row-index="groupIndex" :columns="columns" />
          </template>

          <!-- TableGroup group -->
          <TableGroup
            v-else-if="group.type === 'group' && group.tableGroup && group.items"
            :table-group="group.tableGroup"
            :items="group.items"
            :columns="columns"
            :is-shown-default="group.items.length === data.length"
          />
        </template>
      </tbody>

      <TableFooter
        :total-count="totalCountSpendings"
        :total-price="totalPrice"
        :column-count="columns.length"
      />
    </table>
  </n-collapse-transition>
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
