<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'

  import { computed, ref } from 'vue'

  const { spendings, stores, totalPrice } = useSpendingsStore()

  type SortType = 'price-desc' | 'visits-desc' | 'avg-desc'
  const sortBy = ref<SortType>('price-desc')

  const storeStats = computed(() => {
    return stores.map((store) => {
      const storeSpendings = spendings.filter((s: Spending) => s.store === store)
      const price = storeSpendings.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const visits = storeSpendings.length
      const itemCount = storeSpendings.reduce((sum: number, s: Spending) => sum + s.quantity, 0)
      const avgPerVisit = visits > 0 ? price / visits : 0
      const percent = totalPrice > 0 ? Math.round((price / totalPrice) * 100) : 0
      return { name: store, price, visits, itemCount, avgPerVisit, percent }
    })
  })

  const sortedStores = computed(() => {
    const sorted = [...storeStats.value]
    switch (sortBy.value) {
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'visits-desc':
        return sorted.sort((a, b) => b.visits - a.visits)
      case 'avg-desc':
        return sorted.sort((a, b) => b.avgPerVisit - a.avgPerVisit)
      default:
        return sorted
    }
  })

  const chartLabels = computed(() => sortedStores.value.map((s) => `${s.name} (${s.percent}%)`))
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle obchodů',
      data: sortedStores.value.map((s) => s.price),
      backgroundColor: generateColorPalette(['#8b5cf6', '#a78bfa'], sortedStores.value.length),
    },
  ])
</script>

<template>
  <SummaryCard
    title="Výdaje dle obchodů"
    :subtitle="`${stores.length} obchodů`"
    chart-type="Bar"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="mb-3 flex gap-2 flex-wrap">
      <n-button-group size="tiny">
        <n-button
          :type="sortBy === 'price-desc' ? 'primary' : 'default'"
          @click="sortBy = 'price-desc'"
        >
          Útrata ↓
        </n-button>
        <n-button
          :type="sortBy === 'visits-desc' ? 'primary' : 'default'"
          @click="sortBy = 'visits-desc'"
        >
          Návštěvy ↓
        </n-button>
        <n-button
          :type="sortBy === 'avg-desc' ? 'primary' : 'default'"
          @click="sortBy = 'avg-desc'"
        >
          Průměr ↓
        </n-button>
      </n-button-group>
    </div>

    <div v-for="store in sortedStores" :key="store.name" class="flex items-center gap-2 text-base">
      <div class="font-bold min-w-[100px] text-blue truncate" :title="store.name">
        {{ store.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(store.price) }}</div>
      <div class="text-blue text-xs text-muted-foreground whitespace-nowrap">
        ({{ store.visits }}×, {{ formatNumberToCzk(store.avgPerVisit) }}/návštěva)
      </div>
    </div>

    <template #footer>
      <div class="flex font-bold w-full justify-between text-lg">
        <div class="text-blue">Celkem:</div>
        <div>{{ formatNumberToCzk(totalPrice) }}</div>
      </div>
    </template>
  </SummaryCard>
</template>
