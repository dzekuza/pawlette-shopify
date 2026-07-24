'use client';

import dynamic from 'next/dynamic';
import type { PawCharmsWordmarkSceneProps } from './PawCharmsWordmarkScene';

const PawCharmsWordmarkScene = dynamic(
  () => import('./PawCharmsWordmarkScene').then((m) => m.PawCharmsWordmarkScene),
  { ssr: false }
);

export type PawCharmsWordmarkProps = Pick<PawCharmsWordmarkSceneProps, 'variant'>;

/** "PAWCHARMS" spelled out in 3D charm letters, floating over the cream background. */
export function PawCharmsWordmark({ variant }: PawCharmsWordmarkProps) {
  return (
    <section className="relative mx-auto w-full max-w-[1920px] overflow-hidden bg-cream">
      <div className="relative aspect-[1920/500] w-full">
        <PawCharmsWordmarkScene variant={variant} className="absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}
