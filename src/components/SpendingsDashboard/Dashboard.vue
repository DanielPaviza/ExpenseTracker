<script setup lang="ts">
  import Carousel from '@components/SpendingsDashboard/Carousel/Carousel.vue'
  import CarouselItem from '@components/SpendingsDashboard/Carousel/CarouselItem.vue'
  import CarouselSlide from '@components/SpendingsDashboard/Carousel/CarouselSlide.vue'
  import AverageSummary from '@components/SpendingsDashboard/Summary/AverageSummary.vue'
  import CategorySummary from '@components/SpendingsDashboard/Summary/CategorySummary.vue'
  import FreeSummary from '@components/SpendingsDashboard/Summary/FreeSummary.vue'
  import OverallPriceSummary from '@components/SpendingsDashboard/Summary/OverallPriceSummary.vue'
  import StatisticsSummary from '@components/SpendingsDashboard/Summary/StatisticsSummary.vue'
  import StoreSummary from '@components/SpendingsDashboard/Summary/StoreSummary.vue'
  import TagSummary from '@components/SpendingsDashboard/Summary/TagSummary.vue'
  import UnpaidSummary from '@components/SpendingsDashboard/Summary/UnpaidSummary.vue'

  const slides = [
    { id: 0, label: 'Přehled a kategorie' },
    { id: 1, label: 'Obchody a tagy' },
    { id: 2, label: 'Statistiky' },
    { id: 3, label: 'Platby' },
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
