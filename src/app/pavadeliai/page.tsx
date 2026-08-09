import type { Metadata } from 'next'
import { getLeashes } from '@/lib/shopify'
import { buildLeashProduct } from '@/lib/catalog'
import { PavadeliaiPageContent } from '@/components/products/PavadeliaiPageContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'BioThane pavadėlis šuniui – vandeniui atsparus',
  description: 'BioThane pavadėlis šuniui, vandeniui atsparus ir derantis su PawsCharm antkakliais. Lengvai valomas, patvarus, tinka kasdieniams pasivaikščiojimams.',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Koks pavadėlio ilgis tinka mano šuniui?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PawsCharm pavadėlis tinka visų dydžių šunims — nuo mažiausio iki didžiausio. Rankena ir kilpa sukurtos taip, kad pavadėlis būtų patogus laikyti tiek trumpiems, tiek ilgiems pasivaikščiojimams.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar pavadėlis atsparus vandeniui?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip. Pavadėlis pagamintas iš BioThane juostos, todėl atlaiko lietų, balas ir purviną žolę — pakanka nuvalyti drėgna šluoste, ir jis vėl atrodo kaip naujas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar galima derinti pavadėlį su antkakliu pagal spalvą?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip. Pavadėliai gaminami tomis pačiomis spalvomis kaip PawsCharm antkakliai, todėl galite lengvai suderinti visą rinkinį — antkaklį, pavadėlį ir pakabukus.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaip prižiūrėti BioThane pavadėlį?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Priežiūra minimali — nuvalykite drėgna šluoste arba nuskalaukite po čiaupu ir leiskite išdžiūti. BioThane nereikia jokios specialios priežiūros ar impregnavimo, priešingai nei odiniams ar nailoniniams pavadėliams.',
      },
    },
  ],
}

export default async function PavadeliaiPage () {
  const leashes = await getLeashes()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PavadeliaiPageContent leashes={leashes.map((leash) => buildLeashProduct(leash))} />
    </>
  )
}
