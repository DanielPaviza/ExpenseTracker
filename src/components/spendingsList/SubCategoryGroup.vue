<script setup lang="ts">
  import type { SpendingColumn } from '@components/spendingsList/SpendingsColumns'
  import type { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { ChevronForwardOutline, CloseOutline } from '@vicons/ionicons5'
  import { NButton, NIcon, useDialog, useMessage } from 'naive-ui'

  import { type VNode, computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const props = defineProps<{
    subCategory: string
    items: Spending[]
    columns: SpendingColumn[]
  }>()

  const router = useRouter()
  const store = useSpendingsStore()
  const dialog = useDialog()
  const message = useMessage()
  const isExpanded = ref(false)

  const totalPrice = computed(() => {
    return props.items
      .filter((spending) => !spending.isFree && !spending.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
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

  function handleRowClick(row: Spending, event?: MouseEvent) {
    // Don't navigate if clicking on the delete button
    if (event && (event.target as HTMLElement).closest('.delete-button')) {
      return
    }
    router.push(`/edit/${row.id}`)
  }

  function handleDelete(row: Spending, event: Event) {
    event.stopPropagation()

    dialog.warning({
      title: 'Smazat nákup',
      content: `Opravdu chcete smazat "${row.name}"?`,
      positiveText: 'Smazat',
      negativeText: 'Zrušit',
      onPositiveClick: async () => {
        await store.removeSpending(row.id)
        message.success('Nákup byl úspěšně smazán')
      },
    })
  }

  function toggleExpanded(event: Event) {
    event.stopPropagation()
    isExpanded.value = !isExpanded.value
  }
</script>

<template>
  <tr class="subCategory-group-header bg-blue-50 hover:bg-blue-100 cursor-pointer">
    <td
      :colspan="columns.length"
      class="border-b border-blue-200 px-4 py-2"
      @click="toggleExpanded"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <n-icon :size="20" class="transition-transform" :class="{ 'rotate-90': isExpanded }">
            <ChevronForwardOutline />
          </n-icon>
          <span class="font-semibold text-blue-700">{{ subCategory }}</span>
          <span class="text-sm text-gray-600">({{ items.length }} položek)</span>
        </div>
        <div class="font-bold text-black me-[7.6%]">
          {{ formatNumberToCzk(totalPrice) }}
        </div>
      </div>
    </td>
  </tr>

  <template v-if="isExpanded">
    <tr
      v-for="(row, index) in items"
      :key="row.id"
      class="bg-gray-50 hover:bg-blue-50 cursor-pointer subCategory-item border-2 border-e-0 border-t-0 border-b-0 border-blue-300"
      @click="handleRowClick(row, $event)"
    >
      <td
        v-for="column in columns"
        :key="`${row.id}-${String(column.key)}`"
        class="border-b border-blue-100 px-4 py-2"
        :class="{ 'border-blue-200': index === items.length - 1 }"
      >
        <template v-if="column.key === 'deleteAction'">
          <div class="opacity-75 hover:opacity-100">
            <n-button
              class="delete-button"
              size="tiny"
              color="#ef4444"
              @click="handleDelete(row, $event)"
            >
              <template #icon>
                <n-icon>
                  <CloseOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
        </template>
        <template v-else-if="typeof getCellContent(column, row, index) === 'object'">
          <component :is="getCellContent(column, row, index)" />
        </template>
        <template v-else>
          {{ getCellContent(column, row, index) }}
        </template>
      </td>
    </tr>
  </template>
</template>

<style scoped>
  .subCategory-group-header {
    position: sticky;
    z-index: 1;
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
</style>
