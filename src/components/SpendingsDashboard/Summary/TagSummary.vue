<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'

  import { Spending } from '@/types/Spending'

  const store = useSpendingsStore()
  const { spendings, tags, totalPrice } = storeToRefs(store)

  type SortType = 'alphabetical' | 'price-desc' | 'price-asc' | 'count-desc'
  const sortBy = ref<SortType>('price-desc')

  const tagStats = computed(() => {
    return tags.value.map((tag) => {
      const tagItems = spendings.value.filter((s: Spending) => s.tags && s.tags.includes(tag))
      const price = tagItems
        .filter((s: Spending) => !s.isFree && !s.isToBePaid)
        .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const count = tagItems.length
      const itemCount = tagItems.reduce((sum: number, s: Spending) => sum + s.quantity, 0)
      const avgPrice = count > 0 ? price / count : 0

      return {
        name: tag,
        price,
        count,
        itemCount,
        avgPrice,
        percent: totalPrice.value > 0 ? Math.round((price / totalPrice.value) * 100) : 0,
      }
    })
  })

  const sortedTags = computed(() => {
    const sorted = [...tagStats.value]
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

  const { displayedItems: displayedTags, hasMore, toggleText, showAll } = useItemsLimit(sortedTags)

  const chartLabels = computed(() => sortedTags.value.map((tag) => `${tag.name} (${tag.percent}%)`))
  const chartDatasets = computed(() => {
    const getData = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return sortedTags.value.map((tag) => tag.count)
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return sortedTags.value.map((tag) => tag.price)
      }
    }

    const getLabel = () => {
      switch (sortBy.value) {
        case 'count-desc':
          return 'Počet nákupů dle tagů'
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return 'Výdaje dle tagů'
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: generateColorPalette(sortedTags.value.length),
      },
    ]
  })
</script>

<template>
  <SummaryCard
    title="Výdaje dle tagů"
    :subtitle="`${tags.length} tagů`"
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
      v-for="tag in displayedTags"
      :key="tag.name"
      class="flex items-center justify-between gap-14 text-base"
    >
      <div class="font-bold min-w-[100px] text-blue truncate" :title="tag.name">
        {{ tag.name }}:
      </div>
      <div class="flex gap-2 items-center">
        <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(tag.price) }}</div>
        <div class="text-blue text-xs text-muted-foreground whitespace-nowrap flex justify-end">
          ({{ tag.percent }}%, {{ tag.count }}×)
        </div>
      </div>
    </div>

    <div
      v-if="hasMore"
      @click="showAll = !showAll"
      class="mt-1 text-blueLight text-xs cursor-pointer"
    >
      {{ toggleText }}
    </div>
  </SummaryCard>
</template>
