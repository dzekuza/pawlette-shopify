import { ProductsPageV2Content } from '@/components/products/ProductsPageV2Content'
import { getLandingProducts } from '@/lib/db'

export default async function ProductsPageV2 () {
  const products = await getLandingProducts()

  return <ProductsPageV2Content products={products} />
}
