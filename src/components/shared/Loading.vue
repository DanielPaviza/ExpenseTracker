<script setup lang="ts">
  import { NSkeleton } from 'naive-ui'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-app">
    <aside class="flex w-64 shrink-0 flex-col gap-4 border-r border-line bg-surface p-5">
      <div class="flex items-center gap-3">
        <n-skeleton :width="36" :height="36" :sharp="false" />
        <n-skeleton text width="60%" />
      </div>
      <n-skeleton height="40px" :sharp="false" />
      <n-skeleton v-for="i in 2" :key="i" height="34px" :sharp="false" />
    </aside>
    <div class="flex flex-1 flex-col">
      <div class="flex h-16 items-center justify-between border-b border-line bg-surface px-10">
        <n-skeleton width="260px" height="40px" :sharp="false" />
        <n-skeleton width="160px" height="32px" :sharp="false" />
      </div>
      <div class="flex flex-col gap-6 px-10 py-6">
        <n-skeleton width="240px" height="28px" :sharp="false" />
        <div class="grid grid-cols-4 gap-5">
          <n-skeleton v-for="i in 4" :key="i" height="112px" :sharp="false" />
        </div>
        <div class="grid grid-cols-2 gap-5">
          <n-skeleton height="380px" :sharp="false" />
          <n-skeleton height="380px" :sharp="false" />
        </div>
      </div>
      <div class="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div class="card px-5 py-3 text-sm font-medium text-fg-muted">
          {{ $t('common.loadingData') }}
        </div>
      </div>
    </div>
  </div>
</template>
