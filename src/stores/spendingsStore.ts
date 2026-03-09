import { loadSpendings, saveSpendings } from '@utils/spendingStorage'
import { defineStore } from 'pinia'

import { computed, ref, watch } from 'vue'

import { useSettingsStore } from '@/stores/settingsStore'
import { Spending } from '@/types/Spending'

export const useSpendingsStore = defineStore('spendings', () => {
  const spendings = ref<Spending[]>([])
  const originalSpendings = ref<Spending[]>([])
  const isLoading = ref(false)
  const settingsStore = useSettingsStore()

  // App view state - null means no filtering by category
  const categoryView = ref<string | null>(null)

  const setCategoryViewSettings = (category: string | null): void => {
    const newSettings = { ...settingsStore.settings, defaultCategoryView: category }
    settingsStore.save(newSettings)
  }

  // Initialize the default category view from settings, when settings are loaded
  watch(
    () => settingsStore.isLoading,
    () => {
      // Default category does not exist anymore
      if (
        settingsStore.settings.defaultCategoryView !== null &&
        !categories.value.includes(settingsStore.settings.defaultCategoryView)
      ) {
        categoryView.value = null
        setCategoryViewSettings(null)
        return
      }

      categoryView.value = settingsStore.settings.defaultCategoryView
    },
  )

  // Track changes
  const newSpendingIds = ref<Set<string>>(new Set())
  const editedSpendingIds = ref<Set<string>>(new Set())
  const deletedSpendings = ref<Spending[]>([])

  const pendingChanges = computed(() => {
    const current = JSON.stringify(
      spendings.value.map((s) => ({ ...s })).sort((a, b) => a.id.localeCompare(b.id)),
    )
    const original = JSON.stringify(
      originalSpendings.value.map((s) => ({ ...s })).sort((a, b) => a.id.localeCompare(b.id)),
    )
    return current !== original
  })

  const spendingsInCategoryView = computed(() => {
    if (categoryView.value) return spendings.value.filter((s) => s.category === categoryView.value)

    return spendings.value
  })

  async function load(): Promise<boolean> {
    isLoading.value = true
    try {
      const loadedData = await loadSpendings()
      spendings.value = loadedData
      originalSpendings.value = [...loadedData]
      // Clear tracking on fresh load
      newSpendingIds.value.clear()
      editedSpendingIds.value.clear()
      deletedSpendings.value = []
      return true
    } catch (error) {
      console.error('Failed to load spendings:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function save(): Promise<void> {
    isLoading.value = true
    try {
      await saveSpendings(spendings.value)
      originalSpendings.value = [...spendings.value]
    } catch (error) {
      console.error('Failed to save spendings:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function addSpending(spending: Spending): void {
    spendings.value.push(spending)
    newSpendingIds.value.add(spending.id)
  }

  function removeSpending(id: string): void {
    const index = spendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      const spending = spendings.value[index]
      deletedSpendings.value.push(spending)
      spendings.value.splice(index, 1)
      // Remove from new/edited tracking if present
      newSpendingIds.value.delete(id)
      editedSpendingIds.value.delete(id)
    }
  }

  function removeSpendingCategory(category: string): void {
    const toDelete = spendings.value.filter((s) => s.category === category)
    for (const spending of toDelete) removeSpending(spending.id)

    // Switch the view if currently viewing the deleted category
    if (categoryView.value === category) categoryView.value = null

    // Update settings if default category view was the deleted category
    if (settingsStore.settings.defaultCategoryView === category) setCategoryViewSettings(null)
  }

  function renameSpendingCategory(oldCategory: string, newCategory: string): void {
    for (const spending of spendings.value)
      if (spending.category === oldCategory) {
        const updatedSpending = { ...spending, category: newCategory }
        updateSpending(spending.id, updatedSpending)
      }

    // Switch the view if currently viewing the renamed category
    if (categoryView.value === oldCategory) categoryView.value = newCategory

    // Update settings if default category view was the renamed category
    if (settingsStore.settings.defaultCategoryView === oldCategory)
      setCategoryViewSettings(newCategory)
  }

  function removeSpendingStore(store: string, acrossAllCategories: boolean): void {
    const toDelete = spendings.value.filter(
      (s) => s.store === store && (acrossAllCategories || s.category === categoryView.value),
    )
    for (const spending of toDelete) removeSpending(spending.id)
  }

  function renameSpendingStore(
    oldStore: string,
    newStore: string,
    acrossAllCategories: boolean,
  ): void {
    for (const spending of spendings.value)
      if (
        spending.store === oldStore &&
        (acrossAllCategories || spending.category === categoryView.value)
      ) {
        const updatedSpending = { ...spending, store: newStore }
        updateSpending(spending.id, updatedSpending)
      }
  }

  function removeSpendingSubCategory(subCategory: string, acrossAllCategories: boolean): void {
    const toDelete = spendings.value.filter(
      (s) =>
        s.subCategory === subCategory && (acrossAllCategories || s.category === categoryView.value),
    )
    for (const spending of toDelete) removeSpending(spending.id)
  }

  function renameSpendingSubCategory(
    oldSubCategory: string,
    newSubCategory: string,
    acrossAllCategories: boolean,
  ): void {
    for (const spending of spendings.value)
      if (
        spending.subCategory === oldSubCategory &&
        (acrossAllCategories || spending.category === categoryView.value)
      ) {
        const updatedSpending = { ...spending, subCategory: newSubCategory }
        updateSpending(spending.id, updatedSpending)
      }
  }

  function removeSpendingTag(tag: string, acrossAllCategories: boolean): void {
    for (const spending of spendings.value)
      if (
        spending.tags &&
        spending.tags.includes(tag) &&
        (acrossAllCategories || spending.category === categoryView.value)
      ) {
        const updatedTags = spending.tags.filter((t) => t !== tag)
        const updatedSpending = { ...spending, tags: updatedTags }
        updateSpending(spending.id, updatedSpending)
      }
  }

  function renameSpendingTag(oldTag: string, newTag: string, acrossAllCategories: boolean): void {
    for (const spending of spendings.value)
      if (
        spending.tags &&
        spending.tags.includes(oldTag) &&
        (acrossAllCategories || spending.category === categoryView.value)
      ) {
        const updatedTags = spending.tags.map((t) => (t === oldTag ? newTag : t))
        const updatedSpending = { ...spending, tags: updatedTags }
        updateSpending(spending.id, updatedSpending)
      }
  }

  function restoreSpending(id: string): void {
    const index = deletedSpendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      const spending = deletedSpendings.value[index]
      spendings.value.push(spending)
      deletedSpendings.value.splice(index, 1)
    }
  }

  function restoreAllDeletedSpendings(): void {
    spendings.value.push(...deletedSpendings.value)
    console.log('Restoring all deleted spendings:', deletedSpendings.value)
    deletedSpendings.value = []
  }

  function updateSpending(id: string, updatedSpending: Spending): void {
    const index = spendings.value.findIndex((s) => s.id === id)
    if (index < 0) return

    spendings.value[index] = updatedSpending
    // Track as edited only if not already new
    if (!newSpendingIds.value.has(id)) editedSpendingIds.value.add(id)
  }

  function discardChanges(): void {
    spendings.value = [...originalSpendings.value]
    deletedSpendings.value = []
    newSpendingIds.value.clear()
    editedSpendingIds.value.clear()
  }

  // Computed: distinct categories
  const categories = computed(() => {
    if (spendings.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendings.value)
      if (s.category) countMap.set(s.category, (countMap.get(s.category) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category)
  })

  const subCategories = computed(() => {
    if (spendingsInCategoryView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendingsInCategoryView.value)
      if (s.subCategory) countMap.set(s.subCategory, (countMap.get(s.subCategory) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([subCategory]) => subCategory)
  })

  const tableGroups = computed(() => {
    if (spendingsInCategoryView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendingsInCategoryView.value)
      if (s.tableGroup) countMap.set(s.tableGroup, (countMap.get(s.tableGroup) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tableGroup]) => tableGroup)
  })

  // Computed: distinct payers
  const payers = computed(() => {
    if (spendingsInCategoryView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendingsInCategoryView.value)
      if (s.payer) countMap.set(s.payer, (countMap.get(s.payer) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([payer]) => payer)
  })

  // Computed: distinct stores
  const stores = computed(() => {
    if (spendingsInCategoryView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendingsInCategoryView.value) {
      const key = s.store || 'Neznámé'
      countMap.set(key, (countMap.get(key) || 0) + 1)
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([store]) => store)
  })

  const totalPrice = computed(() => {
    return spendingsInCategoryView.value
      .filter((s) => !s.isFree && !s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  const totalUnpaid = computed(() => {
    return spendingsInCategoryView.value
      .filter((s) => !s.isFree && s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  // Computed: distinct tags
  const tags = computed(() => {
    if (spendingsInCategoryView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of spendingsInCategoryView.value)
      if (s.tags && s.tags.length > 0)
        for (const tag of s.tags) countMap.set(tag, (countMap.get(tag) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  })

  // Unfiltered spendings for global statistics
  const allSpendings = computed(() => spendings.value)

  // Total price across all categories (unfiltered)
  const totalPriceAll = computed(() => {
    return spendings.value
      .filter((s) => !s.isFree && !s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  return {
    categoryView,
    spendings: spendingsInCategoryView,
    allSpendings,
    totalPrice,
    totalPriceAll,
    totalUnpaid,
    pendingChanges,
    isLoading,
    load,
    save,
    addSpending,
    removeSpending,
    updateSpending,
    restoreSpending,
    restoreAllDeletedSpendings,
    removeSpendingCategory,
    renameSpendingCategory,
    removeSpendingStore,
    renameSpendingStore,
    removeSpendingSubCategory,
    renameSpendingSubCategory,
    removeSpendingTag,
    renameSpendingTag,
    discardChanges,
    categories,
    subCategories,
    tableGroups,
    payers,
    stores,
    tags,
    newSpendingIds,
    editedSpendingIds,
    deletedSpendings,
  }
})
