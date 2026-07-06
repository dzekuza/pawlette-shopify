import Link from 'next/link'
import Image from 'next/image'
import { slugFromCharmId } from '@/lib/catalog'
import type { ShopifyCharm } from '@/lib/shopify'

export function CharmCard ({ charm }: { charm: ShopifyCharm }) {
  return (
    <Link href={`/products/${slugFromCharmId(charm.id)}`} style={{ textDecoration: 'none' }}>
      <article
        data-animate='card'
        style={{ cursor: 'pointer', borderRadius: 20, transition: 'transform 150ms ease-out' }}
        onPointerEnter={e => {
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
          }
        }}
        onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
        onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
        onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
      >
        <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderRadius: 20, background: charm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={encodeURI(charm.image)}
            alt={charm.baseTitle}
            width={196}
            height={196}
            style={{ width: '70%', height: '70%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ padding: '16px 4px 8px' }}>
          <div className="text-bark" style={{ marginBottom: 4, fontSize: 16, fontWeight: 500 }}>{charm.baseTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div className="text-bark" style={{ fontSize: 20, fontWeight: 500 }}>{charm.price}</div>
            <span className="text-interactive-text" style={{ fontSize: 13, fontWeight: 500 }}>Peržiūrėti →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
