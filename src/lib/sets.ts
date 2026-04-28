import { slugFromProductName } from '@/lib/catalog'
import type { ShopifyCollar } from '@/lib/shopify'

export interface BundleSetProduct {
  title: string
  slug: string
  price: string
  image: string
  color: string
}

export interface BundleSet {
  id: string
  title: string
  description: string
  savingsLabel: string
  savingsPercent: number
  originalPrice: string
  bundlePrice: string
  collar: BundleSetProduct
  leash: BundleSetProduct
  accentColor: string
}

export const SETS_DISCOUNT_PERCENT = 12

const GENERIC_TOKENS = new Set([
  'personalized',
  'personalised',
  'personalizuotas',
  'personalizuoti',
  'personalizuota',
  'waterproof',
  'vandeniui',
  'atsparus',
  'atspari',
  'atsparūs',
  'dog',
  'šuns',
  'šunų',
  'with',
  'su',
  'charms',
  'pakabukais',
  'pakabukai',
  'collar',
  'antkaklis',
  'antkaklio',
  'leash',
  'pavadėlis',
  'pavadėlio',
  'set',
  'rinkinys',
  '5ft',
  '1,5m',
])

function parseEuroPrice (price: string) {
  const value = Number.parseFloat(price.replace(/[^\d.,-]/g, '').replace(',', '.'))
  return Number.isFinite(value) ? value : 0
}

function formatEuroPrice (amount: number) {
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? `€${rounded.toFixed(0)}` : `€${rounded.toFixed(2)}`
}

function trimProductTitle (title: string) {
  return title
    .replace(/personalized/ig, '')
    .replace(/personalised/ig, '')
    .replace(/personalizuotas/ig, '')
    .replace(/waterproof/ig, '')
    .replace(/vandeniui\s+atsparus/ig, '')
    .replace(/dog/ig, '')
    .replace(/šuns/ig, '')
    .replace(/with charms/ig, '')
    .replace(/su pakabukais/ig, '')
    .replace(/collar/ig, '')
    .replace(/antkaklis/ig, '')
    .replace(/leash/ig, '')
    .replace(/pavadėlis/ig, '')
    .replace(/-?\s*5ft/ig, '')
    .replace(/-?\s*1,5m/ig, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function productStem (product: ShopifyCollar) {
  const source = `${product.handle} ${product.title} ${product.tags.join(' ')}`

  return source
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
    .filter((token) => !GENERIC_TOKENS.has(token))
    .join(' ')
}

export function isLeashProduct (product: ShopifyCollar) {
  return /(leash|pavadė)/i.test(`${product.title} ${product.handle} ${product.tags.join(' ')}`)
}

export function isCollarSetProduct (product: ShopifyCollar) {
  return !isLeashProduct(product)
}

function pickMatchingLeash (collar: ShopifyCollar, leashes: ShopifyCollar[]) {
  if (leashes.length === 1) return leashes[0]

  const collarStem = productStem(collar)
  const collarTokens = new Set(collarStem.split(/\s+/).filter(Boolean))

  let bestLeash = leashes[0]
  let bestScore = -1

  for (const leash of leashes) {
    const leashStem = productStem(leash)
    const leashTokens = leashStem.split(/\s+/).filter(Boolean)

    let score = 0

    if (leash.color === collar.color) score += 100

    for (const token of leashTokens) {
      if (collarTokens.has(token)) score += 12
    }

    if (leashStem && collarStem && (leashStem.includes(collarStem) || collarStem.includes(leashStem))) {
      score += 30
    }

    if (score > bestScore) {
      bestScore = score
      bestLeash = leash
    }
  }

  return bestLeash
}

export function buildBundleSets (products: ShopifyCollar[]): BundleSet[] {
  const collars = products.filter(isCollarSetProduct)
  const leashes = products.filter(isLeashProduct)

  if (!collars.length || !leashes.length) return []

  return collars.map((collar) => {
    const leash = pickMatchingLeash(collar, leashes)
    const originalAmount = parseEuroPrice(collar.price) + parseEuroPrice(leash.price)
    const bundleAmount = originalAmount * (1 - SETS_DISCOUNT_PERCENT / 100)
    const savingsAmount = originalAmount - bundleAmount
    const trimmedTitle = trimProductTitle(collar.title)
    const baseTitle = trimmedTitle || collar.title

    return {
      id: `set-${collar.handle}-${leash.handle}`,
      title: `${baseTitle} pasivaikščiojimo rinkinys`,
      description: `Derinkite ${baseTitle.toLowerCase()} su tinkančiu pavadėliu ir sutaupykite ${SETS_DISCOUNT_PERCENT}% lyginant su pirkimu atskirai.`,
      savingsLabel: `Sutaupykite ${formatEuroPrice(savingsAmount)}`,
      savingsPercent: SETS_DISCOUNT_PERCENT,
      originalPrice: formatEuroPrice(originalAmount),
      bundlePrice: formatEuroPrice(bundleAmount),
      collar: {
        title: collar.title,
        slug: slugFromProductName(collar.title),
        price: collar.price,
        image: collar.image,
        color: collar.color,
      },
      leash: {
        title: leash.title,
        slug: slugFromProductName(leash.title),
        price: leash.price,
        image: leash.image,
        color: leash.color,
      },
      accentColor: collar.color,
    }
  })
}
