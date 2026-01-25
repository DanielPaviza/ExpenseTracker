<script setup lang="ts">
  import { NSpin } from 'naive-ui'

  import MarginContainer from '@/components/shared/MarginContainer.vue'
</script>
<template>
  <div class="flex items-center flex-col h-screen">
    <header class="border-b-2 py-4 border-blue bg-whiteTransparent backdrop-blur-md w-screen">
      <MarginContainer>
        <h1 class="text-4xl font-extrabold tracking-tight text-blue">
          {{ $t('header.title') }}
        </h1>
      </MarginContainer>
    </header>
    <div class="h-full flex flex-col justify-center items-center gap-6 mt-[-5%]">
      <span class="text-xl font-semibold text-blue-600">
        {{ $t('common.loadingData') }}
      </span>
      <n-spin size="large" />
    </div>
  </div>
</template>
<style scoped>
  :deep(.n-spin) {
    color: #3b82f6;
  }
</style>
