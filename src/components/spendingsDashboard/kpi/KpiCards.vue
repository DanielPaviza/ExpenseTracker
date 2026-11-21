<script setup lang="ts">
  import { CalendarOutline, CardOutline, HourglassOutline, ReceiptOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { type Component, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t, d } = useI18n()
  const store = useSpendingsStore()
  const { spendings, totalPrice, totalPriceAll, totalUnpaid, categoryView } = storeToRefs(store)

  const paidSpendings = computed(() => spendings.value.filter((s) => !s.isFree && !s.isToBePaid))
  const unpaidCount = computed(
    () => spendings.value.filter((s) => !s.isFree && s.isToBePaid).length,
  )

  const firstDate = computed(() => {
    if (paidSpendings.value.length === 0) return null
    return new Date(Math.min(...paidSpendings.value.map((s) => new Date(s.createdAt).getTime())))
  })

  const monthlyAverage = computed(() => {
    if (paidSpendings.value.length === 0 || !firstDate.value) return 0
    const last = new Date(
      Math.max(...paidSpendings.value.map((s) => new Date(s.createdAt).getTime())),
    )
    const months =
      (last.getFullYear() - firstDate.value.getFullYear()) * 12 +
      (last.getMonth() - firstDate.value.getMonth()) +
      1
    return totalPrice.value / Math.max(1, months)
  })

  type Kpi = {
    key: string
    label: string
    value: string
    hint: string
    icon: Component
    tone: string
  }

  const kpis = computed<Kpi[]>(() => [
    {
      key: 'paid',
      label: t('kpi.totalPaid'),
      value: formatCurrency(totalPrice.value),
      hint:
        categoryView.value && totalPriceAll.value > 0
          ? t('kpi.ofAll', { percent: Math.round((totalPrice.value / totalPriceAll.value) * 100) })
          : firstDate.value
            ? t('kpi.sinceDate', { date: d(firstDate.value, 'short') })
            : '—',
      icon: CardOutline,
      tone: 'bg-primary-soft text-primary',
    },
    {
      key: 'unpaid',
      label: t('kpi.unpaid'),
      value: formatCurrency(totalUnpaid.value),
      hint: t('kpi.itemsCount', { count: unpaidCount.value }),
      icon: HourglassOutline,
      tone: totalUnpaid.value > 0 ? 'bg-warning/12 text-warning' : 'bg-surface-3 text-fg-muted',
    },
    {
      key: 'count',
      label: t('kpi.purchases'),
      value: String(spendings.value.length),
      hint: t('kpi.itemsCount', {
        count: paidSpendings.value.reduce((sum, s) => sum + s.quantity, 0),
      }),
      icon: ReceiptOutline,
      tone: 'bg-cyan-500/12 text-cyan-600 dark:text-cyan-400',
    },
    {
      key: 'monthly',
      label: t('kpi.monthlyAverage'),
      value: formatCurrency(monthlyAverage.value),
      hint: t('summary.basedOnTimePeriod'),
      icon: CalendarOutline,
      tone: 'bg-violet-500/12 text-violet-600 dark:text-violet-400',
    },
  ])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
    <div v-for="kpi in kpis" :key="kpi.key" class="card flex items-start gap-4 p-5">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="kpi.tone">
        <n-icon size="20"><component :is="kpi.icon" /></n-icon>
      </div>
      <div class="min-w-0">
        <div class="text-sm font-medium text-fg-muted">{{ kpi.label }}</div>
        <div class="mt-0.5 truncate text-2xl font-semibold tracking-tight tabular-nums text-fg">
          {{ kpi.value }}
        </div>
        <div class="mt-0.5 truncate text-xs text-fg-subtle">{{ kpi.hint }}</div>
      </div>
    </div>
  </div>
</template>
