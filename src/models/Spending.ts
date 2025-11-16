export class Spending {
  // Required properties
  Id: string
  Category: string
  Type: string
  Name: string
  IsPaid: boolean
  Payer: string
  Quantity: number
  UnitPrice: number

  // Optional properties
  Dimensions?: string | null
  Url?: string | null
  Document?: string | null
  Store?: string | null
  StoreCode?: string | null
  Description?: string | null
  SubCategory?: string | null
  CreatedAt: Date
  EditedAt: Date | null

  constructor(data?: Partial<Spending>) {
    this.Id = data?.Id ?? crypto.randomUUID()
    this.Category = data?.Category ?? ''
    this.Type = data?.Type ?? ''
    this.Name = data?.Name ?? ''
    this.IsPaid = data?.IsPaid ?? false
    this.Payer = data?.Payer ?? ''
    this.Quantity = data?.Quantity ?? 1
    this.UnitPrice = data?.UnitPrice ?? 0
    this.Dimensions = data?.Dimensions ?? null
    this.Url = data?.Url ?? null
    this.Document = data?.Document ?? null
    this.Store = data?.Store ?? null
    this.StoreCode = data?.StoreCode ?? null
    this.Description = data?.Description ?? null
    this.SubCategory = data?.SubCategory ?? null
    this.CreatedAt = data?.CreatedAt == null ? new Date() : new Date(data?.CreatedAt)
    this.EditedAt = data?.EditedAt == null ? null : new Date(data?.EditedAt)
  }
}
