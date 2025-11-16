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

const { type, labels, datasets = [] } = defineProps({
  type: String as () => 'Bar' | 'Doughnut',
  labels: Array as () => string[],
  datasets: Array as () => { 
    label: string; 
    data: number[];
    backgroundColor : string[] 
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
