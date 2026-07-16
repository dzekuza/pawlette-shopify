import { getCollars, getCharms, getLeashes, type ShopifyCharm, type ShopifyCollar, type ShopifyCollarVariant } from '@/lib/shopify'

export interface ProductDetail {
  slug: string
  id: string
  variantId: string
  productType: 'collar' | 'charm' | 'leash'
  name: string
  /** Real Shopify product title, before per-color synthesis (e.g. "Blue Leash"). */
  parentTitle?: string
  parentHandle?: string
  colorLabel?: string
  price: string
  originalPrice?: string
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
  leashVariants?: ShopifyCollarVariant[]
  leashColors?: string[]
  /** Video URLs from the "pawlette.social_video" metafield, managed per-product in Shopify Admin. */
  videos?: string[]
}

function slugifyText (value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function slugFromProductName (name: string) {
  return `collar-${slugifyText(name.replace(/\b(set|Set|rinkinys)\b/g, '').trim())}`
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

const CHARM_PRODUCT_GALLERY_FALLBACK = [
  '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
  '/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp',
  '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
]
const MAX_CHARM_GALLERY_IMAGES = 7

function uniqueStrings (values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function isNonEmptyString (value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0
}

function extractPlainText (value?: string) {
  if (!value) return ''

  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const candidate = node as { value?: unknown; children?: unknown[] }
    const ownValue = typeof candidate.value === 'string' ? candidate.value : ''
    const childValue = Array.isArray(candidate.children) ? candidate.children.map(walk).join(' ') : ''
    return [ownValue, childValue].filter(Boolean).join(' ').trim()
  }

  try {
    const parsed = JSON.parse(value) as unknown
    const text = walk(parsed).replace(/\s+/g, ' ').trim()
    if (text) return text
  } catch {
    // fall through to raw string cleanup
  }

  return value.replace(/\s+/g, ' ').trim()
}

function normalizeMarketingCopy (value?: string) {
  if (!value) return ''

  return value
    .replace(/\bPawlette\b/gi, 'PawCharms')
    .replace(/\bantkakli\b/gi, 'antkaklį')
    .replace(/\s+/g, ' ')
    .trim()
}

function getCharmGallery (charm: ShopifyCharm) {
  const productGallery = uniqueStrings([
    charm.productFeaturedImage,
    ...charm.productImages,
  ])

  const filledGallery = uniqueStrings([
    ...productGallery,
    ...CHARM_PRODUCT_GALLERY_FALLBACK,
  ]).slice(0, MAX_CHARM_GALLERY_IMAGES)

  if (filledGallery.length > 0) return filledGallery

  return uniqueStrings([
    charm.image,
    ...CHARM_PRODUCT_GALLERY_FALLBACK,
  ]).slice(0, MAX_CHARM_GALLERY_IMAGES)
}

function buildCharmCollectionProduct (charms: ShopifyCharm[]): ProductDetail | undefined {
  const first = charms[0]
  const images = first ? getCharmGallery(first) : []

  if (!first) return undefined

  // Icon charm variants all share the same image as productFeaturedImage (collection shot).
  // Letter charms have real per-variant Shopify CDN images — use those for the card thumbnail.
  const charmWithUniqueImage = charms.find(
    c => c.image && c.productFeaturedImage && c.image !== c.productFeaturedImage
  )
  const cardImage = charmWithUniqueImage?.image || first.productFeaturedImage || images[0] || ''

  return {
    slug: 'charm-charms',
    id: 'charm-charms',
    variantId: first.variantId,
    productType: 'charm',
    name: first.productTitle,
    price: first.price,
    originalPrice: first.originalPrice,
    shortDescription: normalizeMarketingCopy(first.productDescription),
    longDescription: normalizeMarketingCopy(first.description ?? first.productDescription) || 'Kiekvienas pakabukas užsisega ir nusiima maždaug per penkias sekundes.',
    image: cardImage,
    images,
    accentColor: first.bg,
    tintColor: `${first.bg}33`,
    ctaHref: '/products',
    ctaLabel: 'Pridėti konfigūratoriuje',
    compatibilityNote: 'Suderinama su kiekvienu PawCharms antkaklio rinkiniu.',
    tags: ['Pakabukas'],
    charmVariants: charms,
    care: first.care,
    shipping: first.shipping,
    videos: first.socialVideos,
  }
}

function buildCharmProduct (charm: ShopifyCharm): ProductDetail {
  const images = getCharmGallery(charm)
  const shortDescription = normalizeMarketingCopy(extractPlainText(charm.productDescription)) || 'Prisegamas pakabukas visiems PawCharms antkakliams.'

  return {
    slug: slugFromCharmId(charm.id),
    id: `charm-${charm.id}`,
    variantId: charm.variantId,
    productType: 'charm',
    name: charm.title,
    price: charm.price,
    originalPrice: charm.originalPrice,
    shortDescription,
    longDescription: normalizeMarketingCopy(charm.description) || `${charm.title} prisisega ir nusiima maždaug per penkias sekundes. Rinkite mėgstamiausius ir keiskite stilių kasdien be jokių įrankių.`,
    image: images[0] ?? '',
    images,
    accentColor: charm.bg,
    tintColor: `${charm.bg}33`,
    ctaHref: '/products',
    ctaLabel: 'Pridėti konfigūratoriuje',
    compatibilityNote: 'Suderinama su kiekvienu PawCharms antkaklio rinkiniu.',
    tags: ['Pakabukas'],
    features: charm.features,
    care: charm.care,
    shipping: charm.shipping,
    videos: charm.socialVideos,
  }
}

export function buildCollarProduct (collar: ShopifyCollar, opts?: { useParentMedia?: boolean, slugOverride?: string }): ProductDetail {
  const shortDescription = opts?.useParentMedia
    ? (normalizeMarketingCopy(collar.parentDescription) || normalizeMarketingCopy(extractPlainText(collar.description)) || `${collar.parentTitle} — vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais.`)
    : (normalizeMarketingCopy(extractPlainText(collar.description)) || `${collar.title} — vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais.`)
  const image = opts?.useParentMedia ? (collar.parentImage || collar.image) : collar.image
  const name = opts?.useParentMedia ? (collar.parentTitle || collar.title) : collar.title

  return {
    slug: opts?.slugOverride || slugFromProductName(collar.title),
    id: `collar-${collar.id}`,
    variantId: collar.variantId,
    productType: 'collar',
    name,
    parentTitle: collar.parentTitle,
    parentHandle: collar.nodeHandle,
    colorLabel: collar.colors[0],
    price: collar.price,
    originalPrice: collar.originalPrice,
    shortDescription,
    longDescription: normalizeMarketingCopy(opts?.useParentMedia ? collar.parentDescription : collar.description) || `${collar.title} yra vandeniui atsparus silikoninis antkaklio rinkinys su penkiais prisegamais pakabukais. Sukurtas kasdieniam nešiojimui ir lengvam valymui po lietaus, dienų paplūdimyje ar purvinų pasivaikščiojimų.`,
    image,
    images: uniqueStrings([image, ...collar.images]),
    accentColor: collar.color,
    tintColor: hexToRgba(collar.color, 0.15),
    ctaHref: '/products',
    ctaLabel: 'Kurti savo rinkinį',
    compatibilityNote: 'Įeina 5 pakabukai. Bet kada galite juos keisti arba papildyti naujais.',
    tags: collar.tags,
    features: collar.features,
    set_includes: collar.set_includes,
    care: collar.care,
    shipping: collar.shipping,
    videos: collar.socialVideos,
  }
}

export function buildLeashProduct (leash: ShopifyCollar, opts?: { useParentMedia?: boolean, slugOverride?: string }): ProductDetail {
  const shortDescription = opts?.useParentMedia
    ? (normalizeMarketingCopy(leash.parentDescription) || normalizeMarketingCopy(extractPlainText(leash.description)) || `${leash.parentTitle} — vandeniui atsparus silikoninis pavadėlis su patogiu rankenos dizainu.`)
    : (normalizeMarketingCopy(extractPlainText(leash.description)) || `${leash.title} — vandeniui atsparus silikoninis pavadėlis su patogiu rankenos dizainu.`)
  const image = opts?.useParentMedia ? (leash.parentImage || leash.image) : leash.image
  const name = opts?.useParentMedia ? (leash.parentTitle || leash.title) : leash.title

  return {
    slug: opts?.slugOverride || leash.handle,
    id: `leash-${leash.id}`,
    variantId: leash.variantId,
    productType: 'leash',
    name,
    parentTitle: leash.parentTitle,
    parentHandle: leash.nodeHandle,
    colorLabel: leash.colors[0],
    price: leash.price,
    originalPrice: leash.originalPrice,
    shortDescription,
    longDescription: normalizeMarketingCopy(opts?.useParentMedia ? leash.parentDescription : leash.description) || `${leash.title} yra vandeniui atsparus silikoninis pavadėlis, sukurtas kasdieniam naudojimui. Lengvai valomas, patvarus ir stilingas.`,
    image,
    images: uniqueStrings([image, ...leash.images]),
    accentColor: leash.color,
    tintColor: hexToRgba(leash.color, 0.15),
    ctaHref: '/pavadeliai',
    ctaLabel: 'Žiūrėti pavadėlius',
    compatibilityNote: 'Suderinamas su visais PawCharms antkakliais.',
    tags: leash.tags,
    features: leash.features,
    care: leash.care,
    shipping: leash.shipping,
    leashVariants: leash.variants,
    leashColors: leash.colors.length > 0 ? leash.colors : undefined,
    videos: leash.socialVideos,
  }
}

export function buildGroupedLeashProduct (leashes: ShopifyCollar[]): ProductDetail {
  const base = leashes[0]
  const allColors = [...new Set(leashes.flatMap(l => l.colors))]
  const allVariants = leashes.flatMap(l => l.variants)
  return {
    ...buildLeashProduct(base),
    leashColors: allColors.length > 0 ? allColors : undefined,
    leashVariants: allVariants,
  }
}

// Static fallback catalog for generateStaticParams — populated at runtime via Shopify
export const PRODUCT_CATALOG: ProductDetail[] = []

export function getProductBySlug (slug: string): ProductDetail | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug)
}

