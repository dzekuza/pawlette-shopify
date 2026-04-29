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
      borderTop: '1px solid #E8E3DC',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 350ms ease',
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
            {['#F4B5C0', '#A8D5A2', '#B8D8F4', '#F9E4A0'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #FAF7F2', marginLeft: i > 0 ? -8 : 0 }} />
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: '#3D3530' }}>Vandeniui atsparūs antkaklių rinkiniai — nuo 28 €</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#9B948F' }}>5 pakabukai įskaičiuoti · nemokamas pristatymas nuo 40 €</div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', marginLeft: isMobile ? 0 : 'auto' }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#A8D5A2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A8D5A2', animation: 'pulse 2s ease-in-out infinite' }} />
          Dabar perka 4 žmonės
        </div>
        <Link href="/products" style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
          padding: '10px 24px', borderRadius: 100, background: '#A8D5A2', color: '#2a5a25',
          textDecoration: 'none', transition: 'background 150ms', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8fc489')}
          onMouseLeave={e => (e.currentTarget.style.background = '#A8D5A2')}>
          Kurk savo antkaklį →
        </Link>
      </div>
      </div>
    </div>
  );
}
