import { useSpendingsStore } from '@/stores/spendingsStore'

export function useSpendingStatus() {
  const store = useSpendingsStore()

  function getSpendingStatus(id: string): 'new' | 'edited' | null {
    if (store.newSpendingIds.has(id)) return 'new'

    if (store.editedSpendingIds.has(id)) return 'edited'

    return null
  }

  return {
    getSpendingStatus,
  }
}
