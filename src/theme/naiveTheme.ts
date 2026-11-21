import { type GlobalThemeOverrides } from 'naive-ui'

/**
 * Naive UI computes derived colors (hover, alpha variants...) from concrete values,
 * so the palette from style.css is mirrored here as plain hex strings.
 */
const FONT = `'Inter Variable', ui-sans-serif, system-ui, sans-serif`

const shared: GlobalThemeOverrides = {
  common: {
    fontFamily: FONT,
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    fontWeightStrong: '600',
  },
  Button: {
    fontWeight: '500',
    borderRadiusMedium: '8px',
  },
  Card: {
    borderRadius: '14px',
  },
  Drawer: {
    headerPadding: '20px 28px',
    bodyPadding: '20px 28px',
    footerPadding: '16px 28px',
  },
  Dialog: {
    borderRadius: '14px',
  },
  Tag: {
    borderRadius: '6px',
  },
}

export const lightThemeOverrides: GlobalThemeOverrides = {
  ...shared,
  common: {
    ...shared.common,
    primaryColor: '#2563eb',
    primaryColorHover: '#1d4ed8',
    primaryColorPressed: '#1e40af',
    primaryColorSuppl: '#3b82f6',
    infoColor: '#2563eb',
    infoColorHover: '#1d4ed8',
    infoColorPressed: '#1e40af',
    infoColorSuppl: '#3b82f6',
    successColor: '#16a34a',
    warningColor: '#d97706',
    errorColor: '#dc2626',
    errorColorHover: '#ef4444',
    textColorBase: '#0f172a',
    textColor1: '#0f172a',
    textColor2: '#334155',
    textColor3: '#5b6678',
    bodyColor: '#f3f6fb',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',
    borderColor: '#e3e8f0',
    dividerColor: '#e3e8f0',
    hoverColor: '#eef4ff',
  },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  ...shared,
  common: {
    ...shared.common,
    primaryColor: '#4f8cff',
    primaryColorHover: '#6d9fff',
    primaryColorPressed: '#3b7bf0',
    primaryColorSuppl: '#4f8cff',
    infoColor: '#4f8cff',
    infoColorHover: '#6d9fff',
    infoColorPressed: '#3b7bf0',
    infoColorSuppl: '#4f8cff',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
    errorColor: '#f87171',
    errorColorHover: '#fca5a5',
    textColorBase: '#e6ebf5',
    textColor1: '#e6ebf5',
    textColor2: '#c8d0de',
    textColor3: '#9aa6ba',
    bodyColor: '#0a0f1c',
    cardColor: '#111827',
    modalColor: '#151e30',
    popoverColor: '#1c2740',
    tableColor: '#111827',
    inputColor: '#151e30',
    borderColor: '#2a364d',
    dividerColor: '#222d42',
    hoverColor: 'rgba(79, 140, 255, 0.12)',
  },
}

/** Chart palette – blue identity first, then well separated hues. */
export const CHART_PALETTE = [
  '#2563eb',
  '#06b6d4',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#ec4899',
  '#64748b',
  '#ef4444',
  '#84cc16',
  '#0ea5e9',
]
