<script setup lang="ts">
  import AverageSummary from '@components/spendingsDashboard/summary/cards/AverageSummary.vue'
  import CategorySummary from '@components/spendingsDashboard/summary/cards/CategorySummary.vue'
  import FreeSummary from '@components/spendingsDashboard/summary/cards/FreeSummary.vue'
  import OverallPriceSummary from '@components/spendingsDashboard/summary/cards/OverallPriceSummary.vue'
  import StatisticsSummary from '@components/spendingsDashboard/summary/cards/StatisticsSummary.vue'
  import StoreSummary from '@components/spendingsDashboard/summary/cards/StoreSummary.vue'
  import SubCategorySummary from '@components/spendingsDashboard/summary/cards/SubCategorySummary.vue'
  import TagSummary from '@components/spendingsDashboard/summary/cards/TagSummary.vue'
  import UnpaidSummary from '@components/spendingsDashboard/summary/cards/UnpaidSummary.vue'

  import { type Component, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import KpiCards from '@/components/spendingsDashboard/kpi/KpiCards.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t } = useI18n()
  const store = useSpendingsStore()

  type Section = { id: string; title: string; cards: Component[] }

  // With a category selected the category breakdown becomes a sub-category breakdown
  const sections = computed<Section[]>(() => [
    {
      id: 'overview',
      title: t('dashboard.overviewAndCategories'),
      cards: [
        OverallPriceSummary,
        store.categoryView !== null ? SubCategorySummary : CategorySummary,
      ],
    },
    { id: 'stores', title: t('dashboard.storesAndTags'), cards: [StoreSummary, TagSummary] },
    {
      id: 'statistics',
      title: t('dashboard.statistics'),
      cards: [StatisticsSummary, AverageSummary],
    },
    { id: 'payments', title: t('dashboard.payments'), cards: [UnpaidSummary, FreeSummary] },
  ])
</script>

<template>
  <div class="flex flex-col gap-8">
    <KpiCards />

    <section v-for="section in sections" :id="`dashboard-${section.id}`" :key="section.id">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {{ section.title }}
      </h2>
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <component :is="card" v-for="(card, idx) in section.cards" :key="`${section.id}-${idx}`" />
      </div>
    </section>
  </div>
</template>
