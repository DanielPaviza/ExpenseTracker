<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SortButtons from '@/components/home/spendingsDashboard/summary/SortButtons.vue'
  import SummaryCard from '@/components/home/spendingsDashboard/summary/SummaryCard.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const sortBy = ref<SortType>('price-desc')

  const types = computed(() => {
    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.type) {
        set.add(s.type)
      }
    }
    return Array.from(set)
  })

  const { sortedStats } = useEntityStats({
    spendings,
    entities: types,
    totalPrice,
    filterFn: (s, type) => s.type === type,
    sortBy,
  })

  const {
    displayedItems: displayedTypes,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByType',
    countLabelKey: 'summary.purchasesByType',
  })

  const sortOptions = computed(() => [
    { value: 'price-desc' as SortType, label: `${t('table.price')} ↓` },
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByType')"
    :subtitle="`${types.length} ${$t('summary.types')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <SortButtons v-model="sortBy" :options="sortOptions" />

    <div v-for="type in displayedTypes" :key="type.name" class="flex items-center gap-5 text-base">
      <div class="font-bold min-w-[100px] w-full text-blue truncate" :title="type.name">
        {{ type.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">
        {{ formatCurrency(type.price) }}
      </div>
      <div class="text-blue text-xs text-muted-foreground whitespace-nowrap">
        ({{ type.count }}×)
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
