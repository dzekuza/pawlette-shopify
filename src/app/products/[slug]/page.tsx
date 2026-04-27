import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SingleProductPage } from '@/components/products/SingleProductPage'
import { getProductBySlug, getProductBySlugAsync, PRODUCT_CATALOG } from '@/lib/catalog'

export const revalidate = 300

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams () {
  return PRODUCT_CATALOG.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata ({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlugAsync(slug)

  if (!product) {
    return {
      title: 'Product not found | PawCharms'
    }
  }

  return {
    title: `${product.name} | PawCharms`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | PawCharms`,
      description: product.shortDescription,
      type: 'website',
      url: `https://pawcharms.lt/products/${product.slug}`,
      siteName: 'PawCharms',
      images: [{ url: product.image }]
    }
  }
}

export default async function ProductPage ({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlugAsync(slug)

  if (!product) notFound()

  return <SingleProductPage product={product} />
}
