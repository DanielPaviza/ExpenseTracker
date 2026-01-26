import { reactive } from 'vue'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings } from '@/types/Settings'

export function createSettings(data?: Partial<Settings>): Settings {
  return reactive({
    languageCode: data?.languageCode ?? DEFAULT_SETTINGS.languageCode,
    currencySymbol: data?.currencySymbol ?? DEFAULT_SETTINGS.currencySymbol,
    subGroupDefaultOpen: data?.subGroupDefaultOpen ?? DEFAULT_SETTINGS.subGroupDefaultOpen,
    defaultSummaryCard: data?.defaultSummaryCard ?? DEFAULT_SETTINGS.defaultSummaryCard,
  }) as Settings
}
