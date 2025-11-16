<script setup lang="ts">
import { defineProps } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const { type, labels, datasets } = defineProps({
  type: {
    type: String as () => 'Bar' | 'Doughnut',
    required: true,
  },
  labels: {
    type: Array as () => string[],
    required: true,
  },
  datasets: {
    type: Array as () => { label: string; data: number[]; backgroundColor: string[] }[],
    required: true,
  },
})
</script>

<template>
  <component
    :is="type === 'Bar' ? Bar : Doughnut"
    width="250px"
    height="250px"
    :style="{
      width: 'auto',
      height: 'auto',
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
