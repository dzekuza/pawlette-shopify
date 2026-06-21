import { slugFromProductName } from '@/lib/catalog'
import type { ProductDetail } from '@/lib/catalog'
import type { LandingCollar } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { ProductPrice, hasDiscountedPrice } from '@/components/storefront/ProductPrice'
import {
  CatalogCard,
  CatalogCardAction,
  CatalogCardBody,
  CatalogCardFooter,
  CatalogCardLink,
  CatalogCardMedia,
  CatalogCardTitle,
} from '@/components/storefront/CatalogCard'

type ProductCardProduct = LandingCollar | ProductDetail
const DEFAULT_CHARM_SWATCHES = ['var(--color-sage)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-lavender)']

function isProductDetail (product: ProductCardProduct): product is ProductDetail {
  return 'slug' in product
}

export function ProductCard ({ product, href: hrefProp }: { product: ProductCardProduct; href?: string }) {
  const isDetail = isProductDetail(product)
  const isCollarProduct = isDetail ? product.productType === 'collar' : true
  const href = hrefProp ?? (isDetail ? `/products/${product.slug}` : `/products/${slugFromProductName(product.name)}`)
  const background = isDetail ? product.tintColor : product.bg
  const title = product.name
  const price = product.price
  const originalPrice = product.originalPrice
  const badge = isDetail ? product.badge : product.badge
  const collarColor = isDetail ? product.accentColor : product.collarColor
  const charmSwatches = isDetail
    ? DEFAULT_CHARM_SWATCHES
    : product.charms.slice(0, 4).map((charm) => charm.bg)
  const hasSale = hasDiscountedPrice(price, originalPrice)
  const desc = isDetail ? product.shortDescription : product.desc

  return (
    <CatalogCardLink href={href}>
      <CatalogCard>
        <CatalogCardMedia alt={title} background={background} image={product.image}>
          {isCollarProduct ? (
            <Badge variant='personalize' size='customize' className='absolute left-3.5 top-3.5'>
              <span aria-hidden='true' className='text-[10px] leading-none'>
                ✦
              </span>
              Personalizuok
            </Badge>
          ) : null}
          {badge && !isDetail ? (
            <Badge
              variant='default'
              size='compact'
              className='absolute right-3.5 top-3.5'
              style={{
                backgroundColor: product.badgeBg || 'rgba(168,213,162,0.2)',
                color: product.badgeColor || 'var(--color-interactive-text)',
              }}
            >
              {badge}
            </Badge>
          ) : null}
        </CatalogCardMedia>
        <CatalogCardBody>
          <CatalogCardTitle className='mb-2 line-clamp-2 text-[16px] leading-[1.3]'>{title}</CatalogCardTitle>
          <div className='mb-3.5 flex items-center gap-1.5'>
            <span
              title='Antkaklio spalva'
              className='h-3.5 w-3.5 rounded-full border border-bark/15'
              style={{ background: collarColor }}
            />
            {charmSwatches.map((swatch, index) => (
              <span
                key={`${swatch}-${index}`}
                title='Pakabuko spalva'
                className='h-3 w-3 rounded-full border border-bark/10'
                style={{ background: swatch }}
              />
            ))}
          </div>
          {desc ? (
            <p className='mb-4 line-clamp-2 font-sans text-[13px] leading-[1.55] text-bark-muted'>{desc}</p>
          ) : null}
          <CatalogCardFooter>
            <ProductPrice
              currentPrice={price}
              originalPrice={originalPrice}
              showSavingsBadge={hasSale}
            />
            <CatalogCardAction>Užsakyti iš anksto</CatalogCardAction>
          </CatalogCardFooter>
        </CatalogCardBody>
      </CatalogCard>
    </CatalogCardLink>
  )
}
