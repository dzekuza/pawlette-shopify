import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Šunų antkakliai ir pakabukai',
  description: 'Peržiūrėkite visus PawCharms antkaklių rinkinius ir keičiamus pakabukus. Vandeniui atsparūs silikoniniai antkakliai 4 spalvų deriniuose.',
  openGraph: {
    title: 'Šunų antkakliai ir pakabukai | PawCharms',
    description: 'Vandeniui atsparūs silikoniniai šunų antkakliai su keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
    type: 'website',
    url: 'https://pawcharms.lt/products',
    siteName: 'PawCharms',
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
      name: `Žavesys ${c.name}`,
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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        bestRating: '5',
        reviewCount: '3',
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
