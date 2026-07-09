import { ProductsPageContent } from '@/components/products/ProductsPageContent'
import { getLandingProducts } from '@/lib/db'

export default async function ProductsPage () {
  const products = await getLandingProducts()

  return <ProductsPageContent products={products} />
}
