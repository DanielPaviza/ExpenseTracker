import type { VNode } from 'vue'

import type { Spending } from '@/types/Spending'
import type { SpendingColumn } from '@/types/SpendingColumn'

export function getCellContent(
  column: SpendingColumn,
  row: Spending,
  rowIndex: number,
): string | VNode {
  if (column.render) {
    const result = column.render(row, rowIndex)
    if (typeof result === 'object' && result !== null && '__v_isVNode' in result)
      return result as VNode

    return String(result)
  }
  const value = row[column.key as keyof Spending]
  return value !== null ? String(value) : '-'
}

export function calculateTotalPrice(spendings: Spending[]): number {
  return spendings
    .filter((spending) => !spending.isFree && !spending.isToBePaid)
    .reduce((sum, spending) => sum + spending.totalPrice, 0)
}

export function sortSpendingsByDefault(spendings: Spending[]): Spending[] {
  return [...spendings].sort((a, b) => {
    if (a.category === b.category)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

    return a.category.localeCompare(b.category)
  })
}
