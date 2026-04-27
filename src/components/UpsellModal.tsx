'use client';

import { useState } from 'react';
import { type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify';

interface UpsellModalProps {
  collar: ShopifyCollar | null;
  charms: ShopifyCharm[];
  onClose: () => void;
  onAddCharms: (ids: string[]) => void;
}

export function UpsellModal({ collar, charms, onClose, onAddCharms }: UpsellModalProps) {
  const extras = charms.slice(5);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) =>
    setPicked(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" style={{ background: 'rgba(61,53,48,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="slide-up w-[480px] bg-cream rounded-[28px] relative" style={{ padding: '40px 40px 32px', boxShadow: '0 24px 80px rgba(61,53,48,0.2)' }}>
        <button
          onClick={onClose}
          className="absolute top-[18px] right-5 bg-transparent border-none cursor-pointer leading-none text-bark-muted"
          style={{ fontSize: 22 }}
        >
          ×
        </button>

        {/* Success indicator */}
        <div className="flex items-center gap-2.5 mb-6 rounded-xl border" style={{ padding: '12px 16px', background: '#eef7ee', borderColor: '#c8e8c4' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold flex-shrink-0" style={{ background: '#A8D5A2', fontSize: 14, color: '#2a5a25' }}>✓</div>
          <div>
            <div className="font-medium" style={{ fontSize: 14, color: '#2a5a25' }}>{collar?.title ?? ''} collar added to cart</div>
            <div style={{ fontSize: 12, color: '#5a9a55' }}>Your 5 included charms are ready to pick.</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="font-medium uppercase mb-2.5 text-bark-muted" style={{ fontSize: 11, letterSpacing: '0.08em' }}>Complete your set</div>
          <h2 className="text-bark mb-2" style={{ fontSize: 22, lineHeight: 1.2 }}>Add extra charms for €6 each.</h2>
          <p className="text-bark-light" style={{ fontSize: 14, lineHeight: 1.6 }}>Swap by mood, season, or occasion. Most owners buy 2–3 extras.</p>
        </div>

        <div className="grid grid-cols-4 gap-2.5 mb-6 overflow-y-auto" style={{ maxHeight: 200 }}>
          {extras.map(c => {
            const sel = picked.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className="rounded-[14px] cursor-pointer flex flex-col items-center gap-1 font-sans"
                style={{
                  background: c.bg,
                  border: sel ? '2.5px solid #3D3530' : '2.5px solid transparent',
                  padding: '12px 8px',
                  transform: sel ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 150ms',
                }}
              >
                {c.image
                  ? <img src={c.image} alt={c.title} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  : <span style={{ fontSize: 24 }}>✦</span>}
                <span className="font-medium uppercase" style={{ fontSize: 10, letterSpacing: '0.05em', color: 'rgba(61,53,48,0.6)' }}>{c.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 font-medium cursor-pointer rounded-full font-sans text-bark-light bg-white"
            style={{ fontSize: 14, padding: '13px', border: '2px solid #E8E3DC' }}
          >
            No thanks
          </button>
          <button
            onClick={() => { onAddCharms(picked); onClose(); }}
            className="flex-[2] font-medium cursor-pointer rounded-full border-none font-sans"
            style={{ fontSize: 14, padding: '13px', background: '#A8D5A2', color: '#2a5a25' }}
          >
            {picked.length > 0 ? `Add ${picked.length} charm${picked.length > 1 ? 's' : ''} — +€${picked.length * 6}` : 'Go to cart →'}
          </button>
        </div>
      </div>
    </div>
  );
}
