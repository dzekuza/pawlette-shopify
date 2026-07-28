import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { SingleProductPage } from '@/components/products/SingleProductPage'
import { getProductBySlugAsync } from '@/lib/catalog'
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

export async function generateMetadata ({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const localeCode = locale === 'en' ? 'en' : 'lt'
  const product = await getProductBySlugAsync(slug, locale)

  if (!product) {
    return {
      title: localeCode === 'en' ? 'Product not found' : 'Prekė nerasta'
    }
  }

  const title = buildProductSeoTitle(product, localeCode)
  const description = buildProductSeoDescription(product, localeCode)

  return {
    title,
    description,
    // Comparison variant of the PDP — kept out of the canonical/index graph until promoted.
    robots: { index: false, follow: true },
  }
}

export default async function ProductPageV2 ({ params }: ProductPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const localeCode = locale === 'en' ? 'en' : 'lt'
  const product = await getProductBySlugAsync(slug, locale)

  if (!product) notFound()

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
      <SingleProductPage product={product} layout="split" />
    </>
  )
}
