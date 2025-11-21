<script setup lang="ts">
  import ChartComponent from '@components/ChartComponent.vue'
  import { NButton, NButtonGroup, NCard } from 'naive-ui'

  import { ref } from 'vue'

  const {
    title,
    subtitle,
    chartType = 'None',
    chartLabels,
    chartDatasets,
    chartTypeChangeEnabled = false,
    showFooter = true,
    compactMode = false,
  } = defineProps({
    title: String,
    subtitle: String,
    chartType: String as () => 'None' | 'Bar' | 'Doughnut' | 'Line',
    chartLabels: Array as () => string[],
    chartDatasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[] | string
      borderColor?: string[] | string
      borderWidth?: number
      tension?: number
    }[],
    chartTypeChangeEnabled: Boolean,
    showFooter: Boolean,
    compactMode: Boolean,
  })

  const selectedChartType = ref<'Doughnut' | 'Bar' | 'Line'>(
    chartType !== 'None' ? (chartType as 'Doughnut' | 'Bar' | 'Line') : 'Doughnut',
  )
</script>

<template>
  <div class="flex h-full">
    <n-card class="shadow-lg w-full">
      <div class="flex justify-between items-center mb-2">
        <div>
          <div class="text-2xl font-bold text-blue">
            {{ title }}
          </div>
          <div v-if="subtitle" class="text-sm text-gray-600 mt-1">
            {{ subtitle }}
          </div>
        </div>
        <n-button-group v-if="chartTypeChangeEnabled && chartType != 'None'" size="small">
          <n-button
            :type="selectedChartType === 'Doughnut' ? 'primary' : 'default'"
            @click="selectedChartType = 'Doughnut'"
          >
            Doughnut
          </n-button>
          <n-button
            :type="selectedChartType === 'Bar' ? 'primary' : 'default'"
            @click="selectedChartType = 'Bar'"
          >
            Bar
          </n-button>
          <n-button
            :type="selectedChartType === 'Line' ? 'primary' : 'default'"
            @click="selectedChartType = 'Line'"
          >
            Line
          </n-button>
        </n-button-group>
      </div>
      <hr class="mt-4 mb-6 text-blue" />
      <div
        class="flex flex-col md:flex-row xl:flex-col 2xl:flex-row justify-around"
        :class="{ 'gap-4': !compactMode }"
      >
        <div
          class="mb-6 md:mb-0 xl:mb-6 2xl:mb-0 flex flex-col text-lg"
          :class="compactMode ? 'gap-0.5' : 'gap-1 whitespace-nowrap'"
        >
          <slot />
        </div>
        <div class="flex justify-center items-center">
          <ChartComponent
            v-if="chartType != 'None' && chartLabels && chartDatasets"
            :type="selectedChartType"
            :labels="chartLabels"
            :datasets="chartDatasets"
          />
        </div>
      </div>
      <div v-if="showFooter && $slots.footer" class="mt-6">
        <hr class="mb-4 text-blue" />
        <slot name="footer" />
      </div>
    </n-card>
  </div>
</template>
