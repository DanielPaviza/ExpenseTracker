<script setup lang="ts">
  import TableRow from '@components/spendingsList/dataTable/shared/TableRow.vue'
  import { ChevronForwardOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import BulkEditActionContext from '@/components/shared/BulkEditActionContext.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { calculateTotalPrice } from '@/utils/tableUtils'

  const router = useRouter()
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

    if (currentViewKey === 'allInOne') return
    router.push(`/bulkEdit/${getPath()}/${encodeURIComponent(tableGroupName)}`)
  }

  watch(
    () => settingsStore.settings.tableGroupDefaultOpen,
    (newValue) => {
      isExpanded.value = newValue
    },
  )
</script>

<template>
  <BulkEditActionContext :mouse-event="actionContextMouseEvent" @edit="openSpendingBulkEdit" />
  <tr
    class="bg-blue-50 hover:bg-blue-100 cursor-pointer border-b border-blue-200 px-4 py-2"
    @click="toggleExpanded"
    @contextmenu="handleContextMenu"
  >
    <td class="py-2">
      <div class="flex items-center gap-2 ps-3">
        <n-icon
          :size="20"
          class="transition-transform text-blue-500"
          :class="{ 'rotate-90': isExpanded }"
        >
          <ChevronForwardOutline />
        </n-icon>
        <span class="font-semibold text-blue-500">{{ tableGroupName }}</span>
        <span class="text-sm text-gray-600">({{ items.length }} {{ $t('table.items') }})</span>
      </div>
    </td>
    <td v-for="_ in columns.length - 2" :key="_" />
    <td class="font-bold ps-3" :class="isExpanded ? 'text-blue' : ' text-black'">
      <template v-if="!isExpanded"> </template>
      {{ formatCurrency(totalPrice) }}
    </td>
    <td />
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

<style scoped>
  .rotate-90 {
    transform: rotate(0deg);
  }
</style>
