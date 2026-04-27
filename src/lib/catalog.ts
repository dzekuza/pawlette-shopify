import { getCollars, getCharms, type ShopifyCharm } from '@/lib/shopify'

export interface ProductDetail {
  slug: string
  id: string
  variantId: string
  productType: 'collar' | 'charm'
  name: string
  price: string
  shortDescription: string
  longDescription: string
  image: string
  images: string[]
  badge?: string
  accentColor: string
  tintColor: string
  ctaHref: string
  ctaLabel: string
  compatibilityNote: string
  tags: string[]
  features?: string
  set_includes?: string
  care?: string
  shipping?: string
  charmVariants?: ShopifyCharm[]
}

export function slugFromProductName (name: string) {
  return `collar-${name.replace(' set', '').replace(' Set', '').toLowerCase().replace(/\s+/g, '-')}`
}

export function slugFromCharmId (id: string) {
  return `charm-${id}`
}

function hexToRgba (hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Static fallback catalog for generateStaticParams — populated at runtime via Shopify
export const PRODUCT_CATALOG: ProductDetail[] = []

export function getProductBySlug (slug: string): ProductDetail | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug)
}

export async function getProductBySlugAsync (slug: string): Promise<ProductDetail | undefined> {
  if (slug === 'charm-charms') {
    const charms = await getCharms()
    const first = charms[0]
    if (!first) return undefined
    return {
      slug,
      id: 'charm-charms',
      variantId: first.variantId,
      productType: 'charm',
      name: 'Charms',
      price: '€6',
      shortDescription: 'Snap-on silicone charms for all PawCharms collars.',
      longDescription: 'Each charm clicks on and off in around five seconds. Collect your favourites and rotate styles every day without tools.',
      image: first.image,
      images: first.productImages.length > 0 ? first.productImages : (first.image ? [first.image] : []),
      accentColor: first.bg,
      tintColor: `${first.bg}33`,
      ctaHref: '/products',
      ctaLabel: 'Add in configurator',
      compatibilityNote: 'Compatible with every PawCharms collar set.',
      tags: ['Charm'],
      charmVariants: charms,
    }
  }

  if (slug.startsWith('charm-')) {
    const charmHandle = slug.replace(/^charm-/, '')
    const charms = await getCharms()
    const charm = charms.find((c) => c.id === charmHandle || c.handle === charmHandle)
    if (!charm) return undefined
    return {
      slug,
      id: `charm-${charm.id}`,
      variantId: charm.variantId,
      productType: 'charm',
      name: `${charm.title} charm`,
      price: charm.price,
      shortDescription: charm.description || 'Snap-on charm for all PawCharms collars.',
      longDescription: charm.description || `${charm.title} charm clicks on and off in around five seconds. Collect your favourites and rotate styles every day without tools.`,
      image: charm.image,
      images: charm.productImages.length > 0 ? charm.productImages : (charm.image ? [charm.image] : []),
      accentColor: charm.bg,
      tintColor: `${charm.bg}33`,
      ctaHref: '/products',
      ctaLabel: 'Add in configurator',
      compatibilityNote: 'Compatible with every PawCharms collar set.',
      tags: ['Charm'],
      features: charm.features,
      care: charm.care,
      shipping: charm.shipping,
    }
  }

  const collarHandle = slug.replace(/^collar-/, '')
  const normalize = (s: string) => s.replace(/-collar$/, '')
  const titleToSlug = (t: string) => t.replace(/ set/gi, '').toLowerCase().replace(/\s+/g, '-')
  const collars = await getCollars()
  const collar = collars.find((c) =>
    c.id === collarHandle ||
    c.handle === collarHandle ||
    normalize(c.handle) === normalize(collarHandle) ||
    titleToSlug(c.title) === collarHandle
  )
  if (!collar) return undefined

  return {
    slug,
    id: `collar-${collar.id}`,
    variantId: collar.variantId,
    productType: 'collar',
    name: collar.title,
    price: collar.price,
    shortDescription: collar.description || `${collar.title} — waterproof silicone collar with snap-on charms.`,
    longDescription: collar.description || `${collar.title} is a waterproof silicone collar set with five snap-on charms. Designed for daily wear and easy cleaning after rain, beach days, or muddy walks.`,
    image: '',
    images: [],
    accentColor: collar.color,
    tintColor: hexToRgba(collar.color, 0.15),
    ctaHref: '/products',
    ctaLabel: 'Build your set',
    compatibilityNote: 'Includes 5 charms. You can swap or add any individual charm at any time.',
    tags: collar.tags,
    features: collar.features,
    set_includes: collar.set_includes,
    care: collar.care,
    shipping: collar.shipping,
  }
}
