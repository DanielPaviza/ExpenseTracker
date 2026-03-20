<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SortButtons from '@/components/spendingsDashboard/summary/SortButtons.vue'
  import SummaryCard from '@/components/spendingsDashboard/summary/SummaryCard.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, stores, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const { sortedStats } = useEntityStats({
    spendings,
    entities: stores,
    totalPrice,
    filterFn: (s, storeName) => s.store === storeName,
    sortBy,
    includeVisits: true,
  })

  const {
    displayedItems: displayedStores,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByStores',
  })

  const sortOptions = computed(() => [
    { value: 'price-desc' as SortType, label: `${t('summary.spending')} ↓` },
    { value: 'visits-desc' as SortType, label: `${t('summary.visits')} ↓` },
    { value: 'avg-desc' as SortType, label: `${t('summary.average')} ↓` },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByStores')"
    :subtitle="`${stores.length} ${$t('summary.stores')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <SortButtons v-model="sortBy" :options="sortOptions" />

    <div v-for="s in displayedStores" :key="s.name" class="flex items-center gap-5 text-base">
      <div class="font-bold min-w-[100px] text-blue truncate" :title="s.name">{{ s.name }}:</div>
      <div class="flex w-full justify-end items-center gap-2">
        <div class="font-semibold whitespace-nowrap">
          {{ formatCurrency(s.price) }}
        </div>
        <div class="text-blue text-xs text-muted-foreground whitespace-nowrap">
          ({{ s.visits }}×, {{ formatCurrency(s.avgPerVisit || 0) }}/{{ $t('summary.visit') }})
        </div>
      </div>
    </div>

    <div
      v-if="hasMore"
      class="mt-1 text-blueLight text-xs cursor-pointer"
      @click="showAll = !showAll"
    >
      {{ toggleText }}
    </div>
  </SummaryCard>
</template>
