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
  import { NCarousel } from 'naive-ui'

  import { computed } from 'vue'

  import CarouselItem from '@/components/spendingsDashboard/carousel/CarouselItem.vue'
  import CarouselSlide from '@/components/spendingsDashboard/carousel/CarouselSlide.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const spendingStore = useSpendingsStore()

  const { slideCount } = defineProps<{
    slideCount: number
  }>()

  const currentSlideId = defineModel<number>('current-slide-id', {
    required: false,
    default: 0,
  })

  const isCategorySelected = computed(() => spendingStore.categoryView !== null)

  const nextSlide = () => {
    currentSlideId.value = (currentSlideId.value + 1) % slideCount
  }

  const prevSlide = () => {
    currentSlideId.value = (currentSlideId.value - 1 + slideCount) % slideCount
  }
</script>
;

<template>
  <div class="carouselContainer relative w-full">
    <n-carousel
      v-model:current-index="currentSlideId"
      :show-dots="false"
      draggable
      :slides-per-view="1"
    >
      <CarouselSlide>
        <CarouselItem navigate-dir="prev" @navigation-action="prevSlide">
          <OverallPriceSummary />
        </CarouselItem>
        <CarouselItem navigate-dir="next" @navigation-action="nextSlide">
          <!-- Show SubCategorySummary when a category is selected, otherwise CategorySummary -->
          <SubCategorySummary v-if="isCategorySelected" />
          <CategorySummary v-else />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem navigate-dir="prev" @navigation-action="prevSlide">
          <StoreSummary />
        </CarouselItem>
        <CarouselItem navigate-dir="next" @navigation-action="nextSlide">
          <TagSummary />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem navigate-dir="prev" @navigation-action="prevSlide">
          <StatisticsSummary />
        </CarouselItem>
        <CarouselItem navigate-dir="next" @navigation-action="nextSlide">
          <AverageSummary />
        </CarouselItem>
      </CarouselSlide>

      <CarouselSlide>
        <CarouselItem navigate-dir="prev" @navigation-action="prevSlide">
          <FreeSummary />
        </CarouselItem>
        <CarouselItem navigate-dir="next" @navigation-action="nextSlide">
          <UnpaidSummary />
        </CarouselItem>
      </CarouselSlide>
    </n-carousel>
  </div>
</template>

<style scoped>
  :deep(.n-carousel) {
    position: static;
  }

  :deep(.n-carousel__slide) {
    height: auto !important;
  }

  :deep(.n-carousel.n-carousel--bottom .n-carousel__dots) {
    transform: translateX(0%);
    bottom: -24px;
    left: 20px;
  }

  :deep(.n-carousel__dot) {
    background-color: #a6a2b6 !important;
  }

  :deep(.n-carousel__dot--active) {
    background-color: #3b82f6 !important;
  }

  :deep(.n-carousel__arrow:hover) {
    background-color: rgba(59, 130, 246, 1);
    opacity: 1;
  }
</style>
