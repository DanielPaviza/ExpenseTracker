<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'
  import DeletedSpendingsTable from '@components/spendingsList/DeletedSpendingsTable.vue'
  import SpendingsDataTable from '@components/spendingsList/dataTable/SpendingsDataTable.vue'
  import { NSelect } from 'naive-ui'

  import { computed, ref, watch } from 'vue'

  import { useSpendingsColumns } from '@/composables/spending/useSpendingsColumns'
  import { useSpendingsViews } from '@/composables/spending/useSpendingsViews'
  import { DEFAULT_TABLE_GROUP_SORT } from '@/constants/defaultTableGroupSort'
  import { SpendingList, SpendingListKey } from '@/types/SpendingList'
  import { SortState, SortType } from '@/types/TableGroupSort'

  import TableGroupSort from './TableGroupSort.vue'

  const { columns: allColumns } = useSpendingsColumns()

  const { createViews } = useSpendingsViews() // stores and allTags used internally

  const VIEWS = computed<Record<SpendingListKey, SpendingList>>(() => createViews())

  const allInOneKey = 'allInOne' as SpendingListKey
  const currentViewKey = ref<SpendingListKey>(allInOneKey)
  const currentView = computed<SpendingList>(() => VIEWS.value[currentViewKey.value])
  const showGroupedData = computed(() => currentViewKey.value !== allInOneKey)

  const sortState = ref<SortState>(DEFAULT_TABLE_GROUP_SORT.sortState)
  const sortType = ref<SortType>(DEFAULT_TABLE_GROUP_SORT.sortType)

  const hideColumnSelectHeaders = computed(() => {
    return allColumns.value.map((col) => ({
      label: col.title,
      value: String(col.key),
    }))
  })

  const hiddenColumnKeys = ref<string[]>(
    allColumns.value.filter((col) => col.isHidden).map((col) => String(col.key)),
  )

  const columns = computed(() => {
    return allColumns.value.filter((col) => !hiddenColumnKeys.value.includes(String(col.key)))
  })

  const hideColumnsOnViewChange = (
    newView: SpendingList | undefined,
    oldView: SpendingList | undefined,
  ): void => {
    hiddenColumnKeys.value = [
      ...hiddenColumnKeys.value.filter((key) => !oldView?.hiddenColumnKeys.includes(key)),
      ...(newView?.hiddenColumnKeys || []),
    ]
  }

  watch(
    currentView,
    (newView, oldView) => {
      hideColumnsOnViewChange(newView, oldView)
    },
    { immediate: true },
  )
</script>
<template>
  <div class="mb-4 flex flex-wrap items-end justify-between gap-4">
    <ButtonNavigation v-model:selected-id="currentViewKey" :buttons="Object.values(VIEWS)" />
    <div class="flex flex-wrap items-end gap-3">
      <TableGroupSort
        v-if="currentView?.enableSorting"
        v-on="{
          'update:sortState': (value: SortState) => (sortState = value),
          'update:sortType': (value: SortType) => (sortType = value),
        }"
      />
      <div>
        <div class="mb-1 ms-1 text-xs font-medium text-fg-muted">
          {{ $t('table.hiddenColumns') }}
        </div>
        <n-select
          v-model:value="hiddenColumnKeys"
          class="hideColumnsSelect min-w-[220px] max-w-[520px]"
          :placeholder="$t('table.hiddenPlaceholder')"
          multiple
          max-tag-count="responsive"
          :options="hideColumnSelectHeaders"
          clearable
        />
      </div>
    </div>
  </div>

  <SpendingsDataTable
    :spendings="currentView?.spendings || []"
    :show-grouped-data="showGroupedData"
    :columns="columns"
    :table-group-sort-state="sortState"
    :table-group-sort-type="sortType"
    :current-view-key="currentViewKey"
  />

  <!-- Deleted Spendings Section -->
  <div class="mt-8">
    <DeletedSpendingsTable />
  </div>
</template>
