export class Spending {
  // Required properties
  Id: string = crypto.randomUUID();
  Category: string;
  Name: string;
  IsPaid: boolean;
  PaidBy: string;
  Quantity: number;
  UnitPrice: number;
  
  // Optional properties
  Dimensions?: string | null;
  Url?: string | null;
  Document?: string | null;
  Store?: string | null;
  StoreCode?: string | null;
  Description?: string | null;
  SubCategory?: string | null;
  CreatedAt: Date;
  EditedAt: Date;

  constructor(data?: Partial<Spending>) {
    this.Category = data?.Category ?? '';
    this.Name = data?.Name ?? '';
    this.IsPaid = data?.IsPaid ?? false;
    this.PaidBy = data?.PaidBy ?? '';
    this.Quantity = data?.Quantity ?? 1;
    this.UnitPrice = data?.UnitPrice ?? 0;
    this.Dimensions = data?.Dimensions ?? null;
    this.Url = data?.Url ?? null;
    this.Document = data?.Document ?? null;
    this.Store = data?.Store ?? null;
    this.StoreCode = data?.StoreCode ?? null;
    this.Description = data?.Description ?? null;
    this.SubCategory = data?.SubCategory ?? null;
    this.CreatedAt = data?.CreatedAt ?? new Date();
    this.EditedAt = data?.EditedAt ?? new Date();
  }
}
