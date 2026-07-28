import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === 'en' ? 'https://pawscharm.com/en/products' : 'https://pawscharm.com/products';

  return {
    title: 'Šunų antkakliai, pakabukai ir rinkiniai',
    description: 'Peržiūrėkite visus PawCharms silikoninius šunų antkaklius, keičiamus pakabukus ir rinkinius. Rankų darbas Vilniuje, pristatymas visoje Lietuvoje.',
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com/products',
        en: 'https://pawscharm.com/en/products',
        'x-default': 'https://pawscharm.com/products',
      },
    },
    keywords: ['šuns antkaklis', 'šunų antkakliai', 'pakabukai šunims', 'silikoninis antkaklis šuniui', 'PawCharms'],
    openGraph: {
      title: 'Šunų antkakliai, pakabukai ir rinkiniai | PawCharms',
      description: 'Vandeniui atsparūs silikoniniai šunų antkakliai su keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
      type: 'website',
      url: canonical,
      siteName: 'PawCharms',
      images: [{ url: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Šunų antkakliai, pakabukai ir rinkiniai | PawCharms',
      description: 'Vandeniui atsparūs silikoniniai šunų antkakliai ir keičiami pakabukai šunims.',
    },
  };
}

const COLLAR_PRICE = '28';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('seo.productListSchema');
  const translatedCollars = t.raw('collars') as Array<{ name: string; color: string }>;
  const collars = translatedCollars.map((collar) => ({ ...collar, price: COLLAR_PRICE }));

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PawCharms šunų antkaklių rinkiniai',
    url: 'https://pawscharm.com/products',
    numberOfItems: collars.length,
    itemListElement: collars.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `PawCharms ${c.name}`,
        description: c.color,
        brand: { '@type': 'Brand', name: 'PawCharms' },
        url: 'https://pawscharm.com/products',
        offers: {
          '@type': 'Offer',
          price: c.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'PawCharms' },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
      />
      {children}
    </>
  );
}
