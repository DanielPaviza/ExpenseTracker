<script setup lang="ts">
  import TableRow from '@components/home/spendingsList/dataTable/shared/TableRow.vue'
  import { ChevronForwardOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { computed, ref } from 'vue'

  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSettingsStore } from '@/stores/settingsStore'
  import type { Spending } from '@/types/Spending'
  import type { SpendingColumn } from '@/types/SpendingColumn'
  import { calculateTotalPrice } from '@/utils/tableUtils'

  const { subCategory, items, columns, isShownDefault } = defineProps<{
    subCategory: string
    items: Spending[]
    columns: SpendingColumn[]
    isShownDefault?: boolean
  }>()

  const { settings } = useSettingsStore()
  const isExpanded = ref(items.length <= 1 || isShownDefault || settings.subGroupDefaultOpen)

  const totalPrice = computed(() => calculateTotalPrice(items))

  function toggleExpanded(event: Event): void {
    event.stopPropagation()
    isExpanded.value = !isExpanded.value
  }
</script>

<template>
  <tr
    class="bg-blue-50 hover:bg-blue-100 cursor-pointer border-b border-blue-200 px-4 py-2"
    @click="toggleExpanded"
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
        <span class="font-semibold text-blue-500">{{ subCategory }}</span>
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
      is-subgroup
    />
  </template>
</template>

<style scoped>
  .rotate-90 {
    transform: rotate(0deg);
  }
</style>
