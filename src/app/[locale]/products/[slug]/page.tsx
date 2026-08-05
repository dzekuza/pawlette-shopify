import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { SingleProductPage } from '@/components/products/SingleProductPage'
import { getAllProductSlugs, getProductBySlugAsync } from '@/lib/catalog'
import {
  buildProductBreadcrumbJsonLd,
  buildProductFaqSchema,
  buildProductJsonLd,
  buildProductSeoDescription,
  buildProductSeoTitle,
} from '@/lib/seo'

export const revalidate = 300

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams () {
  const slugs = await getAllProductSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata ({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const product = await getProductBySlugAsync(slug, locale)

  if (!product) {
    const t = await getTranslations({ locale, namespace: 'products.pdp' })
    return {
      title: t('notFoundTitle')
    }
  }

  const localeCode = locale === 'en' ? 'en' : 'lt'
  const title = buildProductSeoTitle(product, localeCode)
  const description = buildProductSeoDescription(product, localeCode)
  const ltProductUrl = `https://pawscharm.com/products/${product.slug}`
  const enProductUrl = `https://pawscharm.com/en/products/${product.slug}`
  const productUrl = localeCode === 'en' ? enProductUrl : ltProductUrl

  // The ~260 letter×color charm permutations share near-identical boilerplate copy (only the
  // letter/color differs) — a thin/doorway-page pattern. Noindex them but keep them followable
  // so link equity still flows to the charm collection hub and named icon/shape charms.
  const isThinCharmVariant = product.productType === 'charm' && product.charmCategory === 'letter'

  return {
    title,
    description,
    ...(isThinCharmVariant ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: productUrl,
      languages: {
        lt: ltProductUrl,
        en: enProductUrl,
        'x-default': ltProductUrl,
      },
    },
    keywords: localeCode === 'en'
      ? [
          product.name,
          product.productType === 'collar' ? 'personalized dog collar' : product.productType === 'leash' ? 'waterproof dog leash' : 'interchangeable dog collar charms',
          product.productType === 'collar' ? 'BioThane dog collar' : product.productType === 'leash' ? 'BioThane dog leash' : 'charms for dog collars',
          product.productType === 'collar' ? 'engraved dog collar' : product.productType === 'leash' ? 'dog leash' : 'letter charms for dogs',
          'PawsCharm',
          'Vilnius',
        ]
      : [
          product.name,
          product.productType === 'collar' ? 'personalizuotas šuns antkaklis' : product.productType === 'leash' ? 'vandeniui atsparus pavadėlis šuniui' : 'keičiami pakabukai šunims',
          product.productType === 'collar' ? 'BioThane antkaklis šuniui' : product.productType === 'leash' ? 'BioThane pavadėlis šuniui' : 'pakabukai šunų antkakliams',
          product.productType === 'collar' ? 'graviruotas šuns antkaklis' : product.productType === 'leash' ? 'pavadėlis šuniui' : 'raidiniai pakabukai šunims',
          'PawsCharm',
          'Vilnius',
        ],
    openGraph: {
      title: `${title} | PawsCharm`,
      description,
      type: 'website',
      url: productUrl,
      siteName: 'PawsCharm',
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PawsCharm`,
      description,
      images: product.image ? [product.image] : undefined,
    }
  }
}

export default async function ProductPage ({ params }: ProductPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const product = await getProductBySlugAsync(slug, locale)

  if (!product) notFound()

  const localeCode = locale === 'en' ? 'en' : 'lt'
  const productSchema = buildProductJsonLd(product, localeCode)
  const breadcrumbSchema = await buildProductBreadcrumbJsonLd(product, localeCode)
  const faqSchema = await buildProductFaqSchema(product, localeCode)

  const schemas = (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )

  return (
    <>
      {schemas}
      <SingleProductPage product={product} />
    </>
  )
}
