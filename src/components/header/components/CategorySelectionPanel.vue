<script setup lang="ts">
  import { CloseOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
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
    canBeEdited: boolean
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
      canBeEdited: false,
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
      canBeEdited: true,
    }))

    return [allCard, ...categoryCards]
  })

  const handleSelectCategory = (category: string | null) => {
    emit('select', category)
  }
</script>

<template>
  <div class="flex min-h-0 flex-col">
    <div class="flex items-center justify-between border-b border-line px-6 py-4">
      <div>
        <h2 class="text-lg font-semibold text-fg">{{ t('header.selectCategory') }}</h2>
        <p class="text-sm text-fg-muted">{{ cards.length - 1 }} {{ t('summary.categories') }}</p>
      </div>
      <n-button quaternary circle @click="emit('close')">
        <template #icon>
          <n-icon><CloseOutline /></n-icon>
        </template>
      </n-button>
    </div>

    <div class="grid min-h-0 grid-cols-1 gap-3 overflow-y-auto p-6 sm:grid-cols-2 lg:grid-cols-3">
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
        :can-be-edited="card.canBeEdited"
        @click="handleSelectCategory(card.category)"
      />
    </div>
  </div>
</template>
