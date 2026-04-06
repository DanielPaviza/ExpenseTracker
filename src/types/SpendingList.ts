import { Spending } from '@/types/Spending'

export type SpendingList = {
  id: SpendingListKey
  label: string
  categories: string[]
  hiddenColumnKeys: string[]
  enableSorting: boolean
  showFilter: boolean
  spendings: Spending[]
}
export type SpendingListKey = 'allInOne' | 'byCategories' | 'byStores' | 'byTags'
