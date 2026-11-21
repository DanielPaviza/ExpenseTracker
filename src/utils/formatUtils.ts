import { CHART_PALETTE } from '@/theme/naiveTheme'

/**
 * Formats a number with spaces as thousand separators.
 * @param num - The number to format.
 * @returns The formatted number as a string.
 */
export function formatNumberToCurrency(num: number, symbol: string): string {
  return `${Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${symbol}`
}

/**
 * Generate a deterministic color palette of hex colors.
 * Starts with `preselected` colors (kept in order), continues with the shared chart palette
 * and, if still more colors are needed, falls back to golden-angle distributed hues.
 *
 * @param colorsCount - desired total number of colors in returned array
 * @param preselected - array of hex color strings (e.g. ['#ff0000'])
 */
export function generateColorPalette(colorsCount: number, preselected: string[] = []): string[] {
  const result: string[] = []
  const push = (c: string): void => {
    const normalized = c.toLowerCase()
    if (result.length < colorsCount && !result.includes(normalized)) result.push(normalized)
  }

  preselected.filter((c) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)).forEach(push)
  CHART_PALETTE.forEach(push)

  let i = 0
  while (result.length < colorsCount) {
    const hue = Math.round((i * 137.508 + 210) % 360)
    push(`hsl(${hue}, 65%, ${50 + (i % 3) * 6}%)`)
    i++
  }

  return result
}

// Truncates text to a maximum length, adding "..." if truncated.
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - 3) + '...'
}
