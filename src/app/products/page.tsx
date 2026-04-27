import { ProductsPageContent } from '@/components/products/ProductsPageContent'
import { getLandingCollars } from '@/lib/db'
import { getCharms } from '@/lib/shopify'

export default async function ProductsPage () {
  const [collars, charms] = await Promise.all([getLandingCollars(), getCharms()])

  return <ProductsPageContent collars={collars} charms={charms} />
}
