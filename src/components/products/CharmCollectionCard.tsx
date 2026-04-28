import Link from 'next/link'
import type { ProductDetail } from '@/lib/catalog'

interface CharmCollectionCardProps {
  href: string
  title: string
  description?: string
  price: string
  image: string
  imageAlt: string
}

export function CharmCollectionCard ({ href, title, description, price, image, imageAlt }: CharmCollectionCardProps) {
  return (
    <Link
      href={href}
      data-animate='card'
      className='group block rounded-[20px] transition-transform duration-200 ease-out hover:-translate-y-1 no-underline'
    >
      <article
        style={{ cursor: 'pointer', borderRadius: 20, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div className='relative h-[200px] overflow-hidden rounded-[20px]' style={{ background: '#B8D8F4' }}>
          {image && (
            <img
              src={image}
              alt={imageAlt}
              className='block h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105'
            />
          )}
          <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(6px)', borderRadius: 100, padding: '6px 10px' }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: '#3D3530' }}>{title}</span>
          </div>
        </div>
        <div style={{ padding: '16px 4px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ marginBottom: 6, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#3D3530' }}>{title}</div>
          {description && (
            <div
              style={{
                marginBottom: 14,
                fontSize: 13,
                lineHeight: 1.55,
                color: '#9B948F',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: 'auto' }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#3D3530' }}>{price}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2a5a25', whiteSpace: 'nowrap' }}>Peržiūrėti →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function CharmCollectionProductCard ({ product }: { product: ProductDetail }) {
  return (
    <CharmCollectionCard
      href={`/products/${product.slug}`}
      title={product.name}
      description={product.shortDescription}
      price={product.price}
      image={product.image}
      imageAlt={product.name}
    />
  )
}
