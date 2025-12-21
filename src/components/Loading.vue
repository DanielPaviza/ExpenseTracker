<script setup lang="ts"></script>
<template>
  <div class="flex justify-center items-center h-32">
    <span class="text-lg text-blue-600 animate-pulse">
      <slot>{{ $t('common.loadingData') }}</slot>
    </span>
  </div>
</template>
