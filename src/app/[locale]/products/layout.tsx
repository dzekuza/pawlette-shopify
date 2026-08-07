import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === 'en' ? 'https://pawscharm.com/en/products' : 'https://pawscharm.com/products';

  const title = locale === 'en' ? 'Dog Collars, Charms & Sets' : 'Šunų antkakliai, pakabukai ir rinkiniai';
  const description = locale === 'en'
    ? 'Browse every PawsCharm BioThane dog collar, interchangeable charm, and set. Handmade in Vilnius, shipping across the EU.'
    : 'Peržiūrėkite visus PawsCharm BioThane šunų antkaklius, keičiamus pakabukus ir rinkinius. Rankų darbas Vilniuje, pristatymas visoje Lietuvoje.';
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
      ? ['dog collar', 'dog collars', 'charms for dogs', 'BioThane dog collar', 'PawsCharm']
      : ['šuns antkaklis', 'šunų antkakliai', 'pakabukai šunims', 'BioThane antkaklis šuniui', 'PawsCharm'],
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
