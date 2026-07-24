'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify';
import { addLinesToCart } from '@/lib/cart';
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer';
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile';
import { Collar3DModal } from '@/components/products/Collar3DModal';
import { DisplayHeading } from '@/components/storefront/Typography';

const MAX_CHARMS = 6;

const COLOR_SWATCHES: Record<string, string> = {
  Pink: '#F4B5C0',
  Blue: '#B8D8F4',
  Cyan: '#A8E6E6',
  'Blue/Green': '#A8D5C8',
  Green: '#A8D5A2',
  Black: '#3D3530',
  Yellow: '#F9E4A0',
  Purple: '#D4B8F4',
};

const LT_COLOR_LABELS: Record<string, string> = {
  blue: 'Mėlyna',
  'sky blue': 'Dangaus mėlyna',
  'sky-blue': 'Dangaus mėlyna',
  'dark blue': 'Tamsiai mėlyna',
  'dark-blue': 'Tamsiai mėlyna',
  green: 'Žalia',
  red: 'Rausva',
  pink: 'Rožinė',
  yellow: 'Geltona',
  purple: 'Violetinė',
  'light blue': 'Šviesiai mėlyna',
};

function translateColorLabel(value: string) {
  return LT_COLOR_LABELS[value.toLowerCase()] ?? value;
}

