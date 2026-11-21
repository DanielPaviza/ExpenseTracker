export type ThemeMode = 'light' | 'dark' | 'system'
export type StartPage = 'dashboard' | 'spendings'

export type Settings = {
  currencySymbol: string
  tableGroupDefaultOpen: boolean
  languageCode: string
  theme: ThemeMode
  startPage: StartPage
  defaultCategoryView: string | null
  defaultHiddenSpendingColumns: string[]
}
