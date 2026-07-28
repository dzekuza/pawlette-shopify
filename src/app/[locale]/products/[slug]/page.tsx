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
  return slugs.map((slug) => ({ slug }))
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

  const title = buildProductSeoTitle(product)
  const description = buildProductSeoDescription(product)
  const productUrl = `https://pawscharm.com/products/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    // English PDPs are ~90% untranslated (title/description/JSON-LD/page
    // chrome still Lithuanian) — never in this plan's Phase-1 scope. Rather
    // than fully translating the PDP (a Phase 2 task), keep it out of the
    // index while still allowing normal crawling/link-following.
    ...(locale === 'en' ? { robots: { index: false, follow: true } } : {}),
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
  const locale = await getLocale()
  const product = await getProductBySlugAsync(slug, locale)

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
      <SingleProductPage product={product} />
    </>
  )
}
