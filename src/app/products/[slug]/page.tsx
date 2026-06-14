import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SingleProductPage } from '@/components/products/SingleProductPage'
import { LeashProductPage } from '@/components/products/LeashProductPage'
import { getAllProductSlugs, getProductBySlugAsync, getRecommendedProductsForProductAsync } from '@/lib/catalog'

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

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `https://pawcharms.lt/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | PawCharms`,
      description: product.shortDescription,
      type: 'website',
      url: `https://pawcharms.lt/products/${product.slug}`,
      siteName: 'PawCharms',
      images: product.image ? [{ url: product.image }] : undefined
    }
  }
}

export default async function ProductPage ({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlugAsync(slug)

  if (!product) notFound()

  const recommendedProducts = await getRecommendedProductsForProductAsync(product)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.image,
    brand: { '@type': 'Brand', name: 'PawCharms' },
    url: `https://pawcharms.lt/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'PawCharms' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pradžia', item: 'https://pawcharms.lt' },
      { '@type': 'ListItem', position: 2, name: 'Produktai', item: 'https://pawcharms.lt/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://pawcharms.lt/products/${product.slug}` },
    ],
  }

  const schemas = (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )

  if (product.productType === 'leash') {
    return (
      <>
        {schemas}
        <LeashProductPage product={product} recommendedProducts={recommendedProducts} />
      </>
    )
  }

  return (
    <>
      {schemas}
      <SingleProductPage product={product} recommendedProducts={recommendedProducts} />
    </>
  )
}
