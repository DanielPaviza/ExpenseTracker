<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'

  import { computed, ref } from 'vue'

  const { spendings, categories, totalPrice } = useSpendingsStore()

  type SortType = 'alphabetical' | 'price-desc' | 'price-asc' | 'count-desc'
  const sortBy = ref<SortType>('price-desc')

  const categoryStats = computed(() => {
    return categories.map((cat) => {
      const categoryItems = spendings.filter((s: Spending) => s.category === cat)
      const price = categoryItems.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const count = categoryItems.length
      const itemCount = categoryItems.reduce((sum: number, s: Spending) => sum + s.quantity, 0)
      const avgPrice = count > 0 ? price / count : 0

      return {
        name: cat,
        price,
        count,
        itemCount,
        avgPrice,
        percent: totalPrice > 0 ? Math.round((price / totalPrice) * 100) : 0,
      }
    })
  })

  const sortedCategories = computed(() => {
    const sorted = [...categoryStats.value]
    switch (sortBy.value) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'count-desc':
        return sorted.sort((a, b) => b.count - a.count)
      default:
        return sorted
    }
  })

  const chartLabels = computed(() =>
    sortedCategories.value.map((cat) => `${cat.name} (${cat.percent}%)`),
  )
  const chartDatasets = computed(() => {
    const getData = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return sortedCategories.value.map((cat) => cat.count)
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return sortedCategories.value.map((cat) => cat.price)
      }
    }

    const getLabel = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return 'Počet nákupů dle kategorií'
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return 'Výdaje dle kategorií'
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: generateColorPalette(sortedCategories.value.length),
      },
    ]
  })
</script>

<template>
  <SummaryCard
    title="Výdaje dle kategorií"
    :subtitle="`${categories.length} kategorií`"
    chart-type="Doughnut"
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
          Cena ↓
        </n-button>
        <n-button
          :type="sortBy === 'count-desc' ? 'primary' : 'default'"
          @click="sortBy = 'count-desc'"
        >
          Počet ↓
        </n-button>
        <n-button
          :type="sortBy === 'alphabetical' ? 'primary' : 'default'"
          @click="sortBy = 'alphabetical'"
        >
          A-Z
        </n-button>
      </n-button-group>
    </div>

    <div
      v-for="category in sortedCategories"
      :key="category.name"
      class="flex items-center justify-between gap-5 text-base"
    >
      <div class="font-bold min-w-[100px] text-blue truncate" :title="category.name">
        {{ category.name }}:
      </div>
      <div class="flex gap-2 items-center">
        <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(category.price) }}</div>
        <div class="text-blue text-xs text-muted-foreground whitespace-nowrap flex justify-end">
          ({{ category.percent }}%, {{ category.count }}×)
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
