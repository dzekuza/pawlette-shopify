'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const STAR_ICON = '/Dog_Collar_Flat_Lay_A_yellow_star_with_a_soft_green_outline_floats_HzBh2qMJ Background Removed.png';
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

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <img key={i} src={encodeURI(STAR_ICON)} alt="" aria-hidden className="w-4 h-4 object-contain" />
      ))}
      <span className="font-sans text-xs font-semibold text-white/90 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export function Reviews() {
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindowWidth(window.innerWidth);
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const perPage = isMobile ? 1 : isTablet ? 2 : 3;
  const total = stories.length;
  const maxIndex = total - perPage;

  const cardW = isMobile ? 260 : isTablet ? 280 : 300;
  const gap = 16;

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const startTimers = useCallback(() => {
    clearTimers();
    const tickMs = 30;
    progressRef.current = setInterval(() => {}, tickMs);
    intervalRef.current = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1));
    }, INTERVAL);
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
    <section className="py-[60px] md:py-[100px] bg-surface-2 overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-bark-muted mb-3.5">
              Klientų atsiliepimai
            </div>
            <h2 className="font-sans text-[30px] md:text-[40px] font-medium tracking-[-0.02em] text-bark m-0">
              Patvirtinta šunų ir jų šeimininkų.
            </h2>
          </div>
          {/* Arrows */}
          <div className="flex gap-2.5 shrink-0">
            {([[-1, '←'], [1, '→']] as const).map(([dir, label]) => (
              <button
                key={label}
                onClick={() => go(dir)}
                disabled={dir === -1 ? index === 0 : index >= maxIndex}
                aria-label={dir === -1 ? 'Ankstesnis' : 'Kitas'}
                className={cn(
                  'w-11 h-11 rounded-full border-[1.5px] border-border bg-white cursor-pointer text-[18px] text-bark',
                  'flex items-center justify-center transition-[background,opacity] duration-150',
                  'hover:enabled:bg-surface-2',
                  (dir === -1 ? index === 0 : index >= maxIndex) ? 'opacity-30' : 'opacity-100'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              gap,
              transform: `translateX(-${index * (cardW + gap)}px)`,
            }}
          >
            {stories.map(story => (
              <div
                key={story.id}
                className="shrink-0 rounded-[20px] overflow-hidden relative"
                style={{ width: cardW, aspectRatio: '3/4' }}
              >
                <img src={story.preview} alt={story.author} className="w-full h-full object-cover block" />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.1)_50%,transparent_100%)]" />
                {/* content */}
                <div className="absolute bottom-0 left-0 right-0 p-[20px_18px]">
                  <StarRow rating={story.rating} />
                  <p className="font-sans my-2 mb-3.5 text-[13px] leading-[1.5] text-white/[0.92]">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <img src={story.avatar} alt={story.author} className="w-7 h-7 rounded-full object-cover border-2 border-white/50" />
                    <span className="font-sans text-xs font-medium text-white/80">{story.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-1.5 justify-center mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); startTimers(); }}
              aria-label={`Eiti į skaidrę ${i + 1}`}
              className="h-1.5 rounded-[3px] border-none cursor-pointer p-0 transition-[width,background] duration-[250ms] ease-[ease]"
              style={{
                width: i === index ? 20 : 6,
                background: i === index ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
