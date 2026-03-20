<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SummaryCard from '@/components/spendingsDashboard/summary/SummaryCard.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const dateStats = computed(() => {
    const paidSpendings = spendings.value.filter((s) => !s.isFree && !s.isToBePaid)
    if (paidSpendings.length === 0)
      return {
        firstDate: null,
        lastDate: null,
        totalDays: 0,
        totalWeeks: 0,
        totalMonths: 0,
      }

    const sortedByDate = [...paidSpendings].sort(
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
    return totalDays > 0 ? totalPrice.value / totalDays : 0
  })

  const averagePerWeek = computed(() => {
    const { totalWeeks } = dateStats.value
    return totalWeeks > 0 ? totalPrice.value / totalWeeks : 0
  })

  const averagePerMonth = computed(() => {
    const { totalMonths } = dateStats.value
    return totalMonths > 0 ? totalPrice.value / totalMonths : 0
  })

  const chartLabels = computed(() => [
    t('summary.daily'),
    t('summary.weekly'),
    t('summary.monthly'),
  ])
  const chartDatasets = computed(() => [
    {
      label: t('summary.averageExpenses'),
      data: [averagePerDay.value, averagePerWeek.value, averagePerMonth.value],
      backgroundColor: ['#ef4444', '#f97316', '#eab308'],
    },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.averageExpenses')"
    :subtitle="$t('summary.basedOnTimePeriod')"
    chart-type="Bar"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="w-100 space-y-2">
      <div class="flex justify-between">
        <div class="font-bold text-blue">{{ $t('summary.avgDaily') }}:</div>
        <div class="font-semibold">
          {{ formatCurrency(averagePerDay) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">{{ $t('summary.avgWeekly') }}:</div>
        <div class="font-semibold">
          {{ formatCurrency(averagePerWeek) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">{{ $t('summary.avgMonthly') }}:</div>
        <div class="font-semibold">
          {{ formatCurrency(averagePerMonth) }}
        </div>
      </div>
    </div>
    <template #footer>
      <div class="text-sm text-gray-500">
        {{ $t('summary.totalFor') }}
        <span class="font-bold">{{ dateStats.totalDays }}</span> {{ $t('summary.days') }},
        <span class="font-bold">{{ dateStats.totalWeeks }}</span> {{ $t('summary.weeks') }},
        <span class="font-bold">{{ dateStats.totalMonths }}</span> {{ $t('summary.months') }}.
      </div>
    </template>
  </SummaryCard>
</template>
