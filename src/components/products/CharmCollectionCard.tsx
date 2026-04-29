import type { ProductDetail } from '@/lib/catalog'
import { Badge } from '@/components/ui/badge'
import { FeaturePillList } from '@/components/storefront/FeaturePillList'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import {
  CatalogCard,
  CatalogCardAction,
  CatalogCardBody,
  CatalogCardFooter,
  CatalogCardLink,
  CatalogCardMedia,
  CatalogCardTitle,
} from '@/components/storefront/CatalogCard'

interface CharmCollectionCardProps {
  href: string
  title: string
  price: string
  originalPrice?: string
  image: string
  imageAlt: string
}

export function CharmCollectionCard ({ href, title, price, originalPrice, image, imageAlt }: CharmCollectionCardProps) {
  return (
    <CatalogCardLink href={href}>
      <CatalogCard>
        <CatalogCardMedia alt={imageAlt} background='#B8D8F4' image={image}>
          <Badge variant='glass' className='absolute bottom-3.5 left-3.5 px-2.5 py-1 normal-case tracking-[0.04em]'>
            {title}
          </Badge>
        </CatalogCardMedia>
        <CatalogCardBody className='pb-2'>
          <CatalogCardTitle className='mb-2 line-clamp-2 text-[16px] leading-[1.35]'>{title}</CatalogCardTitle>
          <FeaturePillList items={[`Nuo ${price}`, '100+ variantų']} className='mb-4' />
          <CatalogCardFooter className='items-end'>
            <ProductPrice currentPrice={price} originalPrice={originalPrice} note='Spalvos ir raidės' />
            <CatalogCardAction variant='link' className='whitespace-nowrap'>
              Rinktis →
            </CatalogCardAction>
          </CatalogCardFooter>
        </CatalogCardBody>
      </CatalogCard>
    </CatalogCardLink>
  )
}

export function CharmCollectionProductCard ({ product }: { product: ProductDetail }) {
  return (
    <CharmCollectionCard
      href={`/products/${product.slug}`}
      title={product.name}
      price={product.price}
      originalPrice={product.originalPrice}
      image={product.image}
      imageAlt={product.name}
    />
  )
}
