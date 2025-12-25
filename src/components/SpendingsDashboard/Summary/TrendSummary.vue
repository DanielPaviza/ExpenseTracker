<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NButton, NButtonGroup } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings } = storeToRefs(store)

  type Grouping = 'day' | 'week' | 'month'
  const groupBy = ref<Grouping>('month')

  const spendingTrends = computed(() => {
    const groups: { [key: string]: { total: number; count: number } } = {}

    spendings.value
      .filter((s) => !s.isFree && !s.isToBePaid)
      .forEach((s) => {
        const date = new Date(s.createdAt)
        let key = ''
        if (groupBy.value === 'day') {
          key = date.toISOString().split('T')[0]
        } else if (groupBy.value === 'week') {
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
          key = weekStart.toISOString().split('T')[0]
        } else {
          // month
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        }

        if (!groups[key]) {
          groups[key] = { total: 0, count: 0 }
        }
        groups[key].total += s.totalPrice
        groups[key].count++
      })

    return Object.entries(groups)
      .map(([key, value]) => ({
        date: key,
        total: value.total,
        count: value.count,
      }))
      .sort((a, b) => (a.date > b.date ? 1 : -1))
  })

  const cumulativeSpending = computed(() => {
    let cumulativeTotal = 0
    return spendingTrends.value.map((trend) => {
      cumulativeTotal += trend.total
      return cumulativeTotal
    })
  })

  const chartLabels = computed(() => spendingTrends.value.map((t) => t.date))
  const chartDatasets = computed(() => [
    {
      label: `${t('summary.expensesFor')} ${groupBy.value}`,
      data: spendingTrends.value.map((t) => t.total),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: t('summary.cumulativeExpenses'),
      data: cumulativeSpending.value,
      backgroundColor: 'rgba(234, 179, 8, 0.5)',
      borderColor: 'rgba(234, 179, 8, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.spendingTrends')"
    chart-type="Line"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
    :show-footer="false"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="font-bold text-blue">{{ $t('summary.groupBy') }}:</div>
      <n-button-group size="tiny">
        <n-button :type="groupBy === 'day' ? 'primary' : 'default'" @click="groupBy = 'day'">
          {{ $t('summary.day') }}
        </n-button>
        <n-button :type="groupBy === 'week' ? 'primary' : 'default'" @click="groupBy = 'week'">
          {{ $t('summary.week') }}
        </n-button>
        <n-button :type="groupBy === 'month' ? 'primary' : 'default'" @click="groupBy = 'month'">
          {{ $t('summary.month') }}
        </n-button>
      </n-button-group>
    </div>
    <div class="overflow-y-auto max-h-64 pr-2 text-sm">
      <div
        v-for="trend in spendingTrends"
        :key="trend.date"
        class="flex justify-between items-center"
      >
        <span>{{ trend.date }}:</span>
        <span class="font-semibold">{{ formatCurrency(trend.total) }}</span>
      </div>
    </div>
  </SummaryCard>
</template>
