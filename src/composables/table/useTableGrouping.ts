import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Spending } from '@/types/Spending'
import { SortState, SortType } from '@/types/TableGroupSort'

export interface GroupedData {
  type: 'group' | 'item'
  tableGroup: string
  items: Spending[]
}

export function useTableGrouping(
  sortedData: () => Spending[],
  sortState: () => SortState,
  sortType: () => SortType,
) {
  const { t } = useI18n()

  const sortTableGroups = (groups: GroupedData[], sortState: SortState, sortType: SortType) => {
    if (sortType === 'abc')
      groups.sort((a, b) => {
        const comparison = a.tableGroup.localeCompare(b.tableGroup, 'cs')
        return sortState === 'asc' ? comparison : -comparison
      })
    else if (sortType === 'price')
      groups.sort((a, b) => {
        const totalA = a.items.reduce((sum, s) => sum + s.totalPrice, 0)
        const totalB = b.items.reduce((sum, s) => sum + s.totalPrice, 0)
        return sortState === 'asc' ? totalA - totalB : totalB - totalA
      })
  }

  const groupedData = computed<GroupedData[]>(() => {
    const result: GroupedData[] = []
    const tableGroupMap = new Map<string, Spending[]>()

    // Group items by tableGroup
    for (const item of sortedData() as Spending[]) {
      const subCat = item.tableGroup || t('table.unknown')
      if (!tableGroupMap.has(subCat)) tableGroupMap.set(subCat, [])

      tableGroupMap.get(subCat)!.push(item)
    }

    for (const [tableGroup, items] of tableGroupMap.entries())
      result.push({ type: 'group', tableGroup, items })

    sortTableGroups(result, sortState(), sortType())

    return result
  })

  return {
    groupedData,
  }
}
