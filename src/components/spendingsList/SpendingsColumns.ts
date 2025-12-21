import { Spending } from '@/types/Spending'
import { formatDateShort, formatNumberToCzk } from '@utils/formatUtils'

import { type VNode, h } from 'vue'
import { useI18n } from 'vue-i18n'

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

export function useSpendingsColumns(): SpendingColumn[] {
  const { t } = useI18n()

  return [
    {
      title: t('columns.category'),
      key: 'category',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: true,
      tooltip: null,
      sortFn: (a, b) => a.category.localeCompare(b.category),
      filterVal: (row) => row.category,
      render: (row) => row.category,
    },
    {
      title: t('columns.type'),
      key: 'type',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: false,
      tooltip: null,
      sortFn: (a, b) => a.type.localeCompare(b.type),
      filterVal: (row) => row.type,
      render: (row) => row.type,
    },
    {
      title: t('columns.name'),
      key: 'name',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: false,
      tooltip: null,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      filterVal: (row) => row.name,
      render: (row) =>
        row.url ?
          h(
            'a',
            {
              class: 'spending-link',
              style: { color: '#3b82f6', 'text-decoration': 'underline' },
              target: "_blank",
              rel: "noopener noreferrer",
              color: "#3b82f6",
              title: t('form.openLink'),
              href: row.url,

            },
            row.name,
          )
          : row.name,
    },
    {
      title: t('columns.store'),
      key: 'store',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: true,
      tooltip: null,
      sortFn: (a, b) => (a.store || '').localeCompare(b.store || ''),
      filterVal: (row) => row.store || '',
      render: (row) => row.store || '-',
    },
    {
      title: t('columns.paid'),
      key: 'isToBePaid',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: true,
      tooltip: t('form.toBePaidTooltip'),
      sortFn: (a, b) => Number(a.isToBePaid) - Number(b.isToBePaid),
      filterVal: (row) => (row.isToBePaid ? t('form.no') : t('form.yes')),
      render: (row) => (row.isToBePaid ? t('form.no') : t('form.yes')),
    },
    {
      title: t('columns.free'),
      key: 'isFree',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: true,
      tooltip: t('form.freeTooltip'),
      sortFn: (a, b) => Number(a.isFree) - Number(b.isFree),
      filterVal: (row) => (row.isFree ? t('form.yes') : t('form.no')),
      render: (row) => (row.isFree ? t('form.yes') : t('form.no')),
    },
    {
      title: t('columns.payer'),
      key: 'payer',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: true,
      tooltip: null,
      sortFn: (a, b) => (a.payer || '').localeCompare(b.payer || ''),
      filterVal: (row) => row.payer || '',
      render: (row) => row.payer,
    },
    {
      title: t('columns.created'),
      key: 'createdAt',
      isHidden: true,
      filterEnabled: true,
      selectFilterEnabled: false,
      tooltip: null,
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
      title: t('columns.tags'),
      key: 'tags',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: false,
      tooltip: null,
      sortFn: (a, b) => (a.tags?.join(',') || '').localeCompare(b.tags?.join(',') || ''),
      filterVal: (row) => row.tags?.join(', ') || '',
      render: (row) =>
        row.tags && row.tags.length > 0 ?
          h(
            'div',
            { style: { display: 'flex', gap: '4px', 'flex-wrap': 'wrap' } },
            row.tags.map((tag: string) =>
              h(
                'span',
                {
                  style: {
                    padding: '2px 8px',
                    'border-radius': '12px',
                    'background-color': '#e0f2fe',
                    color: '#0369a1',
                    'font-size': '12px',
                    'font-weight': '500',
                  },
                },
                tag,
              ),
            ),
          )
          : '-',
    },
    {
      title: t('columns.price'),
      key: 'totalPrice',
      isHidden: false,
      filterEnabled: true,
      selectFilterEnabled: false,
      tooltip: null,
      sortFn: (a, b) => a.totalPrice - b.totalPrice,
      filterVal: (row) => String(row.totalPrice),
      render: (row) =>
        h(
          'div',
          { style: { 'font-weight': 'bolder' } },
          formatNumberToCzk(row.totalPrice),
        ),
    }
  ]
}
