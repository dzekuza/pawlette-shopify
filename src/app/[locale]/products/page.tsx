import { getLocale } from 'next-intl/server'
import { ProductsPageContent } from '@/components/products/ProductsPageContent'
import { getLandingProducts } from '@/lib/db'

export default async function ProductsPage () {
  const locale = await getLocale()
  const products = await getLandingProducts(locale)

  return <ProductsPageContent products={products} />
}
