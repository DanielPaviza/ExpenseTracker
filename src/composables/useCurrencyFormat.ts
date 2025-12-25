import { useI18n } from 'vue-i18n'

import { CURRENCY_CZK_SYMBOL, CURRENCY_EUR_SYMBOL } from '@/constants/currency'
import { formatNumberToCurrency } from '@/utils/formatUtils'

export function formatCurrency(price: number): string {
  const { locale } = useI18n()
  const symbol = locale.value === 'cs' ? CURRENCY_CZK_SYMBOL : CURRENCY_EUR_SYMBOL
  const formattedNumber = formatNumberToCurrency(price, symbol)

  return formattedNumber
}
