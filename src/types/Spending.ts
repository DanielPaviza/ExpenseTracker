export interface Spending {
  id: string
  category: string
  type: string
  name: string
  isToBePaid: boolean
  isFree: boolean
  payer: string
  quantity: number
  unitPrice: number
  dimensions?: string | null
  url?: string | null
  document?: string | null
  store?: string | null
  storeCode?: string | null
  description?: string | null
  subCategory?: string | null
  tags: string[]
  createdAt: Date
  editedAt: Date | null
  readonly totalPrice: number // Computed property
}