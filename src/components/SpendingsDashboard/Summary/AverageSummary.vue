<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const dateStats = computed(() => {
    if (spendings.length === 0) {
      return {
        firstDate: null,
        lastDate: null,
        totalDays: 0,
        totalWeeks: 0,
        totalMonths: 0,
      }
    }

    const sortedByDate = [...spendings].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    const firstDate = new Date(sortedByDate[0].createdAt)
    const lastDate = new Date(sortedByDate[sortedByDate.length - 1].createdAt)
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    const totalWeeks = Math.ceil(totalDays / 7)
    const totalMonths =
      (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
      (lastDate.getMonth() - firstDate.getMonth()) +
      1

    return { firstDate, lastDate, totalDays, totalWeeks, totalMonths }
  })

  const averagePerDay = computed(() => {
    const { totalDays } = dateStats.value
    return totalDays > 0 ? totalPrice / totalDays : 0
  })

  const averagePerWeek = computed(() => {
    const { totalWeeks } = dateStats.value
    return totalWeeks > 0 ? totalPrice / totalWeeks : 0
  })

  const averagePerMonth = computed(() => {
    const { totalMonths } = dateStats.value
    return totalMonths > 0 ? totalPrice / totalMonths : 0
  })

  const chartLabels = computed(() => ['Denní', 'Týdenní', 'Měsíční'])
  const chartDatasets = computed(() => [
    {
      label: 'Průměrné výdaje',
      data: [averagePerDay.value, averagePerWeek.value, averagePerMonth.value],
      backgroundColor: ['#ef4444', '#f97316', '#eab308'],
    },
  ])
</script>

<template>
  <SummaryCard
    title="Průměrné výdaje"
    subtitle="Vzhledem k časovému období"
    chart-type="Bar"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="flex justify-between">
      <div class="font-bold text-blue">Průměr denně:</div>
      <div class="font-semibold">{{ formatNumberToCzk(averagePerDay) }}</div>
    </div>
    <div class="flex justify-between">
      <div class="font-bold text-blue">Průměr týdně:</div>
      <div class="font-semibold">{{ formatNumberToCzk(averagePerWeek) }}</div>
    </div>
    <div class="flex justify-between">
      <div class="font-bold text-blue">Průměr měsíčně:</div>
      <div class="font-semibold">{{ formatNumberToCzk(averagePerMonth) }}</div>
    </div>
    <template #footer>
      <div class="text-sm text-gray-500">
        Celkem za
        <span class="font-bold">{{ dateStats.totalDays }}</span> dní,
        <span class="font-bold">{{ dateStats.totalWeeks }}</span> týdnů,
        <span class="font-bold">{{ dateStats.totalMonths }}</span> měsíců.
      </div>
    </template>
  </SummaryCard>
</template>
