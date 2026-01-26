import { Ref, ref } from 'vue'
import { h, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatCurrency } from '@/composables/useCurrencyFormat'
import { formatDateLocalized } from '@/composables/useDateFormat'
import { SpendingColumn } from '@/types/SpendingColumn'

export function useSpendingsColumns(): { columns: Ref<SpendingColumn[]> } {
  const { t, locale } = useI18n()
  const columns = ref<SpendingColumn[]>(getColumns())

  // Trigger re-computation of columns when locale changes
  watch(
    () => locale.value,
    () => {
      columns.value = getColumns()
    },
  )

  function getColumns(): SpendingColumn[] {
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
          row.url
            ? h(
                'a',
                {
                  class: 'spending-link',
                  style: { color: '#3b82f6', 'text-decoration': 'underline' },
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  color: '#3b82f6',
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
        filterVal: (row) => (row.isToBePaid ? t('common.no') : t('common.yes')),
        render: (row) => (row.isToBePaid ? t('common.no') : t('common.yes')),
      },
      {
        title: t('columns.free'),
        key: 'isFree',
        isHidden: false,
        filterEnabled: true,
        selectFilterEnabled: true,
        tooltip: t('form.freeTooltip'),
        sortFn: (a, b) => Number(a.isFree) - Number(b.isFree),
        filterVal: (row) => (row.isFree ? t('common.yes') : t('common.no')),
        render: (row) => (row.isFree ? t('common.yes') : t('common.no')),
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
        filterVal: (row) => formatDateLocalized(new Date(row.createdAt)),
        render: (row) =>
          h(
            'div',
            { style: { 'font-size': '14px', color: '#666' } },
            formatDateLocalized(new Date(row.createdAt)),
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
          row.tags && row.tags.length > 0
            ? h(
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
          h('div', { style: { 'font-weight': 'bolder' } }, formatCurrency(row.totalPrice)),
      },
    ]
  }

  return {
    columns,
  }
}
