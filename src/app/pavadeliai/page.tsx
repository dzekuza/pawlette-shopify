import type { Metadata } from 'next'
import { getLeashes } from '@/lib/shopify'
import { buildLeashProduct } from '@/lib/catalog'
import { PavadeliaiPageContent } from '@/components/products/PavadeliaiPageContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Silikoninis pavadėlis šuniui – vandeniui atsparus',
  description: 'Silikoninis pavadėlis šuniui (šuns pavadėlis), vandeniui atsparus ir derantis su PawsCharm antkakliais. Lengvai valomas, patvarus ir pagamintas kasdieniams pasivaikščiojimams.',
  alternates: { canonical: 'https://pawscharm.com/pavadeliai' },
  keywords: ['pavadėlis šuniui', 'šuns pavadėlis', 'silikoninis pavadėlis', 'vandeniui atsparus pavadėlis', 'PawsCharm'],
  openGraph: {
    title: 'Silikoninis pavadėlis šuniui – vandeniui atsparus | PawsCharm',
    description: 'Vandeniui atsparus silikoninis pavadėlis šuniui, suderintas su PawsCharm antkaklių kolekcija.',
    type: 'website',
    url: 'https://pawscharm.com/pavadeliai',
    siteName: 'PawsCharm',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silikoninis pavadėlis šuniui – vandeniui atsparus | PawsCharm',
    description: 'Lengvai valomas silikoninis pavadėlis šuniui kasdieniams pasivaikščiojimams.',
  },
}

export default async function PavadeliaiPage () {
  const leashes = await getLeashes()
  return <PavadeliaiPageContent leashes={leashes.map((leash) => buildLeashProduct(leash))} />
}
