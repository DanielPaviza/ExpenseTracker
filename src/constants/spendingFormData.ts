import { Spending } from '@/types/Spending'

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
  subCategory: '',
  tags: [] as string[],
  createdAt: new Date(),
}
