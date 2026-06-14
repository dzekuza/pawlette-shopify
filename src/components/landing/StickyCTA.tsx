'use client';

import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function StickyCTA({ visible }: { visible: boolean }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
      background: 'rgba(250,247,242,0.96)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-border)',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 280ms cubic-bezier(0.23, 1, 0.32, 1)',
      boxShadow: '0 -4px 24px rgba(61,53,48,0.08)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '12px 16px' : '14px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex' }}>
            {['/charm-flower.png', '/charm-star.png', '/charm-heart.png', '/charm-paw.png'].map((src, i) => (
              <div key={src} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-cream)', marginLeft: i > 0 ? -10 : 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={src} alt="" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--color-bark)' }}>Vandeniui atsparūs antkaklių rinkiniai — nuo 28 €</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--color-bark-muted)' }}>5 pakabukai įskaičiuoti · nemokamas pristatymas nuo 40 €</div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', marginLeft: isMobile ? 0 : 'auto' }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--color-sage)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-sage)', animation: 'pulse 2s ease-in-out infinite' }} />
          Dabar perka 4 žmonės
        </div>
        <Link href="/products" style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
          padding: '10px 24px', borderRadius: 100, background: 'var(--color-sage)', color: 'var(--color-interactive-text)',
          textDecoration: 'none', transition: 'background-color 150ms ease-out', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-sage-dark)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-sage)')}>
          Kurk savo antkaklį →
        </Link>
      </div>
      </div>
    </div>
  );
}
