import { loadSpendings, saveSpendings } from '@utils/spendingStorage'
import { defineStore } from 'pinia'

import { computed, ref } from 'vue'

import { Spending } from '@/types/Spending'

export const useSpendingsStore = defineStore('spendings', () => {
  const spendings = ref<Spending[]>([])
  const originalSpendings = ref<Spending[]>([])
  const isLoading = ref(false)

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

  async function load() {
    isLoading.value = true
    try {
      const loadedData = await loadSpendings()
      spendings.value = loadedData
      originalSpendings.value = [...loadedData]
      // Clear tracking on fresh load
      newSpendingIds.value.clear()
      editedSpendingIds.value.clear()
      deletedSpendings.value = []
    } catch (error) {
      console.error('Failed to load spendings:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function save() {
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

  async function addSpending(spending: Spending) {
    spendings.value.push(spending)
    newSpendingIds.value.add(spending.id)
  }

  async function removeSpending(id: string) {
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

  async function restoreSpending(id: string) {
    const index = deletedSpendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      const spending = deletedSpendings.value[index]
      spendings.value.push(spending)
      deletedSpendings.value.splice(index, 1)
    }
  }

  async function restoreAllDeletedSpendings() {
    spendings.value.push(...deletedSpendings.value)
    console.log('Restoring all deleted spendings:', deletedSpendings.value)
    deletedSpendings.value = []
  }

  async function updateSpending(id: string, updatedSpending: Spending) {
    const index = spendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      spendings.value[index] = updatedSpending
      // Track as edited only if not already new
      if (!newSpendingIds.value.has(id)) {
        editedSpendingIds.value.add(id)
      }
    }
  }

  function discardChanges() {
    spendings.value = [...originalSpendings.value]
    deletedSpendings.value = []
    newSpendingIds.value.clear()
    editedSpendingIds.value.clear()
  }

  // Computed: distinct categories
  const categories = computed(() => {
    if (spendings.value.length === 0) {
      return []
    }

    const countMap = new Map<string, number>()
    for (const s of spendings.value) {
      if (s.category) {
        countMap.set(s.category, (countMap.get(s.category) || 0) + 1)
      }
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category)
  })

  const subCategories = computed(() => {
    if (spendings.value.length === 0) {
      return []
    }

    const countMap = new Map<string, number>()
    for (const s of spendings.value) {
      if (s.subCategory) {
        countMap.set(s.subCategory, (countMap.get(s.subCategory) || 0) + 1)
      }
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([subCategory]) => subCategory)
  })

  // Computed: distinct payers
  const payers = computed(() => {
    if (spendings.value.length === 0) {
      return []
    }

    const countMap = new Map<string, number>()
    for (const s of spendings.value) {
      if (s.payer) {
        countMap.set(s.payer, (countMap.get(s.payer) || 0) + 1)
      }
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([payer]) => payer)
  })

  // Computed: distinct stores
  const stores = computed(() => {
    if (spendings.value.length === 0) {
      return []
    }

    const countMap = new Map<string, number>()
    for (const s of spendings.value) {
      const key = s.store || 'Neznámé'
      countMap.set(key, (countMap.get(key) || 0) + 1)
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([store]) => store)
  })

  const totalPrice = computed(() => {
    return spendings.value
      .filter((s) => !s.isFree && !s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  const totalUnpaid = computed(() => {
    return spendings.value
      .filter((s) => !s.isFree && s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  // Computed: distinct tags
  const tags = computed(() => {
    if (spendings.value.length === 0) {
      return []
    }

    const countMap = new Map<string, number>()
    for (const s of spendings.value) {
      if (s.tags && s.tags.length > 0) {
        for (const tag of s.tags) {
          countMap.set(tag, (countMap.get(tag) || 0) + 1)
        }
      }
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  })

  return {
    spendings,
    totalPrice,
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
    discardChanges,
    categories,
    subCategories,
    payers,
    stores,
    tags,
    newSpendingIds,
    editedSpendingIds,
    deletedSpendings,
  }
})
