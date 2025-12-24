import { VNode } from 'vue'

import { Spending } from '@/types/Spending'

export interface SpendingColumn {
  title: string
  key: keyof Spending | string
  isHidden?: boolean
  filterEnabled?: boolean
  selectFilterEnabled?: boolean
  tooltip?: string | null
  sortFn?: (a: Spending, b: Spending) => number
  filterVal: (row: Spending) => string
  render?: (row: Spending, rowIndex: number) => VNode | string | number
}
