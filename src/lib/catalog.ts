import { ALL_CHARMS, PRODUCTS } from '@/lib/data'
import { supabase } from '@/lib/supabase'

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
  return `collar-${name.replace(' set', '').toLowerCase()}`
}

export function slugFromCharmId (id: string) {
  return `charm-${id}`
}

const collarProducts: ProductDetail[] = PRODUCTS.map((product) => {
  const cleanName = product.name.replace(' set', '')
  const slug = slugFromProductName(product.name)
  return {
    slug,
    id: `collar-${product.id}`,
    productType: 'collar',
    name: product.name,
    price: product.price,
    shortDescription: product.desc,
    longDescription: `${cleanName} is a waterproof silicone collar set with five snap-on charms. Designed for daily wear and easy cleaning after rain, beach days, or muddy walks.`,
    image: product.image,
    images: product.image ? [product.image] : [],
    badge: product.badge,
    accentColor: product.collarColor,
    tintColor: product.bg,
    ctaHref: '/configure',
    ctaLabel: 'Build your set',
    compatibilityNote: 'Includes 5 charms. You can swap or add any individual charm at any time.'
  }
})

const charmProducts: ProductDetail[] = ALL_CHARMS.map((charm) => ({
  slug: slugFromCharmId(charm.id),
  id: `charm-${charm.id}`,
  productType: 'charm',
  name: `${charm.name} charm`,
  price: '€4',
  shortDescription: 'Snap-on charm for all PawCharms collars.',
  longDescription: `${charm.name} charm clicks on and off in around five seconds. Collect your favourites and rotate styles every day without tools.`,
  image: encodeURI(charm.image),
  images: charm.image ? [encodeURI(charm.image)] : [],
  accentColor: charm.bg,
  tintColor: `${charm.bg}33`,
  ctaHref: '/configure',
  ctaLabel: 'Add in configurator',
  compatibilityNote: 'Compatible with every PawCharms collar set.'
}))

export const PRODUCT_CATALOG: ProductDetail[] = [...collarProducts, ...charmProducts]

export function getProductBySlug (slug: string): ProductDetail | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug)
}

function hexToRgba (hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export async function getProductBySlugAsync (slug: string): Promise<ProductDetail | undefined> {
  // Charms are static-only
  if (slug.startsWith('charm-')) return getProductBySlug(slug)

  // For collars, try DB first — match "New", "New set", "New Collar", etc.
  const collarBaseName = slug
    .replace(/^collar-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const [productRes, shippingRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, color, stock, images, features, set_includes, care')
      .eq('type', 'collar')
      .ilike('name', `${collarBaseName}%`)
      .limit(1)
      .single(),
    supabase.from('settings').select('value').eq('key', 'shipping').single(),
  ])

  const data = productRes.data
  const shipping = shippingRes.data?.value

  if (data) {
    const staticMatch = collarProducts.find((p) => p.slug === slug)
    const dbImages = (data.images as string[]) ?? []
    const firstImage = dbImages[0] ?? staticMatch?.image ?? ''
    return {
      slug,
      id: `collar-${data.id}`,
      productType: 'collar',
      name: data.name,
      price: `€${data.price}`,
      shortDescription: staticMatch?.shortDescription ?? `${data.name} — waterproof silicone collar with snap-on charms.`,
      longDescription: staticMatch?.longDescription ?? `${data.name} is a waterproof silicone collar set with five snap-on charms.`,
      image: firstImage,
      images: dbImages.length > 0 ? dbImages : (staticMatch?.images ?? []),
      badge: data.stock === 'low_stock' ? 'Almost gone' : staticMatch?.badge,
      accentColor: data.color,
      tintColor: hexToRgba(data.color, 0.15),
      ctaHref: '/configure',
      ctaLabel: 'Build your set',
      compatibilityNote: 'Includes 5 charms. You can swap or add any individual charm at any time.',
      features: data.features ?? undefined,
      set_includes: data.set_includes ?? undefined,
      care: data.care ?? undefined,
      shipping: shipping ?? undefined,
    }
  }

  // DB miss — fall back to static
  return getProductBySlug(slug)
}
