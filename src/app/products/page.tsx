import { ProductsPageContent } from '@/components/products/ProductsPageContent'
import { getLandingCollars } from '@/lib/db'
import { getProductBySlugAsync } from '@/lib/catalog'

export default async function ProductsPage () {
  const [collars, charmCollection] = await Promise.all([
    getLandingCollars(),
    getProductBySlugAsync('charm-charms'),
  ])

  return <ProductsPageContent collars={collars} charmCollection={charmCollection ?? null} />
}
