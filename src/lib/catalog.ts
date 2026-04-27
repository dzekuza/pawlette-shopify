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

function uniqueStrings (values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function getCharmGallery (charm: ShopifyCharm) {
  const productGallery = uniqueStrings([
    charm.productFeaturedImage,
    ...charm.productImages,
  ])

  return productGallery.length > 0 ? productGallery : uniqueStrings([charm.image])
}

// Static fallback catalog for generateStaticParams — populated at runtime via Shopify
export const PRODUCT_CATALOG: ProductDetail[] = []

export function getProductBySlug (slug: string): ProductDetail | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug)
}

export async function getAllProductSlugs (): Promise<string[]> {
  const [collars, charms] = await Promise.all([getCollars(), getCharms()])

  return [
    ...collars.map((collar) => slugFromProductName(collar.title)),
    'charm-charms',
    ...charms.map((charm) => slugFromCharmId(charm.id)),
  ]
}

export async function getProductBySlugAsync (slug: string): Promise<ProductDetail | undefined> {
  if (slug === 'charm-charms') {
    const charms = await getCharms()
    const first = charms[0]
    const images = first ? getCharmGallery(first) : []
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
      image: images[0] ?? '',
      images,
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
    const images = charm ? getCharmGallery(charm) : []
    if (!charm) return undefined
    return {
      slug,
      id: `charm-${charm.id}`,
      variantId: charm.variantId,
      productType: 'charm',
      name: `${charm.title} charm`,
      price: charm.price,
      shortDescription: charm.productDescription || 'Snap-on charm for all PawCharms collars.',
      longDescription: charm.description || `${charm.title} charm clicks on and off in around five seconds. Collect your favourites and rotate styles every day without tools.`,
      image: images[0] ?? '',
      images,
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
    image: collar.image,
    images: uniqueStrings([collar.image, ...collar.images]),
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
