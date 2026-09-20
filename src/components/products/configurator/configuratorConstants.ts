// Shared by the collar configurator parts and modals.

export const DIVIDER = 'var(--color-border)'

// Color filter chips shared by the Personalise + Extra-charms modals — hex values keyed the same
// as products.configurator.colorFilters in the message dictionaries.
export const CHARM_COLOR_FILTER_KEYS = [
  { key: 'blue', hex: '#B8D8F4' },
  { key: 'dark blue', hex: '#6B9FD4' },
  { key: 'pink', hex: '#F4B5C0' },
  { key: 'yellow', hex: '#F9E4A0' },
  { key: 'purple', hex: '#D4B8F4' },
]
export const COLOR_FILTER_LABEL_KEYS: Record<string, string> = {
  blue: 'blue',
  'dark blue': 'darkBlue',
  pink: 'pink',
  yellow: 'yellow',
  purple: 'purple',
}

// Color name → hex swatch mapping for display
export const COLOR_SWATCHES: Record<string, string> = {
  Pink:       '#F4B5C0',
  Blue:       '#B8D8F4',
  Cyan:       '#A8E6E6',
  'Blue/Green': '#A8D5C8',
  Green:      '#A8D5A2',
  Black:      'var(--color-bark)',
}
