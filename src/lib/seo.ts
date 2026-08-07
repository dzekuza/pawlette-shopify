import type { ProductDetail } from '@/lib/catalog'
import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config'
import { getTranslations } from 'next-intl/server'

export type ProductLocale = 'lt' | 'en'

export const SITE_URL = 'https://pawscharm.com'
export const BRAND_NAME = 'PawsCharm'
export const BRAND_LOCATION = 'Vilnius, Lietuva'
// Kept for the visible star badge on ProductCard — that's a separate product-content
// decision from structured data. See buildProductJsonLd: it no longer emits fake
// aggregateRating/review schema built from this same placeholder value.
export const PRODUCT_REVIEW_RATING = 4.9

function trimText(value?: string) {
  return value?.replace(/\s+/g, ' ').trim() ?? ''
}

function clampDescription(value: string, maxLength = 160) {
  const normalized = trimText(value)
  if (normalized.length <= maxLength) return normalized

  const truncated = normalized.slice(0, maxLength - 1)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${(lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}…`
}

function toTitleCase(value?: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function isParentProductPage(product: ProductDetail) {
  return Boolean(product.parentHandle && product.slug === product.parentHandle)
}

/** Prefixes a site-root-relative path with `/en` for the English locale — mirrors the
 * `localePrefix: 'as-needed'` behavior configured in src/i18n/routing.ts (lt has no prefix). */
function localeUrl(path: string, locale: ProductLocale) {
  return locale === 'en' ? `${SITE_URL}/en${path}` : `${SITE_URL}${path}`
}

function getProductKeyword(product: ProductDetail, locale: ProductLocale) {
  if (locale === 'en') {
    if (product.productType === 'collar') {
      if (isParentProductPage(product)) return 'personalized BioThane dog collar with charms'
      // product.name carries the Task-19 English overlay (e.g. "Blue Collar") —
      // strip the trailing noun to recover just the color word.
      const colorWord = product.name.replace(/\s*collar\s*$/i, '').trim().toLowerCase()
      return `${colorWord ? `${colorWord} ` : ''}BioThane dog collar with charms`
    }
    if (product.productType === 'leash') {
      return isParentProductPage(product)
        ? 'waterproof BioThane dog leash'
        : 'BioThane dog leash'
    }
    if (product.slug === 'charm-charms') return 'interchangeable charms for dog collars'
    return 'dog collar charm'
  }

  if (product.productType === 'collar') {
    return isParentProductPage(product)
      ? 'personalizuotas BioThane šuns antkaklis su pakabukais'
      : `${product.colorLabel?.toLowerCase() ?? ''} BioThane šuns antkaklis su pakabukais`.trim()
  }
  if (product.productType === 'leash') {
    return isParentProductPage(product)
      ? 'vandeniui atsparus BioThane pavadėlis šuniui'
      : `${product.colorLabel?.toLowerCase() ?? ''} BioThane pavadėlis šuniui`.trim()
  }
  if (product.slug === 'charm-charms') return 'keičiami pakabukai šunų antkakliams'
  return 'pakabukas šuns antkakliui'
}

export function buildProductSeoTitle(product: ProductDetail, locale: ProductLocale = 'lt') {
  if (locale === 'en') {
    // product.name already carries the Task-19 English overlay (e.g. "Blue
    // Collar", "Blue Leash", "PawsCharm Charms — Large (M/L)") — build the
    // title around it instead of re-deriving a color word from Lithuanian
    // fields like colorLabel, which the overlay does not translate.
    if (product.productType === 'collar') {
      if (isParentProductPage(product)) return 'Personalized BioThane Dog Collar with Charms'
      return `${product.name} — Waterproof BioThane Dog Collar with Charms`
    }
    if (product.productType === 'leash') {
      if (isParentProductPage(product)) return 'Waterproof BioThane Dog Leash'
      return `${product.name} — Waterproof BioThane Dog Leash`
    }
    if (product.slug === 'charm-charms') return 'Interchangeable Charms for Dog Collars'
    return `${product.name} — Dog Collar Charm`
  }

  if (product.productType === 'collar') {
    if (isParentProductPage(product)) return 'Personalizuotas BioThane šuns antkaklis su pakabukais'
    // product.name is already the masculine-agreeing form (e.g. "Mėlynas antkaklis") —
    // strip the noun back off so it can be reinserted into this title template.
    const colorAdjective = product.name.replace(/\s*antkaklis\s*$/i, '').trim() || toTitleCase(product.colorLabel)
    return `${colorAdjective} BioThane šuns antkaklis su pakabukais`
  }
  if (product.productType === 'leash') {
    if (isParentProductPage(product)) return 'Vandeniui atsparus BioThane pavadėlis šuniui'
    return `${toTitleCase(product.colorLabel) || product.name} BioThane pavadėlis šuniui`
  }
  if (product.slug === 'charm-charms') return 'Keičiami pakabukai šunų antkakliams'
  return `${product.name} pakabukas šuns antkakliui`
}

export function buildProductSeoDescription(product: ProductDetail, locale: ProductLocale = 'lt') {
  const baseDescription = trimText(product.shortDescription || product.longDescription)

  if (locale === 'en') {
    if (product.productType === 'collar') {
      if (isParentProductPage(product)) {
        return clampDescription(
          `Personalized BioThane dog collar with interchangeable charms, engraving, and a waterproof build. Handmade in Vilnius, free shipping over ${FREE_SHIPPING_THRESHOLD_TEXT}.`
        )
      }
      return clampDescription(
        `${product.name} — waterproof BioThane dog collar with interchangeable charms and engraving. Handmade in Vilnius, free shipping over ${FREE_SHIPPING_THRESHOLD_TEXT}.`
      )
    }
    if (product.productType === 'leash') {
      if (isParentProductPage(product)) {
        return clampDescription(
          'Waterproof BioThane dog leash that matches every PawsCharm collar. Easy to clean, durable, and built for everyday walks.'
        )
      }
      return clampDescription(
        `${product.name} — waterproof BioThane dog leash that matches every PawsCharm collar. Easy to clean and built for everyday walks.`
      )
    }
    if (product.slug === 'charm-charms') {
      return clampDescription(
        'Interchangeable PawsCharm charms for dog collars — letters, hearts, stars, and more designs that snap on in 5 seconds, no tools required.'
      )
    }
    return clampDescription(
      `${product.name} — a snap-on PawsCharm charm for your dog's collar. ${baseDescription || 'Easy to attach, colorful, and compatible with every PawsCharm collar.'}`
    )
  }

  if (product.productType === 'collar') {
    if (isParentProductPage(product)) {
      return clampDescription(
        `Personalizuotas BioThane šuns antkaklis su keičiamais pakabukais, graviravimu ir vandeniui atsparia medžiaga. Rankų darbas Vilniuje, pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`
      )
    }

    return clampDescription(
      `${toTitleCase(product.colorLabel) || product.name} BioThane šuns antkaklis su pakabukais, graviravimu ir vandeniui atsparia medžiaga. Rankų darbas Vilniuje, pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`
    )
  }

  if (product.productType === 'leash') {
    if (isParentProductPage(product)) {
      return clampDescription(
        `Vandeniui atsparus BioThane pavadėlis šuniui, derantis su PawsCharm antkakliais. Lengvai valomas, patvarus ir sukurtas kasdieniams pasivaikščiojimams.`
      )
    }

    return clampDescription(
      `${toTitleCase(product.colorLabel) || product.name} BioThane pavadėlis šuniui, derantis su PawsCharm antkakliais. Lengvai valomas ir sukurtas kasdieniams pasivaikščiojimams.`
    )
  }

  if (product.slug === 'charm-charms') {
    return clampDescription(
      `Keičiami PawsCharm pakabukai šunų antkakliams - raidės, širdelės, žvaigždės ir kiti dizainai, kuriuos prisegsite per 5 sekundes be įrankių.`
    )
  }

  return clampDescription(
    `${product.name} - keičiamas pakabukas PawsCharm šuns antkakliui. ${baseDescription || 'Lengvai prisegamas, spalvingas ir suderinamas su visais PawsCharm antkakliais.'}`
  )
}

