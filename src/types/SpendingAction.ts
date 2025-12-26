import { VNodeChild } from 'vue'

import { Spending } from '@/types/Spending'

export interface SpendingAction {
  label?: string
  key: string
  icon: () => VNodeChild
  handleAction: (spending: Spending) => void | Promise<void>
}
