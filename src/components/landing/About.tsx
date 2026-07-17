'use client';

import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

function BentoCard({
  background,
  heading,
  description,
  flex,
  align = 'end',
  children,
}: {
  background: string;
  heading: string;
  description: string;
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
        gap: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 270,
      }}
    >
      {children}
      <p className="font-sans text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-bark" style={{ maxWidth: 320, position: 'relative' }}>
        {heading}
      </p>
      <p className="font-sans text-base font-medium leading-[1.5] text-bark-muted" style={{ maxWidth: 320, position: 'relative' }}>
        {description}
      </p>
    </div>
  );
}

export function About() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const rowTop = (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
      <BentoCard
        background="var(--color-surface-2)"
        heading="Kiekvienas antkaklis gaminamas rankomis"
        description="Aukščiausios kokybės BioThane šuns antkaklis"
        flex={isMobile ? '1' : '0 0 380px'}
      >
        <div aria-hidden="true" style={{ position: 'absolute', top: -70, right: -20, width: 230, height: 230, transform: 'rotate(-17deg)' }}>
          <Image src="/hero-figma/bento-collar-charm.png" alt="" fill sizes="230px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
      <BentoCard
        background="rgba(168,213,162,0.3)"
        heading="Personalizuojamas išskirtiniais pakabukais"
        description="Magnetiniai silikoniniai PawCharms pakabučiai — personalizuokite savo stiliumi"
        flex="1 0 0"
      >
        <div aria-hidden="true" style={{ position: 'absolute', top: -20, left: '2%', width: '48%', maxWidth: 220, aspectRatio: '1 / 1', transform: 'rotate(-34deg)' }}>
          <Image src="/hero-figma/bento-paw-print.png" alt="" fill sizes="220px" style={{ objectFit: 'contain' }} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', top: 6, right: '4%', width: '42%', maxWidth: 190, aspectRatio: '1 / 1', transform: 'rotate(-46deg)' }}>
          <Image src="/hero-figma/bento-letter-s.png" alt="" fill sizes="190px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const rowBottom = (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
      <BentoCard
        background="var(--color-cream)"
        heading="Atlaiko kiekvieną nuotykį"
        description="Atsparus vandeniui, purvui ir kasdienei avantiūrai"
        flex="1 0 0"
        align="start"
      >
        <div aria-hidden="true" style={{ position: 'absolute', right: -20, bottom: -30, top: 60, width: '68%' }}>
          <Image src="/hero-figma/bento-dog-photo.png" alt="Šuo su PawCharms antkakliu" fill sizes="340px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </BentoCard>
      <BentoCard
        background="var(--color-surface-2)"
        heading="Sukurkite antkaklį, kuris atspindi jūsų šunį"
        description="Rinkitės pavadėlį, kuris tobulai dera su jūsų šuns antkakliu"
        flex={isMobile ? '1' : '0 0 380px'}
        align="start"
      >
        <div aria-hidden="true" style={{ position: 'absolute', top: 60, left: '78%', width: 260, height: 260, transform: 'translateX(-50%) rotate(53deg)' }}>
          <Image src="/hero-figma/bento-leash-blue.png" alt="" fill sizes="260px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const brandPanel = (
    <div
      style={{
        flex: isMobile ? '1' : '0 0 340px',
        aspectRatio: isMobile ? '3 / 4' : undefined,
        minHeight: isMobile ? 'auto' : undefined,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--color-surface-2) 0%, var(--color-border) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: '55%', aspectRatio: '1.9 / 1' }}>
        <Image src="/pawcharms.svg" alt="PawCharms" fill sizes="240px" style={{ objectFit: 'contain' }} />
      </div>
    </div>
  );

  return (
    <section id="about" className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 16 : 24,
        }}>
          <p className="font-display" style={{ fontSize: isMobile ? 28 : 48, lineHeight: 1.2, color: 'var(--color-bark)', margin: 0 }}>
            Sukurta patogumui. Pritaikyta jūsų šuniui
          </p>
          <a
            href="/configure"
            className="whitespace-nowrap rounded-full bg-bark px-6 py-3 text-base font-medium text-white no-underline"
          >
            Sukurkite savo unikalų antkaklį →
          </a>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {isMobile ? (
            <>
              {rowTop}
              {brandPanel}
              {rowBottom}
            </>
          ) : (
            <>
              {/* Left — 2x2 bento */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 0 0', minWidth: 0 }}>
                {rowTop}
                {rowBottom}
              </div>

              {/* Right — brand tile */}
              {brandPanel}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
