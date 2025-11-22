import { Spending } from '@models/Spending'
import { loadSpendings, saveSpendings } from '@utils/spendingStorage'
import { defineStore } from 'pinia'

import { computed, ref } from 'vue'

export const useSpendingsStore = defineStore('spendings', () => {
  const spendings = ref<Spending[]>([])
  const originalSpendings = ref<Spending[]>([])
  const isLoading = ref(false)

  const pendingChanges = computed(() => {
    return JSON.stringify(spendings.value) !== JSON.stringify(originalSpendings.value)
  })

  async function load() {
    isLoading.value = true
    try {
      const loadedData = await loadSpendings()
      spendings.value = loadedData
      originalSpendings.value = JSON.parse(JSON.stringify(loadedData))
    } finally {
      isLoading.value = false
    }
  }

  async function save() {
    isLoading.value = true
    try {
      await saveSpendings(spendings.value)
      originalSpendings.value = JSON.parse(JSON.stringify(spendings.value))
    } finally {
      isLoading.value = false
    }
  }

  function addSpending(spending: Spending) {
    spendings.value.push(spending)
  }

  function removeSpending(id: string) {
    const index = spendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      spendings.value.splice(index, 1)
    }
  }

  function updateSpending(id: string, updatedSpending: Spending) {
    const index = spendings.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      spendings.value[index] = updatedSpending
    }
  }

  function discardChanges() {
    spendings.value = JSON.parse(JSON.stringify(originalSpendings.value))
  }

  // Computed: distinct categories
  const categories = computed(() => {
    if (spendings.value.length === 0) return []

    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.category) set.add(s.category)
    }
    return Array.from(set)
  })

  const subCategories = computed(() => {
    if (spendings.value.length === 0) return []

    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.subCategory) set.add(s.subCategory)
    }
    return Array.from(set)
  })

  // Computed: distinct payers
  const payers = computed(() => {
    if (spendings.value.length === 0) return []

    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.payer) set.add(s.payer)
    }
    return Array.from(set)
  })

  // Computed: distinct stores
  const stores = computed(() => {
    if (spendings.value.length === 0) return []

    const set = new Set<string>()
    for (const s of spendings.value) {
      if (s.store) set.add(s.store)
    }
    return Array.from(set)
  })

  const totalPrice = computed(() => {
    return spendings.value.filter((s) => !s.isFree && !s.isToBePaid).reduce((sum, spending) => sum + spending.totalPrice, 0)
  })

  const totalUnpaid = computed(() => {
    return spendings.value
      .filter((s) => !s.isFree && s.isToBePaid)
      .reduce((sum, spending) => sum + spending.totalPrice, 0)
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
    discardChanges,
    categories,
    subCategories,
    payers,
    stores,
  }
})
