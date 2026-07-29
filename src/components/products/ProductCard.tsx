import { Star, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
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
import ltMessages from '@/messages/lt.json'
import enMessages from '@/messages/en.json'
import { localizeHref } from '@/lib/locale-path'

type ProductCardProduct = LandingCollar | ProductDetail
const DEFAULT_CHARM_SWATCHES = ['var(--color-blossom)', 'var(--color-sage)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-lavender)']

// ProductCard is rendered both under the migrated `[locale]` routes (with a
// NextIntlClientProvider ancestor) and from PavadeliaiPageContent on the
// non-migrated `/pavadeliai` route (no provider). Calling next-intl's
// useTranslations() here would throw on `/pavadeliai`, so resolve copy from
// the raw message JSON keyed off the URL's locale prefix instead — same
// pattern as CartDrawer.
const PRODUCT_CARD_STRINGS = { lt: ltMessages.products.card, en: enMessages.products.card }

function isProductDetail (product: ProductCardProduct): product is ProductDetail {
  return 'slug' in product
}

export function ProductCard ({ product, href: hrefProp }: { product: ProductCardProduct; href?: string }) {
  const pathname = usePathname()
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt'
  const t = PRODUCT_CARD_STRINGS[locale]
  const isDetail = isProductDetail(product)
  // ProductCard can't use next-intl's <Link> (no NextIntlClientProvider on
  // /pavadeliai — see note above), so prefix the href with the locale we
  // already resolved from the path, mirroring what next-intl's Link would do
  // automatically. Without this, every product card on /en linked back to
  // the bare (Lithuanian) product path.
  const href = localizeHref(hrefProp ?? `/products/${product.slug}`, locale)
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
                {t.charmsIncluded.replace('{count}', String(charmsCount))}
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
                title={t.charmColorTitle}
                className='h-6 w-6 shrink-0 rounded-full border border-bark/10 [&:not(:last-child)]:mr-[-10px]'
                style={{ background: swatch }}
              />
            ))}
          </div>
          <div className='flex flex-col gap-1'>
            <CatalogCardTitle className='mb-0 line-clamp-2 text-xl font-semibold leading-[1.5] tracking-[-0.5px] text-bark'>
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
