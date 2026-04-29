'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { getCharms, type ShopifyCharm } from '@/lib/shopify';
import { addLineToCart } from '@/lib/cart';
import { Eyebrow } from '@/components/storefront/Typography';

const ROWS_DEFAULT = 3;

export function CharmGrid() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const cols = isMobile ? 6 : 8;

  const [charms, setCharms] = useState<ShopifyCharm[]>([]);
  const [selected, setSelected] = useState<ShopifyCharm | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [query, setQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    getCharms().then(items => {
      setCharms(items);
      if (items.length > 0) setSelected(items[0]);
    });
  }, []);

  async function handleAddToCart() {
    if (!selected || adding) return;
    setAdding(true);
    try {
      await addLineToCart(selected.variantId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } finally {
      setAdding(false);
    }
  }

  // Derive unique colors from actual charm data
  const uniqueColors = useMemo(() => {
    const seen = new Map<string, string>(); // bg -> label
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

  // Reset expanded when filters change
  useEffect(() => { setExpanded(false); }, [query, colorFilter]);

  const maxVisible = cols * ROWS_DEFAULT;
  const visible = expanded ? filtered : filtered.slice(0, maxVisible);
  const hasMore = !expanded && filtered.length > maxVisible;

  if (charms.length === 0) return null;

  // Product-level gallery (same for all charms — use first charm's images)
  const productGallery = charms[0]?.productImages?.slice(0, 5) ?? [];
  const featuredImage = charms[0]?.productFeaturedImage || '';
  const allGalleryImages = featuredImage
    ? [featuredImage, ...productGallery.filter(u => u !== featuredImage)].slice(0, 5)
    : productGallery;
  const mainImage = allGalleryImages[galleryIndex] || featuredImage;

  const galleryBg = selected?.bg || '#EEE';

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
            {/* Product gallery — 2×2 grid, max 4 images */}
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
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: isMobile ? 34 : 44,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'var(--color-bark)',
              margin: 0,
            }}>
              Tavo šuo.<br />Tavo stilius.
            </h2>

            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: '#8f8680', maxWidth: 480 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Eyebrow>Pasirinkite pakabuką</Eyebrow>
                {selected && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)' }}>
                    {selected.baseTitle || selected.title}
                  </span>
                )}
              </div>

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
                    transition: 'all 0.15s',
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
                      transition: 'border-color 0.15s',
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
                      const isSel = selected?.id === charm.id;
                      return (
                        <button
                          key={charm.id}
                          onClick={() => setSelected(charm)}
                          title={charm.baseTitle || charm.title}
                          style={{
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            background: charm.bg || '#EEE',
                            aspectRatio: '1 / 1',
                            borderRadius: 10,
                            overflow: 'hidden',
                            position: 'relative',
                            outline: isSel ? '2.5px solid var(--color-bark)' : '2.5px solid transparent',
                            outlineOffset: 1,
                            transition: 'outline-color 0.15s',
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
            <div style={{ marginTop: 16 }}>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                style={{
                  width: '100%',
                  background: added ? '#4CAF50' : 'var(--color-bark)',
                  color: 'var(--color-cream)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '16px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: adding ? 'wait' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 0.2s',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span>{added ? '✓ Pridėta į krepšelį' : adding ? 'Pridedama...' : 'Pridėti į krepšelį →'}</span>
                {!added && !adding && selected?.price && (
                  <span style={{ opacity: 0.75, fontWeight: 500 }}>{selected.price}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
