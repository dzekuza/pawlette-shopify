import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SingleProductPage } from '@/components/products/SingleProductPage'
import { getAllProductSlugs, getProductBySlugAsync, getRecommendedProductsForProductAsync } from '@/lib/catalog'
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
  return slugs.map((slug) => ({ slug }))
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
  const productUrl = `https://pawcharms.lt/products/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    keywords: [
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
  const product = await getProductBySlugAsync(slug)

  if (!product) notFound()

  const recommendedProducts = await getRecommendedProductsForProductAsync(product)

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
      <SingleProductPage product={product} recommendedProducts={recommendedProducts} />
    </>
  )
}
