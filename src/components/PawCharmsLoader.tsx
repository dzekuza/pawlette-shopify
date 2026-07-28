'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const PawCharmsWordmarkScene = dynamic(
  () => import('./landing/PawCharmsWordmarkScene').then((m) => m.PawCharmsWordmarkScene),
  {
    ssr: false,
    // Plain CSS bounce while the R3F chunk + charms.glb are still loading, so there's
    // never a blank frame — same "bouncing dots" read as the 3D animation it hands off to.
    loading: () => (
      <div className="flex h-full w-full items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-bounce rounded-full bg-sage"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    ),
  }
);

export type PawCharmsLoaderProps = {
  className?: string;
  /** Renders as a fixed full-screen overlay (route transitions) instead of filling its parent. */
  fullScreen?: boolean;
};

/** "PAWCHARMS" bouncing in a travelling wave — the site's loading indicator. */
export function PawCharmsLoader({ className, fullScreen }: PawCharmsLoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-cream',
        fullScreen ? 'fixed inset-0 z-50' : 'h-full w-full',
        className
      )}
    >
      <div className="aspect-[16/7] w-full max-w-[640px]">
        <PawCharmsWordmarkScene variant="loading" className="h-full w-full" />
      </div>
    </div>
  );
}
