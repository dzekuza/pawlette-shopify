'use client';

import Image from 'next/image';
import { DisplayHeading } from '@/components/storefront/Typography';

const TIMELINE = [
  {
    week: 'Week 1',
    title: 'Nebijosi vandens ir purvo',
    desc: 'BioThane paviršius atlaiko lietų, balas ir purviną žolę — antkaklis lieka švarus po kiekvieno pasivaikščiojimo.',
  },
  {
    week: 'Week 4',
    title: 'Būsi išskirtinis',
    desc: 'Pakabukai keičiami per kelias sekundes — kiekvieną dieną galite sukurti naują stilių savo šuniui.',
  },
  {
    week: 'Week 8',
    title: 'Turėsi ilgaamžišką pavadėlį, antkaklį bei charmsus',
    desc: 'Medžiaga nesudyla ir neblunka — tas pats antkaklis liks kaip naujas dar ilgai po pirkimo.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-8 md:gap-16">
          <DisplayHeading as="h2" size="section" className="text-bark md:text-[48px]">
            Kas atsitiks po to kai įsigysi PawCharms?
          </DisplayHeading>

          <div className="relative flex justify-center py-6 lg:justify-end lg:py-10">
            <div className="relative h-[340px] w-[300px] md:h-[460px] md:w-[400px]">
              <div className="absolute left-0 top-2 h-[74%] w-[70%] -rotate-6 overflow-hidden rounded-[32px] shadow-[0_28px_56px_-24px_rgba(61,53,48,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-rotate-3">
                <Image src="/hero-figma/timeline-dog-1.jpg" alt="Šuo su PawCharms antkakliu" fill sizes="(min-width: 768px) 280px, 210px" className="object-cover" loading="eager" />
              </div>
              <div className="absolute bottom-2 right-0 h-[74%] w-[70%] rotate-3 overflow-hidden rounded-[28px] shadow-[0_32px_64px_-20px_rgba(61,53,48,0.4)] ring-4 ring-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-1">
                <Image src="/hero-figma/timeline-dog-2.png" alt="Šuo su akiniais ir PawCharms antkakliu" fill sizes="(min-width: 768px) 280px, 210px" className="object-cover" loading="eager" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full self-stretch bg-sage/15 lg:h-auto lg:w-px" />

        <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
          {TIMELINE.map((step) => (
            <div key={step.week} className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center rounded-full bg-sage/10 px-3 py-1.5 text-sm font-medium text-sage-dark">
                {step.week}
              </span>
              <p className="m-0 text-base font-semibold tracking-[-0.01em] text-bark-muted md:text-lg">
                {step.title}
              </p>
              <p className="m-0 text-sm leading-relaxed text-bark-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
