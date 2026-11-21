<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SortButtons from '@/components/spendingsDashboard/summary/SortButtons.vue'
  import StatItem from '@/components/spendingsDashboard/summary/StatItem.vue'
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

  const { chartLabels, chartDatasets, colors } = useSummaryChart({
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

    <StatItem
      v-for="(s, idx) in displayedStores"
      :key="s.name"
      :stat="s"
      :color="colors[idx]"
      :show-percent="false"
      :show-count="false"
      :extra-info="`${s.visits}× · ${formatCurrency(s.avgPerVisit || 0)}/${$t('summary.visit')}`"
    />

    <div
      v-if="hasMore"
      class="mt-1 text-primary text-xs font-medium cursor-pointer hover:underline"
      @click="showAll = !showAll"
    >
      {{ toggleText }}
    </div>
  </SummaryCard>
</template>
