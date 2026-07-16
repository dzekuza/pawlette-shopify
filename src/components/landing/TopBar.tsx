'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FREE_SHIPPING_COPY, NEWSLETTER_DISCOUNT_CODE, NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';

const TAGLINE_SLIDES = [
  `${NEWSLETTER_DISCOUNT_PERCENT}% nuolaida pirmam užsakymui su kodu ${NEWSLETTER_DISCOUNT_CODE}`,
  `${FREE_SHIPPING_COPY} · siunčiama iš Vilniaus 🇱🇹`,
  'Pakabukus pakeisite per 5 sekundes ir be jokių įrankių',
  'BioThane medžiaga – atspari vandeniui, purvui ir dilimui',
  'Personalizuok pakabukais ir sukurk unikalų antkaklio dizainą',
];

export function TopBar() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINE_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToTagline = (dir: 1 | -1) => {
    setTaglineIndex((i) => (i + dir + TAGLINE_SLIDES.length) % TAGLINE_SLIDES.length);
  };

  return (
    <div className="flex items-center justify-center gap-3 bg-sage px-4 py-2 text-center">
      <button
        type="button"
        aria-label="Ankstesnis šūkis"
        onClick={() => goToTagline(-1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronLeft className="size-3.5" />
      </button>

      <p className="font-tomato text-sm font-medium tracking-[0.02em] text-interactive-text">
        {TAGLINE_SLIDES[taglineIndex]}
      </p>

      <button
        type="button"
        aria-label="Kitas šūkis"
        onClick={() => goToTagline(1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}
