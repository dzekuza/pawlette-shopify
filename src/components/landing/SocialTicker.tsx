'use client';

import { TICKER_ITEMS } from '@/lib/data';

const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

export function SocialTicker() {
  return (
    <div className="bg-bark h-9 overflow-hidden fixed top-0 left-0 right-0 z-[201] flex items-center">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="font-sans text-[13px] text-cream/65 px-8 inline-flex items-center gap-2 shrink-0">
            {t}
            <span className="w-1 h-1 rounded-full bg-cream/20 inline-block ml-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
