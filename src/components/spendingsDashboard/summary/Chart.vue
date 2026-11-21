<script setup lang="ts">
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    type ChartOptions,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js'

  import { computed } from 'vue'
  import { Bar, Doughnut, Line } from 'vue-chartjs'

  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useTheme } from '@/composables/useTheme'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
  )

  type Dataset = {
    label: string
    data: number[]
    backgroundColor: string[] | string
    borderColor?: string[] | string
    borderWidth?: number
    tension?: number
    isCount?: boolean
  }

  const {
    type,
    labels,
    datasets = [],
  } = defineProps<{
    type?: 'Bar' | 'Doughnut' | 'Line'
    labels?: string[]
    datasets?: Dataset[]
  }>()

  const { isDark } = useTheme()

  const chartComponent = computed(() => {
    if (type === 'Bar') return Bar
    if (type === 'Line') return Line
    return Doughnut
  })

  const palette = computed(() => ({
    text: isDark.value ? '#9aa6ba' : '#5b6678',
    grid: isDark.value ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.06)',
    surface: isDark.value ? '#111827' : '#ffffff',
    tooltipBg: isDark.value ? '#1c2740' : '#0f172a',
  }))

  // Style datasets per chart type (rounded bars, smooth filled lines, separated donut arcs)
  const styledDatasets = computed(() =>
    datasets.map((ds) => {
      const first = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[0] : ds.backgroundColor
      if (type === 'Line')
        return {
          ...ds,
          borderColor: first,
          backgroundColor: `${first}22`,
          pointBackgroundColor: first,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        }
      if (type === 'Bar')
        return { ...ds, borderRadius: 6, borderSkipped: false, maxBarThickness: 36 }
      return { ...ds, borderColor: palette.value.surface, borderWidth: 2, hoverOffset: 6 }
    }),
  )

  const options = computed<ChartOptions<'bar' | 'line' | 'doughnut'>>(() => {
    const isCartesian = type === 'Bar' || type === 'Line'
    return {
      responsive: true,
      maintainAspectRatio: true,
      ...(type === 'Doughnut' || !type ? { cutout: '68%' } : {}),
      plugins: {
        legend: {
          display: !isCartesian,
          position: 'bottom',
          labels: {
            color: palette.value.text,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8,
            padding: 12,
            font: { size: 11, family: 'Inter Variable' },
          },
        },
        tooltip: {
          backgroundColor: palette.value.tooltipBg,
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: 'Inter Variable', weight: 600 },
          bodyFont: { family: 'Inter Variable' },
          callbacks: {
            label: (ctx) => {
              const value = typeof ctx.raw === 'number' ? ctx.raw : 0
              const isCount = (ctx.dataset as { isCount?: boolean }).isCount
              return ` ${isCount ? value : formatCurrency(value)}`
            },
          },
        },
      },
      ...(isCartesian
        ? {
            scales: {
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: palette.value.text, font: { size: 11 } },
              },
              y: {
                grid: { color: palette.value.grid },
                border: { display: false },
                ticks: { color: palette.value.text, font: { size: 11 } },
              },
            },
          }
        : {}),
    }
  })
</script>

<template>
  <div :class="type === 'Doughnut' || !type ? 'w-[230px]' : 'w-[300px] max-w-full'">
    <component
      :is="chartComponent"
      :data="{ labels, datasets: styledDatasets }"
      :options="options as any"
    />
  </div>
</template>
