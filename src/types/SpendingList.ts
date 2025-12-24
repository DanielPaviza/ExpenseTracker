import { Spending } from '@/types/Spending'

export type SpendingList = {
  id: SpendingListKey
  label: string
  categories: string[]
  hiddenColumnKeys: string[]
  enableSorting: boolean
  getSpendings: (categoryOrStoreOrTag: string) => Spending[]
}
export type SpendingListKey = 'allInOne' | 'byCategories' | 'byStores' | 'byTags'
