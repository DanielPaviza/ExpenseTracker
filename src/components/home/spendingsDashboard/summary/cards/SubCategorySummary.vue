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
  const { spendings, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const subCategories = computed(() => {
    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.tableGroup) {
        set.add(s.tableGroup)
      }
    }
    return Array.from(set)
  })

  const { sortedStats } = useEntityStats({
    spendings,
    entities: subCategories,
    totalPrice,
    filterFn: (s, sub) => s.tableGroup === sub,
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
</script>

<template>
  <SummaryCard
    v-if="subCategories.length > 0"
    :title="$t('summary.expensesBySubCategories')"
    :subtitle="`${subCategories.length} ${$t('summary.subCategories')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
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
  </SummaryCard>
</template>
