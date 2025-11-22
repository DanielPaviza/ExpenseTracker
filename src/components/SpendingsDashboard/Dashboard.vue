<script setup lang="ts">
  import Carousel from '@components/SpendingsDashboard/Carousel/Carousel.vue'
  import CarouselItem from '@components/SpendingsDashboard/Carousel/CarouselItem.vue'
  import CarouselSlide from '@components/SpendingsDashboard/Carousel/CarouselSlide.vue'
  import AverageSummary from '@components/SpendingsDashboard/Summary/AverageSummary.vue'
  import CategorySummary from '@components/SpendingsDashboard/Summary/CategorySummary.vue'
  import FreeSummary from '@components/SpendingsDashboard/Summary/FreeSummary.vue'
  import OverallPriceSummary from '@components/SpendingsDashboard/Summary/OverallPriceSummary.vue'
  import RecentSummary from '@components/SpendingsDashboard/Summary/RecentSummary.vue'
  import StatisticsSummary from '@components/SpendingsDashboard/Summary/StatisticsSummary.vue'
  import StoreSummary from '@components/SpendingsDashboard/Summary/StoreSummary.vue'
  import SubCategorySummary from '@components/SpendingsDashboard/Summary/SubCategorySummary.vue'
  import TypeSummary from '@components/SpendingsDashboard/Summary/TypeSummary.vue'
  import UnpaidSummary from '@components/SpendingsDashboard/Summary/UnpaidSummary.vue'

  const slides = [
    { id: 0, label: 'Přehled a kategorie' },
    { id: 1, label: 'Podkategorie a obchody' },
    { id: 2, label: 'Typy a statistiky' },
    { id: 3, label: 'Platby' },
    { id: 4, label: 'Historie' },
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
          <SubCategorySummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <StoreSummary />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem pc-width="49">
          <TypeSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <StatisticsSummary />
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

      <CarouselSlide>
        <CarouselItem pc-width="49">
          <RecentSummary />
        </CarouselItem>
        <CarouselItem pc-width="49">
          <AverageSummary />
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
