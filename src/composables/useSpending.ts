import { reactive } from 'vue'

import type { Spending } from '@/types/Spending'

export function createSpending(data?: Partial<Spending>): Spending {
  const now = new Date()

  return reactive({
    id: data?.id ?? crypto.randomUUID(),
    category: data?.category ?? '',
    type: data?.type ?? '',
    name: data?.name ?? '',
    isToBePaid: data?.isToBePaid ?? false,
    isFree: data?.isFree ?? false,
    payer: data?.payer ?? '',
    quantity: data?.quantity ?? 1,
    unitPrice: data?.unitPrice ?? 0,
    dimensions: data?.dimensions ?? null,
    url: data?.url ?? null,
    technicalDocumentUrl: data?.technicalDocumentUrl ?? null,
    store: data?.store ?? null,
    storeCode: data?.storeCode ?? null,
    description: data?.description ?? null,
    subCategory: data?.subCategory ?? null,
    tags: data?.tags ?? [],
    createdAt: data?.createdAt ? new Date(data.createdAt) : now,
    editedAt: data?.editedAt ? new Date(data.editedAt) : null,
    get totalPrice() {
      return this.unitPrice * this.quantity
    },
    documents: data?.documents
      ? data.documents.map((doc) => ({
          ...doc,
        }))
      : [],
  }) as Spending
}
