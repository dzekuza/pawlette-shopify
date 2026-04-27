import { getCollars, getCharms } from '@/lib/shopify'

export interface ProductDetail {
  slug: string
  id: string
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
  features?: string
  set_includes?: string
  care?: string
  shipping?: string
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
  if (slug.startsWith('charm-')) {
    const charmHandle = slug.replace(/^charm-/, '')
    const charms = await getCharms()
    const charm = charms.find((c) => c.id === charmHandle || c.handle === charmHandle)
    if (!charm) return undefined
    return {
      slug,
      id: `charm-${charm.id}`,
      productType: 'charm',
      name: `${charm.title} charm`,
      price: charm.price,
      shortDescription: 'Snap-on charm for all PawCharms collars.',
      longDescription: `${charm.title} charm clicks on and off in around five seconds. Collect your favourites and rotate styles every day without tools.`,
      image: charm.image,
      images: charm.image ? [charm.image] : [],
      accentColor: charm.bg,
      tintColor: `${charm.bg}33`,
      ctaHref: '/configure',
      ctaLabel: 'Add in configurator',
      compatibilityNote: 'Compatible with every PawCharms collar set.',
    }
  }

  const collarHandle = slug.replace(/^collar-/, '')
  const collars = await getCollars()
  const collar = collars.find((c) => c.id === collarHandle || c.handle === collarHandle)
  if (!collar) return undefined

  return {
    slug,
    id: `collar-${collar.id}`,
    productType: 'collar',
    name: collar.title,
    price: collar.price,
    shortDescription: `${collar.title} — waterproof silicone collar with snap-on charms.`,
    longDescription: `${collar.title} is a waterproof silicone collar set with five snap-on charms. Designed for daily wear and easy cleaning after rain, beach days, or muddy walks.`,
    image: '',
    images: [],
    accentColor: collar.color,
    tintColor: hexToRgba(collar.color, 0.15),
    ctaHref: '/configure',
    ctaLabel: 'Build your set',
    compatibilityNote: 'Includes 5 charms. You can swap or add any individual charm at any time.',
  }
}
