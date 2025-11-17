<script setup lang="ts">
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js'

  import { defineProps } from 'vue'
  import { Bar, Doughnut } from 'vue-chartjs'

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

  const {
    type,
    labels,
    datasets = [],
  } = defineProps({
    type: String as () => 'Bar' | 'Doughnut',
    labels: Array as () => string[],
    datasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[]
    }[],
  })
</script>

<template>
  <component
    :is="type === 'Bar' ? Bar : Doughnut"
    width="auto"
    :style="{
      width: '100%'!,
      maxWidth: '300px',
      height: '100%',
      maxHeight: '200px',
    }"
    :data="{
      labels: labels,
      datasets: datasets,
    }"
    :options="{
      responsive: true,
    }"
  />
</template>
