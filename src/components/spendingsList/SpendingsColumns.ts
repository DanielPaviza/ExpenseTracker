import type { DataTableColumns } from 'naive-ui'
import { Spending } from '@models/Spending'

export const SpendingsColumns: DataTableColumns<Spending> = [
    { title: 'Kategorie', key: 'category' },
    { title: 'Název', key: 'name' },
    { title: 'Typ', key: 'type' },
    {
        title: 'Celková cena',
        key: 'totalPrice',
        render: (row) => `${(row.totalPrice ?? row.unitPrice * row.quantity).toLocaleString()} Kč`,
    },
    { title: 'Obchod', key: 'store', render: (row) => row.store || '-' },
    { title: 'Zaplaceno', key: 'isPaid', render: (row) => (row.isPaid ? 'Ano' : 'Ne') },
    { title: 'Kdo platil', key: 'payer' },
    {
        title: 'Datum vytvoření',
        key: 'createdAt',
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
]
