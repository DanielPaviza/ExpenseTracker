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
    specialSpendings: unpaidSpendings,
    priceSpecial: priceUnpaid,
    priceTotalWithSpecial: priceTotalWithUnpaid,
    chartLabels,
    chartDatasets,
  } = useSpecialSpendings({
    spendings,
    totalPrice,
    filterFn: (s) => s.isToBePaid && !s.isFree,
    labelKeys: {
      paid: 'summary.paid',
      special: 'summary.unpaid',
    },
    colors: {
      paid: '#06402b',
      special: '#e53e3e',
    },
  })

  const {
    displayedItems: displayedUnpaidSpendings,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(unpaidSpendings)
</script>

<template>
  <SummaryCard
    :title="$t('summary.unpaidExpenses')"
    :subtitle="`${unpaidSpendings.length} ${$t('summary.items')}`"
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
        <div class="font-bold text-blue">{{ $t('summary.remainingToPay') }}:</div>
        <div class="font-semibold text-red-600">
          {{ formatCurrency(priceUnpaid) }}
        </div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <div>({{ $t('summary.totalWithUnpaid') }})</div>
        <div>{{ formatCurrency(priceTotalWithUnpaid) }}</div>
      </div>
      <div class="border-t border-blue mt-4">
        <div class="text-blue mb-2 mt-4">{{ $t('summary.unpaidItems') }}:</div>
        <div class="pr-2 text-sm">
          <div
            v-for="spending in displayedUnpaidSpendings"
            :key="spending.id"
            class="flex space-y-1 items-center gap-4"
          >
            <span class="truncate font-semibold" :title="spending.name">{{ spending.name }}</span>
            <span class="font-semibold whitespace-nowrap">{{
              formatCurrency(spending.totalPrice)
            }}</span>
            <span v-if="spending.store">-> {{ spending.store }}</span>
          </div>
          <div v-if="unpaidSpendings.length === 0" class="text-gray-500">
            {{ $t('summary.allExpensesPaid') }}
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