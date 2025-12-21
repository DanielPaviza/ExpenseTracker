<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { Spending } from '@/types/Spending'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, stores, totalPrice } = storeToRefs(store)

  type SortType = 'price-desc' | 'visits-desc' | 'avg-desc'
  const sortBy = ref<SortType>('price-desc')

  const storeStats = computed(() => {
    return stores.value.map((storeName) => {
      const storeSpendings = spendings.value.filter((s: Spending) => s.store === storeName)
      const price = storeSpendings
        .filter((s: Spending) => !s.isFree && !s.isToBePaid)
        .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const visits = storeSpendings.length
      const itemCount = storeSpendings.reduce((sum: number, s: Spending) => sum + s.quantity, 0)
      const avgPerVisit = visits > 0 ? price / visits : 0
      const percent = totalPrice.value > 0 ? Math.round((price / totalPrice.value) * 100) : 0
      return { name: storeName, price, visits, itemCount, avgPerVisit, percent }
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

  const {
    displayedItems: displayedStores,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStores)

  const chartLabels = computed(() => sortedStores.value.map((s) => `${s.name} (${s.percent}%)`))
  const chartDatasets = computed(() => {
    const getData = () => {
      switch (sortBy.value) {
        case 'visits-desc':
          return sortedStores.value.map((s) => s.visits)
        case 'avg-desc':
          return sortedStores.value.map((s) => s.avgPerVisit)
        case 'price-desc':
        default:
          return sortedStores.value.map((s) => s.price)
      }
    }

    const getLabel = () => {
      switch (sortBy.value) {
        case 'visits-desc':
          return t('summary.storeVisits')
        case 'avg-desc':
          return t('summary.avgSpendingPerVisit')
        case 'price-desc':
        default:
          return t('summary.expensesByStores')
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: generateColorPalette(sortedStores.value.length),
      },
    ]
  })
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByStores')"
    :subtitle="`${stores.length} ${$t('summary.stores')}`"
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
          {{ $t('summary.spending') }} ↓
        </n-button>
        <n-button
          :type="sortBy === 'visits-desc' ? 'primary' : 'default'"
          @click="sortBy = 'visits-desc'"
        >
          {{ $t('summary.visits') }} ↓
        </n-button>
        <n-button
          :type="sortBy === 'avg-desc' ? 'primary' : 'default'"
          @click="sortBy = 'avg-desc'"
        >
          {{ $t('summary.average') }} ↓
        </n-button>
      </n-button-group>
    </div>

    <div
      v-for="store in displayedStores"
      :key="store.name"
      class="flex items-center gap-5 text-base"
    >
      <div class="font-bold min-w-[100px] text-blue truncate" :title="store.name">
        {{ store.name }}:
      </div>
      <div class="flex w-full justify-end items-center gap-2">
        <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(store.price) }}</div>
        <div class="text-blue text-xs text-muted-foreground whitespace-nowrap">
          ({{ store.visits }}×, {{ formatNumberToCzk(store.avgPerVisit) }}/{{
            $t('summary.visit')
          }})
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
