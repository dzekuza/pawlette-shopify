'use client';

import Link from 'next/link';
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

const TEXT_PRIMARY   = '#2d2b2a';
const TEXT_MUTED     = 'rgba(45,43,42,0.55)';
const TEXT_SUBTLE    = 'rgba(45,43,42,0.40)';
const LINK_COLOR     = 'rgba(45,43,42,0.70)';
const LINK_HOVER     = '#2d2b2a';
const BORDER_COLOR   = 'rgba(45,43,42,0.12)';

export function LandingFooter() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const isDesktop = w >= 1024;

  return (
    <footer style={{ background: '#f3ede6', color: TEXT_PRIMARY, padding: isMobile ? '40px 0 32px' : '60px 0 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '2fr 1fr 1fr 1fr' : '1fr', gap: isMobile ? 28 : 48, marginBottom: isMobile ? 32 : 56 }}>
          <div>
            <Link href="/" aria-label="PawCharms pagrindinis" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <img src="/pawcharms.svg" alt="PawCharms" style={{ height: 32, width: 'auto', display: 'block' }} />
            </Link>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: TEXT_MUTED, lineHeight: 1.7, maxWidth: 260 }}>Vandeniui atsparūs šunų antkakliai su prisegamais pakabukais. Rankų darbo Vilniuje, Lietuvoje.</p>
            <div style={{ marginTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: TEXT_SUBTLE, fontStyle: 'italic' }}>Pakabukai keičiami per 5 sekundes.</div>
          </div>
          {isMobile ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
              {FOOTER_COLS.map((col, index) => (
                <div key={col.title} style={{ gridColumn: index === FOOTER_COLS.length - 1 ? '1 / -1' : 'auto' }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_SUBTLE, marginBottom: 16 }}>{col.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(l => (
                      <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: LINK_COLOR, textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => (e.currentTarget.style.color = LINK_HOVER)}
                        onMouseLeave={e => (e.currentTarget.style.color = LINK_COLOR)}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_SUBTLE, marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: LINK_COLOR, textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = LINK_HOVER)}
                      onMouseLeave={e => (e.currentTarget.style.color = LINK_COLOR)}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop: `1px solid ${BORDER_COLOR}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 16 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: TEXT_SUBTLE }}>© {new Date().getFullYear()} PawCharms. Pagaminta su meile Lietuvoje.</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: TEXT_SUBTLE }}>hello@pawcharms.lt · Vilnius, Lietuva</div>
        </div>
      </div>
    </footer>
  );
}
