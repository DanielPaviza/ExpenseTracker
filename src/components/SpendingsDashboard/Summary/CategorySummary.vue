<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, categories, totalPrice } = useSpendingsStore()

  const priceByCategory = (category: string) =>
    spendings
      .filter((s: Spending) => s.category === category)
      .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)

  const chartLabels = computed(() =>
    categories.map((cat) => `${cat} (${pricePercentByCategory(cat)}%)`),
  )
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle kategorií',
      data: categories.map((cat) => priceByCategory(cat)),
      backgroundColor: generateColorPalette(['#3b82f6', '#60a5fa'], categories.length),
    },
  ])

  const pricePercentByCategory = (category: string) => {
    const price = priceByCategory(category)
    if (!totalPrice || totalPrice === 0) return 0
    return Math.round((price / totalPrice) * 100)
  }
</script>

<template>
  <SummaryCard
    title="Výdaje dle kategorií"
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="category in categories" :key="category" class="flex items-center gap-2">
      <div class="font-bold min-w-[30px] w-full text-blue">{{ category }}:</div>
      <div class="ms-5 font-semibold">{{ formatNumberToCzk(priceByCategory(category)) }}</div>
      <div class="text-blue text-sm text-muted-foreground">
        ({{ pricePercentByCategory(category) }}%)
      </div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blue">Celkem:</div>
      <div class="ms-5">{{ formatNumberToCzk(totalPrice) }}</div>
    </div>
  </SummaryCard>
</template>
