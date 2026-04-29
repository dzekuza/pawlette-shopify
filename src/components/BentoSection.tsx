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

  const [sizingNeck, setSizingNeck] = useState(36);
  const sizeLabel = sizingNeck <= 28 ? 'XS' : sizingNeck <= 36 ? 'S' : sizingNeck <= 44 ? 'M' : 'L';
  const sizeBreed = sizingNeck <= 28 ? 'Chihuahua, Pomeranian' : sizingNeck <= 36 ? 'Beagle, Cocker Spaniel' : sizingNeck <= 44 ? 'Labrador, Border Collie' : 'Golden Retriever, Husky';
  const sizeFill = ((sizingNeck - 20) / (52 - 20)) * 100;

  const row: React.CSSProperties = {
    display: 'flex',
    gap: 16,
    flexDirection: isMobile ? 'column' : 'row',
  };
  const impactHeadingSize = isMobile ? 30 : 40;
  const sizingLabelSize = isMobile ? 38 : 48;

  return (
    <section style={{ background: bg, transition: 'background 400ms' }}>
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
              <div style={{ fontFamily: "'Luckiest Guy',cursive", fontSize: impactHeadingSize, color: 'var(--color-interactive-text)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em', marginBottom: 16 }}>
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
            <div style={{ fontFamily: "'Luckiest Guy',cursive", fontSize: impactHeadingSize, color: 'var(--color-cream)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em' }}>
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
          {/* Sizing */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: cardBg, border: `1px solid ${border}`, padding: isMobile ? '20px' : '24px' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: textMuted, marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>
              Dydžių gidas
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Luckiest Guy',cursive", fontSize: sizingLabelSize, color: textPrimary, lineHeight: 1 }}>{sizeLabel}</span>
              <span style={{ fontSize: 15, color: textSecondary }}>{sizingNeck} cm</span>
            </div>
            <div style={{ fontSize: 13, color: textMuted, marginBottom: 16 }}>{sizeBreed}</div>
            <div style={{ height: 6, background: border, borderRadius: 3, marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${sizeFill}%`, background: 'var(--color-sage)', borderRadius: 3, transition: 'width 100ms' }} />
            </div>
            <input
              type="range" min={20} max={52} step={1} value={sizingNeck}
              onChange={e => setSizingNeck(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-sage)', cursor: 'pointer', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {(['XS', 'S', 'M', 'L'] as const).map((s, i) => (
                <div key={s} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: sizeLabel === s ? textPrimary : textMuted, transition: 'color 150ms', fontFamily: "'DM Sans',sans-serif" }}>{s}</div>
                  <div style={{ fontSize: 10, color: textMuted }}>{['20–28', '28–36', '36–44', '44–52'][i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charm system */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: 'var(--color-blossom)', padding: isMobile ? '24px 20px' : '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(61,20,30,0.45)', marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
                Pakabukų sistema
              </div>
              <div style={{ fontFamily: "'Luckiest Guy',cursive", fontSize: impactHeadingSize, color: 'rgba(61,20,30,0.85)', lineHeight: isMobile ? 1.02 : 1.05, letterSpacing: '0.01em', marginBottom: 10 }}>
                Prisisega per 5 sekundes.
              </div>
              <div style={{ fontSize: 14, color: 'rgba(61,20,30,0.6)', lineHeight: 1.6 }}>
                Magnetinė jungtis. Jokių segtukų. Jokių įrankių. Jokio vargo.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {['🌸', '⭐', '🦋', '🌿'].map((e, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{e}</div>
              ))}
              <span style={{ fontSize: 12, color: 'rgba(61,20,30,0.5)', marginLeft: 4 }}>+8 daugiau</span>
            </div>
          </div>

          {/* Care */}
          <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: cardBgAlt, border: `1px solid ${border}`, padding: isMobile ? '20px' : '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: textMuted, fontFamily: "'DM Sans',sans-serif" }}>
              Priežiūra
            </div>
            {([['Nuplauk', 'Po kiekvienų maudynių ar purvino pasivaikščiojimo.'], ['Džiovink ore', 'Padėk lygiai. Nedžiovink džiovyklėje.'], ['Nuvalyk pakabukus', 'Drėgna šluoste, tuomet palik išdžiūti.'], ['Laikyk lygiai', 'Lino maišelyje.']] as const).map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage)', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: textPrimary, fontFamily: "'DM Sans',sans-serif" }}>{t}</div>
                  <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
