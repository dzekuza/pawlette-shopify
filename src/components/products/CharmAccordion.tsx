'use client'

import { useTranslations } from 'next-intl'
import type { ProductDetail } from '@/lib/catalog'
import { RichText } from '@/components/products/RichText'
import { Accordion } from '@/components/shared/Accordion'

export function CharmAccordion ({ product }: { product: ProductDetail }) {
  const t = useTranslations('products.pdp')
  const items = [
    {
      id: 'description',
      title: t('accordion.descriptionTitle'),
      content: <RichText value={product.longDescription || t('accordion.descriptionContent')} />,
    },
    {
      id: 'shipping',
      title: t('accordion.shippingTitle'),
      content: <RichText value={product.shipping || t('accordion.shippingContent')} />,
    },
  ]

  return <Accordion items={items} />
}
