'use client';

import { useState } from 'react';
import { ALL_CHARMS } from '@/lib/data';

export function CharmGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCharm = ALL_CHARMS.find(c => c.id === selected);

  return (
    <section id="charms" className="bg-cream px-5 py-[60px] md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1160px]">

        {/* Header row */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-bark-muted">
              The charm collection
            </div>
            <h2 className="mb-4 font-display text-[40px] font-normal leading-[1.1] tracking-[-0.02em] text-bark md:text-[48px]">
              Your dog. Your style.
            </h2>
            <p className="max-w-[480px] font-sans text-base leading-[1.7] text-bark-light">
              Each charm clicks on in seconds and comes off just as easily. Collect them all, swap by
              mood, season, or occasion.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <button
              className="btn-press cursor-pointer rounded-full border-2 border-transparent bg-sage px-8 py-3.5 font-sans text-[15px] font-medium text-interactive-text transition-colors duration-150 ease-out hover:bg-[#8fc489]"
            >
              Shop all charms
            </button>
            {selectedCharm && (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: selectedCharm.bg }}
                >
                  <img src={encodeURI(selectedCharm.image)} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                </div>
                <div>
                  <div className="font-sans text-sm font-medium text-bark">{selectedCharm.name} charm</div>
                  <div className="font-sans text-xs text-bark-muted">€6 · snap-on · waterproof</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6-column charm grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {ALL_CHARMS.map(c => (
            <div
              key={c.id}
              data-animate="card"
              onClick={() => setSelected(c.id === selected ? null : c.id)}
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl"
              style={{
                background: c.bg,
                transition: 'transform 180ms ease-out, box-shadow 180ms ease-out, outline-color 120ms ease-out',
                outline: c.id === selected ? '3px solid #3D3530' : '3px solid transparent',
                outlineOffset: 3,
                transform: c.id === selected ? 'scale(1.08)' : 'scale(1)',
                boxShadow: c.id === selected ? '0 6px 20px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              <img
                src={encodeURI(c.image)}
                alt=""
                aria-hidden="true"
                className="h-[52px] w-[52px] object-contain lg:h-[70px] lg:w-[70px]"
              />
              <span className="font-sans text-[8px] font-medium uppercase tracking-[0.06em] text-bark/55 md:text-[10px]">
                {c.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
