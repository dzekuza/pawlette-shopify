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
  const productUrl = `https://pawscharm.com/products/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    // Title/description/JSON-LD now render in English via the Task-19
    // catalog overlay (see buildProduct* in src/lib/seo.ts) — this gate stays
    // on until a manual review confirms the English PDP content end-to-end,
    // then it can be dropped for locale === 'en'.
    ...(locale === 'en' ? { robots: { index: false, follow: true } } : {}),
    keywords: localeCode === 'en'
      ? [
          product.name,
          product.productType === 'collar' ? 'personalized dog collar' : product.productType === 'leash' ? 'waterproof dog leash' : 'interchangeable dog collar charms',
          product.productType === 'collar' ? 'silicone dog collar' : product.productType === 'leash' ? 'silicone dog leash' : 'charms for dog collars',
          product.productType === 'collar' ? 'engraved dog collar' : product.productType === 'leash' ? 'dog leash' : 'letter charms for dogs',
          'PawCharms',
          'Vilnius',
        ]
      : [
          product.name,
          product.productType === 'collar' ? 'personalizuotas šuns antkaklis' : product.productType === 'leash' ? 'vandeniui atsparus pavadėlis šuniui' : 'keičiami pakabukai šunims',
          product.productType === 'collar' ? 'silikoninis antkaklis šuniui' : product.productType === 'leash' ? 'silikoninis pavadėlis šuniui' : 'pakabukai šunų antkakliams',
          product.productType === 'collar' ? 'graviruotas šuns antkaklis' : product.productType === 'leash' ? 'pavadėlis šuniui' : 'raidiniai pakabukai šunims',
          'PawCharms',
          'Vilnius',
        ],
    openGraph: {
      title: `${title} | PawCharms`,
      description,
      type: 'website',
      url: productUrl,
      siteName: 'PawCharms',
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PawCharms`,
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
