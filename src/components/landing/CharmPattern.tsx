'use client';

import dynamic from 'next/dynamic';

const CharmPatternScene = dynamic(
  () => import('./CharmPatternScene').then((m) => m.CharmPatternScene),
  { ssr: false }
);

/**
 * 1920x1080 reference canvas of levitating charms on a transparent
 * background, sitting directly under the hero. Scales down responsively
 * (aspect-ratio locked) rather than cropping on smaller viewports.
 *
 * Top/bottom edges fade to the page's cream background so the canvas reads
 * as an open field of charms rather than a hard-edged panel.
 */
export function CharmPattern() {
  return (
    <section className="relative mx-auto w-full max-w-[1920px] overflow-hidden bg-cream">
      <div className="relative aspect-[1920/1080] w-full">
        <CharmPatternScene count={48} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-cream to-transparent" />
      </div>
    </section>
  );
}
