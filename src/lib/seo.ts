import type { ProductDetail } from '@/lib/catalog'
import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config'

export const SITE_URL = 'https://pawcharms.lt'
export const BRAND_NAME = 'PawCharms'
export const BRAND_LOCATION = 'Vilnius, Lietuva'
export const PRODUCT_REVIEW_RATING = 4.9
export const PRODUCT_REVIEW_COUNT = 9

const PRODUCT_REVIEWS = [
  {
    author: 'Laima K.',
    reviewBody: 'Prisisega per kelias sekundes ir net po purvinų pasivaikščiojimų atrodo kaip naujas.',
  },
  {
    author: 'Egle M.',
    reviewBody: 'Minkštas, lengvai valomas, o pakabukai laikėsi vietoje net po lietingo bėgimo parke.',
  },
]

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

function getProductKeyword(product: ProductDetail) {
  if (product.productType === 'collar') {
    return isParentProductPage(product)
      ? 'personalizuotas silikoninis šuns antkaklis su pakabukais'
      : `${product.colorLabel?.toLowerCase() ?? ''} silikoninis šuns antkaklis su pakabukais`.trim()
  }
  if (product.productType === 'leash') {
    return isParentProductPage(product)
      ? 'vandeniui atsparus silikoninis pavadėlis šuniui'
      : `${product.colorLabel?.toLowerCase() ?? ''} silikoninis pavadėlis šuniui`.trim()
  }
  if (product.slug === 'charm-charms') return 'keičiami pakabukai šunų antkakliams'
  return 'pakabukas šuns antkakliui'
}

export function buildProductSeoTitle(product: ProductDetail) {
  if (product.productType === 'collar') {
    if (isParentProductPage(product)) return 'Personalizuotas silikoninis šuns antkaklis su pakabukais'
    // product.name is already the masculine-agreeing form (e.g. "Mėlynas antkaklis") —
    // strip the noun back off so it can be reinserted into this title template.
    const colorAdjective = product.name.replace(/\s*antkaklis\s*$/i, '').trim() || toTitleCase(product.colorLabel)
    return `${colorAdjective} silikoninis šuns antkaklis su pakabukais`
  }
  if (product.productType === 'leash') {
    if (isParentProductPage(product)) return 'Vandeniui atsparus silikoninis pavadėlis šuniui'
    return `${toTitleCase(product.colorLabel) || product.name} silikoninis pavadėlis šuniui`
  }
  if (product.slug === 'charm-charms') return 'Keičiami pakabukai šunų antkakliams'
  return `${product.name} - pakabukas šuns antkakliui`
}

export function buildProductSeoDescription(product: ProductDetail) {
  const baseDescription = trimText(product.shortDescription || product.longDescription)

  if (product.productType === 'collar') {
    if (isParentProductPage(product)) {
      return clampDescription(
        `Personalizuotas silikoninis šuns antkaklis su keičiamais pakabukais, graviravimu ir vandeniui atsparia medžiaga. Rankų darbas Vilniuje, pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`
      )
    }

    return clampDescription(
      `${toTitleCase(product.colorLabel) || product.name} silikoninis šuns antkaklis su pakabukais, graviravimu ir vandeniui atsparia medžiaga. Rankų darbas Vilniuje, pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`
    )
  }

  if (product.productType === 'leash') {
    if (isParentProductPage(product)) {
      return clampDescription(
        `Vandeniui atsparus silikoninis pavadėlis šuniui, derantis su PawCharms antkakliais. Lengvai valomas, patvarus ir sukurtas kasdieniams pasivaikščiojimams.`
      )
    }

    return clampDescription(
      `${toTitleCase(product.colorLabel) || product.name} silikoninis pavadėlis šuniui, derantis su PawCharms antkakliais. Lengvai valomas ir sukurtas kasdieniams pasivaikščiojimams.`
    )
  }

  if (product.slug === 'charm-charms') {
    return clampDescription(
      `Keičiami PawCharms pakabukai šunų antkakliams - raidės, širdelės, žvaigždės ir kiti dizainai, kuriuos prisegsite per 5 sekundes be įrankių.`
    )
  }

  return clampDescription(
    `${product.name} - keičiamas pakabukas PawCharms šuns antkakliui. ${baseDescription || 'Lengvai prisegamas, spalvingas ir suderinamas su visais PawCharms antkakliais.'}`
  )
}

export function buildProductFaqSchema(product: ProductDetail) {
  const productLabel = getProductKeyword(product)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Ar ${productLabel} tinka kasdieniam naudojimui?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Taip. PawCharms produktai kurti kasdieniams pasivaikščiojimams, lengvai valosi ir išlaiko tvarkingą išvaizdą net po lietaus ar purvinų nuotykių.',
        },
      },
      {
        '@type': 'Question',
        name: 'Ar galima derinti su kitais PawCharms produktais?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Taip. Pakabukai tinka visiems PawCharms antkakliams, o pavadėliai vizualiai suderinti su mūsų spalvų kolekcija ir kasdieniais komplektais.',
        },
      },
      {
        '@type': 'Question',
        name: 'Per kiek laiko išsiunčiamas užsakymas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Užsakymai paprastai paruošiami per 1 darbo dieną. Lietuvoje pristatymas dažniausiai trunka 1-3 darbo dienas, o į kitas ES šalis 3-7 darbo dienas.',
        },
      },
    ],
  }
}

export function buildProductJsonLd(product: ProductDetail) {
  const productUrl = `${SITE_URL}/products/${product.slug}`
  const description = buildProductSeoDescription(product)
  const keywordName = buildProductSeoTitle(product)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: keywordName,
    description,
    image: product.images.length > 0 ? product.images : [product.image].filter(Boolean),
    sku: product.slug,
    category: getProductKeyword(product),
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    url: productUrl,
    material: product.productType === 'charm' ? 'Silikonas' : 'Maistinis silikonas',
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Lietuva',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Pagaminta',
        value: BRAND_LOCATION,
      },
      {
        '@type': 'PropertyValue',
        name: 'Pristatymas',
        value: `Nemokamas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}`,
      },
      ...(product.productType === 'collar'
        ? [{
            '@type': 'PropertyValue',
            name: 'Personalizavimas',
            value: 'Galimas graviravimas lazeriu',
          }]
        : []),
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: PRODUCT_REVIEW_RATING,
      reviewCount: PRODUCT_REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    },
    review: PRODUCT_REVIEWS.map((review) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.reviewBody,
    })),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.price.replace(/[^\d.]/g, ''),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    },
  }
}

export function buildProductBreadcrumbJsonLd(product: ProductDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pradžia', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produktai', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` },
    ],
  }
}
