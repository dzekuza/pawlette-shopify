import Link from 'next/link'
import { slugFromCharmId } from '@/lib/catalog'
import type { Charm } from '@/lib/data'

interface CharmCardProps {
  charm: Charm
}

export function CharmCard ({ charm }: CharmCardProps) {
  return (
    <Link href={`/products/${slugFromCharmId(charm.id)}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          cursor: 'pointer',
          borderRadius: 16,
          border: '1px solid transparent',
          background: 'rgba(61,53,48,0.03)',
          padding: '20px 12px 16px',
          textAlign: 'center',
          transition: 'transform 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out'
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = 'translateY(-3px)'
          event.currentTarget.style.background = `${charm.bg}30`
          event.currentTarget.style.borderColor = charm.bg
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = 'translateY(0)'
          event.currentTarget.style.background = 'rgba(61,53,48,0.03)'
          event.currentTarget.style.borderColor = 'transparent'
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: charm.bg,
            transition: 'box-shadow 200ms ease-out'
          }}
        >
          <img
            src={encodeURI(charm.image)}
            alt=''
            aria-hidden='true'
            style={{ width: 52, height: 52, objectFit: 'contain' }}
          />
        </div>
        <div style={{ marginBottom: 2, fontSize: 13, fontWeight: 500, color: '#3D3530' }}>
          {charm.name}
        </div>
        <div style={{ fontSize: 12, color: '#9B948F' }}>€4</div>
      </article>
    </Link>
  )
}
