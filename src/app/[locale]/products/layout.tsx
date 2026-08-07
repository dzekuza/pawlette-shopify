import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

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

const COLLAR_PRICE = '28';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = await getTranslations('seo.productListSchema');
  const translatedCollars = t.raw('collars') as Array<{ name: string; color: string }>;
  const collars = translatedCollars.map((collar) => ({ ...collar, price: COLLAR_PRICE }));
  const productsUrl = locale === 'en' ? 'https://pawscharm.com/en/products' : 'https://pawscharm.com/products';

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('itemListName'),
    url: productsUrl,
    numberOfItems: collars.length,
    itemListElement: collars.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `PawsCharm ${c.name}`,
        description: c.color,
        image: 'https://pawscharm.com/og-image.jpg',
        brand: { '@type': 'Brand', name: 'PawsCharm' },
        url: productsUrl,
        offers: {
          '@type': 'Offer',
          price: c.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'PawsCharm' },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'LT',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'EUR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'LT',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
            },
          },
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
