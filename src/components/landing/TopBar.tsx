'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD_EURO, NEWSLETTER_DISCOUNT_CODE, NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';
import ltMessages from '@/messages/lt.json';
import enMessages from '@/messages/en.json';

// TopBar is rendered on landing variants (/landing-v2, /landing-v3, /landing-v4)
// that sit outside the `[locale]` route segment and have no NextIntlClientProvider
// ancestor. Resolve copy from the static message bundles keyed by URL prefix,
// matching LandingNav and LandingFooter.
const TOPBAR_STRINGS = { lt: ltMessages.landing.topBar, en: enMessages.landing.topBar };
const COMMON_STRINGS = { lt: ltMessages.common, en: enMessages.common };

export function TopBar() {
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const t = TOPBAR_STRINGS[locale];
  const tCommon = COMMON_STRINGS[locale];
  const slides = t.slides;
  const [taglineIndex, setTaglineIndex] = useState(0);
  const shippingCopy = tCommon.freeShipping.replace('{threshold}', String(FREE_SHIPPING_THRESHOLD_EURO));

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToTagline = (dir: 1 | -1) => {
    setTaglineIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const renderSlide = (template: string) =>
    template
      .replace('{discountPercent}', String(NEWSLETTER_DISCOUNT_PERCENT))
      .replace('{discountCode}', NEWSLETTER_DISCOUNT_CODE)
      .replace('{shippingCopy}', shippingCopy);

  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-sage px-4 text-center">
      <button
        type="button"
        aria-label={t.prevSlide}
        onClick={() => goToTagline(-1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronLeft className="size-3.5" />
      </button>

      <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-tomato text-sm font-medium tracking-[0.02em] text-interactive-text">
        {renderSlide(slides[taglineIndex])}
      </p>

      <button
        type="button"
        aria-label={t.nextSlide}
        onClick={() => goToTagline(1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}