function AccordionHeader({ title, isOpen, onClick }: { title: string; isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 bg-transparent text-left cursor-pointer transition-colors"
      style={{
        border: 'none',
        outline: 'none',
      }}
    >
      <span 
        className="text-base font-bold transition-colors font-sans"
        style={{
          color: isOpen ? 'var(--color-bark)' : 'var(--color-muted-foreground)',
        }}
      >
        {title}
      </span>
      <div 
        className="flex h-7 w-7 items-center justify-center rounded-full transition-transform"
        style={{
          background: 'var(--color-surface-2)',
          color: 'var(--color-bark)',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease-out',
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
      </div>
    </button>
  );
}

export function LandingBuySection() {
  const [allCollars, setAllCollars] = useState<ShopifyCollar[]>([]);
  const [charms, setCharms] = useState<ShopifyCharm[]>([]);
  const [collar, setCollar] = useState<ShopifyCollar | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedCharms, setSelectedCharms] = useState<(ShopifyCharm | null)[]>(Array(MAX_CHARMS).fill(null));
  
  const [preview3DOpen, setPreview3DOpen] = useState(false);
  const [collarCharmColor, setCollarCharmColor] = useState('blue');
  const [fitGuideOpen, setFitGuideOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [openSection, setOpenSection] = useState<'color' | 'size' | 'charms' | null>('color');

  useEffect(() => {
    getCollars().then((data) => {
      setAllCollars(data);
      if (data.length > 0) {
        const first = data[0];
        setCollar(first);
        setSelectedColor(first.colors[0] ?? '');
        setSelectedSize(first.sizes[1] ?? first.sizes[0] ?? '');
      }
    });
    getCharms().then(setCharms);
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const next = allCollars.find(c => c.colors.includes(color) || c.colors[0] === color);
    if (next) {
      setCollar(next);
      setSelectedSize(s => next.sizes.includes(s) ? s : (next.sizes[1] ?? next.sizes[0] ?? ''));
    }
    setOpenSection('size');
  };

  const colorOptions = useMemo(() => {
    return allCollars.map((c) => {
      const colorName = c.colors[0] ?? '';
      const representativeVariant = c.variants.find((v) => v.image) ?? c.variants[0];
      return {
        color: colorName,
        image: representativeVariant?.image || c.image,
        fallback: COLOR_SWATCHES[colorName] ?? '#E8E3DC',
      };
    });
  }, [allCollars]);

  const handleAddToCart = async () => {
    if (!collar) return;
    setAdding(true);
    
    const variant = collar.variants.find(v =>
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
    ) ?? collar.variants.find(v => selectedSize ? v.size === selectedSize : true) ?? collar.variants[0];
    
    const variantId = variant?.id ?? collar.variantId;
    const picked = selectedCharms.filter(Boolean) as ShopifyCharm[];
    
    const lines = [
      ...(variantId ? [{ merchandiseId: variantId, quantity: 1 }] : []),
      ...picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })),
    ];
    
    if (lines.length > 0) {
      await addLinesToCart(lines);
      window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT));
    }
    setAdding(false);
  };

  if (!collar) return null;

  const displayPrice = collar.price.toString().startsWith('€') ? collar.price : `€${collar.price}`;

  return (
    <>
      <section className="bg-cream px-4 py-16 md:px-6 md:py-24" id="customize">
        <div className="mx-auto max-w-[1112px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Live 3D Preview */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="aspect-square w-full overflow-hidden rounded-2xl relative">
                <Collar3DGalleryTile
                  collar={collar}
                  selectedCharms={selectedCharms}
                  onEdit={() => setPreview3DOpen(true)}
                  variant="slide"
                  background="transparent"
                />
              </div>
            </div>

            {/* Right Column: Customizer Details (White Card) */}
            <div className="lg:col-span-5 flex flex-col gap-6 font-sans bg-white p-6 md:p-10 rounded-[32px] shadow-[0_24px_48px_-32px_rgba(61,53,48,0.12)]">
            <div>
              {/* Star Rating */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: 'var(--color-bark)', marginBottom: 12 }}>
                <span className="text-honey text-xs">★★★★★</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>4.9/5 — 9 atsiliepimų</span>
              </div>
              
              <DisplayHeading as="h2" size="compact" className="m-0 mb-2 text-bark text-3xl md:text-4xl">
                {collar.parentTitle ?? 'PawCharms antkaklis'}
              </DisplayHeading>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-bark">{displayPrice}</span>
                <span className="text-xs text-muted-foreground">Nemokamas pristatymas nuo €40</span>
              </div>
            </div>

            {/* Options Accordion Group */}
            <div className="flex flex-col border-t border-bark-divider">
              
              {/* Accordion 1: Pasirinkite spalvą */}
              <div className="border-b border-bark-divider">
                <AccordionHeader
                  title="Pasirinkite spalvą"
                  isOpen={openSection === 'color'}
                  onClick={() => setOpenSection(openSection === 'color' ? null : 'color')}
                />
                {openSection === 'color' && (
                  <div className="pt-2 pb-5 flex flex-col gap-3">
                    <span className="text-xs text-muted-foreground font-sans">
                      Spalva: {translateColorLabel(selectedColor)}
                    </span>
                    <div className="flex gap-2.5 flex-wrap">
                      {colorOptions.map((opt) => {
                        const isSelected = opt.color === selectedColor;
                        return (
                          <button
                            key={opt.color}
                            type="button"
                            onClick={() => handleColorChange(opt.color)}
                            className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform"
                            style={{
                              border: isSelected ? '2px solid var(--color-sage-dark)' : '1px solid var(--color-border)',
                              background: opt.fallback,
                              cursor: 'pointer',
                            }}
                            aria-label={opt.color}
                            aria-pressed={isSelected}
                          >
                            {opt.image && (
                              <Image
                                src={opt.image}
                                alt=""
                                fill
                                sizes="40px"
                                className="rounded-full object-cover p-[2px]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Dydis */}
              <div className="border-b border-bark-divider">
                <AccordionHeader
                  title="Dydis"
                  isOpen={openSection === 'size'}
                  onClick={() => setOpenSection(openSection === 'size' ? null : 'size')}
                />
                {openSection === 'size' && (
                  <div className="pt-2 pb-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-sans">Pasirinktas dydis: {selectedSize}</span>
                      <button
                        type="button"
                        onClick={() => setFitGuideOpen(true)}
                        className="text-xs text-muted-foreground underline hover:text-bark bg-transparent border-none cursor-pointer font-sans font-semibold"
                      >
                        Dydžių lentelė
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {collar.sizes.map((s) => {
                        const isSelected = s === selectedSize;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className="flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-all border-none cursor-pointer"
                            style={{
                              background: isSelected ? 'var(--color-bark)' : 'var(--color-surface-2)',
                              color: isSelected ? 'white' : 'var(--color-bark)',
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Papuoškite savo antkaklį */}
              <div className="border-b border-bark-divider">
                <AccordionHeader
                  title="Papuoškite savo antkaklį"
                  isOpen={openSection === 'charms'}
                  onClick={() => setOpenSection(openSection === 'charms' ? null : 'charms')}
                />
                {openSection === 'charms' && (
                  <div className="pt-2 pb-5">
                    <div
                      onClick={() => setPreview3DOpen(true)}
                      className="flex items-center justify-between rounded-2xl border border-dashed border-bark/20 bg-cream/30 p-3.5 cursor-pointer hover:border-bark/40 transition-colors"
                    >
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedCharms.map((charm, i) => (
                          <div
                            key={i}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-xs font-semibold"
                            style={{
                              border: charm ? '1px solid var(--color-bark)' : '1px dashed rgba(61,53,48,0.2)',
                              background: charm ? charm.bg + '33' : 'rgba(61,53,48,0.04)',
                            }}
                          >
                            {charm?.image ? (
                              <Image src={charm.image} alt="" width={24} height={24} className="object-contain" />
                            ) : (
                              <span className="text-bark/20">+</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-interactive-text uppercase tracking-wider whitespace-nowrap ml-4">
                        Kurti →
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full rounded-full bg-bark py-4 text-center text-base font-bold text-white transition-opacity hover:opacity-90 border-none cursor-pointer"
              >
                {adding ? 'Kraunama...' : `Pirkti · ${displayPrice}`}
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Galutinė kaina skaičiuojama atsiskaitant
              </p>
            </div>

            {/* Badges */}
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-bark-divider pt-4 text-center">
              {[
                { label: '2–4 d. pristatymas' },
                { label: '30 d. grąžinimas' },
                { label: 'Pagaminta Lietuvoje' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-bark"
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Sizing Modal */}
      {fitGuideOpen && (
        <div
          onClick={() => setFitGuideOpen(false)}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-bark-overlay p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="m-0 text-xl font-bold">Dydžių lentelė</h3>
              <button
                onClick={() => setFitGuideOpen(false)}
                className="bg-transparent border-none cursor-pointer text-2xl text-muted-foreground hover:text-bark"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-3 font-sans text-sm text-bark-light">
              <p>Išmatuokite plačiausią savo šuns kaklo vietą ir patogumui pridėkite 2–3 cm:</p>
              <ul className="m-0 flex flex-col gap-2 pl-5 font-semibold">
                <li>S: 28–36 cm</li>
                <li>M: 36–44 cm</li>
                <li>L: 44–52 cm</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Visi antkakliai yra lengvai reguliuojami, todėl puikiai tiks ir šuniui augant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3D customization modal */}
      <Collar3DModal
        open={preview3DOpen}
        onClose={() => setPreview3DOpen(false)}
        collar={collar}
        allCollars={allCollars}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        charms={charms}
        selectedCharms={selectedCharms}
        onCharmsChange={setSelectedCharms}
        charmColorKey={collarCharmColor}
        onCharmColorChange={setCollarCharmColor}
      />
    </>
  );
}
