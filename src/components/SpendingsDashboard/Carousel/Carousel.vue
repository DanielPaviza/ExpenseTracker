<script setup lang="ts">
  import { NCarousel } from 'naive-ui'

  import { ref } from 'vue'

  const currentSlide = ref(0)
</script>

<template>
  <div class="w-full">
    <n-carousel
      v-model:current-index="currentSlide"
      :show-dots="true"
      :show-arrow="true"
      draggable
      :slides-per-view="1"
      :space-between="20"
    >
      <slot />
    </n-carousel>
  </div>
</template>

<style scoped>
  :deep(.n-carousel__slides) {
    height: auto !important;
  }
  :deep(.n-carousel__slide) {
    height: auto !important;
  }
  :deep(.n-carousel__dot) {
    background-color: #06402b !important;
    transform: translateY(16px);
  }
  :deep(.n-carousel__dot--active) {
    background-color: #60a5fa !important;
  }
  :deep(.n-carousel__arrow) {
    background-color: rgba(59, 130, 246, 0.8);
    width: 32px !important;
    height: 32px !important;
    opacity: 0.8;
    transform: translateY(12px);
  }
  :deep(.n-carousel__arrow:hover) {
    background-color: rgba(59, 130, 246, 1);
    opacity: 1;
  }
</style>
