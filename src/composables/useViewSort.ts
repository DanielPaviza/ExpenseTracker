import { ref } from 'vue'

type SortState = 'none' | 'asc' | 'desc'

export function useViewSort() {
  const nameSortState = ref<SortState>('asc') // Default to alphabetically ascending
  const priceSortState = ref<SortState>('none')

  const toggleNameSort = (): void => {
    if (nameSortState.value === 'none') {
      nameSortState.value = 'asc'
      priceSortState.value = 'none'
    } else if (nameSortState.value === 'asc') {
      nameSortState.value = 'desc'
      priceSortState.value = 'none'
    } else {
      nameSortState.value = 'none'
    }
  }

  const togglePriceSort = (): void => {
    if (priceSortState.value === 'none') {
      priceSortState.value = 'asc'
      nameSortState.value = 'none'
    } else if (priceSortState.value === 'asc') {
      priceSortState.value = 'desc'
      nameSortState.value = 'none'
    } else {
      priceSortState.value = 'none'
    }
  }

  // Sort categories by name or total price
  const getSortedCategories = <T extends { getSpendings: (category: string) => any[] }>(
    categories: string[],
    view: T,
  ): string[] => {
    const sorted = [...categories]

    if (nameSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const comparison = a.localeCompare(b, 'cs')
        return nameSortState.value === 'asc' ? comparison : -comparison
      })
    } else if (priceSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const spendingsA = view.getSpendings(a)
        const spendingsB = view.getSpendings(b)
        const totalA = spendingsA.reduce((sum, s) => sum + s.totalPrice, 0)
        const totalB = spendingsB.reduce((sum, s) => sum + s.totalPrice, 0)
        const comparison = totalA - totalB
        return priceSortState.value === 'asc' ? comparison : -comparison
      })
    }

    return sorted
  }

  return {
    nameSortState,
    priceSortState,
    toggleNameSort,
    togglePriceSort,
    getSortedCategories,
  }
}
