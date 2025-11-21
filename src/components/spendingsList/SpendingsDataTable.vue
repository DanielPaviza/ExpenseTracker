<script setup lang="ts">
  import SortIndicator from '@components/spendingsList/SortIndicator.vue'
  import { type SpendingColumn, SpendingsColumns } from '@components/spendingsList/SpendingsColumns'
  import type { Spending } from '@models/Spending'
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
    CloseCircleOutline,
    ListOutline,
  } from '@vicons/ionicons5'
  import { NButton, NIcon, NSelect } from 'naive-ui'

  import { type VNode, computed, onBeforeUpdate, ref } from 'vue'
  // For triggering SortIndicator's toggleSort from th click
  import type { ComponentPublicInstance } from 'vue'
  import { useRouter } from 'vue-router'

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

  const {
    data,
    hideCategoryColumn = false,
    title = '',
    showHideColumnsSelector = false,
  } = defineProps<{
    data: Spending[]
    hideCategoryColumn?: boolean
    title?: string
    showHideColumnsSelector?: boolean
  }>()

  const isCollapsed = ref(false)

  const columns = ref<SpendingColumn[]>(SpendingsColumns)
  const filteredColumns = computed(() => {
    return columns.value.filter((col) => !col.isHidden)
  })

  const totalCountSpendings = computed(() => data.length)

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
      const column = columns.value.find((c) => c.key === columnKey)
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
    const col = columns.value.find((c) => c.key === sortState.value.key && c.sortFn)
    if (!col || !col.sortFn) return filteredData.value
    const sorted = [...filteredData.value].sort(col.sortFn)
    if (sortState.value.direction === 'desc') sorted.reverse()
    return sorted
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null) {
    if (direction === null) sortState.value = { key: null, direction: null }
    else sortState.value = { key, direction }
  }
  const hiddenColumnKeys = computed(() => {
    return columns.value.filter((col) => col.isHidden).map((col) => col.key)
  })

  const columnHeaders = columns.value.map((col) => {
    if (filteredColumns.value.length === 1 && !col.isHidden) {
      return { label: col.title, value: col.key, disabled: true }
    }
    return { label: col.title, value: col.key }
  })

  const updateColumnsVisibility = (keys: string[]) => {
    for (const column of columns.value) {
      column.isHidden = keys.includes(column.key)
    }
  }

  if (hideCategoryColumn) {
    updateColumnsVisibility(['category'])
  } else {
    updateColumnsVisibility([])
  }

  const totalPrice = computed(() => {
    return sortedData.value
      .filter((spending) => !spending.isFree && !spending.isToBePaid)
      .reduce((sum, spending) => {
        return sum + spending.totalPrice
      }, 0)
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

  function handleRowClick(row: Spending) {
    router.push(`/edit/${row.id}`)
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
        <div
          class="flex items-end w-full hover:text-blue cursor-pointer collapseRow hover:bg-blue-100 rounded py-2"
          @click="isCollapsed = !isCollapsed"
        >
          <n-icon size="32" class="collapseArrow" color="#3b82f6">
            <ArrowUpOutline />
          </n-icon>
          <n-icon size="32" class="listIcon" color="#3b82f6">
            <ListOutline />
          </n-icon>
          <h2 class="text-blue text-2xl me-4 ms-2 font-bold text-left">{{ title }}</h2>
          <div
            class="flex text-[15px] font-bold items-center gap-1 cursor-pointer text-black opacity-60 border-primaryDark border-b hover:text-blue hover:border-blue"
          >
            Zabalit tabulku
          </div>
        </div>
        <div class="flex items-center">
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
            Vymazat filtry a řazení
          </n-button>
          <div v-if="showHideColumnsSelector" class="flex max-w-[30%] min-w-[200px] items-center">
            <n-select
              class="min-w-[200px]"
              :value="hiddenColumnKeys"
              @update:value="updateColumnsVisibility"
              multiple
              :options="columnHeaders"
            />
            <div class="text-green text-[16px] ms-3 font-semibold text-nowrap">Skryté sloupce</div>
          </div>
        </div>
      </div>
      <table class="border-collapse w-full">
        <thead class="">
          <tr class="bg-blue-300 text-[15px]">
            <th
              v-for="(column, colIdx) in filteredColumns"
              :key="String(column.key)"
              class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-blue-500 hover:text-white"
              :class="{ 'bg-blue-400': sortState.key === column.key }"
              @click="column.sortFn && sortIndicatorRefs[colIdx]?.toggleSort()"
            >
              <span class="flex justify-between items-center">
                {{ column.title }}
                <SortIndicator
                  v-if="column.sortFn"
                  :ref="(el) => setSortIndicatorRef(colIdx, el)"
                  :active="sortState.key === column.key"
                  :direction="sortState.key === column.key ? sortState.direction : null"
                  @update:direction="(dir) => updateSort(String(column.key), dir)"
                />
              </span>
            </th>
          </tr>
          <tr class="bg-blue-50">
            <th v-for="column in filteredColumns" :key="`filter-${String(column.key)}`" class="">
              <input
                type="text"
                v-model="columnFilters[String(column.key)]"
                class="border border-blue-300 my-2 w-[96%] p-1 ps-2 bg-white text-md font-normal rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Filtrovat"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in sortedData"
            :key="row.id"
            class="bg-white hover:bg-blue-50 cursor-pointer"
            @click="handleRowClick(row)"
          >
            <td
              v-for="column in filteredColumns"
              :key="`${row.id}-${String(column.key)}`"
              class="border-b border-blue-200 px-4 py-2"
              :class="{ 'border-blue': index === sortedData.length - 1 }"
            >
              <template v-if="typeof getCellContent(column, row, index) === 'object'">
                <component :is="getCellContent(column, row, index)" />
              </template>
              <template v-else>
                {{ getCellContent(column, row, index) }}
              </template>
            </td>
          </tr>
        </tbody>
        <tfoot class="border-blue border-t">
          <tr class="bg-blue-100 font-bold text-lg">
            <td class="px-4 py-2 text-blue">Celkem ({{ totalCountSpendings }}):</td>
            <td v-for="_v in filteredColumns.length - 2"></td>
            <td class="text-blue">
              {{ formatNumberToCzk(totalPrice) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div
      v-else
      key="collapsed"
      class="collapsedRow bg-blue-300 opacity-80 shadow text-white cursor-pointer w-full p-3 flex items-center justify-between rounded hover:bg-blue-500"
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
      <div class="text-xl font-bold">
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
</style>
