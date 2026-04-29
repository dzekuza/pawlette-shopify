'use client';

import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const BENTO_IMAGES = [
  { src: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', alt: '' },
  { src: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', alt: '' },
  { src: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', alt: '' },
  { src: '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp', alt: '' },
];

export function About({ variant }: { variant: 'cream' | 'bold' }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const bg = variant === 'bold' ? '#3D3530' : '#A8D5A2';
  const textPrimary = variant === 'bold' ? '#FAF7F2' : '#2a5a25';
  const textSecondary = variant === 'bold' ? 'rgba(250,247,242,0.65)' : 'rgba(42,90,37,0.7)';
  const subtleBorder = variant === 'bold' ? 'rgba(250,247,242,0.18)' : 'rgba(42,90,37,0.18)';
  const subtleSurface = variant === 'bold' ? 'rgba(250,247,242,0.1)' : 'rgba(250,247,242,0.26)';

  return (
    <section id="about" style={{ background: bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems: 'center' }}>

        {/* Left — text */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: textSecondary, marginBottom: 20 }}>Apie Žavesį</div>
          <h2 className="font-display font-normal tracking-[-0.02em] leading-[1.1]" style={{ fontSize: isMobile ? 30 : 40, color: textPrimary, marginBottom: isMobile ? 20 : 24 }}>
            Sukurta su meile,<br />čia, Lietuvoje.
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: textSecondary, lineHeight: 1.8, marginBottom: 18 }}>
            Žavesys reiškia būtent tai, ką ir norėjome sukurti. Kiekvienas antkaklis gaminamas rankomis Vilniuje iš vandeniui atsparių medžiagų, kurios atlaiko purvą, lietų ir maudynes, nesugeria kvapų ir nesitepa.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: textSecondary, lineHeight: 1.8, marginBottom: 40 }}>
            Pakabukų sistema gimė iš paprastos idėjos: jūsų šuns antkaklis turėtų būti toks pat unikalus kaip jis pats, o pakeitimas turėtų trukti penkias sekundes, ne penkias minutes.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 100, cursor: 'pointer', background: subtleSurface, color: '#2a5a25', border: `1.5px solid ${subtleBorder}`, boxShadow: '0 10px 24px rgba(61,53,48,0.08)', transition: 'all 150ms' }}>
              Shop now
            </button>
            <button
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 100, cursor: 'pointer', background: 'transparent', border: `2px solid ${variant === 'bold' ? 'rgba(250,247,242,0.3)' : 'rgba(42,90,37,0.3)'}`, color: textPrimary, transition: 'all 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = variant === 'bold' ? 'rgba(250,247,242,0.3)' : 'rgba(42,90,37,0.3)'; }}
            >
              Raskite mus Etsy
            </button>
          </div>
        </div>

        {/* Right — bento gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, aspectRatio: '1 / 1' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', gridRow: '1 / 3' }}>
            <Image src={BENTO_IMAGES[0].src} alt={BENTO_IMAGES[0].alt} fill sizes='300px' style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
            <Image src={BENTO_IMAGES[1].src} alt={BENTO_IMAGES[1].alt} fill sizes='200px' style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
            <Image src={BENTO_IMAGES[2].src} alt={BENTO_IMAGES[2].alt} fill sizes='200px' style={{ objectFit: 'cover' }} />
          </div>
        </div>

      </div>
    </section>
  );
}
