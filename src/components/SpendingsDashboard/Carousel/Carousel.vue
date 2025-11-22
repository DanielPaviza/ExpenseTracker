<script setup lang="ts">
  import { NCarousel } from 'naive-ui'

  const { slides } = defineProps<{
    slides: { id: number; label: string }[]
  }>()

  const currentSlide = defineModel<number>('currentSlide', { default: 0 })
</script>

<template>
  <div class="carouselContainer w-full">
    <div class="flex justify-center mb-4">
      <button
        v-for="slide in slides"
        :key="slide.id"
        :class="['nav-button', { active: currentSlide === slide.id }]"
        @click="currentSlide = slide.id"
      >
        {{ slide.label }}
      </button>
    </div>
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

  .nav-button {
    padding: 6px 60px;
    background-color: rgba(166, 162, 182, 0.2);
    border: 2px solid rgba(166, 162, 182, 0.3);
    color: #a6a2b6;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .nav-button:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .nav-button:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .nav-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.1);
    transform: translate(-50%, -50%);
    transition:
      width 0.4s ease,
      height 0.4s ease;
  }

  .nav-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .nav-button:hover {
    border-color: rgba(59, 130, 246, 0.5);
    color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .nav-button.active {
    background-color: rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .nav-button.active::before {
    width: 300px;
    height: 300px;
  }

  .nav-button:active {
    transform: translateY(0);
  }

  .nav-button > span {
    position: relative;
    z-index: 1;
  }
</style>
