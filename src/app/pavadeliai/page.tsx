import type { Metadata } from 'next'
import { getLeashes } from '@/lib/shopify'
import { buildLeashProduct } from '@/lib/catalog'
import { PavadeliaiPageContent } from '@/components/products/PavadeliaiPageContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'BioThane pavadėlis šuniui – vandeniui atsparus',
  description: 'BioThane pavadėlis šuniui (šuns pavadėlis), vandeniui atsparus ir derantis su PawsCharm antkakliais. Lengvai valomas, patvarus ir pagamintas kasdieniams pasivaikščiojimams.',
  alternates: { canonical: 'https://pawscharm.com/pavadeliai' },
  keywords: ['pavadėlis šuniui', 'šuns pavadėlis', 'BioThane pavadėlis', 'vandeniui atsparus pavadėlis', 'PawsCharm'],
  openGraph: {
    title: 'BioThane pavadėlis šuniui – vandeniui atsparus | PawsCharm',
    description: 'Vandeniui atsparus BioThane pavadėlis šuniui, suderintas su PawsCharm antkaklių kolekcija.',
    type: 'website',
    url: 'https://pawscharm.com/pavadeliai',
    siteName: 'PawsCharm',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BioThane pavadėlis šuniui – vandeniui atsparus | PawsCharm',
    description: 'Lengvai valomas BioThane pavadėlis šuniui kasdieniams pasivaikščiojimams.',
  },
}

export default async function PavadeliaiPage () {
  const leashes = await getLeashes()
  return <PavadeliaiPageContent leashes={leashes.map((leash) => buildLeashProduct(leash))} />
}
