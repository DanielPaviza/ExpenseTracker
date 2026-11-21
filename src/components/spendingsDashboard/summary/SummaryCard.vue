<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Chart from '@/components/spendingsDashboard/summary/Chart.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const {
    title,
    subtitle,
    chartType = 'None',
    chartLabels,
    chartDatasets,
    chartTypeChangeEnabled = false,
    showFooter = true,
    showTotalPrice = false,
  } = defineProps({
    title: String,
    subtitle: String,
    chartType: String as () => 'None' | 'Bar' | 'Doughnut' | 'Line',
    chartLabels: Array as () => string[],
    chartDatasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[] | string
      borderColor?: string[] | string
      borderWidth?: number
      tension?: number
      isCount?: boolean
    }[],
    chartTypeChangeEnabled: Boolean,
    showFooter: { type: Boolean, default: true },
    showTotalPrice: Boolean,
  })

  const spendingsStore = useSpendingsStore()
  const { totalPrice, spendings } = storeToRefs(spendingsStore)

  const selectedChartType = ref<'Doughnut' | 'Bar' | 'Line'>(
    chartType !== 'None' ? (chartType as 'Doughnut' | 'Bar' | 'Line') : 'Doughnut',
  )

  const { t } = useI18n()
  const chartTypeOptions = computed(() => [
    { value: 'Doughnut' as const, label: t('summary.donut') },
    { value: 'Bar' as const, label: t('summary.bar') },
    { value: 'Line' as const, label: t('summary.line') },
  ])

  const showContent = computed(() => {
    return spendings.value.length > 0
  })
</script>

<template>
  <div class="card flex h-full flex-col p-6">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-fg">{{ title }}</h3>
        <p v-if="subtitle" class="mt-0.5 text-sm text-fg-muted">{{ subtitle }}</p>
      </div>
      <div
        v-if="chartTypeChangeEnabled && chartType != 'None' && showContent"
        class="flex shrink-0 rounded-lg bg-surface-3 p-0.5"
        :title="$t('summary.chartType')"
      >
        <button
          v-for="option in chartTypeOptions"
          :key="option.value"
          type="button"
          class="rounded-md px-2.5 py-1 text-xs font-medium transition"
          :class="
            selectedChartType === option.value
              ? 'bg-surface text-fg shadow-sm'
              : 'text-fg-muted hover:text-fg'
          "
          @click="selectedChartType = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col items-stretch gap-8 md:flex-row xl:flex-col 2xl:flex-row">
      <div class="flex min-w-0 flex-1 flex-col gap-1 text-sm">
        <slot v-if="showContent" />
        <div v-else class="py-6 text-center text-fg-subtle">
          {{ $t('common.noRecordsFound') }}
        </div>
      </div>
      <div
        v-if="chartType != 'None' && chartLabels && chartDatasets && showContent"
        class="flex shrink-0 items-center justify-center self-center"
      >
        <Chart :type="selectedChartType" :labels="chartLabels" :datasets="chartDatasets" />
      </div>
    </div>

    <div v-if="showFooter && $slots.footer" class="mt-5 border-t border-line pt-4">
      <slot name="footer" />
    </div>
    <div
      v-if="showTotalPrice"
      class="mt-5 flex justify-between border-t border-line pt-3 text-sm font-semibold"
    >
      <span class="text-fg-muted">{{ $t('summary.total') }}</span>
      <span class="tabular-nums">{{ formatCurrency(totalPrice) }}</span>
    </div>
  </div>
</template>
