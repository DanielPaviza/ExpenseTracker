<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SortButtons from '@/components/home/spendingsDashboard/summary/SortButtons.vue'
  import StatItem from '@/components/home/spendingsDashboard/summary/StatItem.vue'
  import SummaryCard from '@/components/home/spendingsDashboard/summary/SummaryCard.vue'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, categories, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const { sortedStats } = useEntityStats({
    spendings,
    entities: categories,
    totalPrice,
    filterFn: (s, cat) => s.category === cat,
    sortBy,
    includeAverage: true,
  })

  const {
    displayedItems: displayedCategories,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByCategories',
    countLabelKey: 'summary.purchasesByCategories',
  })

  const sortOptions = computed(() => [
    { value: 'price-desc' as SortType, label: `${t('table.price')} ↓` },
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByCategories')"
    :subtitle="`${categories.length} ${$t('summary.categories')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <SortButtons v-model="sortBy" :options="sortOptions" />

    <StatItem v-for="category in displayedCategories" :key="category.name" :stat="category" />

    <div
      v-if="hasMore"
      class="mt-1 text-blueLight text-xs cursor-pointer"
      @click="showAll = !showAll"
    >
      {{ toggleText }}
    </div>
  </SummaryCard>
</template>
