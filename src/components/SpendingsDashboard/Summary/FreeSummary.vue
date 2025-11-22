<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'

  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const freeSpendings = computed(() => spendings.value.filter((s) => s.isFree))

  const priceFree = computed(() => freeSpendings.value.reduce((sum, s) => sum + s.totalPrice, 0))

  const priceTotalWithFree = computed(() => totalPrice.value + priceFree.value)

  const priceFreePercent = computed(() => {
    const total = priceTotalWithFree.value
    if (!total || total === 0) return 0
    return Math.round((priceFree.value / total) * 100)
  })

  const chartLabels = computed(() => [
    `Zaplaceno (${100 - priceFreePercent.value}%)`,
    `Zdarma (${priceFreePercent.value}%)`,
  ])
  const chartDatasets = computed(() => [
    {
      label: 'Ušetřené výdaje',
      data: [totalPrice.value, priceFree.value],
      backgroundColor: ['#06402b', '#10b981'],
    },
  ])
</script>

<template>
  <SummaryCard
    title="Ušetřené výdaje"
    :subtitle="`${freeSpendings.length} položek`"
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="max-w-[90%]">
      <div class="flex justify-between">
        <div class="font-bold text-blue me-3">Celkem zaplaceno:</div>
        <div class="font-semibold">{{ formatNumberToCzk(totalPrice) }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">Ušetřeno:</div>
        <div class="font-semibold text-green-600">{{ formatNumberToCzk(priceFree) }}</div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <div>(Celkem s ušetřenými)</div>
        <div>{{ formatNumberToCzk(priceTotalWithFree) }}</div>
      </div>
      <div class="border-t border-blue mt-4">
        <div class="text-blue mb-2 mt-4">Položky zdarma:</div>
        <div class="overflow-y-auto max-h-40 pr-2 text-sm">
          <div
            v-for="spending in freeSpendings"
            :key="spending.id"
            class="flex space-y-1 items-center gap-4"
          >
            <span class="truncate font-semibold" :title="spending.name">{{ spending.name }}</span>
            <span class="font-semibold whitespace-nowrap">{{
              formatNumberToCzk(spending.totalPrice)
            }}</span>
            <span v-if="spending.store">-> {{ spending.store }}</span>
          </div>
          <div v-if="freeSpendings.length === 0" class="text-gray-500">Žádné ušetřené výdaje.</div>
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
