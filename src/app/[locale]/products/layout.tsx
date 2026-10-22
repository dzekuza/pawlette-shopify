import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === 'en' ? 'https://pawscharm.com/en/products' : 'https://pawscharm.com/products';

  const title = locale === 'en' ? 'Handmade BioThane Dog Collars with Swap Charms' : 'Rankų darbo antkakliai šunims iš BioThane';
  const description = locale === 'en'
    ? 'Handmade dog collars from waterproof BioThane webbing. Interchangeable charms clip on in 5 seconds. Sewn in Vilnius, with free shipping over 40 € across the EU.'
    : 'Rankų darbo antkakliai šunims iš vandeniui atsparios BioThane juostos. Pakabukai prisegami per 5 sekundes. Siuvami Vilniuje, pristatymas nemokamas nuo 40 €.';
  const ogDescription = locale === 'en'
    ? 'Waterproof BioThane dog collars with interchangeable charms. Handmade in Vilnius, Lithuania.'
    : 'Vandeniui atsparūs BioThane šunų antkakliai su keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.';
  const twitterDescription = locale === 'en'
    ? 'Waterproof BioThane dog collars and interchangeable charms for dogs.'
    : 'Vandeniui atsparūs BioThane šunų antkakliai ir keičiami pakabukai šunims.';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com/products',
        en: 'https://pawscharm.com/en/products',
        'x-default': 'https://pawscharm.com/products',
      },
    },
    keywords: locale === 'en'
      ? ['handmade dog collars', 'dog collar', 'BioThane dog collar', 'PawsCharm']
      : ['rankų darbo antkakliai šunims', 'šunų antkakliai', 'antkakliai šunims', 'BioThane antkaklis šuniui', 'PawsCharm'],
    openGraph: {
      title: `${title} | PawsCharm`,
      description: ogDescription,
      type: 'website',
      url: canonical,
      siteName: 'PawsCharm',
      images: [{ url: '/og-image.jpg', width: 1920, height: 1080 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PawsCharm`,
      description: twitterDescription,
    },
  };
}

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
