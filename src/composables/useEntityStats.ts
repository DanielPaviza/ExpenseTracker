import { type ComputedRef, type Ref, computed } from 'vue'

import type { Spending } from '@/types/Spending'

export type SortType =
  | 'alphabetical'
  | 'price-desc'
  | 'price-asc'
  | 'count-desc'
  | 'visits-desc'
  | 'avg-desc'

export interface EntityStat {
  name: string
  price: number
  count: number
  percent: number
  itemCount?: number
  avgPrice?: number
  visits?: number
  avgPerVisit?: number
}

export interface EntityStatsOptions {
  spendings: ComputedRef<Spending[]> | Ref<Spending[]>
  entities: ComputedRef<string[]> | Ref<string[]>
  totalPrice: ComputedRef<number> | Ref<number>
  filterFn: (spending: Spending, entity: string) => boolean
  sortBy: Ref<SortType>
  includeVisits?: boolean
  includeAverage?: boolean
}

export function useEntityStats(options: EntityStatsOptions) {
  const {
    spendings,
    entities,
    totalPrice,
    filterFn,
    sortBy,
    includeVisits = false,
    includeAverage = false,
  } = options

  const entityStats = computed<EntityStat[]>(() => {
    return entities.value.map((entity) => {
      const entityItems = spendings.value.filter((s: Spending) => filterFn(s, entity))
      const price = entityItems
        .filter((s: Spending) => !s.isFree && !s.isToBePaid)
        .reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
      const count = entityItems.length
      const itemCount = entityItems.reduce((sum: number, s: Spending) => sum + s.quantity, 0)
      const percent = totalPrice.value > 0 ? Math.round((price / totalPrice.value) * 100) : 0

      const stat: EntityStat = {
        name: entity,
        price,
        count,
        percent,
        itemCount,
      }

      if (includeAverage) stat.avgPrice = count > 0 ? price / count : 0

      if (includeVisits) {
        stat.visits = count
        stat.avgPerVisit = count > 0 ? price / count : 0
      }

      return stat
    })
  })

  const sortedStats = computed<EntityStat[]>(() => {
    const sorted = [...entityStats.value]
    switch (sortBy.value) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'count-desc':
        return sorted.sort((a, b) => b.count - a.count)
      case 'visits-desc':
        return sorted.sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
      case 'avg-desc':
        return sorted.sort((a, b) => (b.avgPerVisit ?? 0) - (a.avgPerVisit ?? 0))
      default:
        return sorted
    }
  })

  return {
    entityStats,
    sortedStats,
  }
}
