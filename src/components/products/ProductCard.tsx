import Link from 'next/link'
import { slugFromProductName } from '@/lib/catalog'
import type { LandingCollar } from '@/lib/db'

export function ProductCard ({ product }: { product: LandingCollar }) {
  return (
    <Link
      href={`/products/${slugFromProductName(product.name)}`}
      style={{ textDecoration: 'none' }}
    >
      <article
        data-animate='card'
        style={{ cursor: 'pointer', borderRadius: 20, transition: 'transform 200ms ease-out' }}
      >
        <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderRadius: 20, background: product.bg }}>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          {product.badge && (
            <div style={{ position: 'absolute', top: 14, right: 14, borderRadius: 20, padding: '3px 12px', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', background: product.badgeBg || '#eef7ee', color: product.badgeColor || '#3a7a3a' }}>
              {product.badge}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(6px)', borderRadius: 100, padding: '6px 10px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(61,53,48,0.12)', background: product.collarColor }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: '#3D3530' }}>
              {product.name.replace(' set', '')}
            </span>
          </div>
        </div>
        <div style={{ padding: '16px 4px 8px' }}>
          <div style={{ marginBottom: 4, fontSize: 16, fontWeight: 500, color: '#3D3530' }}>{product.name}</div>
          <div style={{ marginBottom: 14, fontSize: 13, lineHeight: 1.5, color: '#9B948F' }}>{product.desc}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#3D3530' }}>
              {product.price}
              <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 400, color: '#9B948F' }}>· 5 charms</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2a5a25' }}>View details →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
