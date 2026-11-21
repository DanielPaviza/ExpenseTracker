<script setup lang="ts">
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpecialSpendings } from '@composables/useSpecialSpendings'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import SummaryCard from '@/components/spendingsDashboard/summary/SummaryCard.vue'
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
      paid: '#2563eb',
      special: '#ef4444',
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
    :chart-type="`${unpaidSpendings.length > 0 ? 'Doughnut' : 'None'}`"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-if="unpaidSpendings.length === 0" class="text-fg-muted text-center py-4 w-full">
      {{ $t('common.noRecordsFound') }}
    </div>
    <div v-else class="w-full space-y-1">
      <div class="flex justify-between">
        <div class="font-medium text-fg-muted me-3">{{ $t('summary.totalPaid') }}</div>
        <div class="font-semibold">
          {{ formatCurrency(totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="font-medium text-fg-muted">{{ $t('summary.remainingToPay') }}</div>
        <div class="font-semibold text-danger">
          {{ formatCurrency(priceUnpaid) }}
        </div>
      </div>
      <div class="flex justify-between text-sm text-fg-muted">
        <div>({{ $t('summary.totalWithUnpaid') }})</div>
        <div>{{ formatCurrency(priceTotalWithUnpaid) }}</div>
      </div>
      <div class="mt-4 border-t border-line">
        <div class="mt-4 mb-2 text-xs font-semibold tracking-wide text-fg-subtle uppercase">
          {{ $t('summary.unpaidItems') }}:
        </div>
        <div class="divide-y divide-line text-sm">
          <div
            v-for="spending in displayedUnpaidSpendings"
            :key="spending.id"
            class="flex items-center gap-3 py-1"
          >
            <span class="min-w-0 truncate font-medium" :title="spending.name">
              {{ spending.name }}
            </span>
            <span v-if="spending.store" class="truncate text-xs text-fg-subtle">
              {{ spending.store }}
            </span>
            <span class="ms-auto font-semibold whitespace-nowrap tabular-nums">
              {{ formatCurrency(spending.totalPrice) }}
            </span>
          </div>
          <div v-if="unpaidSpendings.length === 0" class="text-fg-muted">
            {{ $t('summary.allExpensesPaid') }}
          </div>
        </div>
        <div
          v-if="hasMore"
          class="mt-1 text-primary text-xs font-medium cursor-pointer hover:underline"
          @click="showAll = !showAll"
        >
          {{ toggleText }}
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
