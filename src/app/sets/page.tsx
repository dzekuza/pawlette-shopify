import type { Metadata } from 'next'
import { SetsPageContent } from '@/components/products/SetsPageContent'
import { getCollars } from '@/lib/shopify'
import { buildBundleSets } from '@/lib/sets'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Pasivaikščiojimo rinkiniai',
  description: 'Derinkite antkaklius ir pavadėlius viename rinkinyje bei iškart matykite sutaupymą.',
  openGraph: {
    title: 'Pasivaikščiojimo rinkiniai | PawCharms',
    description: 'Viename rinkinyje suderinkite antkaklius ir pavadėlius su specialia rinkinio kaina.',
    type: 'website',
    url: 'https://pawcharms.lt/sets',
    siteName: 'PawCharms',
  },
}

export default async function SetsPage () {
  const products = await getCollars()
  const sets = buildBundleSets(products)

  return <SetsPageContent sets={sets} />
}
