<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'
  import DeletedSpendingsTable from '@components/spendingsList/DeletedSpendingsTable.vue'
  import SpendingsCategoryTable from '@components/spendingsList/SpendingsCategoryTable.vue'
  import SpendingsDataTable from '@components/spendingsList/dataTable/SpendingsDataTable.vue'
  import { NSelect } from 'naive-ui'

  import { computed, ref, watch } from 'vue'

  import { useSpendingsColumns } from '@/composables/spending/useSpendingsColumns'
  import { useSpendingsViews } from '@/composables/spending/useSpendingsViews'
  import { useViewSort } from '@/composables/useViewSort'
  import router from '@/router'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import { SpendingList, SpendingListKey } from '@/types/SpendingList'

  const spendingStore = useSpendingsStore()
  const { columns: allColumns } = useSpendingsColumns()

  // Use new composables for views and sorting
  const { nameSortState, priceSortState, toggleNameSort, togglePriceSort, getSortedCategories } =
    useViewSort()
  const { createViews } = useSpendingsViews() // stores and allTags used internally

  const VIEWS = computed<Record<SpendingListKey, SpendingList>>(() =>
    createViews(nameSortState.value, priceSortState.value),
  )

  const defaultViewKey = 'allInOne' as SpendingListKey
  const defaultView: SpendingList = VIEWS.value[defaultViewKey]
  const currentViewKey = ref<SpendingListKey>(defaultViewKey)
  const currentView = computed<SpendingList>(() => VIEWS.value[currentViewKey.value])

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

  const openSpendingBulkEdit = (value: string): void => {
    const getPath = () => {
      switch (currentViewKey.value) {
        case 'byCategories':
          return spendingStore.categoryView === null ? 'category' : 'subCategory'
        case 'byStores':
          return 'store'
        case 'byTags':
          return 'tag'
      }
    }

    if (currentViewKey.value === 'allInOne') return
    router.push(`/bulkEdit/${getPath()}/${encodeURIComponent(value)}`)
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
        <div v-if="currentView?.enableSorting">
          <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">
            {{ $t('table.sorting') }}
          </div>
          <div class="flex gap-2">
            <button
              class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
              :class="{
                'border-blue bg-blue text-white': nameSortState !== 'none',
                'border-gray-300 bg-white text-gray-700 hover:border-blue':
                  nameSortState === 'none',
              }"
              @click="toggleNameSort"
            >
              ABC
              <span v-if="nameSortState === 'asc'"> ↑</span>
              <span v-if="nameSortState === 'desc'"> ↓</span>
            </button>
            <button
              class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
              :class="{
                'border-blue bg-blue text-white': priceSortState !== 'none',
                'border-gray-300 bg-white text-gray-700 hover:border-blue':
                  priceSortState === 'none',
              }"
              @click="togglePriceSort"
            >
              {{ $t('table.price') }}
              <span v-if="priceSortState === 'asc'"> ↑</span>
              <span v-if="priceSortState === 'desc'"> ↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="currentView.categories?.length > 0" class="pb-10">
    <SpendingsCategoryTable
      v-for="category in getSortedCategories(currentView.categories || [], currentView)"
      :key="category"
      :category="category"
      :spendings="currentView.getSpendings(category)"
      :columns="columns"
      :is-collapsed-default="currentView.id != defaultView.id"
    >
      <template #default="{ data, title, columns: cols, isCollapsedDefault: collapsed }">
        <SpendingsDataTable
          :data="data"
          :columns="cols"
          :title="title"
          :is-collapsed-default="collapsed"
          :can-open-settings="currentView.id !== defaultView.id"
          @open-settings="openSpendingBulkEdit(title)"
        />
      </template>
    </SpendingsCategoryTable>
  </div>

  <div v-else class="text-center text-blue py-8 text-xl">
    {{ $t('common.noRecordsFound') }}
  </div>

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
