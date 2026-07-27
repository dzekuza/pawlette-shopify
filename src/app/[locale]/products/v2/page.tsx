import type { Metadata } from 'next'
import { ProductsPageV2Content } from '@/components/products/ProductsPageV2Content'
import { getLandingProducts } from '@/lib/db'

// /products/v2 is an alternate layout of the same catalogue as /products and would
// otherwise be indexed as a duplicate listing page. The per-product /products/[slug]/v2
// routes are already noindex for the same reason; this keeps the parent consistent.
// follow: true so crawl equity still flows through to the canonical product pages.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default async function ProductsPageV2 () {
  const products = await getLandingProducts()

  return <ProductsPageV2Content products={products} />
}
