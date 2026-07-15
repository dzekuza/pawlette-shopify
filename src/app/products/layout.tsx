import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Šunų antkakliai, pakabukai ir rinkiniai',
  description: 'Peržiūrėkite visus PawCharms silikoninius šunų antkaklius, keičiamus pakabukus ir rinkinius. Rankų darbas Vilniuje, pristatymas visoje Lietuvoje.',
  alternates: { canonical: 'https://pawcharms.lt/products' },
  keywords: ['šunų antkakliai', 'pakabukai šunims', 'silikoninis antkaklis šuniui', 'PawCharms'],
  openGraph: {
    title: 'Šunų antkakliai, pakabukai ir rinkiniai | PawCharms',
    description: 'Vandeniui atsparūs silikoniniai šunų antkakliai su keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
    type: 'website',
    url: 'https://pawcharms.lt/products',
    siteName: 'PawCharms',
    images: [{ url: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Šunų antkakliai, pakabukai ir rinkiniai | PawCharms',
    description: 'Vandeniui atsparūs silikoniniai šunų antkakliai ir keičiami pakabukai šunims.',
  },
};

const collars = [
  { id: 1, name: 'Blossom rinkinys', price: '28', color: 'Rožinis silikoninis šuns antkaklis su keičiamais pakabukais' },
  { id: 2, name: 'Sage rinkinys',    price: '28', color: 'Šalavijo žalios spalvos silikoninis šuns antkaklis su keičiamais pakabukais' },
  { id: 3, name: 'Sky rinkinys',     price: '28', color: 'Dangaus mėlynumo silikoninis šuns antkaklis su keičiamais pakabukais' },
  { id: 4, name: 'Honey rinkinys',   price: '28', color: 'Medaus geltonumo silikoninis šuns antkaklis su keičiamais pakabukais' },
];

const productListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PawCharms šunų antkaklių rinkiniai',
  url: 'https://pawcharms.lt/products',
  numberOfItems: collars.length,
  itemListElement: collars.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: `PawCharms ${c.name}`,
      description: c.color,
      brand: { '@type': 'Brand', name: 'PawCharms' },
      url: 'https://pawcharms.lt/products',
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

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
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
