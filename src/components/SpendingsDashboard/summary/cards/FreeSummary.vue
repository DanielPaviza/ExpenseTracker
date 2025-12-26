<script setup lang="ts">
  import SummaryCard from '@components/spendingsDashboard/summary/SummaryCard.vue'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpecialSpendings } from '@composables/useSpecialSpendings'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const {
    specialSpendings: freeSpendings,
    priceSpecial: priceFree,
    priceTotalWithSpecial: priceTotalWithFree,
    chartLabels,
    chartDatasets,
  } = useSpecialSpendings({
    spendings,
    totalPrice,
    filterFn: (s) => s.isFree,
    labelKeys: {
      paid: 'summary.paid',
      special: 'summary.free',
    },
    colors: {
      paid: '#06402b',
      special: '#10b981',
    },
  })

  const {
    displayedItems: displayedFreeSpendings,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(freeSpendings)
</script>

<template>
  <SummaryCard
    :title="$t('summary.savedExpenses')"
    :subtitle="`${freeSpendings.length} ${$t('summary.items')}`"
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="max-w-[90%]">
      <div class="flex justify-between">
        <div class="font-bold text-blue me-3">{{ $t('summary.totalPaid') }}:</div>
        <div class="font-semibold">
          {{ formatCurrency(totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">{{ $t('summary.saved') }}:</div>
        <div class="font-semibold text-green-600">
          {{ formatCurrency(priceFree) }}
        </div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <div>({{ $t('summary.totalWithSaved') }})</div>
        <div>{{ formatCurrency(priceTotalWithFree) }}</div>
      </div>
      <div class="border-t border-blue mt-4">
        <div class="text-blue mb-2 mt-4">{{ $t('summary.freeItems') }}:</div>
        <div class="pr-2 text-sm">
          <div
            v-for="spending in displayedFreeSpendings"
            :key="spending.id"
            class="flex space-y-1 items-center gap-4"
          >
            <span class="truncate font-semibold" :title="spending.name">{{ spending.name }}</span>
            <span class="font-semibold whitespace-nowrap">{{
              formatCurrency(spending.totalPrice)
            }}</span>
            <span v-if="spending.store">-> {{ spending.store }}</span>
          </div>
          <div v-if="freeSpendings.length === 0" class="text-gray-500">
            {{ $t('summary.noSavedExpenses') }}
          </div>
        </div>
        <div
          v-if="hasMore"
          class="mt-1 text-blueLight text-xs cursor-pointer"
          @click="showAll = !showAll"
        >
          {{ toggleText }}
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