export async function buildProductFaqSchema(product: ProductDetail, locale: ProductLocale = 'lt') {
  const productLabel = getProductKeyword(product, locale)
  const t = await getTranslations({ locale, namespace: 'products.pdp.seo.faqSchema' })

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('everydayUse.question', { product: productLabel }),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('everydayUse.answer'),
        },
      },
      {
        '@type': 'Question',
        name: t('combineProducts.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('combineProducts.answer'),
        },
      },
      {
        '@type': 'Question',
        name: t('shipping.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('shipping.answer'),
        },
      },
    ],
  }
}

export function buildProductJsonLd(product: ProductDetail, locale: ProductLocale = 'lt') {
  const productUrl = localeUrl(`/products/${product.slug}`, locale)
  const description = buildProductSeoDescription(product, locale)
  const keywordName = buildProductSeoTitle(product, locale)
  const brandLocation = locale === 'en' ? 'Vilnius, Lithuania' : BRAND_LOCATION

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: keywordName,
    description,
    image: product.images.length > 0
      ? product.images
      : [product.image].filter(Boolean).length > 0
        ? [product.image]
        : ['https://pawscharm.com/og-image.jpg'],
    sku: product.slug,
    category: getProductKeyword(product, locale),
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    url: productUrl,
    material: locale === 'en'
      ? (product.productType === 'charm' ? 'Silicone' : 'BioThane webbing')
      : (product.productType === 'charm' ? 'Silikonas' : 'BioThane juosta'),
    countryOfOrigin: {
      '@type': 'Country',
      name: locale === 'en' ? 'Lithuania' : 'Lietuva',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: locale === 'en' ? 'Made in' : 'Pagaminta',
        value: brandLocation,
      },
      {
        '@type': 'PropertyValue',
        name: locale === 'en' ? 'Shipping' : 'Pristatymas',
        value: locale === 'en' ? `Free over ${FREE_SHIPPING_THRESHOLD_TEXT}` : `Nemokamas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}`,
      },
      ...(product.productType === 'collar'
        ? [{
            '@type': 'PropertyValue',
            name: locale === 'en' ? 'Personalization' : 'Personalizavimas',
            value: locale === 'en' ? 'Laser engraving available' : 'Galimas graviravimas lazeriu',
          }]
        : []),
    ],
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.price.replace(/[^\d.]/g, ''),
      priceCurrency: 'EUR',
      validFrom: getPriceValidFrom(),
      priceValidUntil: getPriceValidUntil(),
      availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'LT',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LT',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        },
      },
    },
  }
}

// Google's Product structured-data requires a bounded validity window on price —
// round up to the end of next month so it never trails behind without needing
// per-request recomputation logic beyond a simple date roll.
function getPriceValidUntil (): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 2, 0)
  return d.toISOString().split('T')[0]
}

// Google's Merchant Listings validator recommends a `validFrom` alongside
// `priceValidUntil` to bound the price's validity window on both ends —
// the start of the current month, since we have no per-price-change date to use.
function getPriceValidFrom (): string {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().split('T')[0]
}

export async function buildProductBreadcrumbJsonLd(product: ProductDetail, locale: ProductLocale = 'lt') {
  const t = await getTranslations({ locale, namespace: 'products.pdp.seo' })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: localeUrl('', locale) },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbProducts'), item: localeUrl('/products', locale) },
      { '@type': 'ListItem', position: 3, name: product.name, item: localeUrl(`/products/${product.slug}`, locale) },
    ],
  }
}
