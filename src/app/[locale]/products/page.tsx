import { getLocale, getTranslations } from 'next-intl/server'
import { ProductsPageContent } from '@/components/products/ProductsPageContent'
import { getLandingProducts } from '@/lib/db'

const COLLAR_PRICE = '28'

export default async function ProductsPage () {
  const locale = await getLocale()
  const products = await getLandingProducts(locale)

  const t = await getTranslations('seo.productListSchema')
  const translatedCollars = t.raw('collars') as Array<{ name: string, color: string }>
  const collars = translatedCollars.map((collar) => ({ ...collar, price: COLLAR_PRICE }))
  const productsUrl = locale === 'en' ? 'https://pawscharm.com/en/products' : 'https://pawscharm.com/products'

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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
      />
      <ProductsPageContent products={products} />
    </>
  )
}
