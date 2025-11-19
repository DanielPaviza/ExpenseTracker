<script setup lang="ts">
  const { width = '100' } = defineProps({
    width: String,
  })
</script>

<template>
  <div :style="{ width: width + '%' }">
    <slot />
  </div>
</template>
