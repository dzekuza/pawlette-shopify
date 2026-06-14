'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { getCharms, type ShopifyCharm } from '@/lib/shopify';
import { addLinesToCart } from '@/lib/cart';
import { Eyebrow } from '@/components/storefront/Typography';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ROWS_DEFAULT = 3;
const MAX_CHARMS = 5;

function SortableCharmSlot({ id, charm, onRemove }: { id: string; charm: ShopifyCharm | null; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onRemove}
      title={charm?.title}
      style={{
        flex: 1,
        aspectRatio: '1/1',
        maxWidth: 64,
        borderRadius: 16,
        border: charm ? '2px solid var(--color-bark)' : '2px dashed rgba(61,53,48,0.2)',
        background: charm ? (charm.bg || '#EEE') + '44' : 'rgba(61,53,48,0.04)',
        cursor: charm ? 'grab' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
      }}
    >
      {charm?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={charm.image} alt={charm.title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
      ) : (
        <span style={{ fontSize: 18, color: 'rgba(61,53,48,0.2)', pointerEvents: 'none' }}>+</span>
      )}
    </div>
  );
}

const COLLAR_SLUG = 'collar-pawlette-collar';
const CHARMS_SLUG = 'charm-charms';

export function CharmGrid() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const cols = w < 640 ? 5 : w < 1024 ? 7 : 8;
  const router = useRouter();

  const [charms, setCharms] = useState<ShopifyCharm[]>([]);
  const [selectedCharms, setSelectedCharms] = useState<(ShopifyCharm | null)[]>([null, null, null, null, null]);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [query, setQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    getCharms().then(items => setCharms(items));
  }, []);

  const toggleCharm = (charm: ShopifyCharm) => {
    setSelectedCharms(prev => {
      const idx = prev.findIndex(c => c?.id === charm.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = null;
        return next;
      }
      const empty = prev.findIndex(c => c === null);
      if (empty === -1) return prev; // all 5 slots full
      const next = [...prev];
      next[empty] = charm;
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedCharms(prev => {
        const oldIndex = prev.findIndex((_, i) => `slot-${i}` === active.id);
        const newIndex = prev.findIndex((_, i) => `slot-${i}` === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const selectedCount = selectedCharms.filter(Boolean).length;

  async function handleAddToCart() {
    if (!selectedCount || adding) return;
    setAdding(true);
    try {
      const lines = (selectedCharms.filter(Boolean) as ShopifyCharm[]).map(c => ({
        merchandiseId: c.variantId,
        quantity: 1,
      }));
      await addLinesToCart(lines);
      router.push(`/products/${CHARMS_SLUG}`);
    } finally {
      setAdding(false);
    }
  }

  const uniqueColors = useMemo(() => {
    const seen = new Map<string, string>();
    const COLOR_LABELS: Record<string, string> = {
      '#B8D8F4': 'Mėlyna',
      '#A8D5A2': 'Žalia',
      '#F4B5C0': 'Rožinė',
      '#F9E4A0': 'Geltona',
      '#D4B8F4': 'Violetinė',
    };
    charms.forEach(c => {
      if (c.bg && !seen.has(c.bg)) seen.set(c.bg, COLOR_LABELS[c.bg] ?? c.color);
    });
    return Array.from(seen.entries()).map(([bg, label]) => ({ bg, label }));
  }, [charms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return charms.filter(c => {
      if (colorFilter && c.bg !== colorFilter) return false;
      if (!q) return true;
      return (
        (c.baseTitle || c.title).toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.color.toLowerCase().includes(q)
      );
    });
  }, [charms, query, colorFilter]);

  useEffect(() => { setExpanded(false); }, [query, colorFilter]);

  const maxVisible = cols * ROWS_DEFAULT;
  const visible = expanded ? filtered : filtered.slice(0, maxVisible);
  const hasMore = !expanded && filtered.length > maxVisible;
  const selectedIds = new Set(selectedCharms.filter(Boolean).map(c => c!.id));

  if (charms.length === 0) return null;

  const productGallery = charms[0]?.productImages?.slice(0, 5) ?? [];
  const featuredImage = charms[0]?.productFeaturedImage || '';
  const allGalleryImages = featuredImage
    ? [featuredImage, ...productGallery.filter(u => u !== featuredImage)].slice(0, 5)
    : productGallery;

  return (
    <section id="charms" style={{ background: 'var(--color-cream)', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '80px 48px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 0.7fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'start',
        }}>

          {/* LEFT — Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}>
              {allGalleryImages.slice(0, 4).map((url, i) => (
                <div
                  key={url}
                  style={{
                    borderRadius: i === 0 ? '20px 10px 10px 10px' : i === 1 ? '10px 20px 10px 10px' : i === 2 ? '10px 10px 10px 20px' : '10px 10px 20px 10px',
                    overflow: 'hidden',
                    aspectRatio: '1 / 1',
                    background: '#f5f3f0',
                  }}
                >
                  <img src={url} alt={`Nuotrauka ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Info + Selector */}
          <div style={{ paddingTop: isMobile ? 0 : 8, display: 'flex', flexDirection: 'column' }}>
            <Eyebrow className="mb-3">Pakabukų kolekcija</Eyebrow>

            <h2 style={{
              fontFamily: "'Luckiest Guy', 'DM Sans', sans-serif",
              fontSize: 'clamp(30px, 3.5vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'var(--color-bark)',
              margin: 0,
            }}>
              Tavo šuo.<br />Tavo stilius.
            </h2>

            <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.7, color: 'var(--color-bark-muted)', maxWidth: 480 }}>
              Kiekvienas pakabukas prisisega per kelias sekundes ir taip pat lengvai nusiima. Rink, derink ir keisk pagal nuotaiką, sezoną ar progą.
            </p>

            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Keičiamas per ~5 sekundes', 'Tinka visiems antkaklių rinkiniams', '25+ variantų'].map(point => (
                <span key={point} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 999,
                  padding: '7px 12px',
                  background: 'rgba(61,53,48,0.045)',
                  color: '#6B6460',
                  fontSize: 12,
                  fontWeight: 500,
                }}>
                  {point}
                </span>
              ))}
            </div>

            {/* Charm selector */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(61,53,48,0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <Eyebrow>Rinktis pakabuką</Eyebrow>
                <span style={{ fontSize: 12, color: '#9B948F', fontWeight: 500 }}>
                  {selectedCount}/{MAX_CHARMS}
                </span>
              </div>

              {/* 5-slot sortable preview */}
              <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedCharms.map((_, i) => `slot-${i}`)} strategy={horizontalListSortingStrategy}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {selectedCharms.map((charm, i) => (
                      <SortableCharmSlot key={`slot-${i}`} id={`slot-${i}`} charm={charm} onRemove={() => charm && toggleCharm(charm)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Color filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                <button
                  onClick={() => setColorFilter(null)}
                  style={{
                    border: colorFilter === null ? '2px solid var(--color-bark)' : '2px solid rgba(61,53,48,0.15)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: colorFilter === null ? 'var(--color-bark)' : 'transparent',
                    color: colorFilter === null ? 'var(--color-cream)' : 'var(--color-bark)',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'background-color 150ms ease-out, color 150ms ease-out',
                  }}
                >
                  Visi
                </button>
                {uniqueColors.map(({ bg, label }) => (
                  <button
                    key={bg}
                    onClick={() => setColorFilter(colorFilter === bg ? null : bg)}
                    title={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      border: colorFilter === bg ? '2px solid var(--color-bark)' : '2px solid rgba(61,53,48,0.15)',
                      borderRadius: 999,
                      padding: '4px 10px 4px 6px',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: 'transparent',
                      color: 'var(--color-bark)',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'border-color 150ms ease-out',
                    }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: bg, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <svg
                  width="15" height="15" viewBox="0 0 15 15" fill="none"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9B948F' }}
                >
                  <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Ieškoti pakabuko..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: 36,
                    paddingRight: query ? 36 : 12,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(61,53,48,0.15)',
                    background: '#fff',
                    fontSize: 14,
                    color: 'var(--color-bark)',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 2,
                      color: '#9B948F',
                      fontSize: 16,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <p style={{ fontSize: 14, color: '#9B948F', padding: '12px 0' }}>Nieko nerasta.</p>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 8,
                  }}>
                    {visible.map(charm => {
                      const isSel = selectedIds.has(charm.id);
                      const isFull = selectedCount >= MAX_CHARMS && !isSel;
                      return (
                        <button
                          key={charm.id}
                          onClick={() => !isFull && toggleCharm(charm)}
                          title={charm.baseTitle || charm.title}
                          style={{
                            border: 'none',
                            padding: 0,
                            cursor: isFull ? 'not-allowed' : 'pointer',
                            background: charm.bg || '#EEE',
                            aspectRatio: '1 / 1',
                            borderRadius: 10,
                            overflow: 'hidden',
                            position: 'relative',
                            outline: isSel ? '2.5px solid var(--color-bark)' : '2.5px solid transparent',
                            outlineOffset: 1,
                            opacity: isFull ? 0.4 : 1,
                            transition: 'outline-color 0.15s, opacity 0.15s',
                          } as React.CSSProperties}
                        >
                          {charm.image ? (
                            <img src={charm.image} alt={charm.baseTitle || charm.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 12, boxSizing: 'border-box' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 18 }}>
                              {charm.title.match(/[\u{1F300}-\u{1FFFF}]/u)?.[0] ?? '✨'}
                            </div>
                          )}
                          {isSel && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(61,53,48,0.18)',
                            }}>
                              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                                <path d="M1.5 5.5l3.5 3.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {hasMore && (
                    <button
                      onClick={() => setExpanded(true)}
                      style={{
                        marginTop: 10,
                        width: '100%',
                        border: '1px solid rgba(61,53,48,0.18)',
                        background: 'transparent',
                        borderRadius: 10,
                        padding: '10px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--color-bark)',
                        cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Rodyti visus ({filtered.length - maxVisible} daugiau)
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Add to cart */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleAddToCart}
                disabled={!selectedCount || adding}
                style={{
                  width: '100%',
                  background: selectedCount ? 'var(--color-bark)' : '#E8E3DC',
                  color: selectedCount ? 'var(--color-cream)' : '#9B948F',
                  border: 'none',
                  borderRadius: 14,
                  padding: '16px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: selectedCount && !adding ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background-color 200ms ease-out',
                  letterSpacing: '-0.01em',
                }}
              >
                {adding
                  ? 'Apdorojama...'
                  : selectedCount
                    ? `Užsakyti su ${selectedCount} pakabuk${selectedCount > 1 ? 'ais' : 'u'} →`
                    : 'Pasirinkite iki 5 pakabukų'}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`/products/${COLLAR_SLUG}`}
                  style={{
                    flex: 1,
                    display: 'block',
                    textAlign: 'center',
                    padding: '11px 16px',
                    border: '1.5px solid rgba(61,53,48,0.18)',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-bark)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Antkaklio produktas →
                </a>
                <a
                  href={`/products/${CHARMS_SLUG}`}
                  style={{
                    flex: 1,
                    display: 'block',
                    textAlign: 'center',
                    padding: '11px 16px',
                    border: '1.5px solid rgba(61,53,48,0.18)',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-bark)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Visi pakabukai →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
