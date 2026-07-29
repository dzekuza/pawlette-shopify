'use client';

import { useState, useEffect } from 'react';
import type { ShopifyCollar } from '@/lib/shopify';

export function UrgencyBar({ collar, isDark }: { collar: ShopifyCollar | null; isDark: boolean }) {
  const [count, setCount] = useState(5);
  const [viewers, setViewers] = useState(9);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(Math.floor(Math.random() * 8) + 3);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewers(Math.floor(Math.random() * 12) + 6);
  }, []);

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border mb-4 ${
      isDark ? 'bg-honey/8 border-honey/15' : 'bg-honey/30 border-honey/60'
    }`}>
      <div className="flex items-center gap-2">
        <div className="w-[7px] h-[7px] rounded-full bg-honey shrink-0" />
        <span suppressHydrationWarning className={`text-[13px] font-medium ${
          isDark ? 'text-cream/80' : 'text-bark'
        }`}>
          Liko tik {count} rink. {collar?.title ?? ''} sandėlyje
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[7px] h-[7px] rounded-full bg-sage shrink-0 animate-pulse" />
        <span suppressHydrationWarning className={`text-[12px] ${
          isDark ? 'text-cream/50' : 'text-bark-light'
        }`}>
          Dabar šį produktą žiūri {viewers} žmonės
        </span>
      </div>
    </div>
  );
}
