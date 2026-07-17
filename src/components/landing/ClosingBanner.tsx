'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function ClosingBanner() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section className="relative overflow-hidden bg-sky">
      <div style={{ position: 'relative', width: '100%', aspectRatio: isMobile ? '3 / 4' : '1240 / 676', minHeight: isMobile ? 420 : undefined }}>
        <Image
          src="/hero-figma/closing-banner.png"
          alt="PawCharms antkaklis su vardo pakabukais"
          fill
          sizes="100vw"
          className="object-cover"
          loading="eager"
        />
        <div
          className="mx-auto flex max-w-[1200px] items-end justify-between px-4 md:px-6"
          style={{ position: 'absolute', left: 0, right: 0, bottom: isMobile ? 24 : 48, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 24, alignItems: isMobile ? 'flex-start' : 'flex-end' }}
        >
          <p className="font-display" style={{ fontSize: isMobile ? 28 : 48, lineHeight: 1.2, color: 'var(--color-bark)', margin: 0 }}>
            Vienas antkaklis. Begalė stilių.
          </p>
          <Link
            href="/configure"
            className="whitespace-nowrap rounded-full bg-bark px-8 py-4 text-base font-medium text-white no-underline"
          >
            Atrask savo
          </Link>
        </div>
      </div>
    </section>
  );
}
