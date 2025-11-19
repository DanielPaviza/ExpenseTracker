<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const types = computed(() => {
    const set = new Set<string>()
    for (const s of spendings) {
      if (s.type) set.add(s.type)
    }
    return Array.from(set)
  })

  const priceByType = (type: string) =>
    spendings
      .filter((s: Spending) => s.type === type)
      .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)

  const countByType = (type: string) => spendings.filter((s: Spending) => s.type === type).length

  const chartLabels = computed(() =>
    types.value.map((type) => `${type} (${pricePercentByType(type)}%)`),
  )
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle typu',
      data: types.value.map((type) => priceByType(type)),
      backgroundColor: generateColorPalette(['#f59e0b', '#fbbf24'], types.value.length),
    },
  ])

  const pricePercentByType = (type: string) => {
    const price = priceByType(type)
    if (!totalPrice || totalPrice === 0) return 0
    return Math.round((price / totalPrice) * 100)
  }
</script>

<template>
  <SummaryCard
    title="Výdaje dle typu"
    chart-type="Bar"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="type in types" :key="type" class="flex items-center gap-2">
      <div class="font-bold min-w-[30px] w-full text-blue">{{ type }}:</div>
      <div class="ms-5 font-semibold">{{ formatNumberToCzk(priceByType(type)) }}</div>
      <div class="text-blue text-sm text-muted-foreground">({{ countByType(type) }}ks)</div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blue">Celkem:</div>
      <div class="ms-5">{{ formatNumberToCzk(totalPrice) }}</div>
    </div>
  </SummaryCard>
</template>
