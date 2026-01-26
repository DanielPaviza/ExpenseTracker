<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'
  import { NCarousel } from 'naive-ui'

  import { ref } from 'vue'

  const { slides, defaultSlideIndex } = defineProps<{
    slides: { id: number; label: string }[]
    defaultSlideIndex: number
  }>()

  const currentSlide = ref<number>(defaultSlideIndex)
</script>

<template>
  <div class="carouselContainer w-full">
    <ButtonNavigation v-model:selected-id="currentSlide" :buttons="slides" class="mb-4" />
    <n-carousel
      v-model:current-index="currentSlide"
      :show-dots="true"
      :show-arrow="true"
      draggable
      :slides-per-view="1"
    >
      <slot />
    </n-carousel>
  </div>
</template>

<style scoped>
  .carouselContainer {
    position: relative;
    padding-bottom: 50px;
  }

  :deep(.n-carousel) {
    position: static;
  }

  :deep(.n-carousel__slide) {
    height: auto !important;
  }

  :deep(.n-carousel__dots) {
    position: absolute;
    bottom: 10px;
  }

  :deep(.n-carousel__dot) {
    background-color: #a6a2b6 !important;
  }

  :deep(.n-carousel__dot--active) {
    background-color: #3b82f6 !important;
  }

  :deep(.n-carousel__arrow) {
    background-color: rgba(59, 130, 246, 0.8);
    width: 32px !important;
    height: 32px !important;
    opacity: 0.8;
    bottom: 10px !important;
    top: auto !important;
  }

  :deep(.n-carousel__arrow:hover) {
    background-color: rgba(59, 130, 246, 1);
    opacity: 1;
  }
</style>
