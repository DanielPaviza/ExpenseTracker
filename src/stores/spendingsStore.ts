import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Spending } from '@models/Spending'
import { loadSpendings, saveSpendings } from '@utils/spendingStorage'

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
            originalSpendings.value = loadedData
        } finally {
            isLoading.value = false
        }
    }

    async function save() {
        isLoading.value = true
        try {
            await saveSpendings(spendings.value)
            originalSpendings.value = spendings.value
        } finally {
            isLoading.value = false
        }
    }

    function addSpending(spending: Spending) {
        spendings.value.push(spending)
    }

    function removeSpending(id: string) {
        const index = spendings.value.findIndex((s) => s.Id === id)
        if (index !== -1) {
            spendings.value.splice(index, 1)
        }
    }

    function updateSpending(id: string, updatedSpending: Spending) {
        const index = spendings.value.findIndex((s) => s.Id === id)
        if (index !== -1) {
            spendings.value[index] = updatedSpending
        }
    }

    function discardChanges() {
        spendings.value = originalSpendings.value
    }

    return {
        spendings,
        pendingChanges,
        isLoading,
        load,
        save,
        addSpending,
        removeSpending,
        updateSpending,
        discardChanges,
    }
})
