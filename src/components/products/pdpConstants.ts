// Shared, presentation-agnostic constants used by both the product-detail page (SingleProductPage.tsx)
// and the collar configurator (useCollarConfigurator.ts / CollarConfigurator.tsx). Pulled out into their
// own module so CollarConfigurator can import them without creating a circular dependency with
// SingleProductPage.tsx (which imports CollarConfigurator). SingleProductPage.tsx re-exports these so
// existing external imports (CharmBuilderPanel, CharmDecoratorPanel, Collar3DModal) keep working unchanged.

import type { useTranslations } from 'next-intl'

// Scoped to the `products.pdp` message namespace — pass `useTranslations('products.pdp')` from the caller.
type PdpTranslator = ReturnType<typeof useTranslations>

// Total charm slots shown in the personalise UI. The "5 nemokami pakabukai su antkakliu"
// Shopify discount only zeroes out up to FREE_CHARMS charms per collar at checkout — the
// 6th slot (index FREE_CHARMS) is priced at full charm price, shown with a €3.99 badge
// wherever slots are rendered.
export const MAX_CHARMS = 6
export const FREE_CHARMS = 5

export const BORDER_COLOR = 'var(--color-border)'
export const TEXT_PRIMARY = 'var(--color-bark)'
export const TEXT_MUTED = 'var(--color-muted-foreground)'
export const TEXT_SECONDARY = 'var(--color-bark-light)'

export const PDP_REVIEW_RATING = 4.9
export const PDP_REVIEW_COUNT = 9

export function getPdpTrustPoints (t: PdpTranslator): string[] {
  return t.raw('trustPoints')
}

export function getPdpReviews (t: PdpTranslator): { quote: string; author: string }[] {
  return t.raw('reviews')
}

const COLOR_LABEL_KEYS: Record<string, string> = {
  blue: 'blue',
  'sky blue': 'skyBlue',
  'sky-blue': 'skyBlue',
  'dark blue': 'darkBlue',
  'dark-blue': 'darkBlue',
  green: 'green',
  red: 'red',
  pink: 'pink',
  yellow: 'yellow',
  purple: 'purple',
  'ligh blue': 'lightBlue',
  'light blue': 'lightBlue',
}

export function translateColorLabel (t: PdpTranslator, value: string) {
  const key = COLOR_LABEL_KEYS[value.toLowerCase()]
  return key ? t(`colorNames.${key}`) : value
}
