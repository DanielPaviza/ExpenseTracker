import { CURRENCY_SYMBOL_EURO } from '@/constants/currency'
import { ENGLISH_LANGUAGE } from '@/constants/languages'
import { Settings } from '@/types/Settings'

export const DEFAULT_SETTINGS: Settings = {
  languageCode: ENGLISH_LANGUAGE.code,
  currencySymbol: CURRENCY_SYMBOL_EURO,
  tableGroupDefaultOpen: false,
  defaultSummaryCard: 'overviewAndCategories',
  defaultCategoryView: null,
}
