'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';
import { Collar, ALL_CHARMS } from '@/lib/data';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';

interface CollarStageProps {
  collar: Collar;
  selectedCharms: (string | null)[];
  isDark: boolean;
  moveCharm: (fromIndex: number, toIndex: number) => void;
  onClearSlot: (slotIndex: number) => void;
  showGallery?: boolean;
}

function SortableSlot({
  slotIndex,
  charmId,
  slotSize,
  charmSize,
  onClear,
}: {
  slotIndex: number;
  charmId: string | null;
  slotSize: number;
  charmSize: number;
  onClear: () => void;
}) {
  const charm = charmId ? ALL_CHARMS.find(c => c.id === charmId) : null;
  const id = `slot-${slotIndex}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !charm });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: charm ? 'none' : undefined,
  } as React.CSSProperties;
  const showFilled = charm && !isDragging;

  return (
    <div
      ref={setNodeRef}
      className="relative flex items-center"
      {...(charm ? { ...attributes, ...listeners } : {})}
      style={{ ...style, cursor: showFilled ? 'grab' : 'default' }}
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center select-none"
        style={{
          width: slotSize,
          height: slotSize,
          background: showFilled ? charm!.bg : 'rgba(61,53,48,0.08)',
          border: `2px dashed ${showFilled ? 'transparent' : 'rgba(61,53,48,0.18)'}`,
          transition: 'background-color 250ms ease-out',
          WebkitUserSelect: 'none',
          boxShadow: showFilled ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        {showFilled ? (
          <img
            src={encodeURI(charm!.image)}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{ width: charmSize, height: charmSize, maxWidth: '120%', maxHeight: '120%', objectFit: 'contain' }}
          />
        ) : (
          <span className="text-lg" style={{ color: 'rgba(61,53,48,0.22)' }}>+</span>
        )}
      </div>
      {showFilled && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onClear(); }}
          aria-label="Remove charm"
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border-none p-0 z-10"
          style={{
            background: 'rgba(61,53,48,0.75)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 10,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function DragPreview({ charmId, slotSize, charmSize }: { charmId: string; slotSize: number; charmSize: number }) {
  const charm = ALL_CHARMS.find(c => c.id === charmId);
  if (!charm) return null;
  return (
    <div
      className="rounded-full flex items-center justify-center cursor-grabbing"
      style={{
        width: slotSize,
        height: slotSize,
        background: charm.bg,
        opacity: 0.95,
        transform: 'scale(1.12)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      }}
    >
      <img
        src={encodeURI(charm.image)}
        alt=""
        draggable={false}
        style={{ width: charmSize, height: charmSize, maxWidth: '120%', maxHeight: '120%', objectFit: 'contain' }}
      />
    </div>
  );
}

const COLLAR_GALLERY: Record<string, string[]> = {
  blossom: [
    '/In_a_minimalist_style_a_delicate_pink_hzs32ACd.webp',
    '/collar-pink.png',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  ],
  sage: [
    '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  ],
  sky: [
    '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
  ],
  honey: [
    '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    '/collar-yellow.png',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  ],
};

export function CollarStage({ collar, selectedCharms, moveCharm, onClearSlot, showGallery = true }: CollarStageProps) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const slotSize = isMobile ? 52 : 64;
  const charmSize = isMobile ? 120 : 150;
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveImg(0); }, [collar.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const slotIds = ['slot-0', 'slot-1', 'slot-2', 'slot-3', 'slot-4'];

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const fromIndex = slotIds.indexOf(active.id as string);
    const toIndex = slotIds.indexOf(over.id as string);
    if (fromIndex !== -1 && toIndex !== -1) moveCharm(fromIndex, toIndex);
  };

  const activeCharmId = activeId ? selectedCharms[slotIds.indexOf(activeId)] : null;
  const gallery = COLLAR_GALLERY[collar.id] ?? COLLAR_GALLERY.blossom;

  const ssrCharms = (
    <div className="flex items-center justify-center w-full" style={{ gap: isMobile ? 8 : 12 }}>
      {slotIds.map((_, i) => {
        const charm = selectedCharms[i] ? ALL_CHARMS.find(c => c.id === selectedCharms[i]) : null;
        return (
          <div
            key={i}
            className="flex-shrink-0 rounded-full flex items-center justify-center"
            style={{
              width: slotSize,
              height: slotSize,
              background: charm ? charm.bg : 'rgba(61,53,48,0.08)',
              border: `2px dashed ${charm ? 'transparent' : 'rgba(61,53,48,0.18)'}`,
              boxShadow: charm ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
            }}
          >
            {charm
              ? <img src={encodeURI(charm.image)} alt="" style={{ width: charmSize, height: charmSize, maxWidth: '120%', maxHeight: '120%', objectFit: 'contain' }} />
              : <span className="text-lg" style={{ color: 'rgba(61,53,48,0.22)' }}>+</span>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{ gap: isMobile ? 12 : 16, justifyContent: showGallery ? 'flex-start' : 'center' }}
    >

      {/* Main image area + vertical thumbnails */}
      {showGallery && (
        <div className="flex-1 flex gap-3 min-h-0">

          {/* Vertical thumbnail strip — desktop only */}
          {!isMobile && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View ${i + 1}`}
                  className="rounded-xl overflow-hidden flex-shrink-0 p-0 cursor-pointer outline-none"
                  style={{
                    width: 62,
                    height: 62,
                    border: `2px solid ${activeImg === i ? collar.color : 'rgba(61,53,48,0.12)'}`,
                    background: 'rgba(61,53,48,0.04)',
                    transition: 'border-color 200ms, transform 150ms',
                    transform: activeImg === i ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <img src={img} alt="" draggable={false} className="w-full h-full object-cover block" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              borderRadius: isMobile ? 16 : 20,
              background: `linear-gradient(160deg, ${collar.bgTint} 0%, rgba(42,30,24,0.5) 100%)`,
              minHeight: isMobile ? 260 : 0,
            }}
          >
            <img
              key={gallery[activeImg]}
              src={gallery[activeImg]}
              alt={`${collar.name} collar`}
              className="w-full h-full object-cover block"
            />
            <div
              className="absolute bottom-3.5 left-3.5 rounded-full font-sans font-bold uppercase"
              style={{
                background: collar.color,
                padding: '4px 14px',
                fontSize: 11,
                color: '#3D3530',
                letterSpacing: '0.08em',
              }}
            >
              {collar.name}
            </div>
          </div>
        </div>
      )}

      {/* Mobile thumbnails */}
      {showGallery && isMobile && (
        <div className="flex gap-2">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="rounded-[10px] overflow-hidden flex-shrink-0 p-0 cursor-pointer outline-none"
              style={{
                width: 56,
                height: 56,
                border: `2px solid ${activeImg === i ? collar.color : 'rgba(61,53,48,0.12)'}`,
              }}
            >
              <img src={img} alt="" draggable={false} className="w-full h-full object-cover block" />
            </button>
          ))}
        </div>
      )}

      {/* Charm strip */}
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{
          background: collar.color,
          borderRadius: isMobile ? 14 : 18,
          padding: isMobile ? '18px 16px' : '22px 24px',
          boxShadow: `0 0 40px ${collar.glowColor}55, 0 4px 16px rgba(0,0,0,0.12)`,
          transition: 'background-color 400ms, box-shadow 400ms',
          gap: 12,
        }}
      >
        {mounted ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={slotIds} strategy={horizontalListSortingStrategy}>
              <div className="flex items-center justify-center w-full" style={{ gap: isMobile ? 8 : 12 }}>
                {slotIds.map((id, i) => (
                  <SortableSlot
                    key={id}
                    slotIndex={i}
                    charmId={selectedCharms[i]}
                    slotSize={slotSize}
                    charmSize={charmSize}
                    onClear={() => onClearSlot(i)}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId && activeCharmId
                ? <DragPreview charmId={activeCharmId} slotSize={slotSize} charmSize={charmSize} />
                : null}
            </DragOverlay>
          </DndContext>
        ) : ssrCharms}
        <p className="font-sans uppercase m-0" style={{
          fontSize: 10,
          color: 'rgba(61,53,48,0.42)',
          letterSpacing: '0.06em',
        }}>
          Drag to reorder
        </p>
      </div>

    </div>
  );
}