export async function getAllProductSlugs (): Promise<string[]> {
  const [collars, charms, leashes] = await Promise.all([getCollars(), getCharms(), getLeashes()])

  return [
    ...collars.map((collar) => collar.nodeHandle).filter(isNonEmptyString),
    ...collars.map((collar) => slugFromProductName(collar.title)),
    'charm-charms',
    'pawcharms-pakabuciai',
    ...charms.map((charm) => slugFromCharmId(charm.id)),
    ...leashes.map((leash) => leash.nodeHandle).filter(isNonEmptyString),
    ...leashes.map((leash) => leash.handle),
  ]
}

export async function getProductBySlugAsync (slug: string): Promise<ProductDetail | undefined> {
  if (slug === 'charm-charms' || slug === 'pawcharms-pakabuciai') {
    const charms = await getCharms()
    return buildCharmCollectionProduct(charms)
  }

  if (slug.startsWith('charm-')) {
    const charmHandle = slug.replace(/^charm-/, '')
    const charms = await getCharms()
    const charm = charms.find((c) => c.id === charmHandle || c.handle === charmHandle)
    if (!charm) return undefined
    return buildCharmProduct(charm)
  }

  const collarHandle = slug.replace(/^collar-/, '')
  const normalize = (s: string) => s.replace(/-collar$/, '')
  const titleToSlug = (t: string) => slugifyText(t.replace(/\b(set|rinkinys)\b/gi, '').trim())
  const collars = await getCollars()
  const collar = collars.find((c) =>
    c.id === collarHandle ||
    c.handle === collarHandle ||
    normalize(c.handle) === normalize(collarHandle) ||
    titleToSlug(c.title) === collarHandle
  )
  if (collar) return buildCollarProduct(collar)

  // Raw Shopify product handle (e.g. "pawcharms-antkaklis") — use the main product's own image/description, not a color variant's
  const parentCollar = collars.find((c) => c.nodeHandle === collarHandle || c.nodeHandle === slug)
  if (parentCollar) return buildCollarProduct(parentCollar, { useParentMedia: true, slugOverride: parentCollar.nodeHandle || slug })

  const leashes = await getLeashes()
  const directLeash = leashes.find((l) => l.handle === slug || l.id === slug)
  if (directLeash) return buildLeashProduct(directLeash)

  const parentLeash = leashes.find((l) => l.nodeHandle === slug)  // parent handle fallback (e.g. "pawlette-leash")
  if (parentLeash) return buildLeashProduct(parentLeash, { useParentMedia: true, slugOverride: parentLeash.nodeHandle || slug })

  return undefined
}

export async function getRecommendedProductsForProductAsync (product: ProductDetail, limit = 6): Promise<ProductDetail[]> {
  const [collars, charms, leashes] = await Promise.all([getCollars(), getCharms(), getLeashes()])
  const recommendations: ProductDetail[] = []
  const seen = new Set<string>([product.slug])

  const addProduct = (nextProduct?: ProductDetail) => {
    if (!nextProduct || seen.has(nextProduct.slug) || recommendations.length >= limit) return
    seen.add(nextProduct.slug)
    recommendations.push(nextProduct)
  }

  if (product.productType === 'collar') {
    addProduct(buildCharmCollectionProduct(charms))

    // Include leash as upsell — grouped so all colors are available in the upsell picker
    if (leashes.length > 0) addProduct(buildGroupedLeashProduct(leashes))

    for (const collar of collars) {
      addProduct(buildCollarProduct(collar))
    }

    return recommendations
  }

  for (const collar of collars) {
    addProduct(buildCollarProduct(collar))
  }

  if (product.slug !== 'charm-charms') {
    addProduct(buildCharmCollectionProduct(charms))
  }

  return recommendations
}
