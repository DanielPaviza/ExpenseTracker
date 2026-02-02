import { VNodeChild } from 'vue'

import { Spending } from '@/types/Spending'

export interface ActionContextItem {
  label?: string
  key: string
  icon: () => VNodeChild
  handleSpendingAction?: (spending: Spending) => void | Promise<void>
  handleAction?: () => void | Promise<void>
}
