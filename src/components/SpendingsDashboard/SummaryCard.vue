<script setup lang="ts">
import { defineProps } from 'vue'
import { NCard } from 'naive-ui'
import ChartComponent from '@components/ChartComponent.vue'

const {
  title,
  chartType = 'None',
  chartLabels,
  chartDatasets,
} = defineProps({
  title: String,
  chartType: String as () => 'None' | 'Bar' | 'Doughnut',
  chartLabels: Array as () => string[],
  chartDatasets: Array as () => { label: string; data: number[]; backgroundColor: string[] }[],
})
</script>

<template>
  <div class="w-[49%]">
    <n-card class="shadow-lg">
      <div class="text-2xl font-bold text-blueLight">
        {{ title }}
      </div>
      <hr class="mt-6 mb-8" />
      <div class="flex justify-around">
        <div class="mb-5 flex flex-col gap-1 text-lg whitespace-nowrap">
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
