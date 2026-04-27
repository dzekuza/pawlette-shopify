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
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px', borderRadius: 12,
      background: isDark ? 'rgba(249,228,160,0.08)' : 'rgba(249,228,160,0.3)',
      border: `1px solid ${isDark ? 'rgba(249,228,160,0.15)' : 'rgba(249,228,160,0.6)'}`,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e8a020', flexShrink: 0 }} />
        <span suppressHydrationWarning style={{ fontSize: 13, fontWeight: 500, color: isDark ? 'rgba(250,247,242,0.8)' : '#7a5010' }}>
          Only {count} {collar?.title ?? ''} sets left in stock
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A8D5A2', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
        <span suppressHydrationWarning style={{ fontSize: 12, color: isDark ? 'rgba(250,247,242,0.5)' : '#6B6460' }}>
          {viewers} people are viewing this right now
        </span>
      </div>
    </div>
  );
}
