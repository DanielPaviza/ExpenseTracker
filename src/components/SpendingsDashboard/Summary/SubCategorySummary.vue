<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'
  import { NButton, NButtonGroup } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  type SortType = 'price-desc' | 'count-desc' | 'alphabetical'
  const sortBy = ref<SortType>('price-desc')
  const subCategories = computed(() => {
    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.subCategory) {
        set.add(s.subCategory)
      }
    }
    return Array.from(set)
  })

  const subCategoryStats = computed(() => {
    return subCategories.value.map((sub) => {
      const subCategorySpendings = spendings.value.filter((s) => s.subCategory === sub)
      const price = subCategorySpendings
        .filter((s) => !s.isFree && !s.isToBePaid)
        .reduce((sum, s) => sum + s.totalPrice, 0)
      const count = subCategorySpendings.length
      const percent = totalPrice.value > 0 ? Math.round((price / totalPrice.value) * 100) : 0
      return { name: sub, price, count, percent }
    })
  })

  const sortedSubCategories = computed(() => {
    const sorted = [...subCategoryStats.value]
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

  const {
    displayedItems: displayedSubCategories,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedSubCategories)

  const chartLabels = computed(() =>
    sortedSubCategories.value.map((s) => `${s.name} (${s.percent}%)`),
  )
  const chartDatasets = computed(() => {
    const getData = (): number[] => {
      switch (sortBy.value) {
        case 'count-desc':
          return sortedSubCategories.value.map((s) => s.count)
        case 'price-desc':
        case 'alphabetical':
        default:
          return sortedSubCategories.value.map((s) => s.price)
      }
    }

    const getLabel = (): string => {
      switch (sortBy.value) {
        case 'count-desc':
          return t('summary.purchasesBySubCategories')
        case 'price-desc':
        case 'alphabetical':
        default:
          return t('summary.expensesBySubCategories')
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: generateColorPalette(sortedSubCategories.value.length),
      },
    ]
  })
</script>

<template>
  <SummaryCard
    v-if="subCategories.length > 0"
    :title="$t('summary.expensesBySubCategories')"
    :subtitle="`${subCategories.length} ${$t('summary.subCategories')}`"
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
          {{ $t('table.price') }} ↓
        </n-button>
        <n-button
          :type="sortBy === 'count-desc' ? 'primary' : 'default'"
          @click="sortBy = 'count-desc'"
        >
          {{ $t('summary.count') }} ↓
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
      v-for="sub in displayedSubCategories"
      :key="sub.name"
      class="flex items-center gap-2 text-base"
    >
      <div class="font-bold min-w-[100px] text-blue truncate" :title="sub.name">
        {{ sub.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">
        {{ formatNumberToCzk(sub.price) }}
      </div>
      <div class="text-blue text-xs text-muted-foreground">({{ sub.count }}×)</div>
    </div>

    <div
      v-if="hasMore"
      class="mt-1 text-blueLight text-xs cursor-pointer"
      @click="showAll = !showAll"
    >
      {{ toggleText }}
    </div>
  </SummaryCard>
</template>
