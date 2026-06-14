import type { Metadata } from 'next'
import { getLeashes } from '@/lib/shopify'
import { buildLeashProduct } from '@/lib/catalog'
import { PavadeliaiPageContent } from '@/components/products/PavadeliaiPageContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Pavadeliai | PawCharms',
  description: 'Vandeniui atsparūs silikoniniai pavadėliai šunims. Lengvai valomi, patvarūs ir stilingi — sukurti kasdieniam naudojimui.',
  alternates: { canonical: 'https://pawcharms.lt/pavadeliai' },
  openGraph: {
    title: 'Pavadeliai | PawCharms',
    description: 'Vandeniui atsparūs silikoniniai pavadėliai šunims.',
    type: 'website',
    url: 'https://pawcharms.lt/pavadeliai',
    siteName: 'PawCharms',
  },
}

export default async function PavadeliaiPage () {
  const leashes = await getLeashes()
  return <PavadeliaiPageContent leashes={leashes.map(buildLeashProduct)} />
}
