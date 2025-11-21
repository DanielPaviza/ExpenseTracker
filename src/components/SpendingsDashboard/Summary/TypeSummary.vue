<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const types = computed(() => {
    const set = new Set<string>()
    for (const s of spendings) {
      if (s.type) set.add(s.type)
    }
    return Array.from(set)
  })

  const typeStats = computed(() => {
    return types.value.map((type) => {
      const typeSpendings = spendings.filter((s) => s.type === type)
      const price = typeSpendings.reduce((sum, s) => sum + s.totalPrice, 0)
      const count = typeSpendings.length
      const percent = totalPrice > 0 ? Math.round((price / totalPrice) * 100) : 0
      return { name: type, price, count, percent }
    })
  })

  const sortedTypes = computed(() => {
    return [...typeStats.value].sort((a, b) => b.price - a.price)
  })

  const chartLabels = computed(() => sortedTypes.value.map((t) => `${t.name} (${t.percent}%)`))
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle typu',
      data: sortedTypes.value.map((t) => t.price),
      backgroundColor: generateColorPalette(['#f59e0b', '#fbbf24'], sortedTypes.value.length),
    },
  ])
</script>

<template>
  <SummaryCard
    title="Výdaje dle typu"
    :subtitle="`${sortedTypes.length} typů`"
    chart-type="Bar"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="type in sortedTypes" :key="type.name" class="flex items-center gap-2">
      <div class="font-bold min-w-[100px] w-full text-blue truncate" :title="type.name">
        {{ type.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(type.price) }}</div>
      <div class="text-blue text-sm text-muted-foreground">({{ type.count }}×)</div>
    </div>
    <template #footer>
      <div class="flex font-bold w-full justify-between">
        <div class="text-blue">Celkem:</div>
        <div class="ms-5">{{ formatNumberToCzk(totalPrice) }}</div>
      </div>
    </template>
  </SummaryCard>
</template>
