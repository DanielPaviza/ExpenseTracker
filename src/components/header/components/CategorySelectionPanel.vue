<script setup lang="ts">
  import { CloseOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, onBeforeUnmount, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  import CategoryStatCard from '@/components/header/components/CategoryStatCard.vue'
  import { useCategoryStats } from '@/composables/useCategoryStats'
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const emit = defineEmits<{
    (e: 'select', category: string | null): void
    (e: 'close'): void
  }>()

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { categoryView } = storeToRefs(store)

  const { categoryStats, allCategoriesStat, isSelected } = useCategoryStats(categoryView)

  type CategoryCardVm = {
    key: string
    category: string | null
    title: string
    totalPriceText: string
    count: number
    monthlyAverageText: string
    percent: number
    color: string
    selected: boolean
  }

  const purchasesLabel = computed(() => t('categoryPanel.purchases'))
  const monthLabel = computed(() => t('categoryPanel.month'))

  const cards = computed<CategoryCardVm[]>(() => {
    const all = allCategoriesStat.value

    const allCard: CategoryCardVm = {
      key: '__all__',
      category: null,
      title: t('common.allCategories'),
      totalPriceText: formatCurrency(all.totalPrice),
      count: all.count,
      monthlyAverageText: formatCurrency(all.monthlyAverage),
      percent: 100,
      color: all.color,
      selected: isSelected(null),
    }

    const categoryCards: CategoryCardVm[] = categoryStats.value.map((stat) => ({
      key: stat.name,
      category: stat.name,
      title: stat.name,
      totalPriceText: formatCurrency(stat.totalPrice),
      count: stat.count,
      monthlyAverageText: formatCurrency(stat.monthlyAverage),
      percent: stat.percent,
      color: stat.color,
      selected: isSelected(stat.name),
    }))

    return [allCard, ...categoryCards]
  })

  const handleSelectCategory = (category: string | null) => {
    emit('select', category)
  }

  // Listen for Escape key to emit 'close'
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close')
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

<template>
  <div class="category-selection-panel-root flex h-full flex-col">
    <div
      class="sticky top-0 z-10 backdrop-blur-sm pt-8 pb-3 mb-4 border-b border-blue flex justify-between items-center"
    >
      <h2 class="text-2xl font-bold text-blue">
        {{ t('header.selectCategory') }}
      </h2>
      <n-button tertiary color="#3b82f6" @click="emit('close')">
        <n-icon size="32">
          <CloseOutline />
        </n-icon>
        <div class="font-bold">
          {{ $t('common.close') }}
        </div>
      </n-button>
    </div>

    <div
      class="grid flex-1 min-h-0 overflow-y-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <CategoryStatCard
        v-for="card in cards"
        :key="card.key"
        :title="card.title"
        :total-price-text="card.totalPriceText"
        :count="card.count"
        :purchases-label="purchasesLabel"
        :monthly-average-text="card.monthlyAverageText"
        :month-label="monthLabel"
        :percent="card.percent"
        :color="card.color"
        :selected="card.selected"
        @click="handleSelectCategory(card.category)"
      />
    </div>
  </div>
</template>

<style scoped>
  .category-selection-panel-root {
    min-height: 0;
  }
</style>
