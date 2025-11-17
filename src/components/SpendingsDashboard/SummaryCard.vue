<script setup lang="ts">
  import ChartComponent from '@components/ChartComponent.vue'
  import { NCard } from 'naive-ui'

  import { defineProps } from 'vue'

  const {
    title,
    chartType = 'None',
    chartLabels,
    chartDatasets,
  } = defineProps({
    title: String,
    chartType: String as () => 'None' | 'Bar' | 'Doughnut',
    chartLabels: Array as () => string[],
    chartDatasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[]
    }[],
  })
</script>

<template>
  <div class="flex xl:w-[49%] w-full mt-4 xl:mt-0">
    <n-card class="shadow-lg">
      <div class="text-2xl font-bold text-blue">
        {{ title }}
      </div>
      <hr class="mt-6 mb-8 text-blue" />
      <div class="flex flex-col md:flex-row xl:flex-col 2xl:flex-row justify-around">
        <div class="mb-6 md:mb-0 xl:mb-6 2xl:mb-0 flex flex-col gap-1 text-lg whitespace-nowrap">
          <slot />
        </div>
        <div class="flex justify-center">
          <ChartComponent
            v-if="chartType != 'None' && chartLabels && chartDatasets"
            :type="chartType"
            :labels="chartLabels"
            :datasets="chartDatasets"
          />
        </div>
      </div>
    </n-card>
  </div>
</template>
