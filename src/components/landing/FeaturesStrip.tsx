'use client';

import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const LEFT_FEATURES = [
  {
    iconSrc: '/icons/droplet.svg',
    title: 'Atsparus vandeniui ir purvui',
    desc: 'BioThane paviršius lieka švarus ir nekvepia net po aktyviausio pasivaikščiojimo.',
  },
  {
    iconSrc: '/icons/timer.svg',
    title: 'Pakabukus keiskite per 5 sek.',
    desc: 'Tiesiog užmaukite ar numaukite pakabuką ir per akimirką pakeiskite antkaklio stilių.',
  },
  {
    iconSrc: '/icons/paint-board.svg',
    title: 'BioThane medžiaga, nedylanti spalva',
    desc: 'Patvari, lengvai nuvaloma medžiaga, kuri nesudyla, nesitrina ir išlaiko ryškią spalvą metų metus.',
  },
];

const RIGHT_FEATURES = [
  {
    iconSrc: '/icons/hand.svg',
    title: 'Rankų darbo Lietuvoje',
    desc: 'Kiekvienas antkaklis surenkamas Lietuvoje, rankomis — su dėmesiu kokybei ir kiekvienai detalei.',
  },
  {
    iconSrc: '/icons/resize.svg',
    title: 'Reguliuojamas dydis šuniui augant',
    desc: 'Vienas antkaklis tinka ilgai — lengvai reguliuojamas, kai jūsų šuo auga ar keičiasi jo svoris.',
  },
  {
    iconSrc: '/icons/return.svg',
    title: '30 dienų grąžinimo garantija',
    desc: 'Jei antkaklis netiks — grąžinkite jį per 30 dienų, be jokių papildomų klausimų.',
  },
];

function FeatureItem({ iconSrc, title, desc }: { iconSrc: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Image src={iconSrc} alt="" aria-hidden="true" width={24} height={24} />
      <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-bark)', letterSpacing: '-0.01em', margin: 0 }}>
        {title}
      </p>
      <p style={{ fontSize: 16, color: 'rgba(61,53,48,0.65)', lineHeight: 1.5, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}

export function FeaturesStrip() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section style={{ background: 'linear-gradient(180deg, #b9cbdb 0%, #b8d8f4 100%)' }}>
      <div
        className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-12 md:px-6 md:py-16"
        style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 24 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: isMobile ? '100%' : 300, flexShrink: 0 }}>
          {LEFT_FEATURES.map((f) => (
            <FeatureItem key={f.title} {...f} />
          ))}
        </div>

        <div style={{ position: 'relative', width: isMobile ? '100%' : 408, aspectRatio: '408 / 238', flexShrink: 0 }}>
          <Image src="/hero-figma/features-collar.png" alt="PawCharms antkaklis" fill sizes="(max-width: 767px) 100vw, 408px" style={{ objectFit: 'contain' }} loading="eager" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: isMobile ? '100%' : 300, flexShrink: 0 }}>
          {RIGHT_FEATURES.map((f) => (
            <FeatureItem key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
