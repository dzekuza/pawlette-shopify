'use client';

import { useState } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function BentoSection({ isDark }: { isDark: boolean }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const bg = isDark ? '#2A1E18' : 'var(--color-surface-2)';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'white';
  const cardBgAlt = isDark ? 'rgba(255,255,255,0.03)' : 'var(--color-cream)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'var(--color-border)';
  const textPrimary = isDark ? 'var(--color-cream)' : 'var(--color-bark)';
  const textSecondary = isDark ? 'rgba(250,247,242,0.6)' : 'var(--color-bark-light)';
  const textMuted = isDark ? 'rgba(250,247,242,0.3)' : 'var(--color-bark-muted)';

  const row: React.CSSProperties = {
    display: 'flex',
    gap: 16,
    flexDirection: isMobile ? 'column' : 'row',
  };
  const impactHeadingSize = 'clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem)';
  const sizingLabelSize = 'clamp(2.375rem, 2rem + 1.5vw, 3rem)';

  return (
    <section style={{ background: bg, transition: 'background-color 250ms ease-out' }}>
      {/* max-width lives here, not on the section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Row 1 — Material + Origin */}
        <div style={row}>
          {/* Material */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: 'var(--color-sage)', padding: isMobile ? '28px 24px' : '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(42,90,37,0.6)', marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
                Medžiaga
              </div>
              <div style={{ fontFamily: "'Tomato Grotesk VF',cursive", fontSize: impactHeadingSize, color: 'var(--color-interactive-text)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em', marginBottom: 16 }}>
                Atsparūs vandeniui.<br />Be kvapo. Be dėmių.
              </div>
              <div style={{ fontSize: 15, color: 'rgba(42,90,37,0.75)', lineHeight: 1.7 }}>
                TPU dengtas nailonas, kuriam nebaisūs ežerai, purvas ir lietus. Tereikia nuvalyti drėgna šluoste, ir jis vėl atrodo kaip naujas.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Ežerai', 'Purvas', 'Lietus', 'Sniegas'].map(label => (
                <div key={label} style={{ background: 'rgba(42,90,37,0.12)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 500, color: 'var(--color-interactive-text)', fontFamily: "'DM Sans',sans-serif" }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Origin */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: 'var(--color-bark)', padding: isMobile ? '28px 24px' : '40px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.35)', fontFamily: "'DM Sans',sans-serif" }}>
              Kilmė
            </div>
            <div style={{ fontFamily: "'Tomato Grotesk VF',cursive", fontSize: impactHeadingSize, color: 'var(--color-cream)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em' }}>
              Pagaminta rankomis<br />Vilniuje, Lietuvoje.
            </div>
            <div style={{ fontSize: 14, color: 'rgba(250,247,242,0.55)', lineHeight: 1.7 }}>
              Mažos partijos. Kerpama ir surenkama rankomis mūsų dirbtuvėse. Kiekvienas antkaklis išsiunčiamas lino maišelyje.
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: 'rgba(250,247,242,0.2)', fontStyle: 'italic', letterSpacing: '-0.01em', marginTop: 'auto' }}>
              Vandeniui atspari.
            </div>
          </div>
        </div>

        {/* Row 2 — Sizing + Charm system + Care */}
        <div style={row}>
          {/* Charm system */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: 'var(--color-blossom)', padding: isMobile ? '24px 20px' : '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(61,20,30,0.45)', marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
                Pakabukų sistema
              </div>
              <div style={{ fontFamily: "'Tomato Grotesk VF',cursive", fontSize: impactHeadingSize, color: 'rgba(61,20,30,0.85)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em', marginBottom: 10 }}>
                Prisisega per 5 sekundes.
              </div>
              <div style={{ fontSize: 14, color: 'rgba(61,20,30,0.6)', lineHeight: 1.6 }}>
                Prisegamas laikiklis. Jokių segtukų. Jokių įrankių. Jokio vargo.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {['/charm-flower.png', '/charm-star.png', '/charm-heart.png', '/charm-paw.png'].map((src) => (
                <div key={src} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 4 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
              <span style={{ fontSize: 12, color: 'rgba(61,20,30,0.5)', marginLeft: 4 }}>+8 daugiau</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
