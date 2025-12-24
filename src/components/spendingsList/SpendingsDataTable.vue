<script setup lang="ts">
  import Tooltip from '@components/Tooltip.vue'
  import SortIndicator from '@components/spendingsList/SortIndicator.vue'
  import SpendingStatusIndicator from '@components/spendingsList/SpendingStatusIndicator.vue'
  import SubCategoryGroup from '@components/spendingsList/SubCategoryGroup.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import {
    scrollFadeOnBeforeEnter,
    scrollFadeOnBeforeLeave,
    scrollFadeOnEnter,
    scrollFadeOnLeave,
  } from '@utils/animations'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import {
    ArrowDownOutline,
    ArrowUpOutline,
    BuildOutline,
    CloseCircleOutline,
    Copy,
    ListOutline,
    RemoveCircleOutline,
  } from '@vicons/ionicons5'
  import { NButton, NDropdown, NIcon, NInput, NSelect, useDialog, useMessage } from 'naive-ui'

  import { h } from 'vue'
  import type { Component } from 'vue'
  import { type VNode, computed, onBeforeUpdate, ref } from 'vue'
  import type { ComponentPublicInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import type { Spending } from '@/types/Spending'
  import { type SpendingColumn } from '@/types/SpendingColumn'

  const { t } = useI18n()
  type SortIndicatorInstance = ComponentPublicInstance<{ toggleSort: () => void }>
  const sortIndicatorRefs = ref<(SortIndicatorInstance | null)[]>([])
  function setSortIndicatorRef(idx: number, el: Element | ComponentPublicInstance | null) {
    // Only store the component instance, not DOM elements
    if (el && typeof (el as any).toggleSort === 'function') {
      sortIndicatorRefs.value[idx] = el as SortIndicatorInstance
    } else if (el === null) {
      sortIndicatorRefs.value[idx] = null
    }
  }
  onBeforeUpdate(() => {
    sortIndicatorRefs.value = []
  })

  const router = useRouter()
  const store = useSpendingsStore()
  const dialog = useDialog()
  const message = useMessage()

  const {
    data,
    hideCategoryColumn = false,
    title = '',
    columns,
    isCollapsedDefault = false,
  } = defineProps<{
    data: Spending[]
    hideCategoryColumn?: boolean
    title?: string
    columns: SpendingColumn[]
    isCollapsedDefault?: boolean
  }>()

  function renderIcon(icon: Component, color: string) {
    return () => {
      return h(
        NIcon,
        { color },
        {
          default: () => h(icon),
        },
      )
    }
  }

  const rowActionOptions = [
    {
      label: t('actions.delete'),
      key: 'deleteSpending',
      icon: renderIcon(RemoveCircleOutline, 'red'),
    },
    {
      label: t('actions.copy'),
      key: 'copySpending',
      icon: renderIcon(Copy, 'green'),
    },
    {
      label: t('actions.edit'),
      key: 'editSpending',
      icon: renderIcon(BuildOutline, 'orange'),
    },
  ]

  const handleActionRowSelect = (row: Spending, action: string) => {
    if (action === 'deleteSpending') {
      handleDelete(row, null)
    } else if (action === 'copySpending') {
      handleGotoCopyNewSpending(row)
    } else if (action === 'editSpending') {
      handleGotoEditSpending(row)
    }
  }

  const isCollapsed = ref(isCollapsedDefault)

  const totalCountSpendings = computed(() => sortedData.value.length)

  // Sorting state
  const sortState = ref<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  })

  // Filtering state - one filter per column
  const columnFilters = ref<Record<string, string>>({})

  // Filtering logic - applies all active filters
  const filteredData = computed(() => {
    let result = data

    // Apply each column filter
    for (const [columnKey, filterValue] of Object.entries(columnFilters.value)) {
      if (!filterValue || filterValue.trim() === '') continue

      const filterLower = filterValue.toLowerCase().trim()
      const column = columns.find((c) => c.key === columnKey)
      if (!column) continue

      result = result.filter((row) => {
        // Use the column's filterVal function to get the filterable value
        const cellValue = column.filterVal(row)

        // Case-insensitive substring matching
        return cellValue.toLowerCase().includes(filterLower)
      })
    }

    return result
  })

  const sortedData = computed(() => {
    if (!sortState.value.key || !sortState.value.direction) return filteredData.value
    const col = columns.find((c) => c.key === sortState.value.key && c.sortFn)
    if (!col || !col.sortFn) return filteredData.value
    const sorted = [...filteredData.value].sort(col.sortFn)
    if (sortState.value.direction === 'desc') sorted.reverse()
    return sorted
  })

  // Group data by subCategory
  interface GroupedData {
    type: 'group' | 'item'
    subCategory?: string
    items?: Spending[]
    item?: Spending
  }

  const groupedData = computed<GroupedData[]>(() => {
    const result: GroupedData[] = []
    const subCategoryMap = new Map<string, Spending[]>()
    const itemsWithoutSubCategory: Spending[] = []

    // Group items by subCategory
    for (const item of sortedData.value) {
      if (item.subCategory && item.subCategory.trim() !== '') {
        const subCat = item.subCategory
        if (!subCategoryMap.has(subCat)) {
          subCategoryMap.set(subCat, [])
        }
        subCategoryMap.get(subCat)!.push(item)
      } else {
        itemsWithoutSubCategory.push(item)
      }
    }

    // Add items without subCategory first
    for (const item of itemsWithoutSubCategory) {
      result.push({ type: 'item', item })
    }

    // Add grouped items (only group if more than 1 item)
    for (const [subCategory, items] of subCategoryMap.entries()) {
      if (items.length === 1) {
        // Single item - render as regular row
        result.push({ type: 'item', item: items[0] })
      } else {
        // Multiple items - render as collapsible group
        result.push({ type: 'group', subCategory, items })
      }
    }

    return result
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null) {
    if (direction === null) sortState.value = { key: null, direction: null }
    else sortState.value = { key, direction }
  }

  // Build initial hidden columns list from defaults
  const initialHiddenColumns = columns.filter((col) => col.isHidden).map((col) => col.key as string)

  if (hideCategoryColumn) {
    // Add 'category' to the list if not already there
    if (!initialHiddenColumns.includes('category')) {
      initialHiddenColumns.push('category')
    }
  }

  const totalPrice = computed(() => {
    const totalPrice = (sortedData: Spending[]) => {
      return sortedData.reduce((sum, spending) => sum + spending.totalPrice, 0)
    }

    if (sortedData.value.every((s) => s.isFree)) {
      return totalPrice(sortedData.value)
    }

    return totalPrice(sortedData.value.filter((s) => !s.isFree))
  })

  const getCellContent = (
    column: SpendingColumn,
    row: Spending,
    rowIndex: number,
  ): string | VNode => {
    if (column.render) {
      const result = column.render(row, rowIndex)
      if (typeof result === 'object' && result !== null && '__v_isVNode' in result) {
        return result as VNode
      }
      return String(result)
    }
    const value = row[column.key as keyof Spending]
    return value != null ? String(value) : '-'
  }

  const hasActiveFiltersOrSorting = computed(() => {
    return (
      sortState.value.key !== null ||
      Object.values(columnFilters.value).some((val) => val.trim() !== '')
    )
  })

  const clearAllFiltersAndSorting = () => {
    // Clear all filters
    columnFilters.value = {}
    // Clear sorting
    sortState.value = { key: null, direction: null }
  }

  // Generate filter options for each column based on unique values in the data
  const columnFilterOptions = computed(() => {
    const options: Record<string, Array<{ label: string; value: string }>> = {}

    for (const column of columns) {
      const uniqueValues = new Set<string>()

      for (const row of data) {
        const value = column.filterVal(row)
        if (value && value.trim() !== '') {
          uniqueValues.add(value)
        }
      }

      options[String(column.key)] = Array.from(uniqueValues)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ label: value, value }))
    }

    return options
  })

  function handleRowClick(row: Spending, event?: MouseEvent) {
    // Don't navigate if clicking on the delete button or a link
    if (event && (event.target as HTMLElement).closest('.delete-button, .spending-link')) {
      return
    }
    handleGotoEditSpending(row)
  }

  function handleGotoEditSpending(row: Spending) {
    router.push(`/edit/${row.id}`)
  }

  function handleGotoCopyNewSpending(row: Spending) {
    router.push({ path: '/new', query: { template: row.id } })
  }

  function handleDelete(row: Spending, event: Event | null) {
    event?.stopPropagation()

    dialog.warning({
      title: t('dialogs.deletePurchaseTitle'),
      content: t('dialogs.deletePurchaseContent', { name: row.name }),
      positiveText: t('dialogs.delete'),
      negativeText: t('dialogs.cancel'),
      onPositiveClick: async () => {
        await store.removeSpending(row.id)
        message.success(t('messages.purchaseDeletedSuccessfully'))
      },
    })
  }

  function getSpendingStatus(id: string): 'new' | 'edited' | null {
    if (store.newSpendingIds.has(id)) return 'new'
    if (store.editedSpendingIds.has(id)) return 'edited'
    return null
  }
