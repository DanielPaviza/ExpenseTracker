<script setup lang="ts">
  import TableRow from '@components/spendingsList/dataTable/shared/TableRow.vue'
  import { ChevronForwardOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import BulkEditActionContext from '@/components/shared/BulkEditActionContext.vue'
  import { useAppNavigation } from '@/composables/useAppNavigation'
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { calculateTotalPrice } from '@/utils/tableUtils'

  const { t } = useI18n()
  const { openBulkEdit } = useAppNavigation()
  const spendingStore = useSpendingsStore()

  const {
    tableGroupName,
    items,
    columns,
    isShownDefault,
    showExpandedIfOneItemDefault,
    currentViewKey,
  } = defineProps<{
    tableGroupName: string
    items: Spending[]
    columns: SpendingColumn[]
    isShownDefault?: boolean
    showExpandedIfOneItemDefault?: boolean
    currentViewKey: string
  }>()

  const actionContextMouseEvent = ref<MouseEvent | null>(null)

  // Fallback groups ("Unknown", "No tag") don't map to a real value that could be bulk edited
  const canBeEdited = computed(
    () =>
      currentViewKey !== 'allInOne' &&
      tableGroupName !== t('table.unknown') &&
      tableGroupName !== t('table.noTag'),
  )

  const settingsStore = useSettingsStore()
  const isExpanded = ref(
    (showExpandedIfOneItemDefault && items.length <= 1) ||
      isShownDefault ||
      settingsStore.settings.tableGroupDefaultOpen,
  )

  const totalPrice = computed(() => calculateTotalPrice(items))

  function toggleExpanded(event: Event): void {
    event.stopPropagation()
    isExpanded.value = !isExpanded.value
  }

  function handleContextMenu(event: MouseEvent): void {
    if (!canBeEdited.value) return
    event.preventDefault()
    actionContextMouseEvent.value = event
  }

  const openSpendingBulkEdit = (): void => {
    const getPath = () => {
      switch (currentViewKey) {
        case 'byCategories':
          return spendingStore.categoryView === null ? 'category' : 'subCategory'
        case 'byStores':
          return 'store'
        case 'byTags':
          return 'tag'
      }
    }

    if (!canBeEdited.value) return
    openBulkEdit(getPath() ?? '', tableGroupName)
  }

  watch(
    () => settingsStore.settings.tableGroupDefaultOpen,
    (newValue) => {
      isExpanded.value = newValue
    },
  )
</script>

<template>
  <BulkEditActionContext
    v-if="canBeEdited"
    :mouse-event="actionContextMouseEvent"
    @edit="openSpendingBulkEdit"
  />
  <tr
    class="cursor-pointer bg-surface-2 text-sm transition-colors hover:bg-primary-soft"
    @click="toggleExpanded"
    @contextmenu="handleContextMenu"
  >
    <td class="border-b border-line py-2.5">
      <div class="flex items-center gap-2 ps-3">
        <n-icon
          :size="16"
          class="text-fg-subtle transition-transform duration-200"
          :class="{ 'rotate-90 text-primary': isExpanded }"
        >
          <ChevronForwardOutline />
        </n-icon>
        <span class="font-semibold whitespace-nowrap text-fg">{{ tableGroupName }}</span>
        <span
          class="rounded-md bg-surface-3 px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-fg-muted"
        >
          {{ items.length }} {{ $t('table.items') }}
        </span>
      </div>
    </td>
    <td v-for="_ in columns.length - 2" :key="_" class="border-b border-line" />
    <td
      class="border-b border-line px-4 font-semibold whitespace-nowrap tabular-nums"
      :class="isExpanded ? 'text-fg-muted' : 'text-fg'"
    >
      {{ formatCurrency(totalPrice) }}
    </td>
    <td class="border-b border-line" />
  </tr>

  <template v-if="isExpanded">
    <TableRow
      v-for="(row, index) in items"
      :key="row.id"
      :row="row"
      :row-index="index"
      :columns="columns"
      is-table-group
    />
  </template>
</template>
