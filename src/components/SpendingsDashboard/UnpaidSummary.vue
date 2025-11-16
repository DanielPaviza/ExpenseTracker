<script setup lang="ts">
import { Spending } from '@models/Spending'
import { useSpendingsStore } from '@stores/spendingsStore'
import { formatNumber } from '@utils/formatUtils'
import { computed } from 'vue'
import SummaryCard from '@components/SpendingsDashboard/SummaryCard.vue'

const { spendings, totalPrice } = useSpendingsStore()

const priceUnpaid = computed(() =>
  spendings.reduce((acc: number, spending: Spending) => {
    if (!spending.isPaid) {
      return acc + spending.totalPrice
    }
    return acc
  }, 0),
)

const priceTotalWithUnpaid = computed(() => totalPrice + priceUnpaid.value)

const priceUnpaidPercent = computed(() => {
  const total = priceTotalWithUnpaid.value
  if (!total || total === 0) return 0
  return Math.round((priceUnpaid.value / total) * 100)
})

const chartLabels = computed(() => ['Účtováno', 'Neúčtováno'])
const chartDatasets = computed(() => [
  {
    label: 'Ušetřené výdaje',
    data: [totalPrice, priceUnpaid.value],
    backgroundColor: ['#06402b', '#336c8d'],
  },
])
</script>

<template>
  <SummaryCard
    title="Ušetřené výdaje"
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blueLight">Celkem + nenaúčtováno:</div>
      <div class="font-semibold ms-5">{{ formatNumber(priceTotalWithUnpaid) }} Kč</div>
    </div>
    <div class="flex">
      <div class="font-bold min-w-[30px] w-full text-blueLight">Celkem:</div>
      <div class="font-semibold ms-5">{{ formatNumber(totalPrice) }} Kč</div>
    </div>
    <hr class="my-2 text-blueLight" />
    <div class="flex items-center gap-2">
      <div class="font-bold min-w-[30px] w-full text-blueLight">Ušetřeno:</div>
      <div class="font-semibold">{{ formatNumber(priceUnpaid) }} Kč</div>
      <div class="text-blueLight text-sm text-muted-foreground">({{ priceUnpaidPercent }}%)</div>
    </div>
  </SummaryCard>
</template>
