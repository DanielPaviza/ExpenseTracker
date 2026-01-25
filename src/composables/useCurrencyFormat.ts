import { useSettingsStore } from '@/stores/settingsStore'
import { formatNumberToCurrency } from '@/utils/formatUtils'

export function formatCurrency(price: number): string {
  const { settings } = useSettingsStore()
  const formattedNumber = formatNumberToCurrency(price, settings.currencySymbol)

  return formattedNumber
}
