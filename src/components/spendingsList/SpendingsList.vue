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
  <div>
    <h2 class="font-bold text-2xl text-blue mb-2">
      {{ $t('table.viewTitle') }}
    </h2>

    <div class="flex items-end justify-between mb-4">
      <ButtonNavigation v-model:selected-id="currentViewKey" :buttons="Object.values(VIEWS)" />
      <div class="flex items-end gap-2">
        <div class="">
          <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">
            {{ $t('table.hiddenColumns') }}
          </div>
          <n-select
            v-model:value="hiddenColumnKeys"
            class="min-w-[140px] hideColumnsSelect"
            :placeholder="$t('table.hiddenPlaceholder')"
            multiple
            :options="hideColumnSelectHeaders"
            clearable
          />
        </div>
        <TableGroupSort
          v-if="currentView?.enableSorting"
          v-on="{
            'update:sortState': (value: SortState) => (sortState = value),
            'update:sortType': (value: SortType) => (sortType = value),
          }"
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
  <div class="my-8">
    <DeletedSpendingsTable />
  </div>
</template>
<style scoped>
  :deep(.hideColumnsSelect .n-base-selection > div) {
    padding-top: 6px;
    padding-bottom: 4px;
  }
</style>
