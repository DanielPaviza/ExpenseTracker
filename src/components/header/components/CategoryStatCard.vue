<script setup lang="ts">
  import DonutChart from '@/components/header/components/DonutChart.vue'

  defineProps<{
    title: string
    totalPriceText: string
    count: number
    purchasesLabel: string
    monthlyAverageText: string
    monthLabel: string
    percent: number
    color: string
    selected: boolean
  }>()
</script>

<template>
  <div
    class="m-2 flex justify-between items-center p-5 bg-white rounded-xl cursor-pointer transition-all duration-200 border-blue hover:shadow-lg hover:-translate-y-0.5"
    :class="
      selected
        ? 'border-2 bg-linear-to-br from-blue-50 to-white shadow-lg'
        : 'boxShadowCustom border border-transparent hover:border-blue'
    "
  >
    <div class="flex-1 min-w-0">
      <div class="text-xl font-semibold text-blue-800 mb-3 truncate">
        {{ title }}
      </div>

      <div class="mb-3">
        <div class="text-xl font-bold text-slate-800 mb-1">
          {{ totalPriceText }}
        </div>
        <div class="text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <span>{{ count }}× {{ purchasesLabel }}</span>
          <span class="text-slate-300">•</span>
          <span>{{ monthlyAverageText }}/{{ monthLabel }}</span>
        </div>
      </div>
    </div>

    <div class="w-14 h-14 ml-4 shrink-0">
      <DonutChart :percent="percent" :color="color" />
    </div>
  </div>
</template>
<style lang="css" scoped>
  .boxShadowCustom {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
</style>
