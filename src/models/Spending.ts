export class Spending {
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
  createdAt: Date
  editedAt: Date | null

  get totalPrice(): number {
    return this.unitPrice * this.quantity
  }

  constructor(data?: Partial<Spending>) {
    this.id = data?.id ?? crypto.randomUUID()
    this.category = data?.category ?? ''
    this.type = data?.type ?? ''
    this.name = data?.name ?? ''
    this.isToBePaid = data?.isToBePaid ?? false
    this.isFree = data?.isFree ?? false
    this.payer = data?.payer ?? ''
    this.quantity = data?.quantity ?? 1
    this.unitPrice = data?.unitPrice ?? 0
    this.dimensions = data?.dimensions ?? null
    this.url = data?.url ?? null
    this.document = data?.document ?? null
    this.store = data?.store ?? null
    this.storeCode = data?.storeCode ?? null
    this.description = data?.description ?? null
    this.subCategory = data?.subCategory ?? null
    this.createdAt = data?.createdAt == null ? new Date() : new Date(data?.createdAt)
    this.editedAt = data?.editedAt == null ? null : new Date(data?.editedAt)
  }
}