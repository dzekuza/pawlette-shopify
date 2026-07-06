'use client';

import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

function BentoCard({
  background,
  heading,
  flex,
  align = 'end',
  children,
}: {
  background: string;
  heading: string;
  flex: string;
  align?: 'start' | 'end';
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background,
        flex,
        minWidth: 0,
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: align === 'start' ? 'flex-start' : 'flex-end',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 270,
      }}
    >
      {children}
      <p className="font-display text-2xl leading-[1.2] tracking-[-0.02em] text-bark" style={{ maxWidth: 320, position: 'relative' }}>
        {heading}
      </p>
    </div>
  );
}

export function About() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const rowTop = (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
      <BentoCard background="var(--color-surface-2)" heading="Kiekvienas antkaklis gaminamas rankomis" flex={isMobile ? '1' : '0 0 380px'}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -70, right: -20, width: 230, height: 230, transform: 'rotate(-17deg)' }}>
          <Image src="/hero-figma/bento-collar-charm.png" alt="" fill sizes="230px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
      <BentoCard background="rgba(168,213,162,0.3)" heading="Personalizuojamas išskirtinais pakabukais" flex="1 0 0">
        <div aria-hidden="true" style={{ position: 'absolute', top: -70, right: 40, width: 200, height: 200, transform: 'rotate(-17deg)' }}>
          <Image src="/hero-figma/bento-letter-s.png" alt="" fill sizes="200px" style={{ objectFit: 'contain' }} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 40, right: 20, width: 110, height: 110 }}>
          <Image src="/hero-figma/bento-letter-k.png" alt="" fill sizes="110px" style={{ objectFit: 'contain' }} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', right: -20, width: 220, height: 220, transform: 'translateY(-50%) rotate(-23deg)' }}>
          <Image src="/hero-figma/bento-paw-print.png" alt="" fill sizes="220px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const rowBottom = (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
      <BentoCard background="var(--color-cream)" heading="Atsparus vandeniui, purvui ir kasdienei avantiūrai" flex="1 0 0" align="start">
        <div aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: -30, top: 20, width: '68%' }}>
          <Image src="/hero-figma/bento-dog-photo.png" alt="Šuo su PawCharms antkakliu" fill sizes="340px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </BentoCard>
      <BentoCard background="var(--color-surface-2)" heading="Sukurkite antkaklį, kuris atspindi jūsų šunį" flex={isMobile ? '1' : '0 0 380px'} align="start">
        <div aria-hidden="true" style={{ position: 'absolute', top: 20, left: '68%', width: 260, height: 260, transform: 'translateX(-50%) rotate(53deg)' }}>
          <Image src="/hero-figma/bento-leash-blue.png" alt="" fill sizes="260px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const videoPanel = (
    <div
      style={{
        flex: isMobile ? '1' : '0 0 340px',
        aspectRatio: isMobile ? '9 / 19' : undefined,
        minHeight: isMobile ? 'auto' : undefined,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-surface-2)',
      }}
    >
      <video
        src="https://cdn.shopify.com/videos/c/o/v/eaad51df2ebc4bdd81140870ab6f1534.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );

  return (
    <section id="about" className="bg-white">
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '64px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 16,
      }}>
        {isMobile ? (
          <>
            {rowTop}
            {videoPanel}
            {rowBottom}
          </>
        ) : (
          <>
            {/* Left — 2x2 bento */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 0 0', minWidth: 0 }}>
              {rowTop}
              {rowBottom}
            </div>

            {/* Right — brand video panel */}
            {videoPanel}
          </>
        )}
      </div>
    </section>
  );
}
