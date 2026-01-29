import { Spending } from '@/types/Spending'
import { SpendingDocument } from '@/types/SpendingDocument'

export const SPENDING_FORM_DATA_DEFAULT: Partial<Spending> = {
  category: '',
  type: '',
  name: '',
  isToBePaid: false,
  isFree: false,
  payer: '',
  quantity: 1,
  unitPrice: 0,
  dimensions: '',
  url: '',
  technicalDocumentUrl: '',
  store: '',
  storeCode: '',
  description: '',
  tableGroup: '',
  tags: [] as string[],
  createdAt: new Date(),
  documents: [] as SpendingDocument[],
}
