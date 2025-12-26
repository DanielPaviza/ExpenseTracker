<script setup lang="ts">
  import Carousel from '@components/spendingsDashboard/carousel/Carousel.vue'
  import CarouselItem from '@components/spendingsDashboard/carousel/CarouselItem.vue'
  import CarouselSlide from '@components/spendingsDashboard/carousel/CarouselSlide.vue'
  import AverageSummary from '@components/spendingsDashboard/summary/cards/AverageSummary.vue'
  import CategorySummary from '@components/spendingsDashboard/summary/cards/CategorySummary.vue'
  import FreeSummary from '@components/spendingsDashboard/summary/cards/FreeSummary.vue'
  import OverallPriceSummary from '@components/spendingsDashboard/summary/cards/OverallPriceSummary.vue'
  import StatisticsSummary from '@components/spendingsDashboard/summary/cards/StatisticsSummary.vue'
  import StoreSummary from '@components/spendingsDashboard/summary/cards/StoreSummary.vue'
  import TagSummary from '@components/spendingsDashboard/summary/cards/TagSummary.vue'
  import UnpaidSummary from '@components/spendingsDashboard/summary/cards/UnpaidSummary.vue'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const slides = [
    { id: 0, label: t('dashboard.overviewAndCategories') },
    { id: 1, label: t('dashboard.storesAndTags') },
    { id: 2, label: t('dashboard.statistics') },
    { id: 3, label: t('dashboard.payments') },
  ]
</script>
<template>
  <div class="dashboard-container">
    <Carousel :slides="slides">
      <CarouselSlide>
        <CarouselItem pc-width="49">
          <OverallPriceSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <CategorySummary />
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
