<script setup lang="ts">
  import CollapsedTableView from '@components/home/spendingsList/dataTable/shared/CollapsedTableView.vue'
  import TableFooter from '@components/home/spendingsList/dataTable/shared/TableFooter.vue'
  import Tooltip from '@components/shared/Tooltip.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { ArrowUpOutline, ListOutline, RefreshOutline } from '@vicons/ionicons5'
  import { NButton, NIcon, useMessage } from 'naive-ui'

  import { type VNode, computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useSpendingDialogAction } from '@/composables/spending/useSpendingDialogAction'
  import { useSpendingsColumns } from '@/composables/spending/useSpendingsColumns'
  import { useTableSort } from '@/composables/table/useTableSort'
  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { calculateTotalPrice, getCellContent } from '@/utils/tableUtils'

  const { t } = useI18n()
  const { restoreAllChangesDialog } = useSpendingDialogAction()

  const store = useSpendingsStore()
  const message = useMessage()

  const isCollapsed = ref(false)

  const { columns: allColumns } = useSpendingsColumns()
  const columns = ref<SpendingColumn[]>(
    allColumns.value.filter((col) => col.key !== 'deleteAction'),
  )
  const filteredColumns = computed(() => {
    return columns.value.filter((col) => !col.isHidden)
  })

  const data = computed(() => store.deletedSpendings)

  const { sortedData } = useTableSort(
    () => data.value,
    () => columns.value,
  )

  const totalCountSpendings = computed(() => data.value.length)
  const totalPrice = computed(() => calculateTotalPrice(sortedData.value))

  function handleRowClick(_row: Spending, event?: MouseEvent): void {
    // Don't navigate if clicking on the restore button
    if (event && (event.target as HTMLElement).closest('.restore-button')) return

    // Don't navigate for deleted items
  }

  function handleRestore(row: Spending, event: Event): void {
    event.stopPropagation()
    try {
      store.restoreSpending(row.id)
      message.success(t('messages.itemRestored', { name: row.name }))
    } catch {
      message.error(t('messages.errorRestoringItem', { name: row.name }))
    }
  }

  function toggleCollapse(): void {
    isCollapsed.value = !isCollapsed.value
  }
</script>

<template>
  <Transition v-if="totalCountSpendings > 0" name="scroll-fade-table">
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
            @click="toggleCollapse"
          >
            {{ $t('table.collapseTable') }}
          </div>
          <div class="ms-auto">
            <n-button
              class="ms-auto"
              size="tiny"
              color="#10b981"
              @click="restoreAllChangesDialog(totalCountSpendings)"
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
              v-for="column in filteredColumns"
              :key="String(column.key)"
              class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap text-white"
            >
              <span class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span>{{ column.title }}</span>
                  <Tooltip v-if="!!column.tooltip" :text="column.tooltip" color="white" />
                </div>
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
                <component :is="getCellContent(column, row, index) as VNode" />
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
        <TableFooter
          :total-count="totalCountSpendings"
          :total-price="totalPrice"
          :column-count="filteredColumns.length"
        />
      </table>
    </div>
    <CollapsedTableView
      v-else
      key="collapsed"
      :title="t('table.deleted')"
      :total-price="totalPrice"
      class="bg-red-300 hover:bg-red-500"
      :total-count-spendings="totalCountSpendings"
      @toggle-collapse="toggleCollapse"
    />
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

  thead tr:first-child th:first-child {
    border-radius: 6px 0 0 0;
  }
  thead tr:first-child th:last-child {
    border-radius: 0 6px 0 0;
  }

  .scroll-fade-table-enter-active,
  .scroll-fade-table-leave-active {
    overflow: hidden;
  }

  /* Override TableFooter colors for red theme */
  :deep(tfoot tr) {
    background-color: #fecaca; /* red-100 */
  }
  :deep(tfoot td) {
    color: #ef4444; /* red-500 */
  }
</style>
