'use client';

import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const FOOTER_COLS = [
  { title: 'Parduotuvė', links: [
    { label: 'Antkaklių rinkiniai', href: '/products' },
    { label: 'Pasivaikščiojimo rinkiniai', href: '/sets' },
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

  return (
    <footer style={{ background: '#3D3530', padding: isMobile ? '40px 20px 32px' : '60px 40px 40px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 28 : 48, marginBottom: isMobile ? 32 : 56 }}>
          <div>
            <Link href="/" aria-label="PawCharms home" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <img src="/pawcharms.svg" alt="PawCharms" style={{ height: 32, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(250,247,242,0.5)', lineHeight: 1.7, maxWidth: 260 }}>Vandeniui atsparūs šunų antkakliai su prisegamais pakabukais. Rankų darbo Vilniuje, Lietuvoje.</p>
            <div style={{ marginTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,0.35)', fontStyle: 'italic' }}>Pakabukai keičiami per 5 sekundes.</div>
          </div>
          {isMobile ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
              {FOOTER_COLS.map((col, index) => (
                <div key={col.title} style={{ gridColumn: index === FOOTER_COLS.length - 1 ? '1 / -1' : 'auto' }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.35)', marginBottom: 16 }}>{col.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(l => (
                      <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(250,247,242,0.55)', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F2')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.55)')}>
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
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.35)', marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(250,247,242,0.55)', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F2')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.55)')}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop: '1px solid rgba(250,247,242,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 16 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(250,247,242,0.3)' }}>© {new Date().getFullYear()} PawCharms. Pagaminta su meile Lietuvoje.</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(250,247,242,0.3)' }}>hello@pawcharms.lt · Vilnius, Lietuva</div>
        </div>
      </div>
    </footer>
  );
}
