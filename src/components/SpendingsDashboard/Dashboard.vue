<script setup lang="ts">
  import Carousel from '@components/SpendingsDashboard/Carousel/Carousel.vue'
  import CarouselItem from '@components/SpendingsDashboard/Carousel/CarouselItem.vue'
  import CarouselSlide from '@components/SpendingsDashboard/Carousel/CarouselSlide.vue'
  import AverageSummary from '@components/SpendingsDashboard/Summary/AverageSummary.vue'
  import CategorySummary from '@components/SpendingsDashboard/Summary/CategorySummary.vue'
  import ItemCountSummary from '@components/SpendingsDashboard/Summary/ItemCountSummary.vue'
  import OverallPriceSummary from '@components/SpendingsDashboard/Summary/OverallPriceSummary.vue'
  import PurchaseHistorySummary from '@components/SpendingsDashboard/Summary/PurchaseHistorySummary.vue'
  import RecentSummary from '@components/SpendingsDashboard/Summary/RecentSummary.vue'
  import StoreSummary from '@components/SpendingsDashboard/Summary/StoreSummary.vue'
  import SubCategorySummary from '@components/SpendingsDashboard/Summary/SubCategorySummary.vue'
  import TrendSummary from '@components/SpendingsDashboard/Summary/TrendSummary.vue'
  import TypeSummary from '@components/SpendingsDashboard/Summary/TypeSummary.vue'
  import UnpaidSummary from '@components/SpendingsDashboard/Summary/UnpaidSummary.vue'
</script>
<template>
  <Carousel class="w-full h-full">
    <CarouselSlide>
      <CarouselItem width="49">
        <OverallPriceSummary />
      </CarouselItem>
      <CarouselItem width="49">
        <UnpaidSummary />
      </CarouselItem>
    </CarouselSlide>

    <CarouselSlide>
      <CarouselItem width="49">
        <CategorySummary />
      </CarouselItem>
      <CarouselItem width="49">
        <SubCategorySummary />
      </CarouselItem>
    </CarouselSlide>

    <CarouselSlide>
      <CarouselItem width="49">
        <StoreSummary />
      </CarouselItem>
      <CarouselItem width="49">
        <TypeSummary />
      </CarouselItem>
    </CarouselSlide>

    <CarouselSlide>
      <CarouselItem width="49">
        <ItemCountSummary />
      </CarouselItem>
      <CarouselItem width="49">
        <AverageSummary />
      </CarouselItem>
    </CarouselSlide>

    <CarouselSlide>
      <CarouselItem width="49">
        <RecentSummary />
      </CarouselItem>
      <CarouselItem width="49">
        <PurchaseHistorySummary />
      </CarouselItem>
      <CarouselItem width="100">
        <TrendSummary />
      </CarouselItem>
    </CarouselSlide>
  </Carousel>
</template>