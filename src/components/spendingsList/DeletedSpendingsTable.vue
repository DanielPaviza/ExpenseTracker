<script setup lang="ts">
  import SortIndicator from '@components/spendingsList/SortIndicator.vue'
  import Tooltip from '@components/Tooltip.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import {
    scrollFadeOnBeforeEnter,
    scrollFadeOnBeforeLeave,
    scrollFadeOnEnter,
    scrollFadeOnLeave,
  } from '@utils/animations'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { ArrowDownOutline, ArrowUpOutline, ListOutline, RefreshOutline } from '@vicons/ionicons5'
  import { NButton, NIcon, useDialog, useMessage } from 'naive-ui'
  import { type VNode, computed, onBeforeUpdate, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import type { ComponentPublicInstance } from 'vue'
  import type { ComponentPublicInstance } from 'vue'

  import { useSpendingsColumns } from '@/composables/useSpendingsColumns'

  const { t } = useI18n()

  type SortIndicatorInstance = ComponentPublicInstance<{ toggleSort: () => void }>
  const sortIndicatorRefs = ref<(SortIndicatorInstance | null)[]>([])
  function setSortIndicatorRef(idx: number, el: Element | ComponentPublicInstance | null) {
    if (el && typeof (el as any).toggleSort === 'function') {
      sortIndicatorRefs.value[idx] = el as SortIndicatorInstance
    } else if (el === null) {
      sortIndicatorRefs.value[idx] = null
    }
  }
  onBeforeUpdate(() => {
    sortIndicatorRefs.value = []
  })

  const store = useSpendingsStore()
  const message = useMessage()
  const dialog = useDialog()

  const isCollapsed = ref(false)

  const { columns: allColumns } = useSpendingsColumns()
  const columns = ref<SpendingColumn[]>(
    allColumns.value.filter((col) => col.key !== 'deleteAction'),
  )
  const filteredColumns = computed(() => {
    return columns.value.filter((col) => !col.isHidden)
  })

  const data = computed(() => store.deletedSpendings)

  const totalCountSpendings = computed(() => data.value.length)

  const sortState = ref<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  })

  const sortedData = computed(() => {
    if (!sortState.value.key || !sortState.value.direction) {
      return data.value
    }
    const col = columns.value.find((c) => c.key === sortState.value.key && c.sortFn)
    if (!col || !col.sortFn) {
      return data.value
    }
    const sorted = [...data.value].sort(col.sortFn)
    if (sortState.value.direction === 'desc') {
      sorted.reverse()
    }
    return sorted
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null) {
    if (direction === null) {
      sortState.value = { key: null, direction: null }
    } else {
      sortState.value = { key, direction }
    }
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

  function handleRowClick(_row: Spending, event?: MouseEvent) {
    // Don't navigate if clicking on the restore button
    if (event && (event.target as HTMLElement).closest('.restore-button')) {
      return
    }
    // Don't navigate for deleted items
  }

  async function handleRestore(row: Spending, event: Event) {
    event.stopPropagation()
    try {
      await store.restoreSpending(row.id)
      message.success(t('messages.itemRestored', { name: row.name }))
    } catch (error) {
      message.error(t('messages.errorRestoringItem', { name: row.name }))
    }
  }

  function handleRestoreAll() {
    dialog.warning({
      title: t('dialogs.restoreAllTitle'),
      content: t('dialogs.restoreAllContent', { count: totalCountSpendings.value }),
      positiveText: t('dialogs.restore'),
      negativeText: t('dialogs.cancel'),
      onPositiveClick: async () => {
        try {
          await store.restoreAllDeletedSpendings()
          message.success(t('messages.allDeletedItemsRestored'))
        } catch {
          message.error(t('messages.errorRestoringAllItems'))
        }
      },
    })
  }
</script>

<template>
  <Transition
    v-if="totalCountSpendings > 0"
    name="scroll-fade-table"
    @before-enter="scrollFadeOnBeforeEnter"
    @enter="scrollFadeOnEnter"
    @before-leave="scrollFadeOnBeforeLeave"
    @leave="scrollFadeOnLeave"
  >
    <div v-if="!isCollapsed" key="expanded" class="overflow-x-auto">
      <div class="flex justify-between items-center">
        <div class="flex items-end w-full py-2">
          <n-icon size="32" class="collapseArrow" color="#ef4444">
            <ArrowUpOutline />
          </n-icon>
          <n-icon size="32" class="listIcon" color="#ef4444">
            <ListOutline />
          </n-icon>
          <h2 class="text-red-500 text-2xl me-4 ms-2 font-bold text-left">
            {{ $t('table.deleted') }}
          </h2>
          <div
            class="flex text-[15px] font-bold items-center gap-1 cursor-pointer text-black opacity-60 border-primaryDark border-b hover:text-red-500 hover:border-red-500"
            @click="isCollapsed = !isCollapsed"
          >
            {{ $t('table.collapseTable') }}
          </div>
          <div class="ms-auto">
            <n-button
              class="ms-auto"
              size="tiny"
              color="#10b981"
              @click="handleRestoreAll"
            >
              {{ $t('table.restoreAll') }}
            </n-button>
          </div>
        </div>
      </div>
      <table class="border-collapse w-full">
        <thead class="">
          <tr class="bg-red-300 text-[15px]">
            <th
              v-for="(column, colIdx) in filteredColumns"
              :key="String(column.key)"
              class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-red-500 hover:text-white"
              :class="{ 'bg-red-400': sortState.key === column.key }"
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
            <th class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap text-white">
              {{ $t('table.restoreColumn') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in sortedData"
            :key="row.id"
            class="bg-red-50 hover:bg-red-100 cursor-pointer"
            @click="handleRowClick(row, $event)"
          >
            <td
              v-for="column in filteredColumns"
              :key="`${row.id}-${String(column.key)}`"
              class="border-b border-red-200 px-4 py-2"
            >
              <template v-if="typeof getCellContent(column, row, index) === 'object'">
                <component :is="getCellContent(column, row, index)" />
              </template>
              <template v-else>
                {{ getCellContent(column, row, index) }}
              </template>
            </td>
            <td class="border-b border-red-200 px-4 py-2">
              <div class="opacity-75 hover:opacity-100">
                <n-button
                  class="restore-button"
                  size="tiny"
                  color="#10b981"
                  @click="handleRestore(row, $event)"
                >
                  <template #icon>
                    <n-icon>
                      <RefreshOutline />
                    </n-icon>
                  </template>
                  {{ $t('dialogs.restore') }}
                </n-button>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot class="border-red-500 border-t">
          <tr class="bg-red-100 font-bold text-lg">
            <td class="px-4 py-2 text-red-500">
              {{ t('table.total') }} ({{ totalCountSpendings }}):
            </td>
            <td v-for="_v in filteredColumns.length - 2" />
            <td class="text-red-500">
              {{ formatNumberToCzk(totalPrice) }}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
    <div
      v-else
      key="collapsed"
      class="collapsedRow bg-red-300 opacity-80 shadow text-white cursor-pointer w-full p-3 flex items-center justify-between rounded hover:bg-red-500"
      @click="isCollapsed = !isCollapsed"
    >
      <div class="flex items-center gap-4">
        <n-icon class="listIcon" size="32">
          <ListOutline />
        </n-icon>
        <n-icon class="unCollapseIcon" size="32">
          <ArrowDownOutline />
        </n-icon>
        <h2 class="text-xl font-bold text-left">
          {{ t('table.deleted') }}
        </h2>
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
    display: flex;
  }
  .collapseRow:hover .listIcon {
    display: none;
  }
  table {
    box-shadow:
      0 4px 6px -1px rgba(239, 68, 68, 0.1),
      0 2px 4px -1px rgba(239, 68, 68, 0.06);
  }
  thead tr:first-child th .sortIndicator {
    color: #ef4444;
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
    stroke: #ef4444;
  }
  .collapseRow:hover h2,
  .collapseRow:hover div {
    color: #ef4444 !important;
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
