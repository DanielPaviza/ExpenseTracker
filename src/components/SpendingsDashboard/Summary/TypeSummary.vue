<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'

  import { computed, ref } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const MAX_DISPLAYED_ITEMS = 8

  type SortType = 'price-desc' | 'count-desc' | 'alphabetical'
  const sortBy = ref<SortType>('price-desc')
  const showAll = ref(false)

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
    const sorted = [...typeStats.value]
    switch (sortBy.value) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'count-desc':
        return sorted.sort((a, b) => b.count - a.count)
      default:
        return sorted
    }
  })

  const displayedTypes = computed(() => {
    return showAll.value ? sortedTypes.value : sortedTypes.value.slice(0, MAX_DISPLAYED_ITEMS)
  })

  const chartLabels = computed(() => sortedTypes.value.map((t) => `${t.name} (${t.percent}%)`))
  const chartDatasets = computed(() => {
    const getData = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return sortedTypes.value.map((t) => t.count)
        case 'price-desc':
        case 'alphabetical':
        default:
          return sortedTypes.value.map((t) => t.price)
      }
    }

    const getLabel = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return 'Počet nákupů dle typu'
        case 'price-desc':
        case 'alphabetical':
        default:
          return 'Výdaje dle typu'
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: generateColorPalette(sortedTypes.value.length),
      },
    ]
  })
</script>

<template>
  <SummaryCard
    title="Výdaje dle typu"
    :subtitle="`${sortedTypes.length} typů`"
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

    <div v-for="type in displayedTypes" :key="type.name" class="flex items-center gap-5 text-base">
      <div class="font-bold min-w-[100px] w-full text-blue truncate" :title="type.name">
        {{ type.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(type.price) }}</div>
      <div class="text-blue text-xs text-muted-foreground whitespace-nowrap">
        ({{ type.count }}×)
      </div>
    </div>

    <div
      v-if="sortedTypes.length > MAX_DISPLAYED_ITEMS"
      @click="showAll = !showAll"
      class="mt-1 text-blueLight text-xs cursor-pointer"
    >
      {{ showAll ? '▲ Zobrazit méně' : `▼ Zobrazit všechny (${sortedTypes.length})` }}
    </div>
  </SummaryCard>
</template>
