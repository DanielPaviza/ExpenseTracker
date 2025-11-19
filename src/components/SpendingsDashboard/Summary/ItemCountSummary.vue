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

  const mostExpensiveItem = computed(() => {
    if (spendings.length === 0) return null
    return spendings.reduce((max, s) => (s.totalPrice > max.totalPrice ? s : max))
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
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blue">Počet nákupů:</div>
      <div class="font-semibold ms-5">{{ spendings.length }}</div>
    </div>
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blue">Celkový počet položek:</div>
      <div class="font-semibold ms-5">{{ totalItems }}</div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blue">Průměr na nákup:</div>
      <div class="font-semibold ms-5">{{ formatNumberToCzk(averagePricePerSpending) }}</div>
    </div>
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blue">Průměr na položku:</div>
      <div class="font-semibold ms-5">{{ formatNumberToCzk(averagePricePerItem) }}</div>
    </div>
    <hr class="my-2 text-blue" />
    <div v-if="mostExpensiveItem" class="flex flex-col gap-1">
      <div class="font-bold text-blue">Nejdražší nákup:</div>
      <div class="text-sm">{{ mostExpensiveItem.name }}</div>
      <div class="font-semibold">{{ formatNumberToCzk(mostExpensiveItem.totalPrice) }}</div>
    </div>
  </SummaryCard>
</template>
