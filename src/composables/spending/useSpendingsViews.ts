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

  const allSpendings = computed(() =>
    spendingsStore.spendings.map((s: Spending) => {
      s.tableGroup = ''
      return s
    }),
  )

  const spendingsByCategory = computed<Spending[]>(() => {
    const copy = [...spendingsStore.spendings]
    const mappedSpendings = copy.map((s: Spending) => ({
      ...s,
      tableGroup: s.category,
    }))

    return mappedSpendings
  })

  const spendingsBySubCategory = computed(() => {
    const copy = [...spendingsStore.spendings]
    const mappedSpendings = copy.map((s: Spending) => ({
      ...s,
      tableGroup: s.subCategory,
    }))

    return mappedSpendings
  })

  const spendingsByStore = computed(() => {
    const copy = [...spendingsStore.spendings]
    const mappedSpendings = copy.map((s: Spending) => ({
      ...s,
      tableGroup: s.store || t('table.unknown'),
    }))

    return mappedSpendings
  })

  const spendingsByTag = computed<Spending[]>(() => {
    const duplicatedSpendings: Spending[] = []
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.tags.length === 0) {
        const copy = { ...s }
        copy.tableGroup = t('table.noTag')
        duplicatedSpendings.push(copy)
      }

      s.tags.forEach((tag: string) => {
        const copy = { ...s }
        copy.tableGroup = tag
        duplicatedSpendings.push(copy)
      })
    })

    return duplicatedSpendings
  })

  const getHiddenColumnsForView = (defaultColumns: string[] = []): string[] => [
    ...settings.defaultHiddenSpendingColumns,
    ...defaultColumns,
  ]

  // View definitions factory
  const createViews = (): Record<SpendingListKey, SpendingList> => ({
    allInOne: {
      id: 'allInOne',
      label: t('table.allInOneTable'),
      categories: [t('table.allExpenses')],
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: false,
      showFilter: false,
      spendings: allSpendings.value,
    },
    // Show bySubCategories when a category is selected, otherwise byCategories
    byCategories: isCategorySelected.value
      ? {
          id: 'byCategories',
          label: t('table.bySubCategories'),
          categories: spendingsStore.subCategories,
          hiddenColumnKeys: getHiddenColumnsForView(['subCategory']),
          enableSorting: true,
          showFilter: false,
          spendings: spendingsBySubCategory.value,
        }
      : {
          id: 'byCategories',
          label: t('table.byCategories'),
          categories: spendingsStore.categories,
          hiddenColumnKeys: getHiddenColumnsForView(['category']),
          enableSorting: true,
          showFilter: false,
          spendings: spendingsByCategory.value,
        },
    byStores: {
      id: 'byStores',
      label: t('table.byStores'),
      categories: stores.value,
      hiddenColumnKeys: getHiddenColumnsForView(['store']),
      enableSorting: true,
      showFilter: false,
      spendings: spendingsByStore.value,
    },
    byTags: {
      id: 'byTags',
      label: t('table.byTags'),
      categories: allTags.value,
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: true,
      showFilter: false,
      spendings: spendingsByTag.value,
    },
  })

  return {
    stores,
    allTags,
    createViews,
    isCategorySelected,
  }
}
