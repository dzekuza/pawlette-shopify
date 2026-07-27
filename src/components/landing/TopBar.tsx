'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FREE_SHIPPING_COPY, NEWSLETTER_DISCOUNT_CODE, NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';

export function TopBar() {
  const t = useTranslations('landing.topBar');
  const slides = t.raw('slides') as string[];
  const [taglineIndex, setTaglineIndex] = useState(0);

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
      .replace('{shippingCopy}', FREE_SHIPPING_COPY);

  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-sage px-4 text-center">
      <button
        type="button"
        aria-label={t('prevSlide')}
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
        aria-label={t('nextSlide')}
        onClick={() => goToTagline(1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}
