'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { SectionIntro } from '@/components/storefront/SectionIntro';
import { TestimonialMediaCard } from '@/components/storefront/TestimonialCard';

const INTERVAL = 3000;

const stories = [
  { id: 1, author: 'Laima K.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', preview: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', quote: 'Prisisega per kelias sekundes ir net po purvinų pasivaikščiojimų vis dar atrodo kaip naujas.', rating: 5 },
  { id: 2, author: 'Marta S.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', preview: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', quote: 'Maudomės kas savaitę, o antkaklis išlieka švarus, minkštas ir patogus.', rating: 5 },
  { id: 3, author: 'Rūta P.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', preview: '/A_man_and_a_woman_sit_on_a_couch_with_a_small_wj6F8xDr.webp', quote: 'Užsakiau tris dovanoms. Ir pakuotė, ir kokybė tikrai nuostabios.', rating: 5 },
  { id: 4, author: 'Aistė J.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', preview: '/A_man_sits_at_an_outdoor_cafe_with_a_French_BfuQAh4h.webp', quote: 'Per mūsų kasdienį sustojimą kavinėje visada sulaukiame komplimentų.', rating: 4.9 },
  { id: 5, author: 'Monika T.', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=face', preview: '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp', quote: 'Pakankamai lengvas bėgimui ir pakankamai saugus pilnam sprintui.', rating: 5 },
  { id: 6, author: 'Greta N.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', preview: '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp', quote: 'Auksinės valandos nuotraukose Blossom rinkinys atrodo nerealiai.', rating: 5 },
  { id: 7, author: 'Tomas V.', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=80&h=80&fit=crop&crop=face', preview: '/A_man_and_a_woman_sit_on_a_couch_with_a_small_wj6F8xDr.webp', quote: 'Labai lengva pakeisti pakabukus savaitgalio ir darbo dienų deriniams.', rating: 4.8 },
  { id: 8, author: 'Eglė R.', avatar: 'https://images.unsplash.com/photo-1542204625-de293a6b4178?w=80&h=80&fit=crop&crop=face', preview: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', quote: 'Spalvos tobulos, o antkaklis patogus visai dienai.', rating: 5 },
  { id: 9, author: 'Karolis P.', avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=80&h=80&fit=crop&crop=face', preview: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', quote: 'Parkas, lietus ir zoomies — net po kelių savaičių jokio nusidėvėjimo.', rating: 5 },
];

const BTN_BASE: React.CSSProperties = {
  display: 'flex',
  width: 44,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: '1.5px solid var(--color-border)',
  background: 'var(--color-cream)',
  fontSize: 18,
  color: 'var(--color-bark)',
  cursor: 'pointer',
  transition: 'background 150ms ease-out, opacity 150ms ease-out',
};

export function Reviews() {
  const windowWidth = useWindowWidth() ?? 1200;

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const perPage = isMobile ? 1 : isTablet ? 2 : 3;
  const total = stories.length;
  const maxIndex = total - perPage;

  const cardW = isMobile ? 260 : isTablet ? 280 : 300;
  const gap = 16;

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startTimers = useCallback(() => {
    clearTimers();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      intervalRef.current = setInterval(() => {
        setIndex(i => (i >= maxIndex ? 0 : i + 1));
      }, INTERVAL);
    }
  }, [maxIndex]);

  useEffect(() => {
    startTimers();
    return clearTimers;
  }, [startTimers]);

  const go = (dir: 1 | -1) => {
    setIndex(i => Math.max(0, Math.min(maxIndex, i + dir)));
    startTimers();
  };

  return (
    <section style={{ padding: isMobile ? '60px 0' : '100px 0', background: 'var(--color-surface-2)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }}>
        <SectionIntro eyebrow='Klientų atsiliepimai' title='Patvirtinta šunų ir jų šeimininkų.' className='mb-12'>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {([[-1, '←'], [1, '→']] as const).map(([dir, label]) => {
              const disabled = dir === -1 ? index === 0 : index >= maxIndex;
              return (
                <button
                  key={label}
                  onClick={() => go(dir)}
                  disabled={disabled}
                  aria-label={dir === -1 ? 'Ankstesnis' : 'Kitas'}
                  style={{ ...BTN_BASE, opacity: disabled ? 0.3 : 1 }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </SectionIntro>

        {/* Slider */}
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              gap,
              transform: `translateX(-${index * (cardW + gap)}px)`,
              transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {stories.map(story => (
              <TestimonialMediaCard
                key={story.id}
                author={story.author}
                avatar={story.avatar}
                preview={story.preview}
                quote={story.quote}
                rating={story.rating}
                sizes='(max-width: 639px) 260px, (max-width: 1023px) 280px, 300px'
                style={{ width: cardW, aspectRatio: '3 / 4', flexShrink: 0 }}
              />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); startTimers(); }}
              aria-label={`Eiti į skaidrę ${i + 1}`}
              style={{ border: 'none', cursor: 'pointer', background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
            >
              <span
                style={{
                  height: 6,
                  width: i === index ? 20 : 6,
                  borderRadius: 3,
                  background: i === index ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)',
                  transition: 'width 250ms ease, background 250ms ease',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
