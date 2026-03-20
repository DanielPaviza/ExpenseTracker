import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSettingsStore } from '@/stores/settingsStore'
import { useSpendingsStore } from '@/stores/spendingsStore'
import type { Spending } from '@/types/Spending'
import { SpendingList, SpendingListKey } from '@/types/SpendingList'

export function useSpendingsViews() {
  const { t } = useI18n()
  const spendingsStore = useSpendingsStore()
  const { settings } = useSettingsStore()

  // Check if a specific category is selected
  const isCategorySelected = computed(() => spendingsStore.categoryView !== null)

  // Memoized maps for categories, stores, and tags
  const stores = computed(() => {
    const storeSet = new Set(
      spendingsStore.spendings.map((s: Spending) => s?.store || t('table.unknown')),
    )
    return [...storeSet].sort()
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.tags && s.tags.length > 0) s.tags.forEach((tag: string) => tagSet.add(tag))
    })
    return [...tagSet].sort()
  })

  const spendingsByCategory = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (!map.has(s.category)) map.set(s.category, [])

      map.get(s.category)!.push(s)
    })
    return map
  })

  const spendingsBySubCategory = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      const subCategory = s.subCategory || t('table.unknown')
      if (!map.has(subCategory)) map.set(subCategory, [])

      map.get(subCategory)!.push(s)
    })
    return map
  })

  const spendingsByStore = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      const store = s.store || t('table.unknown')
      if (!map.has(store)) map.set(store, [])

      map.get(store)!.push(s)
    })
    return map
  })

  const spendingsByTag = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.tags.length === 0) {
        if (!map.has(t('table.noTag'))) map.set(t('table.noTag'), [])

        map.get(t('table.noTag'))!.push(s)
      }
      s.tags.forEach((tag: string) => {
        if (!map.has(tag)) map.set(tag, [])

        map.get(tag)!.push(s)
      })
    })
    return map
  })

  const getSpendingsByCategory = (category: string): Spending[] =>
    spendingsByCategory.value.get(category) || []
  const getSpendingsBySubCategory = (subCategory: string): Spending[] =>
    spendingsBySubCategory.value.get(subCategory) || []
  const getSpendingsByStore = (store: string): Spending[] => spendingsByStore.value.get(store) || []
  const getSpendingsByTag = (tag: string): Spending[] => spendingsByTag.value.get(tag) || []

  // Helper function for sorting spendings
  const getSortedSpendings = (
    spendings: Spending[],
    nameSortState: 'none' | 'asc' | 'desc',
    priceSortState: 'none' | 'asc' | 'desc',
  ): Spending[] => {
    const sorted = [...spendings]

    if (nameSortState !== 'none')
      sorted.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name, 'cs')
        return nameSortState === 'asc' ? comparison : -comparison
      })
    else if (priceSortState !== 'none')
      sorted.sort((a, b) => {
        const comparison = a.totalPrice - b.totalPrice
        return priceSortState === 'asc' ? comparison : -comparison
      })

    return sorted
  }

  const getHiddenColumnsForView = (defaultColumns: string[] = []): string[] => [
    ...settings.defaultHiddenSpendingColumns,
    ...defaultColumns,
  ]

  // View definitions factory
  const createViews = (
    nameSortState: 'none' | 'asc' | 'desc',
    priceSortState: 'none' | 'asc' | 'desc',
  ): Record<SpendingListKey, SpendingList> => ({
    allInOne: {
      id: 'allInOne',
      label: t('table.allInOneTable'),
      categories: [t('table.allExpenses')],
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: false,
      showFilter: false,
      getSpendings: (_: string): Spending[] =>
        getSortedSpendings(spendingsStore.spendings, nameSortState, priceSortState),
    },
    // Show bySubCategories when a category is selected, otherwise byCategories
    byCategories: isCategorySelected.value
      ? {
          id: 'byCategories',
          label: t('table.bySubCategories'),
          categories: spendingsStore.subCategories,
          hiddenColumnKeys: getHiddenColumnsForView(['subCategory']),
          enableSorting: true,
          showFilter: true,
          getSpendings: (subCategory: string): Spending[] =>
            getSortedSpendings(
              getSpendingsBySubCategory(subCategory),
              nameSortState,
              priceSortState,
            ),
        }
      : {
          id: 'byCategories',
          label: t('table.byCategories'),
          categories: spendingsStore.categories,
          hiddenColumnKeys: getHiddenColumnsForView(['category']),
          enableSorting: true,
          showFilter: true,
          getSpendings: (category: string): Spending[] =>
            getSortedSpendings(getSpendingsByCategory(category), nameSortState, priceSortState),
        },
    byStores: {
      id: 'byStores',
      label: t('table.byStores'),
      categories: stores.value,
      hiddenColumnKeys: getHiddenColumnsForView(['store']),
      enableSorting: true,
      showFilter: true,
      getSpendings: (store: string): Spending[] =>
        getSortedSpendings(getSpendingsByStore(store), nameSortState, priceSortState),
    },
    byTags: {
      id: 'byTags',
      label: t('table.byTags'),
      categories: allTags.value,
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: true,
      showFilter: true,
      getSpendings: (tag: string): Spending[] =>
        getSortedSpendings(getSpendingsByTag(tag), nameSortState, priceSortState),
    },
  })

  return {
    stores,
    allTags,
    createViews,
    isCategorySelected,
  }
}
