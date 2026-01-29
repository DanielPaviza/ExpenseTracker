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
  const { spendings, subCategories, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const { sortedStats } = useEntityStats({
    spendings,
    entities: subCategories,
    totalPrice,
    filterFn: (s, sub) => s.subCategory === sub,
    sortBy,
  })

  const {
    displayedItems: displayedSubCategories,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesBySubCategories',
    countLabelKey: 'summary.purchasesBySubCategories',
  })

  const sortOptions = computed(() => [
    { value: 'price-desc' as SortType, label: `${t('table.price')} ↓` },
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])

  const hasData = computed(() => subCategories.value.length > 0)
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesBySubCategories')"
    :subtitle="hasData ? `${subCategories.length} ${$t('summary.subCategories')}` : undefined"
    :chart-type="hasData ? 'Doughnut' : 'None'"
    :chart-type-change-enabled="hasData"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <template v-if="hasData">
      <SortButtons v-model="sortBy" :options="sortOptions" />

      <StatItem
        v-for="sub in displayedSubCategories"
        :key="sub.name"
        :stat="sub"
        :show-percent="false"
      />

      <div
        v-if="hasMore"
        class="mt-1 text-blueLight text-xs cursor-pointer"
        @click="showAll = !showAll"
      >
        {{ toggleText }}
      </div>
    </template>
    <template v-else>
      <div class="text-gray-500 text-center py-4">
        {{ $t('summary.noSubCategories') }}
      </div>
    </template>
  </SummaryCard>
</template>
