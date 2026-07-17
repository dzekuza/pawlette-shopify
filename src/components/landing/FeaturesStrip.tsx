'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR, type CharmSpec } from '@/lib/collar3d';

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
});

/** Brand palette (src/lib/shopify.ts COLOR_BG) — one colour per letter, for a colourful decorative mount. */
const FEATURES_CHARM_COLOURS = ['#F4B5C0', '#A8D5A2', '#B8D8F4', '#F9E4A0', '#D4B8F4'];
const FEATURES_CHARM_ITEMS: CharmSpec[] = 'PAW'.split('').map((ch, i) => ({
  meshKey: ch,
  colour: FEATURES_CHARM_COLOURS[i % FEATURES_CHARM_COLOURS.length],
  kind: 'letter' as const,
}));

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
          {LEFT_FEATURES.map((f, i) => (
            <Fragment key={f.title}>
              {i > 0 ? <div style={{ height: 1, width: '100%', background: 'rgba(61,53,48,0.15)' }} /> : null}
              <FeatureItem {...f} />
            </Fragment>
          ))}
        </div>

        <div style={{ position: 'relative', width: isMobile ? '100%' : 408, aspectRatio: '4 / 3', flexShrink: 0 }}>
          <Collar3DScene
            items={FEATURES_CHARM_ITEMS}
            strapColour={DEFAULT_STRAP_COLOUR}
            hardwareColour={HARDWARE_COLOUR}
            autoRotate
            interactive={false}
            fitMargin={1}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: isMobile ? '100%' : 300, flexShrink: 0 }}>
          {RIGHT_FEATURES.map((f, i) => (
            <Fragment key={f.title}>
              {i > 0 ? <div style={{ height: 1, width: '100%', background: 'rgba(61,53,48,0.15)' }} /> : null}
              <FeatureItem {...f} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
