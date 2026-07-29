'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function BentoSection({ isDark }: { isDark: boolean }) {
  const t = useTranslations('configure.bento');
  const materialTags = t.raw('material.tags') as string[];
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const bg = isDark ? '#2A1E18' : 'var(--color-surface-2)';

  return (
    <section 
      style={{ backgroundColor: bg }} 
      className="transition-colors duration-[250ms] ease-out"
    >
      {/* max-width lives here, not on the section */}
      <div className="max-w-[1200px] mx-auto py-8 px-4 md:py-16 md:px-12 flex flex-col gap-4">

        {/* Row 1 — Material + Origin */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Material */}
          <div className="flex-1 min-w-0 rounded-[20px] bg-sage p-[28px_24px] md:p-[40px_44px] flex flex-col justify-between gap-6">
            <div>
              <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-interactive-text/60 mb-3.5 font-sans">
                {t('material.label')}
              </div>
              <div className="font-display text-[clamp(1.875rem,1.5rem+1.5vw,2.5rem)] text-interactive-text leading-[1.02] md:leading-[1.05] tracking-[0.01em] mb-4">
                {t('material.headingLine1')}<br />{t('material.headingLine2')}
              </div>
              <div className="text-[15px] text-interactive-text/75 leading-[1.7]">
                {t('material.description')}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {materialTags.map(label => (
                <div key={label} className="bg-interactive-text/12 rounded-full py-1.5 px-3.5 text-[12px] font-medium text-interactive-text font-sans">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Origin */}
          <div className="flex-1 min-w-0 rounded-[20px] bg-bark p-[28px_24px] md:p-[40px_36px] flex flex-col gap-4">
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-cream/35 font-sans">
              {t('origin.label')}
            </div>
            <div className="font-display text-[clamp(1.875rem,1.5rem+1.5vw,2.5rem)] text-cream leading-[1.02] md:leading-[1.05] tracking-[0.01em]">
              {t('origin.headingLine1')}<br />{t('origin.headingLine2')}
            </div>
            <div className="text-[14px] text-cream/55 leading-[1.7]">
              {t('origin.description')}
            </div>
            <div className="text-[22px] font-medium text-cream/20 italic tracking-[-0.01em] mt-auto">
              {t('origin.tagline')}
            </div>
          </div>
        </div>

        {/* Row 2 — Sizing + Charm system + Care */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Charm system */}
          <div className="flex-1 min-w-0 rounded-[20px] bg-blossom p-[24px_20px] md:p-[32px_28px] flex flex-col justify-between gap-6">
            <div>
              <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-bark/45 mb-3.5 font-sans">
                {t('charmSystem.label')}
              </div>
              <div className="font-display text-[clamp(1.875rem,1.5rem+1.5vw,2.5rem)] text-bark/85 leading-[1.02] md:leading-[1.05] tracking-[0.01em] mb-2.5">
                {t('charmSystem.heading')}
              </div>
              <div className="text-[14px] text-bark/60 leading-[1.6]">
                {t('charmSystem.description')}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {['/charm-flower.png', '/charm-star.png', '/charm-heart.png', '/charm-paw.png'].map((src) => (
                <div key={src} className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center overflow-hidden p-1">
                  <Image src={src} alt="" width={36} height={36} className="w-full h-full object-contain" />
                </div>
              ))}
              <span className="text-[12px] text-bark/50 ml-1">{t('charmSystem.moreCount')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
