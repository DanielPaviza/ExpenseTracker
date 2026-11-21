<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import CollapsedTableView from '@components/spendingsList/dataTable/shared/CollapsedTableView.vue'
  import TableFooter from '@components/spendingsList/dataTable/shared/TableFooter.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { ChevronUpOutline, RefreshOutline, TrashOutline } from '@vicons/ionicons5'
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
  <Transition v-if="totalCountSpendings > 0" name="scroll-fade-table" mode="out-in">
    <div v-if="!isCollapsed" key="expanded">
      <div class="mb-3 flex items-center gap-3">
        <span class="flex size-7 items-center justify-center rounded-lg bg-danger/10 text-danger">
          <n-icon size="16"><TrashOutline /></n-icon>
        </span>
        <h2 class="text-base font-semibold text-fg">{{ $t('table.deleted') }}</h2>
        <span class="rounded-md bg-danger/10 px-1.5 py-0.5 text-xs font-medium text-danger">
          {{ totalCountSpendings }}×
        </span>
        <n-button text size="small" class="text-fg-muted" @click="toggleCollapse">
          <template #icon>
            <n-icon><ChevronUpOutline /></n-icon>
          </template>
          {{ $t('table.collapseTable') }}
        </n-button>
        <div class="ms-auto">
          <n-button
            size="small"
            type="success"
            secondary
            @click="restoreAllChangesDialog(totalCountSpendings)"
          >
            <template #icon>
              <n-icon><RefreshOutline /></n-icon>
            </template>
            {{ $t('table.restoreAll') }}
          </n-button>
        </div>
      </div>
      <div class="card overflow-x-auto border-danger/25">
        <table class="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr class="bg-danger/5">
              <th
                v-for="column in filteredColumns"
                :key="String(column.key)"
                class="border-b border-danger/20 ps-4 pe-2 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-fg-muted uppercase"
              >
                <span class="flex items-center gap-1.5">
                  <span>{{ column.title }}</span>
                  <Tooltip v-if="!!column.tooltip" :text="column.tooltip" small />
                </span>
              </th>
              <th
                class="border-b border-danger/20 ps-4 pe-2 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-fg-muted uppercase"
              >
                {{ $t('table.restoreColumn') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in sortedData"
              :key="row.id"
              class="bg-surface text-fg-muted line-through decoration-fg-subtle/60 hover:bg-danger/5"
            >
              <td
                v-for="column in filteredColumns"
                :key="`${row.id}-${String(column.key)}`"
                class="border-b border-line px-4 py-2.5"
              >
                <template v-if="typeof getCellContent(column, row, index) === 'object'">
                  <component :is="getCellContent(column, row, index) as VNode" />
                </template>
                <template v-else>
                  {{ getCellContent(column, row, index) }}
                </template>
              </td>
              <td class="border-b border-line px-4 py-2 no-underline">
                <n-button
                  class="restore-button"
                  size="tiny"
                  type="success"
                  secondary
                  @click="handleRestore(row, $event)"
                >
                  <template #icon>
                    <n-icon><RefreshOutline /></n-icon>
                  </template>
                  {{ $t('dialogs.restore') }}
                </n-button>
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
    </div>
    <CollapsedTableView
      v-else
      key="collapsed"
      :title="t('table.deleted')"
      :total-price="totalPrice"
      :total-count-spendings="totalCountSpendings"
      @toggle-collapse="toggleCollapse"
    />
  </Transition>
</template>

<style scoped>
  .scroll-fade-table-enter-active,
  .scroll-fade-table-leave-active {
    transition: opacity 0.15s ease;
  }
  .scroll-fade-table-enter-from,
  .scroll-fade-table-leave-to {
    opacity: 0;
  }
</style>
