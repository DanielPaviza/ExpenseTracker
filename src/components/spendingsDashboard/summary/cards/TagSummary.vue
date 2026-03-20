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

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, tags, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const { sortedStats } = useEntityStats({
    spendings,
    entities: tags,
    totalPrice,
    filterFn: (s, tag) => s.tags && s.tags.includes(tag),
    sortBy,
    includeAverage: true,
  })

  const { displayedItems: displayedTags, hasMore, toggleText, showAll } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByTags',
    countLabelKey: 'summary.purchasesByTags',
  })

  const sortOptions = computed(() => [
    { value: 'price-desc' as SortType, label: `${t('table.price')} ↓` },
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByTags')"
    :subtitle="`${tags.length} ${$t('summary.tags')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <template v-if="displayedTags.length">
      <SortButtons v-model="sortBy" :options="sortOptions" />

      <StatItem v-for="tag in displayedTags" :key="tag.name" :stat="tag" />

      <div
        v-if="hasMore"
        class="mt-1 text-blueLight text-xs cursor-pointer"
        @click="showAll = !showAll"
      >
        {{ toggleText }}
      </div>
    </template>
    <div v-else class="text-gray-500 text-center py-4">
      {{ $t('common.noRecordsFound') }}
    </div>
  </SummaryCard>
</template>
