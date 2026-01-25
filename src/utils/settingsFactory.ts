import { reactive } from 'vue'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings } from '@/types/Settings'

export function createSettings(data?: Partial<Settings>): Settings {
  return reactive({
    languageCode: data?.languageCode ?? DEFAULT_SETTINGS.languageCode,
    currencySymbol: data?.currencySymbol ?? DEFAULT_SETTINGS.currencySymbol,
    dateFormat: data?.dateFormat ?? DEFAULT_SETTINGS.dateFormat,
    subGroupDefaultOpen: data?.subGroupDefaultOpen ?? DEFAULT_SETTINGS.subGroupDefaultOpen,
  }) as Settings
}
