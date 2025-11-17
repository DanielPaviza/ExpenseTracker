<script setup lang="ts">
  import type { Spending } from '@models/Spending'
  import {
    scrollFadeOnBeforeEnter,
    scrollFadeOnBeforeLeave,
    scrollFadeOnEnter,
    scrollFadeOnLeave,
  } from '@utils/animations'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { ListOutline } from '@vicons/ionicons5'
  import { NIcon, NSelect } from 'naive-ui'

  import { type VNode, computed, onBeforeUpdate, ref } from 'vue'
  // For triggering SortIndicator's toggleSort from th click
  import type { ComponentPublicInstance } from 'vue'

  import SortIndicator from './SortIndicator.vue'
  import { type SpendingColumn, SpendingsColumns } from './SpendingsColumns'

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

  // Sorting state
  const sortState = ref<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  })

  // Filtering logic placeholder (add your filter conditions here)
  const filteredData = computed(() => {
    // Example: return data.value.filter(row => ...)
    return data
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
    return data.reduce((sum, spending) => {
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
      <div class="mb-4 flex justify-between items-end">
        <div
          class="flex items-end justify-between w-full hover:text-blue cursor-pointer collapseRow"
          @click="isCollapsed = !isCollapsed"
        >
          <h2 class="text-green text-2xl font-bold text-left">{{ title }}</h2>
          <div
            class="flex text-[16px] font-bold items-center gap-1 cursor-pointer text-green border-primaryDark border-b hover:text-blue hover:border-blue"
          >
            Zabalit tabulku
          </div>
        </div>
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
      <table class="w-full border-collapse border border-blue-300 rounded">
        <thead class="">
          <tr class="bg-blue-300 text-[15px]">
            <th
              v-for="(column, colIdx) in filteredColumns"
              :key="String(column.key)"
              class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-blue-500"
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
          <tr class="bg-gray-50 border-b border-blue-300">
            <th v-for="_c in filteredColumns" class="">
              <input
                type="text"
                class="border border-blue-300 my-2 w-[90%] p-1 ps-2 bg-white text-md font-normal"
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
          <tr class="bg-white font-bold text-lg">
            <td class="px-4 py-2 text-blue">Celkem:</td>
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
      class="bg-blue-200 text-green cursor-pointer w-full p-2 flex items-center justify-between rounded hover:bg-blue-300"
      @click="isCollapsed = !isCollapsed"
    >
      <div class="flex items-center gap-4">
        <n-icon size="40">
          <ListOutline />
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
</style>
