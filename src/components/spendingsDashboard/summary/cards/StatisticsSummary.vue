<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'

  import SummaryCard from '@/components/spendingsDashboard/summary/SummaryCard.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { Spending } from '@/types/Spending'

  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const totalItems = computed(() =>
    spendings.value
      .filter((s: Spending) => !s.isFree && !s.isToBePaid)
      .reduce((sum: number, s: Spending) => sum + s.quantity, 0),
  )

  const paidSpendings = computed(() =>
    spendings.value.filter((s: Spending) => !s.isFree && !s.isToBePaid),
  )

  const averagePricePerItem = computed(() => {
    if (totalItems.value === 0) return 0

    return totalPrice.value / totalItems.value
  })

  const averagePricePerSpending = computed(() => {
    if (paidSpendings.value.length === 0) return 0

    return totalPrice.value / paidSpendings.value.length
  })

  const averageItemsPerSpending = computed(() => {
    if (paidSpendings.value.length === 0) return 0

    return totalItems.value / paidSpendings.value.length
  })

  const mostExpensiveItem = computed(() => {
    if (paidSpendings.value.length === 0) return null

    return paidSpendings.value.reduce((max, s) => (s.totalPrice > max.totalPrice ? s : max))
  })

  const leastExpensiveItem = computed(() => {
    if (paidSpendings.value.length === 0) return null

    return paidSpendings.value.reduce((min, s) => (s.totalPrice < min.totalPrice ? s : min))
  })

  const mostExpensiveSingleUnit = computed(() => {
    if (paidSpendings.value.length === 0) return null

    return paidSpendings.value.reduce((max, s) => (s.unitPrice > max.unitPrice ? s : max))
  })

  const largestQuantityPurchase = computed(() => {
    if (paidSpendings.value.length === 0) return null

    return paidSpendings.value.reduce((max, s) => (s.quantity > max.quantity ? s : max))
  })

  const medianSpendingPrice = computed(() => {
    if (paidSpendings.value.length === 0) return 0

    const sorted = [...paidSpendings.value].sort((a, b) => a.totalPrice - b.totalPrice)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0
      ? sorted[mid].totalPrice
      : (sorted[mid - 1].totalPrice + sorted[mid].totalPrice) / 2
  })

  const uniqueCategories = computed(() => {
    const cats = new Set(paidSpendings.value.map((s) => s.category))
    return cats.size
  })

  const uniqueStores = computed(() => {
    const stores = new Set(paidSpendings.value.map((s) => s.store).filter(Boolean))
    return stores.size
  })
</script>

<template>
  <SummaryCard
    :title="$t('summary.statisticsTitle')"
    :subtitle="`${paidSpendings.length} ${$t('summary.purchases')}`"
  >
    <div class="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
      <!-- Basic Stats -->
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.purchases') }}</span>
        <span class="font-semibold tabular-nums">{{ paidSpendings.length }}</span>
      </div>
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.items') }}</span>
        <span class="font-semibold tabular-nums">{{ totalItems }}</span>
      </div>

      <!-- Averages -->
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.avgPerPurchase') }}</span>
        <span class="font-semibold tabular-nums">{{
          formatCurrency(averagePricePerSpending)
        }}</span>
      </div>
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.avgPerItem') }}</span>
        <span class="font-semibold tabular-nums">{{ formatCurrency(averagePricePerItem) }}</span>
      </div>

      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.avgItems') }}</span>
        <span class="font-semibold tabular-nums">{{ averageItemsPerSpending.toFixed(1) }}</span>
      </div>
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.medianPrice') }}</span>
        <span class="font-semibold tabular-nums">{{ formatCurrency(medianSpendingPrice) }}</span>
      </div>

      <!-- Extremes -->
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.mostExpensive') }}</span>
        <span class="font-semibold tabular-nums" :title="mostExpensiveItem?.name">
          {{ formatCurrency(mostExpensiveItem?.totalPrice ?? 0) }}
        </span>
      </div>
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.cheapest') }}</span>
        <span class="font-semibold tabular-nums" :title="leastExpensiveItem?.name">
          {{ formatCurrency(leastExpensiveItem?.totalPrice ?? 0) }}
        </span>
      </div>

      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.maxQuantity') }}</span>
        <span class="font-semibold tabular-nums" :title="largestQuantityPurchase?.name">
          {{ largestQuantityPurchase?.quantity ?? 0 }}×
        </span>
      </div>

      <!-- Unit Prices -->
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.mostExpensivePerUnit') }}</span>
        <span class="font-semibold tabular-nums" :title="mostExpensiveSingleUnit?.name">
          {{ formatCurrency(mostExpensiveSingleUnit?.unitPrice ?? 0) }}
        </span>
      </div>

      <!-- Unique Counts -->
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.categories') }}</span>
        <span class="font-semibold tabular-nums">{{ uniqueCategories }}</span>
      </div>
      <div class="flex justify-between gap-4 border-b border-line py-2">
        <span class="font-medium text-fg-muted">{{ $t('summary.stores') }}</span>
        <span class="font-semibold tabular-nums">{{ uniqueStores }}</span>
      </div>
    </div>

    <!-- Details Section -->
    <div v-if="mostExpensiveItem" class="mt-4 space-y-1.5 rounded-lg bg-surface-2 p-3 text-sm">
      <div class="text-xs text-fg-muted">
        <span class="font-medium text-fg-muted">{{ $t('summary.mostExpensivePurchase') }}</span>
        {{ mostExpensiveItem.name }} ({{ mostExpensiveItem.quantity }}×
        {{ formatCurrency(mostExpensiveItem.unitPrice) }})
      </div>
      <div class="text-xs text-fg-muted">
        <span class="font-medium text-fg-muted">{{ $t('summary.cheapestPurchase') }}</span>
        {{ leastExpensiveItem?.name }} ({{ leastExpensiveItem?.quantity }}×
        {{ formatCurrency(leastExpensiveItem?.unitPrice ?? 0) }})
      </div>
      <div
        v-if="largestQuantityPurchase && largestQuantityPurchase.quantity > 1"
        class="text-xs text-fg-muted"
      >
        <span class="font-medium text-fg-muted">{{ $t('summary.largestQuantity') }}</span>
        {{ largestQuantityPurchase.name }} ({{ largestQuantityPurchase.quantity }}×
        {{ $t('summary.pricePerUnit') }} {{ formatCurrency(largestQuantityPurchase.unitPrice) }})
      </div>
    </div>
  </SummaryCard>
</template>
