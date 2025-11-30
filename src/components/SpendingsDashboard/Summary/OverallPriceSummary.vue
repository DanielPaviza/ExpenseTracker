<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'

  const store = useSpendingsStore()
  const { spendings, payers, totalPrice } = storeToRefs(store)

  const MAX_DISPLAYED_ITEMS = 5
  const showAll = ref(false)

  const payerStats = computed(() => {
    return payers.value.map((payer) => {
      const payerSpendings = spendings.value.filter((s) => s.payer === payer && !s.isFree)
      const price = payerSpendings
        .filter((s) => !s.isToBePaid)
        .reduce((sum, s) => sum + s.totalPrice, 0)
      const unpaid = payerSpendings
        .filter((s) => s.isToBePaid)
        .reduce((sum, s) => sum + s.totalPrice, 0)
      const percent = totalPrice.value > 0 ? Math.round((price / totalPrice.value) * 100) : 0
      return { name: payer, price, unpaid, percent }
    })
  })

  const displayedPayers = computed(() => {
    return showAll.value ? payerStats.value : payerStats.value.slice(0, MAX_DISPLAYED_ITEMS)
  })

  const chartLabels = computed(() => payerStats.value.map((p) => `${p.name} (${p.percent}%)`))
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle plátců',
      data: payerStats.value.map((p) => p.price),
      backgroundColor: generateColorPalette(payerStats.value.length, [
        '#06402b',
        '#ff9eaf',
        '#ff4551',
      ]),
    },
  ])
</script>

<template>
  <SummaryCard
    title="Celkové výdaje"
    :subtitle="`Celkem ${formatNumberToCzk(totalPrice)}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="payer in displayedPayers" :key="payer.name" class="flex items-start gap-2 mb-1">
      <div class="font-bold min-w-20 w-full text-blue truncate" :title="payer.name">
        {{ payer.name }}:
      </div>
      <div>
        <div class="flex items-center gap-2">
          <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(payer.price) }}</div>
          <div class="text-blue text-sm text-muted-foreground">({{ payer.percent }}%)</div>
        </div>
        <div
          v-if="payer.unpaid > 0"
          class="flex justify-end text-blue text-sm text-muted-foreground"
        >
          {{ formatNumberToCzk(payer.unpaid) }} nezaplaceno
        </div>
      </div>
    </div>

    <div
      v-if="payerStats.length > MAX_DISPLAYED_ITEMS"
      @click="showAll = !showAll"
      class="mt-1 text-blueLight text-xs cursor-pointer"
    >
      {{ showAll ? '▲ Zobrazit méně' : `▼ Zobrazit všechny (${payerStats.length})` }}
    </div>

    <hr class="my-2 text-blue" />
    <div class="text-lg flex justify-between">
      <span class="font-bold text-blue">Celkem:</span>
      <span class="font-semibold">{{ formatNumberToCzk(totalPrice) }}</span>
    </div>
  </SummaryCard>
</template>
