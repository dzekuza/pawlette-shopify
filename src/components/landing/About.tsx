'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';

export function About({ variant }: { variant: 'cream' | 'bold' }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const bg = variant === 'bold' ? '#3D3530' : '#A8D5A2';
  const textPrimary = variant === 'bold' ? '#FAF7F2' : '#2a5a25';
  const textSecondary = variant === 'bold' ? 'rgba(250,247,242,0.65)' : 'rgba(42,90,37,0.7)';

  return (
    <section id="about" style={{ background: bg, padding: isMobile ? '60px 20px' : '100px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: textSecondary, marginBottom: 20 }}>Apie Žavesį</div>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 500, letterSpacing: '-0.02em', color: textPrimary, lineHeight: 1.15, marginBottom: 28 }}>
          Sukurta su meile,<br />čia, Lietuvoje.
        </h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: textSecondary, lineHeight: 1.8, maxWidth: 640, margin: '0 auto 20px' }}>
          Žavesys reiškia būtent tai, ką ir norėjome sukurti. Kiekvienas antkaklis gaminamas rankomis Vilniuje iš vandeniui atsparių medžiagų, kurios atlaiko purvą, lietų ir maudynes, nesugeria kvapų ir nesitepa.
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: textSecondary, lineHeight: 1.8, maxWidth: 640, margin: '0 auto 48px' }}>
          Pakabukų sistema gimė iš paprastos idėjos: jūsų šuns antkaklis turėtų būti toks pat unikalus kaip jis pats, o pakeitimas turėtų trukti penkias sekundes, ne penkias minutes.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 100, cursor: 'pointer', background: '#A8D5A2', color: '#2a5a25', border: '2px solid transparent', transition: 'all 150ms' }}>
            Mūsų istorija
          </button>
          <button style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 100, cursor: 'pointer', background: 'transparent', border: `2px solid ${variant === 'bold' ? 'rgba(250,247,242,0.3)' : 'rgba(42,90,37,0.3)'}`, color: textPrimary, transition: 'all 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = variant === 'bold' ? 'rgba(250,247,242,0.3)' : 'rgba(42,90,37,0.3)'; }}>
            Raskite mus Etsy
          </button>
        </div>
      </div>
    </section>
  );
}
