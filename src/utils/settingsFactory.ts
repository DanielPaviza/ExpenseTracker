import { reactive } from 'vue'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings, StartPage, ThemeMode } from '@/types/Settings'

const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system']
const START_PAGES: StartPage[] = ['dashboard', 'spendings']

export function createSettings(data?: Partial<Settings>): Settings {
  return reactive({
    languageCode: data?.languageCode ?? DEFAULT_SETTINGS.languageCode,
    currencySymbol: data?.currencySymbol ?? DEFAULT_SETTINGS.currencySymbol,
    tableGroupDefaultOpen: data?.tableGroupDefaultOpen ?? DEFAULT_SETTINGS.tableGroupDefaultOpen,
    theme: data?.theme && THEME_MODES.includes(data.theme) ? data.theme : DEFAULT_SETTINGS.theme,
    startPage:
      data?.startPage && START_PAGES.includes(data.startPage)
        ? data.startPage
        : DEFAULT_SETTINGS.startPage,
    defaultCategoryView: data?.defaultCategoryView ?? DEFAULT_SETTINGS.defaultCategoryView,
    defaultHiddenSpendingColumns:
      data?.defaultHiddenSpendingColumns ?? DEFAULT_SETTINGS.defaultHiddenSpendingColumns,
  }) as Settings
}
