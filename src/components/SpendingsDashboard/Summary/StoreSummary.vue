<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, stores, totalPrice } = useSpendingsStore()

  const priceByStore = (store: string) =>
    spendings
      .filter((s: Spending) => s.store === store)
      .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)

  const chartLabels = computed(() =>
    stores.map((store) => `${store} (${pricePercentByStore(store)}%)`),
  )
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle obchodů',
      data: stores.map((store) => priceByStore(store)),
      backgroundColor: generateColorPalette(['#8b5cf6', '#a78bfa'], stores.length),
    },
  ])

  const pricePercentByStore = (store: string) => {
    const price = priceByStore(store)
    if (!totalPrice || totalPrice === 0) return 0
    return Math.round((price / totalPrice) * 100)
  }
</script>

<template>
  <SummaryCard
    title="Výdaje dle obchodů"
    chart-type="Bar"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="store in stores" :key="store" class="flex items-center gap-2">
      <div class="font-bold min-w-[30px] w-full text-blue">{{ store }}:</div>
      <div class="ms-5 font-semibold">{{ formatNumberToCzk(priceByStore(store)) }}</div>
      <div class="text-blue text-sm text-muted-foreground">({{ pricePercentByStore(store) }}%)</div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blue">Celkem:</div>
      <div class="ms-5">{{ formatNumberToCzk(totalPrice) }}</div>
    </div>
  </SummaryCard>
</template>
