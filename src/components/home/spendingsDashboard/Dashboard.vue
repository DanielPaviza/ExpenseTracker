<script setup lang="ts">
  import AverageSummary from '@components/home/spendingsDashboard/summary/cards/AverageSummary.vue'
  import CategorySummary from '@components/home/spendingsDashboard/summary/cards/CategorySummary.vue'
  import FreeSummary from '@components/home/spendingsDashboard/summary/cards/FreeSummary.vue'
  import OverallPriceSummary from '@components/home/spendingsDashboard/summary/cards/OverallPriceSummary.vue'
  import StatisticsSummary from '@components/home/spendingsDashboard/summary/cards/StatisticsSummary.vue'
  import StoreSummary from '@components/home/spendingsDashboard/summary/cards/StoreSummary.vue'
  import SubCategorySummary from '@components/home/spendingsDashboard/summary/cards/SubCategorySummary.vue'
  import TagSummary from '@components/home/spendingsDashboard/summary/cards/TagSummary.vue'
  import UnpaidSummary from '@components/home/spendingsDashboard/summary/cards/UnpaidSummary.vue'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Carousel from '@/components/home/spendingsDashboard/carousel/Carousel.vue'
  import CarouselItem from '@/components/home/spendingsDashboard/carousel/CarouselItem.vue'
  import CarouselSlide from '@/components/home/spendingsDashboard/carousel/CarouselSlide.vue'
  import { SUMMARY_CARDS } from '@/constants/summaryCards'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t } = useI18n()
  const { settings } = useSettingsStore()
  const spendingsStore = useSpendingsStore()
  const { categoryView } = storeToRefs(spendingsStore)

  // Check if a specific category is selected (not "All")
  const isCategorySelected = computed(() => categoryView.value !== null)

  const summaryCards = SUMMARY_CARDS.map((card, index) => ({
    id: index,
    label: t(card.title),
  }))

  const defaultSummaryCard = SUMMARY_CARDS.findIndex(
    (card) => card.id === settings.defaultSummaryCard,
  )
</script>
<template>
  <div class="dashboard-container">
    <Carousel :slides="summaryCards" :default-slide-index="defaultSummaryCard">
      <CarouselSlide>
        <CarouselItem pc-width="49">
          <OverallPriceSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <!-- Show SubCategorySummary when a category is selected, otherwise CategorySummary -->
          <SubCategorySummary v-if="isCategorySelected" />
          <CategorySummary v-else />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem pc-width="49">
          <StoreSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <TagSummary />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem pc-width="49">
          <StatisticsSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <AverageSummary />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem pc-width="49">
          <FreeSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <UnpaidSummary />
        </CarouselItem>
      </CarouselSlide>
    </Carousel>
  </div>
</template>

<style scoped>
  .dashboard-container {
    width: 100%;
  }

  .slide-navigation {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 0 16px;
    flex-wrap: wrap;
  }
</style>
