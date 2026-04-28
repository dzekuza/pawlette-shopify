import Link from 'next/link'
import { slugFromCharmId } from '@/lib/catalog'
import type { ShopifyCharm } from '@/lib/shopify'

export function CharmCard ({ charm }: { charm: ShopifyCharm }) {
  return (
    <Link href={`/products/${slugFromCharmId(charm.id)}`} style={{ textDecoration: 'none' }}>
      <article
        data-animate='card'
        style={{ cursor: 'pointer', borderRadius: 20, transition: 'transform 200ms ease-out' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderRadius: 20, background: charm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={encodeURI(charm.image)}
            alt={charm.baseTitle}
            style={{ width: '70%', height: '70%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ padding: '16px 4px 8px' }}>
          <div style={{ marginBottom: 4, fontSize: 16, fontWeight: 500, color: '#3D3530' }}>{charm.baseTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#3D3530' }}>{charm.price}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2a5a25' }}>Peržiūrėti →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
