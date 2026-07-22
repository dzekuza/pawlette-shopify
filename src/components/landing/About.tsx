'use client';

import Image from 'next/image';
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography';

const HOVER_LIFT = '[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1'

function BentoCard({
  background,
  glow,
  bgImage,
  bgImageAlt,
  eyebrow,
  heading,
  description,
  align = 'end',
  className,
  children,
}: {
  background: string;
  /** Soft ambient colour behind the product cutout — grounds transparent PNGs instead of leaving them floating. */
  glow?: string;
  /** Full-bleed photo mode — renders as the card's background instead of a decorative cutout, with no text overlay. */
  bgImage?: string;
  bgImageAlt?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  align?: 'start' | 'end';
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-animate="card"
      className={`group relative flex min-w-0 flex-col gap-1 overflow-hidden rounded-[24px] ring-1 ring-bark/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${HOVER_LIFT} ${className ?? ''}`}
      style={{
        background,
        minHeight: 270,
        padding: bgImage ? 0 : 24,
        justifyContent: align === 'start' ? 'flex-start' : 'flex-end',
        boxShadow: '0 24px 48px -32px rgba(61,53,48,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      {bgImage ? (
        <Image
          src={bgImage}
          alt={bgImageAlt ?? ''}
          fill
          sizes="(max-width: 767px) 100vw, 380px"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
        />
      ) : null}
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: glow, width: 220, height: 220, top: '10%', right: '5%' }}
        />
      ) : null}
      {children}
      {heading || description ? (
        <div className="relative flex flex-col gap-2">
          {eyebrow ? <Eyebrow className="text-bark-muted/80">{eyebrow}</Eyebrow> : null}
          {heading ? (
            <p className="font-sans text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-bark" style={{ maxWidth: 320 }}>
              {heading}
            </p>
          ) : null}
          {description ? (
            <p className="font-sans text-base font-medium leading-[1.5] text-bark-muted" style={{ maxWidth: 320 }}>
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function About({ showCta = true }: { showCta?: boolean } = {}) {
  const rowTop = (
    <div className="flex flex-col gap-4 md:flex-row">
      <BentoCard
        background="var(--color-surface-2)"
        glow="radial-gradient(circle, rgba(184,216,244,0.55) 0%, rgba(184,216,244,0) 70%)"
        eyebrow="Rankų darbas"
        heading="Kiekvienas antkaklis gaminamas rankomis"
        description="Aukščiausios kokybės BioThane šuns antkaklis"
        className="md:basis-[380px] md:flex-none"
      >
        <div aria-hidden="true" className="absolute -right-5 -top-[70px] w-[230px] rotate-[-17deg] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-[-13deg]" style={{ height: 230 }}>
          <Image src="/hero-figma/bento-collar-charm.png" alt="" fill sizes="230px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
      <BentoCard
        background="rgba(168,213,162,0.3)"
        glow="radial-gradient(circle, rgba(249,228,160,0.6) 0%, rgba(249,228,160,0) 70%)"
        eyebrow="Personalizacija"
        heading="Personalizuojamas išskirtiniais pakabukais"
        description="Magnetiniai silikoniniai PawCharms pakabučiai — personalizuokite savo stiliumi"
        className="flex-1"
      >
        <div aria-hidden="true" className="absolute left-[4%] top-4 w-[30%] max-w-[130px] rotate-[-34deg] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-[-28deg]" style={{ aspectRatio: '1 / 1' }}>
          <Image src="/hero-figma/bento-paw-print.png" alt="" fill sizes="130px" style={{ objectFit: 'contain' }} />
        </div>
        <div aria-hidden="true" className="absolute right-[6%] top-3 w-[26%] max-w-[110px] rotate-[-46deg] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-[-40deg]" style={{ aspectRatio: '1 / 1' }}>
          <Image src="/hero-figma/bento-letter-s.png" alt="" fill sizes="110px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const rowBottom = (
    <div className="flex flex-col gap-4 md:flex-row">
      <BentoCard
        background="var(--color-cream)"
        bgImage="/hero-figma/bento-dog-leash-meadow.jpg"
        bgImageAlt="Šuo su geltonu pavadėliu ir personalizuotu antkakliu pievoje"
        className="flex-1"
      />
      <BentoCard
        background="var(--color-surface-2)"
        glow="radial-gradient(circle, rgba(184,216,244,0.55) 0%, rgba(184,216,244,0) 70%)"
        eyebrow="Derinys"
        heading="Sukurkite antkaklį, kuris atspindi jūsų šunį"
        description="Rinkitės pavadėlį, kuris tobulai dera su jūsų šuns antkakliu"
        className="md:basis-[380px] md:flex-none"
        align="start"
      >
        <div aria-hidden="true" className="absolute left-[78%] top-[60px] w-[260px] -translate-x-1/2 rotate-[53deg] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-[47deg]" style={{ height: 260 }}>
          <Image src="/hero-figma/bento-leash-blue.png" alt="" fill sizes="260px" style={{ objectFit: 'contain' }} />
        </div>
      </BentoCard>
    </div>
  );

  const brandPanel = (
    <div
      data-animate="card"
      className={`group relative flex items-center justify-center overflow-hidden rounded-[24px] ring-1 ring-bark/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${HOVER_LIFT} md:basis-[340px] md:flex-none`}
      style={{
        aspectRatio: '3 / 4',
        background: 'var(--color-surface-2)',
        boxShadow: '0 24px 48px -32px rgba(61,53,48,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      <video
        src="https://cdn.shopify.com/videos/c/o/v/eaad51df2ebc4bdd81140870ab6f1534.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
      />
    </div>
  );

  return (
    <section id="about" className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:gap-6">
          <div className="flex flex-col gap-3">
            <Eyebrow>Apie mus</Eyebrow>
            <DisplayHeading as="h2" size="section" className="text-bark md:text-[48px]">
              Šunų antkakliai su vardu.<br />Pritaikyti jūsų šuniui
            </DisplayHeading>
          </div>
          {showCta ? (
            <a
              href="/products/pawcharms-melynas-antkaklis"
              className="btn-press whitespace-nowrap rounded-full bg-bark px-6 py-3 text-base font-medium text-white no-underline transition-colors duration-150 ease-out hover:bg-bark/90"
            >
              Sukurkite savo unikalų antkaklį →
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            {rowTop}
            {rowBottom}
          </div>
          <div className="lg:hidden">
            {brandPanel}
          </div>
          <div className="hidden lg:block">
            {brandPanel}
          </div>
        </div>
      </div>
    </section>
  );
}
