import { Star, ChevronRight } from 'lucide-react'
import type { ProductDetail } from '@/lib/catalog'
import type { LandingCollar } from '@/lib/db'
import { PRODUCT_REVIEW_RATING } from '@/lib/seo'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import {
  CatalogCard,
  CatalogCardBody,
  CatalogCardFooter,
  CatalogCardLink,
  CatalogCardMedia,
  CatalogCardTitle,
} from '@/components/storefront/CatalogCard'

type ProductCardProduct = LandingCollar | ProductDetail
const DEFAULT_CHARM_SWATCHES = ['var(--color-blossom)', 'var(--color-sage)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-lavender)']

function isProductDetail (product: ProductCardProduct): product is ProductDetail {
  return 'slug' in product
}

export function ProductCard ({ product, href: hrefProp }: { product: ProductCardProduct; href?: string }) {
  const isDetail = isProductDetail(product)
  const href = hrefProp ?? `/products/${product.slug}`
  const background = isDetail ? product.tintColor : product.bg
  const title = product.name
  const price = product.price
  const originalPrice = product.originalPrice
  const charmSwatches = isDetail
    ? DEFAULT_CHARM_SWATCHES
    : product.charms.slice(0, 5).map((charm) => charm.bg)
  const charmsCount = isDetail ? DEFAULT_CHARM_SWATCHES.length : product.charms.length

  return (
    <CatalogCardLink href={href} className='block rounded-[24px] bg-white p-3'>
      <CatalogCard className='gap-3'>
        <div className='flex items-center justify-between gap-2'>
          <span className='inline-flex shrink-0 items-center gap-2 rounded-full bg-bark/5 px-3 py-2'>
            <Star className='h-3.5 w-3.5 fill-honey text-honey' strokeWidth={0} aria-hidden='true' />
            <span className='font-sans text-[13px] font-semibold leading-none text-bark'>{PRODUCT_REVIEW_RATING}</span>
          </span>
          {charmsCount > 0 ? (
            <span className='inline-flex shrink-0 items-center rounded-full bg-sage/10 px-3 py-2'>
              <span className='whitespace-nowrap font-sans text-[13px] font-medium leading-none text-interactive-text'>
                {charmsCount} pakabukai įskaičiuoti
              </span>
            </span>
          ) : null}
        </div>
        <CatalogCardMedia alt={title} background={background} image={product.image} className='rounded-[16px]' />
        <CatalogCardBody className='gap-2.5 px-0 pb-0 pt-0'>
          <div className='flex items-center'>
            {charmSwatches.map((swatch, index) => (
              <span
                key={`${swatch}-${index}`}
                title='Pakabuko spalva'
                className='h-6 w-6 shrink-0 rounded-full border border-bark/10 [&:not(:last-child)]:mr-[-10px]'
                style={{ background: swatch }}
              />
            ))}
          </div>
          <div className='flex flex-col gap-1'>
            <CatalogCardTitle className='mb-0 line-clamp-2 text-[20px] font-semibold leading-[1.5] tracking-[-0.5px] text-bark'>
              {title}
            </CatalogCardTitle>
            <CatalogCardFooter className='items-end'>
              <ProductPrice currentPrice={price} originalPrice={originalPrice} />
              <span className='btn-press flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-bark/15 text-bark transition-colors duration-150 ease-out group-hover:bg-bark group-hover:text-cream'>
                <ChevronRight className='h-3.5 w-3.5' aria-hidden='true' />
              </span>
            </CatalogCardFooter>
          </div>
        </CatalogCardBody>
      </CatalogCard>
    </CatalogCardLink>
  )
}
