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
      paid: '#2563eb',
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
    :chart-type="`${freeSpendings.length > 0 ? 'Doughnut' : 'None'}`"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-if="freeSpendings.length === 0" class="text-fg-muted text-center py-4 w-full">
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
        <div class="font-medium text-fg-muted">{{ $t('summary.saved') }}</div>
        <div class="font-semibold text-success">
          {{ formatCurrency(priceFree) }}
        </div>
      </div>
      <div class="flex justify-between text-sm text-fg-muted">
        <div>({{ $t('summary.totalWithSaved') }})</div>
        <div>{{ formatCurrency(priceTotalWithFree) }}</div>
      </div>
      <div class="mt-4 border-t border-line">
        <div class="mt-4 mb-2 text-xs font-semibold tracking-wide text-fg-subtle uppercase">
          {{ $t('summary.freeItems') }}:
        </div>
        <div class="divide-y divide-line text-sm">
          <div
            v-for="spending in displayedFreeSpendings"
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
          <div v-if="freeSpendings.length === 0" class="text-fg-muted">
            {{ $t('summary.noSavedExpenses') }}
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
