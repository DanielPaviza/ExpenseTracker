import { SpendingDocument } from '@/types/SpendingDocument'

export interface Spending {
  id: string
  category: string
  subCategory: string
  type: string
  name: string
  isToBePaid: boolean
  isFree: boolean
  payer: string
  quantity: number
  unitPrice: number
  dimensions?: string | null
  url?: string | null
  technicalDocumentUrl?: string | null
  store?: string | null
  storeCode?: string | null
  description?: string | null
  tableGroup?: string | null
  tags: string[]
  createdAt: Date
  editedAt: Date | null
  documents: SpendingDocument[]
  readonly totalPrice: number // Computed property
}
