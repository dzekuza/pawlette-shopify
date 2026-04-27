import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Dog Collars & Charms | PawCharms',
  description: 'Browse all PawCharms collar sets and swap charms. Waterproof silicone collars in 4 colours — Sage, Sky, Blossom, and Honey. Mix and match 12 charm designs.',
  openGraph: {
    title: 'Shop Dog Collars & Charms | PawCharms',
    description: 'Waterproof silicone dog collars in 4 colours with 12 swap charm designs. Made in Vilnius, Lithuania.',
    type: 'website',
    url: 'https://pawcharms.lt/products',
    siteName: 'PawCharms',
  },
};

const collars = [
  { id: 1, name: 'Blossom set', price: '28', color: 'Pink silicone dog collar with swap charms' },
  { id: 2, name: 'Sage set',    price: '28', color: 'Sage green silicone dog collar with swap charms' },
  { id: 3, name: 'Sky set',     price: '28', color: 'Sky blue silicone dog collar with swap charms' },
  { id: 4, name: 'Honey set',   price: '28', color: 'Honey yellow silicone dog collar with swap charms' },
];

const productListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PawCharms Dog Collar Sets',
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
      url: 'https://pawcharms.lt/configure',
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
