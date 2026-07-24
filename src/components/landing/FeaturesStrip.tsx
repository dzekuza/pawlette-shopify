'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { HARDWARE_COLOUR } from '@/lib/collar3d';

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
});

const STICKERS = {
  collar: '/hero-figma/hero-sticker-collar.png',
  paw: '/hero-figma/hero-sticker-paw.png',
  letterS: '/hero-figma/hero-sticker-s.png',
};

const FEATURES = [
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

export function FeaturesStrip() {
  return (
    <section 
      className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24"
      style={{ background: 'linear-gradient(180deg, #e3ecf5 0%, #b8d8f4 100%)' }}
    >
      {/* CSS Levitation Style Block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-levitate-features {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes float-collar-features {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
        .features-float-collar { animation: float-collar-features 4s ease-in-out infinite; }
        .features-float-sticker-1 { animation: float-levitate-features 3.2s ease-in-out infinite; }
        .features-float-sticker-2 { animation: float-levitate-features 3.6s ease-in-out infinite; }
        .features-float-sticker-3 { animation: float-levitate-features 4s ease-in-out infinite; }
      `}} />

      <div className="mx-auto max-w-[1200px] flex flex-col gap-16">
        
        {/* Top 3D Showcase Area with Stickers */}
        <div className="relative w-full aspect-[21/9] min-h-[340px] max-w-[1000px] mx-auto z-10">
          
          {/* Background Stickers */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="features-float-sticker-1 absolute left-[2%] top-[10%] w-[130px] -rotate-[17deg] md:w-[200px] md:left-[4%]">
              <Image src={STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" />
            </div>
            <div className="features-float-sticker-2 absolute right-[4%] top-[5%] w-[120px] rotate-[15deg] md:w-[170px]">
              <Image src={STICKERS.letterS} alt="" width={222} height={222} className="h-auto w-full" />
            </div>
            <div className="features-float-sticker-3 absolute right-[2%] top-[15%] w-[100px] -rotate-[23deg] md:w-[140px] md:right-[4%] md:top-[10%]">
              <Image src={STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
            </div>
          </div>

          {/* Live 3D Scene */}
          <div className="features-float-collar absolute inset-0 z-10">
            <Collar3DScene
              items={[]}
              strapColour="#B8D8F4"
              hardwareColour={HARDWARE_COLOUR}
              autoRotate
              interactive
              fitMargin={0.95}
            />
          </div>
        </div>

        {/* Bottom Features Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 z-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 font-sans">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm shadow-sm border border-white/20">
                <Image src={f.iconSrc} alt="" aria-hidden="true" width={22} height={22} />
              </div>
              <h3 className="m-0 text-lg font-bold leading-tight text-bark tracking-tight">
                {f.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-bark-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
