'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const BENTO_IMAGES = [
  { src: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', alt: 'Auksinė retriverė su antkakleliu' },
  { src: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', alt: 'Žalias PawCharms antkaklis' },
  { src: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', alt: 'Moteris su šunimi' },
  { src: '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp', alt: 'PawCharms šuo lauke' },
];

export function About() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="about" style={{ background: 'var(--color-surface-2)' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '64px 64px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '614px 1fr',
        gap: isMobile ? 40 : 32,
        alignItems: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Left — text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 32 : 48,
            letterSpacing: '0.02em',
            lineHeight: 1.05,
          }}>
            Sukurta su <span style={{ color: 'var(--color-blossom)' }}>meile</span>, čia, Lietuvoje.
          </h2>

          <p style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--color-bark-muted)',
            margin: 0,
            maxWidth: 560,
          }}>
            PawCharms kiekvienas antkaklis gaminamas rankomis Vilniuje iš vandeniui atsparių medžiagų. Pakabukų sistema gimė iš paprastos idėjos: jūsų šuns antkaklis turėtų būti toks pat unikalus kaip jis pats.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-sage)',
                borderRadius: 100,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--color-interactive-text)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Užsakyti iš anksto
            </Link>
            <Link
              href="/products"
              aria-label="Peržiūrėti produktus"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1.5px solid var(--color-bark-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-bark)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right — bento image grid */}
        {!isMobile ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 12,
            height: 415,
          }}>
            {/* Left tall image */}
            <div style={{
              gridRow: '1 / 3',
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Image src={BENTO_IMAGES[0].src} alt={BENTO_IMAGES[0].alt} fill sizes="300px" style={{ objectFit: 'cover' }} />
            </div>
            {/* Top right */}
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <Image src={BENTO_IMAGES[1].src} alt={BENTO_IMAGES[1].alt} fill sizes="200px" style={{ objectFit: 'cover' }} />
            </div>
            {/* Bottom right */}
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <Image src={BENTO_IMAGES[2].src} alt={BENTO_IMAGES[2].alt} fill sizes="200px" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            aspectRatio: '4/3',
          }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', gridRow: '1 / 3' }}>
              <Image src={BENTO_IMAGES[0].src} alt={BENTO_IMAGES[0].alt} fill sizes="160px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <Image src={BENTO_IMAGES[1].src} alt={BENTO_IMAGES[1].alt} fill sizes="160px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <Image src={BENTO_IMAGES[2].src} alt={BENTO_IMAGES[2].alt} fill sizes="160px" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
