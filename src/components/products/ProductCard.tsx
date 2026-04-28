import Link from 'next/link'
import { slugFromProductName } from '@/lib/catalog'
import type { ProductDetail } from '@/lib/catalog'
import type { LandingCollar } from '@/lib/db'

type ProductCardProduct = LandingCollar | ProductDetail
const DEFAULT_CHARM_SWATCHES = ['#A8D5A2', '#B8D8F4', '#F9E4A0', '#D4B8F4']

function isProductDetail (product: ProductCardProduct): product is ProductDetail {
  return 'slug' in product
}

export function ProductCard ({ product }: { product: ProductCardProduct }) {
  const isDetail = isProductDetail(product)
  const isCollarProduct = isDetail ? product.productType === 'collar' : true
  const href = isDetail ? `/products/${product.slug}` : `/products/${slugFromProductName(product.name)}`
  const background = isDetail ? product.tintColor : product.bg
  const title = product.name
  const description = isDetail ? product.shortDescription : product.desc
  const price = product.price
  const badge = isDetail ? product.badge : product.badge
  const collarColor = isDetail ? product.accentColor : product.collarColor
  const charmSwatches = isDetail
    ? DEFAULT_CHARM_SWATCHES
    : product.charms.slice(0, 4).map((charm) => charm.bg)

  return (
    <Link
      href={href}
      data-animate='card'
      className='group block rounded-[20px] transition-transform duration-200 ease-out hover:-translate-y-1 no-underline'
    >
      <article style={{ cursor: 'pointer', borderRadius: 20, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className='relative h-[200px] overflow-hidden rounded-[20px]' style={{ background }}>
          {product.image && (
            <img
              src={product.image}
              alt={title}
              className='block h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105'
              style={{ objectFit: 'cover' }}
            />
          )}
          {isCollarProduct && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                borderRadius: 999,
                padding: '8px 12px',
                background: 'linear-gradient(135deg, rgba(255,170,120,0.96) 0%, rgba(255,108,155,0.92) 34%, rgba(109,166,255,0.94) 68%, rgba(88,208,170,0.92) 100%)',
                boxShadow: '0 10px 24px rgba(105,94,160,0.24), inset 0 1px 0 rgba(255,255,255,0.22)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFDF9' }}>
                <span aria-hidden="true" style={{ fontSize: 10, lineHeight: 1 }}>
                  ✦
                </span>
                Personalizuok
              </span>
            </div>
          )}
          {badge && !isDetail && (
            <div style={{ position: 'absolute', top: 14, right: 14, borderRadius: 20, padding: '3px 12px', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', background: product.badgeBg || '#eef7ee', color: product.badgeColor || '#3a7a3a' }}>
              {badge}
            </div>
          )}
        </div>
        <div className='px-1 pb-1.5 pt-4' style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className='mb-1 font-sans text-[15px] font-medium text-bark'>{title}</div>
          <div
            className='mb-3.5 font-sans text-[13px] leading-[1.5] text-bark-muted'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </div>
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
          <div className='flex items-center justify-between' style={{ marginTop: 'auto', gap: 16 }}>
            <div className='font-sans text-[18px] font-medium text-bark'>
              {price}
              <span className='text-xs font-normal text-bark-muted'> · 5 pakabukai</span>
            </div>
            <span className='btn-press rounded-full border-none bg-sage px-[18px] py-2 font-sans text-[13px] font-medium text-interactive-text transition-colors duration-150 ease-out group-hover:bg-[#8fc489]'>
              Rinktis
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
