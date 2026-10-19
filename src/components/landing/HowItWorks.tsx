'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { DisplayHeading } from '@/components/storefront/Typography';

// Fanned photo stack: later entries sit on top. Straightens slightly on hover.
const PHOTO_CARDS = [
  { src: '/hero-figma/timeline-dog-1.jpg', altKey: 'dog1Alt', className: 'left-0 top-0 -rotate-6 rounded-[28px] hover:-rotate-3' },
  { src: '/hero-figma/timeline-dog-3.jpg', altKey: 'dog3Alt', className: 'right-0 top-6 rotate-4 rounded-[28px] ring-4 ring-white hover:rotate-2' },
  { src: '/hero-figma/timeline-dog-4.jpg', altKey: 'dog4Alt', className: 'bottom-0 left-[4%] -rotate-3 rounded-[28px] ring-4 ring-white hover:-rotate-1' },
  { src: '/hero-figma/timeline-dog-2.png', altKey: 'dog2Alt', className: 'bottom-4 right-[2%] rotate-6 rounded-[28px] ring-4 ring-white hover:rotate-3' },
] as const;

interface TimelineStep {
  week: string;
  title: string;
  desc: string;
}

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks');
  const timeline = t.raw('timeline') as TimelineStep[];

  return (
    <section id="how" className="bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Left: heading + photo pair, pinned while the timeline scrolls */}
        <div className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
          <DisplayHeading as="h2" size="section" className="max-w-[16ch] text-bark">
            {t('heading')}
          </DisplayHeading>

          <div className="relative h-[400px] w-[320px] md:h-[540px] md:w-[460px]">
            {PHOTO_CARDS.map((card) => (
              <div
                key={card.src}
                className={cn(
                  'absolute h-[56%] w-[48%] overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  card.className,
                )}
              >
                <Image src={card.src} alt={t(card.altKey)} fill sizes="(min-width: 768px) 220px, 154px" className="object-cover" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: vertical timeline — one rail, a node per step */}
        <ol className="relative m-0 flex list-none flex-col gap-12 p-0 pl-10 lg:gap-16 lg:pt-3">
          <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-sage via-bark/15 to-bark/5" />
          {timeline.map((step, i) => {
            const isLast = i === timeline.length - 1;
            return (
              <li key={step.week} data-animate="card" className="relative flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white',
                    isLast ? 'bg-sage' : 'bg-sage/40',
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', isLast ? 'bg-interactive-text' : 'bg-sage')} />
                  {isLast && <span className="absolute inset-0 animate-ping rounded-full bg-sage/50 [animation-duration:2.4s]" />}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-interactive-text">
                  {step.week}
                </span>
                <h3 className="m-0 font-display text-2xl font-medium leading-[1.15] tracking-[-0.01em] text-bark md:text-[30px]">
                  {step.title}
                </h3>
                <p className="m-0 max-w-[46ch] text-base leading-relaxed text-bark-light">
                  {step.desc}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
