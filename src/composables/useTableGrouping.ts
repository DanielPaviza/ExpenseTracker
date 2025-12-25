import { computed } from 'vue'

import type { Spending } from '@/types/Spending'

export interface GroupedData {
  type: 'group' | 'item'
  subCategory?: string
  items?: Spending[]
  item?: Spending
}

export function useTableGrouping(sortedData: () => Spending[]) {
  const groupedData = computed<GroupedData[]>(() => {
    const result: GroupedData[] = []
    const subCategoryMap = new Map<string, Spending[]>()
    const itemsWithoutSubCategory: Spending[] = []

    // Group items by subCategory
    for (const item of sortedData()) {
      if (item.subCategory && item.subCategory.trim() !== '') {
        const subCat = item.subCategory
        if (!subCategoryMap.has(subCat)) {
          subCategoryMap.set(subCat, [])
        }
        subCategoryMap.get(subCat)!.push(item)
      } else {
        itemsWithoutSubCategory.push(item)
      }
    }

    // Add items without subCategory first
    for (const item of itemsWithoutSubCategory) {
      result.push({ type: 'item', item })
    }

    // Add grouped items (only group if more than 1 item)
    for (const [subCategory, items] of subCategoryMap.entries()) {
      if (items.length === 1) {
        // Single item - render as regular row
        result.push({ type: 'item', item: items[0] })
      } else {
        // Multiple items - render as collapsible group
        result.push({ type: 'group', subCategory, items })
      }
    }

    return result
  })

  return {
    groupedData,
  }
}
