import type { Metadata } from 'next'
import { getLeashes } from '@/lib/shopify'
import { buildLeashProduct } from '@/lib/catalog'
import { PavadeliaiPageContent } from '@/components/products/PavadeliaiPageContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Silikoniniai pavadėliai šunims',
  description: 'Vandeniui atsparūs silikoniniai pavadėliai šunims, derantys su PawCharms antkakliais. Lengvai valomi, patvarūs ir pagaminti kasdieniams pasivaikščiojimams.',
  alternates: { canonical: 'https://pawcharms.lt/pavadeliai' },
  keywords: ['pavadėlis šuniui', 'silikoninis pavadėlis', 'vandeniui atsparus pavadėlis', 'PawCharms'],
  openGraph: {
    title: 'Silikoniniai pavadėliai šunims | PawCharms',
    description: 'Vandeniui atsparūs silikoniniai pavadėliai šunims, suderinti su PawCharms antkaklių kolekcija.',
    type: 'website',
    url: 'https://pawcharms.lt/pavadeliai',
    siteName: 'PawCharms',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silikoniniai pavadėliai šunims | PawCharms',
    description: 'Lengvai valomi silikoniniai pavadėliai šunims kasdieniams pasivaikščiojimams.',
  },
}

export default async function PavadeliaiPage () {
  const leashes = await getLeashes()
  return <PavadeliaiPageContent leashes={leashes.map((leash) => buildLeashProduct(leash))} />
}
