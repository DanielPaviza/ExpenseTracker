<script setup lang="ts">
  import SpendingStatusIndicator from '@components/spendingsList/SpendingStatusIndicator.vue'

  import { type VNode, ref } from 'vue'

  import SpendingsDataTableAction from '@/components/spendingsList/SpendingsDataTableAction.vue'
  import SpendingsDataTableActionContext from '@/components/spendingsList/SpendingsDataTableActionContext.vue'
  import { useSpendingStatus } from '@/composables/spending/useSpendingStatus'
  import { useAppNavigation } from '@/composables/useAppNavigation'
  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { getCellContent } from '@/utils/tableUtils'

  const {
    row,
    rowIndex,
    columns,
    showActions = true,
    isTableGroup,
  } = defineProps<{
    row: Spending
    rowIndex: number
    columns: SpendingColumn[]
    showActions?: boolean
    isTableGroup?: boolean
  }>()

  const actionContextMouseEvent = ref<MouseEvent | null>(null)

  const emit = defineEmits<{
    (e: 'row-click', row: Spending, event?: MouseEvent): void
  }>()

  const { openEditSpending } = useAppNavigation()
  const { getSpendingStatus } = useSpendingStatus()

  function handleRowClick(event?: MouseEvent): void {
    // Don't navigate if clicking on action buttons
    if (event && (event.target as HTMLElement).closest('.delete-button, .spending-link')) return

    emit('row-click', row, event)
    openEditSpending(row.id)
  }

  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault()
    actionContextMouseEvent.value = event
  }
</script>

<template>
  <tr
    class="row relative cursor-pointer text-sm transition-colors hover:bg-primary-soft/60"
    :class="isTableGroup ? 'bg-surface shadow-[inset_3px_0_0_var(--primary-light)]' : 'bg-surface'"
    @click="handleRowClick($event)"
    @contextmenu="handleContextMenu"
  >
    <td
      v-for="column in columns"
      :key="`${row.id}-${String(column.key)}`"
      class="border-b border-line px-4 py-2.5 text-fg"
      :class="{
        'font-semibold tabular-nums': column.key === 'totalPrice',
        'whitespace-nowrap': column.key !== 'tags',
      }"
    >
      <template v-if="typeof getCellContent(column, row, rowIndex) === 'object'">
        <component :is="getCellContent(column, row, rowIndex) as VNode" />
      </template>
      <template v-else>
        {{ getCellContent(column, row, rowIndex) }}
      </template>
      <SpendingStatusIndicator class="me-2" :status="getSpendingStatus(row.id)" />
    </td>
    <td v-if="showActions" class="w-12 border-b border-line px-2">
      <SpendingsDataTableAction :spending="row" />
    </td>
  </tr>
  <SpendingsDataTableActionContext :spending="row" :mouse-event="actionContextMouseEvent" />
</template>

<style scoped>
  .row {
    opacity: 1;
    animation-name: myAnimation;
    animation-duration: 0.25s;
    animation-timing-function: ease-out;
  }

  @keyframes myAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
