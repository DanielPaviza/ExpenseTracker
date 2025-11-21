<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const totalItems = computed(() =>
    spendings.reduce((sum: number, s: Spending) => sum + s.quantity, 0),
  )

  const averagePricePerItem = computed(() => {
    if (totalItems.value === 0) return 0
    return totalPrice / totalItems.value
  })

  const averagePricePerSpending = computed(() => {
    if (spendings.length === 0) return 0
    return totalPrice / spendings.length
  })

  const averageItemsPerSpending = computed(() => {
    if (spendings.length === 0) return 0
    return totalItems.value / spendings.length
  })

  const mostExpensiveItem = computed(() => {
    if (spendings.length === 0) return null
    return spendings.reduce((max, s) => (s.totalPrice > max.totalPrice ? s : max))
  })

  const cheapestItem = computed(() => {
    if (spendings.length === 0) return null
    return spendings.reduce((min, s) => (s.totalPrice < min.totalPrice ? s : min))
  })

  const medianPrice = computed(() => {
    if (spendings.length === 0) return 0
    const sorted = [...spendings].sort((a, b) => a.totalPrice - b.totalPrice)
    const mid = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1].totalPrice + sorted[mid].totalPrice) / 2
    }
    return sorted[mid].totalPrice
  })

  const highestQuantityItem = computed(() => {
    if (spendings.length === 0) return null
    return spendings.reduce((max, s) => (s.quantity > max.quantity ? s : max))
  })

  const chartLabels = computed(() => ['Celkový počet položek', 'Celkový počet nákupů'])
  const chartDatasets = computed(() => [
    {
      label: 'Statistiky',
      data: [totalItems.value, spendings.length],
      backgroundColor: ['#06402b', '#336c8d'],
    },
  ])
</script>

<template>
  <SummaryCard
    title="Statistiky nákupů"
    :subtitle="`${spendings.length} nákupů, ${totalItems} položek`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="space-y-2">
      <div class="flex justify-between">
        <div class="font-bold text-blue">Počet nákupů:</div>
        <div class="font-semibold">{{ spendings.length }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">Celkový počet položek:</div>
        <div class="font-semibold">{{ totalItems }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">Průměr položek/nákup:</div>
        <div class="font-semibold">{{ averageItemsPerSpending.toFixed(1) }}</div>
      </div>
    </div>

    <template #footer>
      <div class="space-y-3">
        <div class="space-y-2">
          <div class="text-sm font-bold text-blue">Cenové statistiky:</div>
          <div class="flex justify-between text-sm">
            <span>Průměr na nákup:</span>
            <span class="font-semibold">{{ formatNumberToCzk(averagePricePerSpending) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Průměr na položku:</span>
            <span class="font-semibold">{{ formatNumberToCzk(averagePricePerItem) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Medián nákupu:</span>
            <span class="font-semibold">{{ formatNumberToCzk(medianPrice) }}</span>
          </div>
        </div>

        <div v-if="mostExpensiveItem" class="space-y-1">
          <div class="text-sm font-bold text-blue">Nejdražší nákup:</div>
          <div class="text-sm truncate" :title="mostExpensiveItem.name">
            {{ mostExpensiveItem.name }}
          </div>
          <div class="font-semibold">{{ formatNumberToCzk(mostExpensiveItem.totalPrice) }}</div>
        </div>

        <div v-if="cheapestItem" class="space-y-1">
          <div class="text-sm font-bold text-blue">Nejlevnější nákup:</div>
          <div class="text-sm truncate" :title="cheapestItem.name">{{ cheapestItem.name }}</div>
          <div class="font-semibold">{{ formatNumberToCzk(cheapestItem.totalPrice) }}</div>
        </div>

        <div v-if="highestQuantityItem" class="space-y-1">
          <div class="text-sm font-bold text-blue">
            Nejvíce položek ({{ highestQuantityItem.quantity }}ks):
          </div>
          <div class="text-sm truncate" :title="highestQuantityItem.name">
            {{ highestQuantityItem.name }}
          </div>
        </div>
      </div>
    </template>
  </SummaryCard>
</template>
