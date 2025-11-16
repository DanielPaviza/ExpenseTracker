<script setup lang="ts">
import { Spending } from '@models/Spending'
import { useSpendingsStore } from '@stores/spendingsStore'
import { formatNumber, generateColorPalette } from '@utils/formatUtils'
import { computed } from 'vue'
import SummaryCard from '@components/SpendingsDashboard/SummaryCard.vue'

const { spendings, payers, totalPrice } = useSpendingsStore()

const priceByPayer = (payer: string) =>
  spendings
    ? spendings
        .filter((s: Spending) => s.payer === payer)
        .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
    : 0

const chartLabels = computed(() => payers.map((payer) => `${payer} (${pricePercentByPayer(payer)}%)`))
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
      <div class="font-bold min-w-[30px] w-full text-blueLight">{{ payer }}:</div>
      <div class="ms-5 font-semibold">{{ formatNumber(priceByPayer(payer)) }} Kč</div>
      <div class="text-blueLight text-sm text-muted-foreground">({{ pricePercentByPayer(payer) }}%)</div>
    </div>
    <hr class="my-2 text-blueLight" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blueLight">Celkem zaplaceno:</div>
      <div class="ms-5">{{ formatNumber(totalPrice) }} Kč</div>
    </div>
  </SummaryCard>
</template>
