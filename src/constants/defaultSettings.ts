import { CZECH_LANGUAGE } from '@/constants/languages'
import { Settings } from '@/types/Settings'

export const DEFAULT_SETTINGS: Settings = {
  languageCode: CZECH_LANGUAGE.code,
  currencySymbol: 'Kč',
  dateFormat: 'DD.MM.YYYY',
  subGroupDefaultOpen: true,
}
