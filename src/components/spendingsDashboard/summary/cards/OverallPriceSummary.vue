<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { generateColorPalette } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SummaryCard from '@/components/spendingsDashboard/summary/SummaryCard.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const store = useSpendingsStore()
  const { spendings, payers, totalPrice } = storeToRefs(store)
  const { t } = useI18n()
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
  const payerColors = computed(() => generateColorPalette(payerStats.value.length))

  const chartDatasets = computed(() => [
    {
      label: t('summary.expensesByPayers'),
      data: payerStats.value.map((p) => p.price),
      backgroundColor: payerColors.value,
    },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.totalExpenses')"
    :subtitle="`${$t('summary.total')} ${formatCurrency(totalPrice)}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="(payer, idx) in displayedPayers" :key="payer.name" class="py-1.5">
      <div class="flex items-baseline justify-between gap-4">
        <div class="flex min-w-0 items-center gap-2">
          <span
            class="size-2 shrink-0 rounded-full"
            :style="{ backgroundColor: payerColors[idx] }"
          />
          <span class="truncate font-medium text-fg" :title="payer.name">{{ payer.name }}</span>
        </div>
        <div class="flex shrink-0 items-baseline gap-2">
          <span class="text-xs text-fg-subtle tabular-nums">{{ payer.percent }}%</span>
          <span class="font-semibold whitespace-nowrap tabular-nums">
            {{ formatCurrency(payer.price) }}
          </span>
        </div>
      </div>
      <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-3">
        <div
          class="h-full rounded-full"
          :style="{ width: `${Math.max(payer.percent, 1)}%`, backgroundColor: payerColors[idx] }"
        />
      </div>
      <div v-if="payer.unpaid > 0" class="mt-1 text-right text-xs text-warning">
        + {{ formatCurrency(payer.unpaid) }} {{ $t('summary.unpaid') }}
      </div>
    </div>

    <div
      v-if="payerStats.length > MAX_DISPLAYED_ITEMS"
      class="mt-1 text-primary text-xs font-medium cursor-pointer hover:underline"
      @click="showAll = !showAll"
    >
      {{
        showAll
          ? $t('common.showLessArrowCount')
          : $t('common.showAllArrowCount', { count: payerStats.length })
      }}
    </div>

    <div class="mt-3 flex justify-between border-t border-line pt-3 text-base">
      <span class="font-medium text-fg-muted">{{ $t('summary.total') }}</span>
      <span class="font-semibold tabular-nums">{{ formatCurrency(totalPrice) }}</span>
    </div>
  </SummaryCard>
</template>
