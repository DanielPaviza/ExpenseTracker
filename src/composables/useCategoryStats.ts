import { useSpendingsStore } from '@stores/spendingsStore'
import { storeToRefs } from 'pinia'

import { type Ref, computed } from 'vue'

import { CHART_PALETTE } from '@/theme/naiveTheme'
import type { Spending } from '@/types/Spending'
import { generateColorPalette } from '@/utils/formatUtils'

export interface CategoryStat {
  name: string
  totalPrice: number
  count: number
  percent: number
  monthlyAverage: number
  color: string
}

function getCategoryColor(index: number): string {
  return generateColorPalette(index + 1)[index]
}

function calculateMonthlyAverage(spendings: Spending[]): number {
  if (spendings.length === 0) return 0

  const paidSpendings = spendings.filter((s) => !s.isFree && !s.isToBePaid)
  if (paidSpendings.length === 0) return 0

  const totalPrice = paidSpendings.reduce((sum, s) => sum + s.totalPrice, 0)

  // Get date range
  const dates = paidSpendings.map((s) => new Date(s.createdAt).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)

  // Calculate months between first and last purchase
  const monthsDiff = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30))

  return totalPrice / monthsDiff
}

export function useCategoryStats(selectedCategory: Ref<string | null>) {
  const store = useSpendingsStore()
  const { allSpendings, categories, totalPriceAll } = storeToRefs(store)

  const categoryStats = computed<CategoryStat[]>(() => {
    return categories.value.map((category, index) => {
      const categoryItems = allSpendings.value.filter((s: Spending) => s.category === category)
      const paidItems = categoryItems.filter((s: Spending) => !s.isFree && !s.isToBePaid)
      const totalPrice = paidItems.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const count = categoryItems.length
      const percent =
        totalPriceAll.value > 0 ? Math.round((totalPrice / totalPriceAll.value) * 100) : 0
      const monthlyAverage = calculateMonthlyAverage(categoryItems)

      return {
        name: category,
        totalPrice,
        count,
        percent,
        monthlyAverage,
        color: getCategoryColor(index),
      }
    })
  })

  // Stats for "All" category
  const allCategoriesStat = computed<CategoryStat>(() => {
    const allItems = allSpendings.value
    const paidItems = allItems.filter((s: Spending) => !s.isFree && !s.isToBePaid)
    const totalPrice = paidItems.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
    const count = allItems.length
    const monthlyAverage = calculateMonthlyAverage(allItems)

    return {
      name: 'all',
      totalPrice,
      count,
      percent: 100,
      monthlyAverage,
      color: CHART_PALETTE[0],
    }
  })

  const isSelected = (categoryName: string | null) => {
    return selectedCategory.value === categoryName
  }

  return {
    categoryStats,
    allCategoriesStat,
    totalPriceAllCategories: totalPriceAll,
    isSelected,
  }
}
