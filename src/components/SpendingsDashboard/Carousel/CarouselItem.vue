<script setup lang="ts">
  const { pcWidth = '100' } = defineProps({
    pcWidth: String,
  })
</script>

<template>
  <div class="carousel-item" :style="{ width: pcWidth + '%' }">
    <slot />
  </div>
</template>

<style scoped>
  @media (max-width: 1439px) {
    .carousel-item {
      width: 100% !important;
    }
  }
</style>
