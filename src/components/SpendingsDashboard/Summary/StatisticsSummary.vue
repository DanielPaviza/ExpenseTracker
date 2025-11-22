<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'

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
  <SummaryCard title="Statistiky nákupů" :subtitle="`${paidSpendings.length} nákupů`">
    <div class="grid grid-cols-2 text-base gap-x-10 gap-y-2">
      <!-- Basic Stats -->
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Nákupy:</span>
        <span class="font-semibold">{{ paidSpendings.length }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Položky:</span>
        <span class="font-semibold">{{ totalItems }}</span>
      </div>

      <!-- Averages -->
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Ø na nákup:</span>
        <span class="font-semibold">{{ formatNumberToCzk(averagePricePerSpending) }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Ø na položku:</span>
        <span class="font-semibold">{{ formatNumberToCzk(averagePricePerItem) }}</span>
      </div>

      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Ø položek:</span>
        <span class="font-semibold">{{ averageItemsPerSpending.toFixed(1) }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Medián ceny:</span>
        <span class="font-semibold">{{ formatNumberToCzk(medianSpendingPrice) }}</span>
      </div>

      <!-- Extremes -->
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Nejdražší:</span>
        <span class="font-semibold" :title="mostExpensiveItem?.name">
          {{ formatNumberToCzk(mostExpensiveItem?.totalPrice ?? 0) }}
        </span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Nejlevnější:</span>
        <span class="font-semibold" :title="leastExpensiveItem?.name">
          {{ formatNumberToCzk(leastExpensiveItem?.totalPrice ?? 0) }}
        </span>
      </div>

      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Max množství:</span>
        <span class="font-semibold" :title="largestQuantityPurchase?.name">
          {{ largestQuantityPurchase?.quantity ?? 0 }}×
        </span>
      </div>

      <!-- Unit Prices -->
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Nejdražší/ks:</span>
        <span class="font-semibold text-sm" :title="mostExpensiveSingleUnit?.name">
          {{ formatNumberToCzk(mostExpensiveSingleUnit?.unitPrice ?? 0) }}
        </span>
      </div>

      <!-- Unique Counts -->
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Kategorie:</span>
        <span class="font-semibold">{{ uniqueCategories }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="font-bold text-blue">Obchody:</span>
        <span class="font-semibold">{{ uniqueStores }}</span>
      </div>
    </div>

    <!-- Details Section -->
    <div v-if="mostExpensiveItem" class="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
      <div class="text-xs text-muted-foreground">
        <span class="font-bold text-blue">Nejdražší nákup:</span>
        {{ mostExpensiveItem.name }} ({{ mostExpensiveItem.quantity }}×
        {{ formatNumberToCzk(mostExpensiveItem.unitPrice) }})
      </div>
      <div class="text-xs text-muted-foreground">
        <span class="font-bold text-blue">Nejlevnější nákup:</span>
        {{ leastExpensiveItem?.name }} ({{ leastExpensiveItem?.quantity }}×
        {{ formatNumberToCzk(leastExpensiveItem?.unitPrice ?? 0) }})
      </div>
      <div
        v-if="largestQuantityPurchase && largestQuantityPurchase.quantity > 1"
        class="text-xs text-muted-foreground"
      >
        <span class="font-bold text-blue">Největší množství:</span>
        {{ largestQuantityPurchase.name }} ({{ largestQuantityPurchase.quantity }}× po
        {{ formatNumberToCzk(largestQuantityPurchase.unitPrice) }})
      </div>
    </div>
  </SummaryCard>
</template>
