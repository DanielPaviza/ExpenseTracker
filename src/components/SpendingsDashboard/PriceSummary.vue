<script setup lang="ts">
import { Spending } from '@models/Spending'
import { useSpendingsStore } from '@stores/spendingsStore'
import { formatNumber } from '@utils/formatUtils'
import { computed } from 'vue'
import SummaryCard from '@components/SpendingsDashboard/SummaryCard.vue'

const { spendings, payers, totalPrice } = useSpendingsStore()

const priceByPayer = (payer: string) =>
  spendings
    ? spendings
        .filter((s: Spending) => s.payer === payer)
        .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
    : 0

const chartLabels = computed(() => (payers ? payers : []))
const chartDatasets = computed(() => [
  {
    label: 'Výdaje podle plátců',
    data: chartLabels.value.map((payer) => priceByPayer(payer)),
    backgroundColor: ['#06402b', '#687c71'],
  },
])
</script>

<template>
  <SummaryCard
    title="Celkové výdaje"
    chart-type="Bar"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="payer in payers ? payers : []" :key="payer" class="flex">
      <div class="font-bold min-w-[30px] w-full text-blueLight">{{ payer }}:</div>
      <div class="font-semibold">{{ formatNumber(priceByPayer(payer)) }} Kč</div>
    </div>
    <div class="mt-2 pt-2 border-t-2 border-primaryLight flex font-bold w-full justify-between">
      <div class="text-blueLight">Celkem:</div>
      <div class="ms-5">{{ formatNumber(totalPrice) }} Kč</div>
    </div>
  </SummaryCard>
</template>
