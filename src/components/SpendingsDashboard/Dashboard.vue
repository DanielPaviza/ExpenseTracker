<script setup lang="ts">
  import Carousel from '@components/SpendingsDashboard/Carousel/Carousel.vue'
  import CarouselItem from '@components/SpendingsDashboard/Carousel/CarouselItem.vue'
  import CarouselSlide from '@components/SpendingsDashboard/Carousel/CarouselSlide.vue'
  import CategorySummary from '@components/SpendingsDashboard/Summary/CategorySummary.vue'
  import ItemCountSummary from '@components/SpendingsDashboard/Summary/ItemCountSummary.vue'
  import PriceSummary from '@components/SpendingsDashboard/Summary/PriceSummary.vue'
  import RecentSummary from '@components/SpendingsDashboard/Summary/RecentSummary.vue'
  import StoreSummary from '@components/SpendingsDashboard/Summary/StoreSummary.vue'
  import TypeSummary from '@components/SpendingsDashboard/Summary/TypeSummary.vue'
  import UnpaidSummary from '@components/SpendingsDashboard/Summary/UnpaidSummary.vue'
</script>
<template>
  <Carousel>
    <CarouselSlide>
      <CarouselItem width="49">
        <PriceSummary />
      </CarouselItem>
      <CarouselItem width="49">
        <UnpaidSummary />
      </CarouselItem>
      <CarouselItem width="100">
        <CategorySummary />
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
        <RecentSummary />
      </CarouselItem>
    </CarouselSlide>
  </Carousel>
</template>
