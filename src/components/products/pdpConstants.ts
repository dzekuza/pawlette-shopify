// Shared, presentation-agnostic constants used by both the product-detail page (SingleProductPage.tsx)
// and the collar configurator (useCollarConfigurator.ts / CollarConfigurator.tsx). Pulled out into their
// own module so CollarConfigurator can import them without creating a circular dependency with
// SingleProductPage.tsx (which imports CollarConfigurator). SingleProductPage.tsx re-exports these so
// existing external imports (CharmBuilderPanel, CharmDecoratorPanel, Collar3DModal) keep working unchanged.

// Kept in sync with the "5 nemokami pakabukai su antkakliu" Shopify discount, which only
// zeroes out up to 5 charms per collar at checkout — raising this above 5 would let a
// shopper fill a 6th slot that gets charged full price, contradicting the "Įeina 5
// pakabukai" (5 charms included) marketing copy shown across the site.
export const MAX_CHARMS = 5

export const BORDER_COLOR = 'var(--color-border)'
export const TEXT_PRIMARY = 'var(--color-bark)'
export const TEXT_MUTED = 'var(--color-muted-foreground)'
export const TEXT_SECONDARY = 'var(--color-bark-light)'

export const PDP_REVIEW_RATING = 4.9
export const PDP_REVIEW_COUNT = 9
export const PDP_TRUST_POINTS = ['2–4 d. pristatymas', '30 d. grąžinimas', 'Pagaminta Lietuvoje']
const PDP_REVIEW_QUOTE = 'Prisisega per kelias sekundes ir net po purvinų pasivaikščiojimų atrodo kaip naujas.'

export const PDP_REVIEWS = [
  {
    quote: PDP_REVIEW_QUOTE,
    author: 'Laima K.',
  },
  {
    quote: 'Minkštas, lengvai valomas, o pakabukai laikėsi vietoje net po lietingo bėgimo parke.',
    author: 'Egle M.',
  },
  {
    quote: 'Gyvai atrodo itin kokybiškai, o mūsų šuo pagaliau turi antkaklį, kuris ir žaismingas, ir tvarkingas.',
    author: 'Rasa T.',
  },
]

const LT_COLOR_LABELS: Record<string, string> = {
  blue: 'Mėlyna',
  'sky blue': 'Dangaus mėlyna',
  'sky-blue': 'Dangaus mėlyna',
  'dark blue': 'Tamsiai mėlyna',
  'dark-blue': 'Tamsiai mėlyna',
  green: 'Žalia',
  red: 'Rausva',
  pink: 'Rožinė',
  yellow: 'Geltona',
  purple: 'Violetinė',
  'ligh blue': 'Šviesiai mėlyna',
  'light blue': 'Šviesiai mėlyna',
}

export function translateColorLabel (value: string) {
  return LT_COLOR_LABELS[value.toLowerCase()] ?? value
}
