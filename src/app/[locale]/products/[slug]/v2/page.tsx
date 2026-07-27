import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
  const product = await getProductBySlugAsync(slug)

  if (!product) {
    return {
      title: 'Prekė nerasta'
    }
  }

  const title = buildProductSeoTitle(product)
  const description = buildProductSeoDescription(product)

  return {
    title,
    description,
    // Comparison variant of the PDP — kept out of the canonical/index graph until promoted.
    robots: { index: false, follow: true },
  }
}

export default async function ProductPageV2 ({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlugAsync(slug)

  if (!product) notFound()

  const productSchema = buildProductJsonLd(product)
  const breadcrumbSchema = buildProductBreadcrumbJsonLd(product)
  const faqSchema = buildProductFaqSchema(product)

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
