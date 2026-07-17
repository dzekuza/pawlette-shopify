'use client';

import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DisplayHeading } from '@/components/storefront/Typography';

const TIMELINE = [
  {
    week: 'Savaitė 1',
    title: 'Nebijosi vandens ir purvo',
    desc: 'BioThane paviršius atlaiko lietų, balas ir purviną žolę — antkaklis lieka švarus po kiekvieno pasivaikščiojimo.',
  },
  {
    week: 'Savaitė 4',
    title: 'Būsi išskirtinis',
    desc: 'Pakabukai keičiami per kelias sekundes — kiekvieną dieną galite sukurti naują stilių savo šuniui.',
  },
  {
    week: 'Savaitė 8',
    title: 'Turėsi ilgaamžiškus pavadėlį, antkaklį bei pakabukus',
    desc: 'Medžiaga nesudyla ir neblunka — tas pats antkaklis liks kaip naujas dar ilgai po pirkimo.',
  },
];

export function HowItWorks() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="how" className="bg-white">
      <div
        className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:flex-row lg:items-center lg:gap-10"
      >
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: isMobile ? 32 : 80, minWidth: 0, width: '100%' }}>
          <DisplayHeading as="h2" size="section" className="text-bark md:text-[48px]">
            Kaip keisis jūsų kasdienybė?
          </DisplayHeading>

          <div style={{ position: 'relative', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
            <div style={{ position: 'relative', height: isMobile ? 300 : 380, width: isMobile ? 260 : 330 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: '62%', height: '68%', borderRadius: 40, overflow: 'hidden' }}>
                <Image src="/hero-figma/timeline-dog-1.jpg" alt="Šuo su PawCharms antkakliu" fill sizes="205px" style={{ objectFit: 'cover' }} loading="eager" />
              </div>
              <div style={{ position: 'absolute', right: 0, bottom: 0, width: '62%', height: '68%', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
                <Image src="/hero-figma/timeline-dog-2.png" alt="Šuo su akiniais ir PawCharms antkakliu" fill sizes="205px" style={{ objectFit: 'cover' }} loading="eager" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: isMobile ? '100%' : 1, height: isMobile ? 1 : 'auto', alignSelf: 'stretch', background: 'rgba(168,213,162,0.15)' }} />

        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0, width: '100%' }}>
          {TIMELINE.map((step) => (
            <div key={step.week} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  padding: '10px 15px',
                  borderRadius: 999,
                  background: 'rgba(168,213,162,0.1)',
                  color: 'var(--color-sage-dark)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {step.week}
              </span>
              <p style={{ fontSize: isMobile ? 20 : 25, fontWeight: 600, color: 'var(--color-bark)', letterSpacing: '-0.02em', margin: 0 }}>
                {step.title}
              </p>
              <p style={{ fontSize: 16, color: 'var(--color-bark-muted)', lineHeight: 1.5, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
