<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings } = useSpendingsStore()

  const recentSpendings = computed(() => {
    return [...spendings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 7)
  })

  const recentTotal = computed(() =>
    recentSpendings.value.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0),
  )

  const chartLabels = computed(() =>
    recentSpendings.value.map((s) => `${s.name.substring(0, 15)}...`),
  )
  const chartDatasets = computed(() => [
    {
      label: 'Poslední nákupy',
      data: recentSpendings.value.map((s) => s.totalPrice),
      backgroundColor: [
        '#06402b',
        '#1a5c3f',
        '#2e7453',
        '#428c67',
        '#56a47b',
        '#6abc8f',
        '#7ed4a3',
      ],
    },
  ])

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit' })
  }
</script>

<template>
  <SummaryCard
    title="Poslední nákupy"
    chart-type="Bar"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="spending in recentSpendings" :key="spending.id" class="flex items-center gap-2">
      <div class="font-semibold text-blue text-xs w-[45px]">
        {{ formatDate(spending.createdAt) }}
      </div>
      <div class="font-bold min-w-[30px] w-full truncate">{{ spending.name }}</div>
      <div class="ms-2 font-semibold whitespace-nowrap">
        {{ formatNumberToCzk(spending.totalPrice) }}
      </div>
    </div>
    <hr class="my-2 text-blue" />
    <div class="flex font-bold w-full justify-between">
      <div class="text-blue">Celkem ({{ recentSpendings.length }}):</div>
      <div class="ms-5">{{ formatNumberToCzk(recentTotal) }}</div>
    </div>
  </SummaryCard>
</template>
