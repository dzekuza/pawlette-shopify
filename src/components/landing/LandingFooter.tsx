'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const FOOTER_COLS = [
  { title: 'Parduotuvė', links: [
    { label: 'Antkaklių rinkiniai', href: '/products' },
    { label: 'Pakabukai', href: '/products/charm-charms' },
    { label: 'Susikurk savo', href: '/products' },
  ]},
  { title: 'Pagalba', links: [
    { label: 'Dydžių gidas', href: '/guide/how-to-measure-dog-collar' },
    { label: 'Silikonas ar nailonas', href: '/guide/silicone-vs-nylon-dog-collars' },
    { label: 'Pristatymas', href: '/faq#orders' },
    { label: 'Grąžinimas', href: '/faq#orders' },
  ]},
  { title: 'PawCharms', links: [
    { label: 'Mūsų istorija', href: '/#about' },
    { label: 'DUK', href: '/faq#products' },
    { label: 'Kontaktai', href: 'mailto:hello@pawcharms.lt' },
  ]},
];

export function LandingFooter() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const isDesktop = w >= 1024;

  return (
    <footer style={{ background: 'var(--color-surface-2)', color: 'var(--color-bark)', padding: isMobile ? '40px 0 32px' : '60px 0 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '2fr 1fr 1fr 1fr' : '1fr', gap: isMobile ? 28 : 48, marginBottom: isMobile ? 32 : 56 }}>
          <div>
            <Link href="/" aria-label="PawCharms pagrindinis" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <Image src="/pawcharms.svg" alt="PawCharms" width={100} height={32} style={{ height: 32, width: 'auto', display: 'block' }} />
            </Link>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-bark-muted)', lineHeight: 1.7, maxWidth: 260 }}>Vandeniui atsparūs šunų antkakliai su prisegamais pakabukais. Rankų darbo Vilniuje, Lietuvoje.</p>
            <div style={{ marginTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>Pakabukai keičiami per 5 sekundes.</div>
          </div>
          {isMobile ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
              {FOOTER_COLS.map((col, index) => (
                <div key={col.title} style={{ gridColumn: index === FOOTER_COLS.length - 1 ? '1 / -1' : 'auto' }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: 16 }}>{col.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(l => (
                      <Link key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-bark-light)', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bark)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-bark-light)')}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-bark-light)', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bark)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-bark-light)')}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 16 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--color-muted-foreground)' }}>© {new Date().getFullYear()} PawCharms. Pagaminta su meile Lietuvoje.</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--color-muted-foreground)' }}>hello@pawcharms.lt · Vilnius, Lietuva</div>
        </div>
      </div>
    </footer>
  );
}
