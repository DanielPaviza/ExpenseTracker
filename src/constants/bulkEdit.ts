export const BulkEdit = {
  category: 'category',
  subCategory: 'subCategory',
  store: 'store',
  tag: 'tag',
} as const

export type BulkEdit = (typeof BulkEdit)[keyof typeof BulkEdit]
