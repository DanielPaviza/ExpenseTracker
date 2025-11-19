<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, payers, totalPrice } = useSpendingsStore()

  const priceByPayer = (payer: string) =>
    spendings
      ? spendings
          .filter((s: Spending) => s.payer === payer)
          .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      : 0

  const chartLabels = computed(() =>
    payers.map((payer) => `${payer} (${pricePercentByPayer(payer)}%)`),
  )
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle plátců',
      data: payers.map((payer) => priceByPayer(payer)),
      backgroundColor: generateColorPalette(['#06402b', '#687c71'], payers.length),
    },
  ])

  const pricePercentByPayer = (payer: string) => {
    const price = priceByPayer(payer)
    if (!totalPrice || totalPrice === 0) return 0
    return Math.round((price / totalPrice) * 100)
  }
</script>

<template>
  <SummaryCard
    title="Celkové výdaje"
    chart-type="Bar"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="payer in payers ? payers : []" :key="payer" class="flex items-center gap-2">
      <div class="font-bold min-w-[30px] w-full text-blue">{{ payer }}:</div>
      <div class="ms-5 font-semibold">{{ formatNumberToCzk(priceByPayer(payer)) }}</div>
      <div class="text-blue text-sm text-muted-foreground">({{ pricePercentByPayer(payer) }}%)</div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blue">Celkem zaplaceno:</div>
      <div class="ms-5">{{ formatNumberToCzk(totalPrice) }}</div>
    </div>
  </SummaryCard>
</template>
