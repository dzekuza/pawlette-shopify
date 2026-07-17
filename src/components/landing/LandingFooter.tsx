'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eyebrow } from '@/components/storefront/Typography';
import { FREE_SHIPPING_COPY } from '@/lib/site-config';

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
  return (
    <footer className="bg-surface-2 py-16 text-bark md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-10 grid gap-10 md:mb-14 md:grid-cols-2 md:gap-12 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="PawCharms pagrindinis" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <Image src="/pawcharms.svg" alt="PawCharms" width={100} height={32} style={{ height: 32, width: 'auto', display: 'block' }} />
            </Link>
            <p style={{ fontSize: 14, color: 'var(--color-bark-muted)', lineHeight: 1.7, maxWidth: 260 }}>Vandeniui atsparūs šunų antkakliai su prisegamais pakabukais. Rankų darbo Vilniuje, Lietuvoje.</p>
            <div style={{ marginTop: 20, fontSize: 13, color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>Pakabukai keičiami per 5 sekundes.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
              {[FREE_SHIPPING_COPY, '30 d. grąžinimas'].map((item) => (
                <span
                  key={item}
                  style={{
                    borderRadius: 999,
                    border: '1px solid rgba(168, 213, 162, 0.5)',
                    background: 'rgba(255,255,255,0.75)',
                    padding: '7px 12px',
                    fontSize: 12,
                    color: 'var(--color-bark)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3 xl:col-span-3 xl:contents">
            {FOOTER_COLS.map((col, index) => (
              <div key={col.title} className={index === FOOTER_COLS.length - 1 ? 'col-span-2 md:col-span-1' : ''}>
                <Eyebrow className="mb-4">{col.title}</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 14, color: 'var(--color-bark-light)', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bark)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-bark-light)')}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-6 text-[12px] text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-4">
          <div style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>© {new Date().getFullYear()} PawCharms. Pagaminta su meile Lietuvoje.</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>hello@pawcharms.lt · Vilnius, Lietuva</div>
        </div>
      </div>
    </footer>
  );
}
