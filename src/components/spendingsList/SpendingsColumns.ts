import { Spending } from '@models/Spending'
import { formatDateShort, formatNumberToCzk } from '@utils/formatUtils'

import { type VNode, h } from 'vue'

export interface SpendingColumn {
  title: string
  key: keyof Spending | string
  isHidden?: boolean
  sortFn?: (a: Spending, b: Spending) => number
  filterVal: (row: Spending) => string
  render?: (row: Spending, rowIndex: number) => VNode | string | number
}

export const SpendingsColumns: SpendingColumn[] = [
  {
    title: 'Kategorie',
    key: 'category',
    isHidden: false,
    sortFn: (a, b) => a.category.localeCompare(b.category),
    filterVal: (row) => row.category,
    render: (row) => row.category,
  },
  {
    title: 'Typ',
    key: 'type',
    isHidden: false,
    sortFn: (a, b) => a.type.localeCompare(b.type),
    filterVal: (row) => row.type,
    render: (row) => row.type,
  },
  {
    title: 'Název',
    key: 'name',
    isHidden: false,
    sortFn: (a, b) => a.name.localeCompare(b.name),
    filterVal: (row) => row.name,
    render: (row) => row.name,
  },
  {
    title: 'Obchod',
    key: 'store',
    isHidden: false,
    sortFn: (a, b) => (a.store || '').localeCompare(b.store || ''),
    filterVal: (row) => row.store || '',
    render: (row) => row.store || '-',
  },
  {
    title: 'Zaplaceno',
    key: 'isToBePaid',
    isHidden: false,
    sortFn: (a, b) => Number(a.isToBePaid) - Number(b.isToBePaid),
    filterVal: (row) => (row.isToBePaid ? 'Ano' : 'Ne'),
    render: (row) => (row.isToBePaid ? 'Ano' : 'Ne'),
  },
  {
    title: 'Plátce',
    key: 'payer',
    isHidden: false,
    sortFn: (a, b) => (a.payer || '').localeCompare(b.payer || ''),
    filterVal: (row) => row.payer || '',
    render: (row) => row.payer,
  },
  {
    title: 'Vytvořeno',
    key: 'createdAt',
    isHidden: false,
    sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    filterVal: (row) => formatDateShort(new Date(row.createdAt)),
    render: (row) =>
      h(
        'div',
        { style: { 'font-size': '14px', color: '#666' } },
        formatDateShort(new Date(row.createdAt)),
      ),
  },
  {
    title: 'Cena',
    key: 'totalPrice',
    isHidden: false,
    sortFn: (a, b) => a.totalPrice - b.totalPrice,
    filterVal: (row) => String(row.totalPrice),
    render: (row) =>
      h(
        'div',
        { style: { 'font-weight': 'bolder' } },
        formatNumberToCzk(row.totalPrice),
      ),
  },
]