</script>

<template>
  <Transition
    name="scroll-fade-table"
    @before-enter="scrollFadeOnBeforeEnter"
    @enter="scrollFadeOnEnter"
    @before-leave="scrollFadeOnBeforeLeave"
    @leave="scrollFadeOnLeave"
  >
    <div v-if="!isCollapsed" key="expanded" class="overflow-x-auto">
      <div class="flex justify-between items-center">
        <div class="flex items-end w-full py-2">
          <n-icon size="32" class="collapseArrow" color="#3b82f6">
            <ArrowUpOutline />
          </n-icon>
          <n-icon size="32" class="listIcon" color="#3b82f6">
            <ListOutline />
          </n-icon>
          <h2 class="text-blue text-2xl me-4 ms-2 font-bold text-left">{{ title }}</h2>
          <div
            class="flex text-[15px] font-bold items-center gap-1 cursor-pointer text-black opacity-60 border-primaryDark border-b hover:text-blue hover:border-blue"
            @click="isCollapsed = !isCollapsed"
          >
            {{ $t('table.collapseTable') }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="me-3 flex items-center">
            <n-button
              v-if="hasActiveFiltersOrSorting"
              @click.stop="clearAllFiltersAndSorting"
              size="tiny"
              color="#3b82f6"
            >
              <template #icon>
                <n-icon>
                  <CloseCircleOutline />
                </n-icon>
              </template>
              {{ $t('table.clearFiltersAndSorting') }}
            </n-button>
          </div>
        </div>
      </div>
      <table class="border-collapse w-full">
        <thead class="">
          <tr class="bg-blue-300 text-[15px]">
            <th
              v-for="(column, colIdx) in columns"
              :key="String(column.key)"
              class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-blue-500 hover:text-white"
              :class="{ 'bg-blue-400': sortState.key === column.key }"
              @click="column.sortFn && sortIndicatorRefs[colIdx]?.toggleSort()"
            >
              <span class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="text-white">{{ column.title }}</span>
                  <Tooltip v-if="!!column.tooltip" :text="column.tooltip" color="white" />
                </div>

                <SortIndicator
                  v-if="column.sortFn"
                  :ref="(el) => setSortIndicatorRef(colIdx, el)"
                  :active="sortState.key === column.key"
                  :direction="sortState.key === column.key ? sortState.direction : null"
                  @update:direction="(dir) => updateSort(String(column.key), dir)"
                />
              </span>
            </th>
            <th></th>
          </tr>
          <tr class="bg-white">
            <th v-for="column in columns" :key="`filter-${String(column.key)}`">
              <div v-if="column.filterEnabled" class="px-2 py-1">
                <n-select
                  v-if="column.selectFilterEnabled"
                  :value="columnFilters[String(column.key)] || null"
                  @update:value="(val) => (columnFilters[String(column.key)] = val || '')"
                  :options="columnFilterOptions[String(column.key)] || []"
                  :placeholder="$t('table.filterPlaceholder')"
                  filterable
                  tag
                  clearable
                  :class="{ 'border border-blue-300': columnFilters[String(column.key)] }"
                />
                <n-input
                  v-else
                  :value="columnFilters[String(column.key)] || ''"
                  @update:value="(val) => (columnFilters[String(column.key)] = val || '')"
                  :placeholder="$t('table.filterPlaceholder')"
                  clearable
                  :class="{ 'border border-blue-300': columnFilters[String(column.key)] }"
                />
              </div>
            </th>
            <th class="mx-2"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, groupIndex) in groupedData" :key="`group-${groupIndex}`">
            <!-- Regular item without subCategory -->
            <tr
              v-if="group.type === 'item' && group.item"
              :key="group.item.id"
              class="bg-white hover:bg-blue-50 cursor-pointer"
              style="position: relative"
              @click="handleRowClick(group.item, $event)"
            >
              <td
                v-for="column in columns"
                :key="`${group.item.id}-${String(column.key)}`"
                class="border-b border-blue-200 px-4 py-2"
              >
                <template v-if="typeof getCellContent(column, group.item, groupIndex) === 'object'">
                  <component :is="getCellContent(column, group.item, groupIndex)" />
                </template>
                <template v-else>
                  {{ getCellContent(column, group.item, groupIndex) }}
                </template>
                <SpendingStatusIndicator :status="getSpendingStatus(group.item.id)" />
              </td>
              <td class="px-2 border-b border-blue-200">
                <div class="opacity-75 hover:opacity-100 mb-1">
                  <n-dropdown
                    :options="rowActionOptions"
                    @select="handleActionRowSelect(group.item, $event)"
                  >
                    <n-button @click.stop>
                      <div class="flex flex-col items-center justify-center font-bold text-[16px]">
                        <span class="h-2 -mt-4">.</span>
                        <span class="h-2">.</span>
                        <span class="h-2">.</span>
                      </div>
                    </n-button>
                  </n-dropdown>
                </div>
              </td>
            </tr>

            <!-- SubCategory group -->
            <SubCategoryGroup
              v-else-if="group.type === 'group' && group.subCategory && group.items"
              :subCategory="group.subCategory"
              :items="group.items"
              :columns="columns"
            />
          </template>
        </tbody>
        <tfoot class="border-blue border-t">
          <tr class="bg-blue-100 font-bold text-lg">
            <td class="px-4 py-2 text-blue">
              {{ $t('table.total') }} ({{ totalCountSpendings }}):
            </td>
            <td v-for="_v in columns.length - 2"></td>
            <td class="text-blue ps-3">
              {{ formatNumberToCzk(totalPrice) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div
      v-else
      key="collapsed"
      class="collapsedRow bg-blue-300 shadow text-white cursor-pointer w-full p-3 flex items-center justify-between rounded hover:bg-blue-500"
      @click="isCollapsed = !isCollapsed"
    >
      <div class="flex items-center gap-4">
        <n-icon class="listIcon" size="32">
          <ListOutline />
        </n-icon>
        <n-icon class="unCollapseIcon" size="32">
          <ArrowDownOutline />
        </n-icon>
        <h2 class="text-xl font-bold text-left">{{ title }}</h2>
      </div>
      <div class="text-xl font-bold text-white">
        {{ formatNumberToCzk(totalPrice) }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .collapseArrow {
    display: none;
    transition: transform 0.3s ease;
  }
  .collapseRow:hover .collapseArrow {
    /* transform: rotate(180deg); */
    display: flex;
  }
  .collapseRow:hover .listIcon {
    display: none;
  }
  table {
    box-shadow:
      0 4px 6px -1px rgba(59, 130, 246, 0.1),
      0 2px 4px -1px rgba(59, 130, 246, 0.06);
  }
  thead tr:first-child th .sortIndicator {
    color: #3b82f6;
  }
  thead tr:first-child th:hover .sortIndicator {
    color: white;
  }
  thead tr:first-child th:first-child {
    border-radius: 6px 0 0 0;
  }
  thead tr:first-child th:last-child {
    border-radius: 0 6px 0 0;
  }
  tfoot tr:last-child td:first-child {
    border-radius: 0 0 0 6px;
  }
  tfoot tr:last-child td:last-child {
    border-radius: 0 0 8px 0;
  }
  .scroll-fade-table-enter-active,
  .scroll-fade-table-leave-active {
    overflow: hidden;
  }
  th:hover .sortIndicator {
    stroke: #3b82f6; /* blue-500 */
  }
  .collapseRow:hover h2,
  .collapseRow:hover div {
    color: #3b82f6 !important;
  }
  .collapsedRow:hover .listIcon {
    display: none;
  }
  .collapsedRow:hover .unCollapseIcon {
    display: inline;
  }
  .unCollapseIcon {
    display: none;
  }
  :deep(.hideColumnsSelect .n-base-selection) {
    border: 1px solid rgba(59, 130, 246, 0.4);
  }
</style>
