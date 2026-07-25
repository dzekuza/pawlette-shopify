'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ShopifyCharm } from '@/lib/shopify'
import type { CollarConfiguratorState } from '@/lib/useCollarConfigurator'
import { CharmDecoratorPanel } from '@/components/products/CharmDecoratorPanel'
import { Collar3DModal } from '@/components/products/Collar3DModal'
import { RichText } from '@/components/products/RichText'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars, TestimonialQuoteCard } from '@/components/storefront/TestimonialCard'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'
import { CartToast } from '@/components/shared/CartToast'
import { Badge } from '@/components/ui/badge'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import {
  MAX_CHARMS,
  BORDER_COLOR,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SECONDARY,
  translateColorLabel,
  PDP_REVIEW_RATING,
  PDP_REVIEW_COUNT,
  PDP_TRUST_POINTS,
  PDP_REVIEWS,
} from '@/components/products/pdpConstants'

const DIVIDER = 'var(--color-border)'

// Color filter chips shared by the Personalise + Extra-charms modals
const CHARM_COLOR_FILTERS = [
  { key: 'blue', label: 'Mėlyna', hex: '#B8D8F4' },
  { key: 'dark blue', label: 'Tamsiai mėlyna', hex: '#6B9FD4' },
  { key: 'pink', label: 'Rožinė', hex: '#F4B5C0' },
  { key: 'yellow', label: 'Geltona', hex: '#F9E4A0' },
  { key: 'purple', label: 'Violetinė', hex: '#D4B8F4' },
]

// Color name → hex swatch mapping for display
const COLOR_SWATCHES: Record<string, string> = {
  Pink:       '#F4B5C0',
  Blue:       '#B8D8F4',
  Cyan:       '#A8E6E6',
  'Blue/Green': '#A8D5C8',
  Green:      '#A8D5A2',
  Black:      'var(--color-bark)',
}

export function SortableCharmSlot ({ id, charm, onRemove }: { id: string; charm: ShopifyCharm | null; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onRemove}
      style={{
        flex: 1, aspectRatio: '1/1', maxWidth: 64, borderRadius: 16,
        border: charm ? `2px solid ${TEXT_PRIMARY}` : `2px dashed rgba(61,53,48,0.2)`,
        background: charm ? charm.bg + '44' : 'rgba(61,53,48,0.04)',
        cursor: charm ? 'grab' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 6,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
      }}
      title={charm?.title}
    >
      {charm?.image
        ? <Image src={charm.image} alt={charm.title} width={52} height={52} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
        : <span style={{ fontSize: 18, color: 'rgba(61,53,48,0.2)', pointerEvents: 'none' }}>+</span>
      }
    </div>
  )
}

export function CharmPicker ({
  charms, selected, selectedIds, onSelect, query, onQueryChange,
}: {
  charms: ShopifyCharm[]; selected: ShopifyCharm | null; selectedIds?: string[]; onSelect: (c: ShopifyCharm) => void
  query: string; onQueryChange: (q: string) => void
}) {
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const width = useWindowWidth() ?? 1200
  const gridRef = useRef<HTMLDivElement | null>(null)
  const COLLAPSED_ROWS = 3
  const TILE_HEIGHT = 82
  const GRID_GAP = 8
  const collapsedHeight = COLLAPSED_ROWS * TILE_HEIGHT + (COLLAPSED_ROWS - 1) * GRID_GAP
  const expansionKey = `${width}:${query}:${charms.map((charm) => charm.id).join(',')}`
  const expanded = expandedFor === expansionKey

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const grid = gridRef.current
      if (!grid) return
      setHasOverflow(grid.scrollHeight > collapsedHeight + 4)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [charms, query, width, collapsedHeight])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>Rinktis pakabuką</span>
        {selected && <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{selected.title}</span>}
      </div>
<input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Ieškoti pakabukų…" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-surface-2)', color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-sage)' }} onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
        <div
          style={{
            overflowY: expanded ? 'auto' : 'hidden',
            flex: 1,
            minHeight: 0,
            maxHeight: expanded ? undefined : collapsedHeight,
            transition: 'max-height 200ms ease',
          }}
        >
        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8 }}>
          {charms.map((charm) => {
            const isSelected = selected?.id === charm.id || selectedIds?.includes(charm.id)
            return (
              <button key={charm.id} onClick={() => onSelect(charm)} title={charm.title} style={{ minHeight: 82, borderRadius: 10, background: 'var(--color-surface-2)', cursor: 'pointer', padding: '8px 6px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, outline: 'none', border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent', boxShadow: isSelected ? '0 0 0 1px var(--color-bark-divider)' : 'none', transition: 'border-color 120ms' }}>
                {charm.image
                  ? <Image src={charm.image} alt="" aria-hidden="true" width={34} height={34} style={{ width: 34, height: 34, objectFit: 'contain' }} />
                  : <span aria-hidden="true" className="font-display" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: charm.bg ?? 'rgba(61,53,48,0.75)', lineHeight: 1 }}>{charm.baseTitle.replace(/^(?:Letter|Raidė)\s+/i, '')}</span>
                }
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charm.baseTitle}</span>
              </button>
            )
          })}
          {charms.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>Pakabukų nerasta</div>}
        </div>
        </div>
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpandedFor((current) => current === expansionKey ? null : expansionKey)}
            style={{
              alignSelf: 'center',
              padding: '0 14px',
              height: 34,
              borderRadius: 999,
              border: `1.5px solid ${BORDER_COLOR}`,
              background: 'var(--color-cream)',
              color: TEXT_PRIMARY,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {expanded ? 'Rodyti mažiau' : 'Rodyti daugiau'}
          </button>
        )}
      </div>
    </div>
  )
}

// Small circular video previews shown above the color swatches — tapping one
// opens it larger in a bottom-sheet player, mirroring the Personalise dialog.
function VideoCircles ({ videos }: { videos: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div>
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
        {videos.map((video, i) => (
          <button
            key={video + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Peržiūrėti vaizdo įrašą ${i + 1}`}
            style={{
              flexShrink: 0, width: 82, height: 82, borderRadius: '50%', overflow: 'hidden',
              border: `2px solid ${BORDER_COLOR}`, padding: 0, cursor: 'pointer', background: 'var(--color-surface-2)',
            }}
          >
            <video
              src={video}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream" style={{ borderRadius: 24, width: '100%', maxWidth: 420, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveIndex(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
            </div>
            <video
              key={videos[activeIndex]}
              src={videos[activeIndex]}
              style={{ width: '100%', borderRadius: 16, maxHeight: '70vh' }}
              autoPlay
              loop
              controls
              playsInline
            />
          </div>
        </div>
      )}
    </div>
  )
}

export interface CollarConfiguratorProps {
  /** Return value of useCollarConfigurator() — the single source of truth for all state/handlers. */
  configurator: CollarConfiguratorState
  /** Display name — caller computes its own fallback (e.g. collar?.parentTitle ?? product.name). */
  name: string
  /** Display price — caller computes its own fallback (e.g. collar?.price ?? product.price). */
  price: string
  /** Whether to render the charm decorator section at all (false for plain leashes). */
  showCharms?: boolean
  /** Circular video previews shown above the color swatches. */
  videos?: string[]
  /** Whether to render the trust badges, review carousel, and info accordion below the CTA (false for the homepage buy card, which already has its own reviews/FAQ sections elsewhere on the page). */
  showTrustAndReviews?: boolean
  /** Render color/charms/size as a guided one-at-a-time stepper (with an explicit "Toliau" button to advance) instead of all three sections at once. */
  stepper?: boolean
}

/**
 * The shared collar "buy" configurator UI — color swatches, size picker, charm decorator,
 * add-to-cart, trust badges, review carousel, and info accordion — plus the Personalise and
 * Extra-charms bottom-sheet modals and the 3D preview modal. Rendered identically by
 * SingleProductPage.tsx (product detail page) and LandingBuySection.tsx (homepage buy card).
 */
export function CollarConfigurator ({ configurator, name, price, showCharms = true, videos = [], showTrustAndReviews = true, stepper = false }: CollarConfiguratorProps) {
  const {
    allCollars,
    collar,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
    addCollarToCart,
    setPersonaliseOpen,
    personaliseOpen,
    selectedCollarCharmCount,
    selectedCollarCharms,
    collarCharmName,
    applyCollarLetters,
    applyCollarLetterColour,
    handleCharmDragEnd,
    setExtraCharmsOpen,
    mounted,
    toggleCollarCharm,
    charms: allCharms,
    dndSensors,
    collarCharmColor,
    setCollarCharmColor,
    collarCharmQuery,
    setCollarCharmQuery,
    filteredCollarCharms,
    charmAdded,
    addCollarCharmToCart,
    applyStarterPack,
    preview3DOpen,
    setPreview3DOpen,
    setSelectedCollarCharms,
    cartToastItems,
    clearCartToast,
  } = configurator

  const dndSensorsForModal = dndSensors
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [fitGuideOpen, setFitGuideOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState(0)

  const sourceCollars = allCollars.length > 0 ? allCollars : (collar ? [collar] : [])
  const hasColors = sourceCollars.length > 0
  const hasSizes = (collar?.sizes?.length ?? 0) > 0
  const colorOptions = useMemo(() => {
    return sourceCollars.map((c) => {
      const colorName = c.colors[0] ?? ''
      const representativeVariant = c.variants.find((v) => v.image) ?? c.variants[0]
      return {
        color: colorName,
        image: representativeVariant?.image || c.image,
        fallback: COLOR_SWATCHES[colorName] ?? '#E8E3DC',
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCollars, collar])

  const handleAddToCart = async () => {
    setAdded(true)
    await addCollarToCart()
    setTimeout(() => setAdded(false), 800)
  }

  const accordionItems = [
    { id: 'description', title: 'Aprašymas',       content: collar?.description  || 'Vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais. Lengvas, reguliuojamas ir su saugia sagtimi.' },
    { id: 'features',    title: 'Savybės',  content: collar?.features     || 'Vandeniui atsparus silikonas · lengvas reguliuojamas prigludimas · saugi sagtis · atsparumas purvui ir kvapams.' },
    { id: 'includes',    title: 'Į rinkinį įeina',      content: collar?.set_includes || 'Antkaklis pasirinktos spalvos ir dydžio · Penki keičiami prisegami pakabukai — pirmi penki įskaičiuoti nemokamai, kiekvienas papildomas + €3.99 · Reguliuojama saugi sagtis · Lininis laikymo maišelis' },
    { id: 'shipping',    title: 'Pristatymas ir grąžinimas', content: collar?.shipping    || 'Nemokamas pristatymas užsakymams nuo 40 € · Pristatymas per 2–4 darbo dienas · Grąžinimas priimamas per 30 dienų, jei prekė originalios būklės' },
  ]

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CartToast items={cartToastItems} onClose={clearCartToast} />
      {/* Title & price */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
          <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
        </div>
        <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{name}</DisplayHeading>
        <ProductPrice
          currentPrice={price}
          originalPrice={collar?.originalPrice}
          note={FREE_SHIPPING_COPY}
          size='detail'
        />
        <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: TEXT_MUTED }}>
          Galutinė kaina skaičiuojama atsiskaitant
        </p>
      </div>

      {/* Video circles */}
      {videos.length > 0 && (
        <VideoCircles videos={videos} />
      )}

      {(() => {
        const colorStepBody = (
          <div>
            {!stepper && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Pasirinkite spalvą</span>
                {selectedColor && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{translateColorLabel(selectedColor)}</span>}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {colorOptions.map((option) => {
                const isSelected = option.color === selectedColor
                return (
                  <button
                    key={option.color}
                      title={translateColorLabel(option.color)}
                    onClick={() => onColorChange(option.color)}
                    style={{
                      flex: '1 1 0',
                      aspectRatio: '1 / 1',
                      minWidth: 0,
                      padding: 0,
                      borderRadius: 12,
                      border: `2px solid ${isSelected ? 'var(--color-sage-dark)' : BORDER_COLOR}`,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: option.fallback,
                      transition: 'border-color 150ms, transform 150ms',
                    }}
                    aria-label={option.color}
                    aria-pressed={isSelected}
                  >
                    {option.image ? (
                      <Image
                        src={option.image}
                        alt=""
                        width={52}
                        height={52}
                        aria-hidden="true"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        )

        const charmsStepBody = (
          <CharmDecoratorPanel
            title="Papuoškite savo antkaklį"
            selectedCharmCount={selectedCollarCharmCount}
            selectedCharms={selectedCollarCharms}
            charmName={collarCharmName}
            onCharmNameChange={applyCollarLetters}
            onCharmColourAt={applyCollarLetterColour}
            onToggleCharm={toggleCollarCharm}
            onCharmReorder={handleCharmDragEnd}
            onNeedMoreCharms={() => setExtraCharmsOpen(true)}
            mounted={mounted}
            allCharms={allCharms}
            dndSensors={dndSensors}
          />
        )

        const sizeStepBody = !hasSizes ? null : (
          <div>
            {!stepper && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Dydis</span>
                {selectedSize && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{selectedSize}</span>}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {collar!.sizes.map((s) => {
                const isSelected = s === selectedSize
                return (
                  <button
                    key={s}
                    onClick={() => onSizeChange(s)}
                    style={{
                      minWidth: 48, padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                      fontWeight: 600, fontSize: 14,
                      border: `2px solid ${isSelected ? TEXT_PRIMARY : BORDER_COLOR}`,
                      background: isSelected ? TEXT_PRIMARY : 'transparent',
                      color: isSelected ? 'var(--color-cream)' : TEXT_PRIMARY,
                      transition: 'background 150ms, border-color 150ms, color 150ms',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: TEXT_SECONDARY }}>
                Prieš užsakydami išmatuokite šuns kaklą. Jei esate tarp dydžių, prieš atsiskaitydami pasitikrinkite dydžių gidą.
              </p>
              <button
                type="button"
                onClick={() => setFitGuideOpen(true)}
                style={{
                  width: 'fit-content',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-interactive-text)',
                  textDecoration: 'none',
                }}
              >
                Kaip išmatuoti tinkamą dydį →
              </button>
            </div>
          </div>
        )

        if (!stepper) {
          return (
            <>
              {hasColors && (<>{colorStepBody}</>)}
              {showCharms && charmsStepBody}
              {hasSizes && (<>{sizeStepBody}</>)}
            </>
          )
        }

        const steps: Array<{ key: string; title: string; body: React.ReactNode; summary: React.ReactNode }> = []
        if (hasColors) steps.push({ key: 'color', title: 'Pasirinkite spalvą', body: colorStepBody, summary: selectedColor ? translateColorLabel(selectedColor) : null })
        if (showCharms) steps.push({ key: 'charms', title: 'Papuoškite savo antkaklį', body: charmsStepBody, summary: selectedCollarCharmCount > 0 ? `${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'ai' : 'as'}` : 'Praleista' })
        if (hasSizes) steps.push({ key: 'size', title: 'Dydis', body: sizeStepBody, summary: selectedSize || null })

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => {
              const isActive = i === stepIndex
              const isDone = i < stepIndex
              const isLocked = i > maxStepReached
              const isLast = i === steps.length - 1
              return (
                <div
                  key={step.key}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${BORDER_COLOR}`,
                    background: isActive ? 'var(--color-cream)' : 'transparent',
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setStepIndex(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '14px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: isLocked ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                          background: isDone ? 'var(--color-sage)' : isActive ? TEXT_PRIMARY : BORDER_COLOR,
                          color: isDone ? 'var(--color-interactive-text)' : isActive ? 'var(--color-cream)' : TEXT_MUTED,
                        }}
                      >
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: isLocked ? TEXT_MUTED : TEXT_PRIMARY }}>{step.title}</span>
                    </span>
                    {isDone && step.summary && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{step.summary}</span>}
                  </button>

                  {isActive && (
                    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {step.body}
                      {!isLast && (
                        <button
                          type="button"
                          onClick={() => {
                            setMaxStepReached((m) => Math.max(m, i + 1))
                            setStepIndex(i + 1)
                          }}
                          style={{
                            alignSelf: 'flex-end',
                            padding: '10px 18px',
                            borderRadius: 999,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 700,
                            background: TEXT_PRIMARY,
                            color: 'var(--color-cream)',
                          }}
                        >
                          Toliau →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Add to cart — label reflects any charms already picked so the payoff of customizing is visible at purchase */}
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
          background: 'var(--color-sage)', color: 'var(--color-interactive-text)',
          boxShadow: '0 4px 20px rgba(168,213,162,0.45)', transition: 'background-color 150ms ease-out, transform 80ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-sage)'; e.currentTarget.style.transform = 'translateY(0)' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {added
          ? '✓ Pridėta į krepšelį!'
          : selectedCollarCharmCount
            ? `Pirkti su ${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'ais' : 'u'} · ${price}`
            : `Pirkti · ${price}`}
      </button>
      {showTrustAndReviews && (
        <>
      {/* Trust strip — purchase reassurance below CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
        {PDP_TRUST_POINTS.map((point) => (
          <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>{point}</div>
        ))}
      </div>

      {/* Review carousel — cross-sell moved to cart drawer as an upsell */}
      <div
        id="reviews"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              transform: `translateX(-${activeReview * 100}%)`,
              transition: 'transform 280ms ease',
            }}
          >
            {PDP_REVIEWS.map((review) => (
              <div key={`${review.author}-${review.quote}`} style={{ minWidth: '100%' }}>
                <TestimonialQuoteCard author={review.author} quote={review.quote} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {PDP_REVIEWS.map((review, index) => (
              <button
                key={review.author}
                type="button"
                onClick={() => setActiveReview(index)}
                aria-label={`Rodyti atsiliepimą ${index + 1}`}
                aria-pressed={activeReview === index}
                style={{
                  width: activeReview === index ? 20 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: activeReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)',
                  transition: 'width 180ms ease, background 180ms ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setActiveReview((current) => (current === 0 ? PDP_REVIEWS.length - 1 : current - 1))}
              aria-label="Ankstesnis atsiliepimas"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `1px solid ${BORDER_COLOR}`,
                background: 'transparent',
                color: TEXT_PRIMARY,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveReview((current) => (current + 1) % PDP_REVIEWS.length)}
              aria-label="Kitas atsiliepimas"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `1px solid ${BORDER_COLOR}`,
                background: 'transparent',
                color: TEXT_PRIMARY,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: DIVIDER }} />

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {accordionItems.map((item) => {
          const isOpen = open === item.id
          return (
            <div key={item.id} className="bg-white" style={{ borderRadius: 12 }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 16, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY, textAlign: 'left',
                }}
              >
                {item.title}
                <span
                  aria-hidden="true"
                  style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                    background: TEXT_PRIMARY, color: 'var(--color-cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 200ms',
                  }}
                >
                  <Plus size={18} strokeWidth={2.2} />
                </span>
              </button>
              {isOpen && <RichText value={item.content} style={{ margin: '0 16px 16px', color: TEXT_SECONDARY }} />}
            </div>
          )
        })}
      </div>
        </>
      )}

      {fitGuideOpen && (
        <div
          onClick={() => setFitGuideOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 700,
            background: 'var(--color-bark-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 24,
              background: 'var(--color-cream)',
              boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
              padding: '24px 22px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <Eyebrow className="font-semibold tracking-[0.1em]">Dydžių gidas</Eyebrow>
                <DisplayHeading as="h3" size="compact" className="mt-[6px] m-0" style={{ lineHeight: 1.15, color: TEXT_PRIMARY, fontWeight: 400 }}>
                  Kaip išmatuoti savo šunį
                </DisplayHeading>
              </div>
              <button
                type="button"
                onClick={() => setFitGuideOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, lineHeight: 1, color: TEXT_MUTED, padding: 0 }}
                aria-label="Uždaryti dydžių gidą"
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Apjuoskite minkšta matavimo juosta šuns kaklo vidurį ten, kur paprastai būna antkaklis.',
                'Juosta turi priglusti, bet neveržti. Tarp juostos ir kaklo turi tilpti du pirštai.',
                'Jei matmuo patenka tarp dydžių, kasdieniam patogumui rinkitės didesnį.',
              ].map((step, index) => (
                <div key={step} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(168,213,162,0.22)', color: 'var(--color-interactive-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: TEXT_SECONDARY }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 16, background: 'var(--color-surface-2)', padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: TEXT_PRIMARY }}>
                <strong>Patarimas:</strong> Matuokite dienos pabaigoje, kai šuo atsipalaidavęs. Jei kailis purus, matuokite po juo, o ne virš jo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* ── Personalise charm dialog ── */}
    {personaliseOpen && (
      <div
        onClick={() => setPersonaliseOpen(false)}
        style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-cream" style={{ borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 600, padding: '28px 24px 40px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DisplayHeading as="h2" size="compact" className="m-0" style={{ fontWeight: 400, color: TEXT_PRIMARY }}>Pridėkite pakabukų</DisplayHeading>
              <Badge variant="sage">Nemokama</Badge>
            </div>
            <button onClick={() => setPersonaliseOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
          </div>

          {/* MAX_CHARMS-slot sortable preview */}
          <DndContext sensors={dndSensorsForModal} collisionDetection={closestCenter} onDragEnd={handleCharmDragEnd}>
            <SortableContext items={selectedCollarCharms.map((_, i) => `slot-${i}`)} strategy={horizontalListSortingStrategy}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {selectedCollarCharms.map((charm, i) => (
                  <SortableCharmSlot key={`slot-${i}`} id={`slot-${i}`} charm={charm} onRemove={() => charm && toggleCollarCharm(charm)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Starter packs — one tap fills all MAX_CHARMS slots for shoppers who don't want to hand-pick */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => applyStarterPack(0)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              ✨ Populiariausias rinkinys
            </button>
            <button
              type="button"
              onClick={() => applyStarterPack(MAX_CHARMS)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              🌸 Gėlių rinkinys
            </button>
          </div>

          {/* Color filter */}
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
            {CHARM_COLOR_FILTERS.map(({ key, label, hex }) => (
              <button
                key={key}
                onClick={() => setCollarCharmColor(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px 6px 8px',
                  borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500,
                  whiteSpace: 'nowrap',
                  background: collarCharmColor === key ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                  color: collarCharmColor === key ? 'var(--color-cream)' : TEXT_PRIMARY,
                  transition: 'background 150ms, color 150ms',
                }}
              >
                {hex && <span style={{ width: 14, height: 14, borderRadius: '50%', background: hex, flexShrink: 0, display: 'inline-block' }} />}
                {label}
              </button>
            ))}
          </div>

          {/* Charm picker */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <CharmPicker
              charms={filteredCollarCharms}
              selected={null}
              selectedIds={selectedCollarCharms.filter(Boolean).map(c => c!.id)}
              onSelect={toggleCollarCharm}
              query={collarCharmQuery}
              onQueryChange={setCollarCharmQuery}
            />
          </div>

          {/* CTA */}
          <button
            onClick={addCollarCharmToCart}
            disabled={!selectedCollarCharmCount}
            style={{
              width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: selectedCollarCharmCount ? 'pointer' : 'not-allowed',
              fontWeight: 600, fontSize: 16,
              background: selectedCollarCharmCount ? 'var(--color-sage)' : '#E8E3DC',
              color: selectedCollarCharmCount ? 'var(--color-interactive-text)' : TEXT_MUTED,
              transition: 'background 150ms',
            }}
          >
            {charmAdded ? '✓ Pridėta į krepšelį!' : selectedCollarCharmCount ? `Į krepšelį su ${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'ais' : 'u'}` : 'Pasirinkite bent 1 pakabuką'}
          </button>
          <button
            type="button"
            onClick={() => setPersonaliseOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, textDecoration: 'underline', textAlign: 'center' }}
          >
            Praleisti ir pirkti be pakabukų
          </button>
        </div>
      </div>
    )}

    <ExtraCharmsModal configurator={configurator} />

    <Collar3DModal
      open={preview3DOpen}
      onClose={() => setPreview3DOpen(false)}
      collar={collar}
      allCollars={allCollars}
      selectedColor={selectedColor}
      onColorChange={onColorChange}
      charms={allCharms}
      selectedCharms={selectedCollarCharms}
      onCharmsChange={setSelectedCollarCharms}
      charmColorKey={collarCharmColor}
      onCharmColorChange={setCollarCharmColor}
    />
    </>
  )
}

/**
 * "Need more charms?" bottom-sheet modal — driven entirely by the shared configurator state, so it
 * can be mounted once per page regardless of product type. Rendered by CollarConfigurator itself for
 * the collar buy flow, AND mounted directly by SingleProductPage.tsx for the charm-product flow
 * (whose CharmBuilderPanel → CharmDecoratorPanel also exposes a "Reikia daugiau pakabukų?" button
 * wired to the same configurator instance) — this keeps a single source of truth for the modal's
 * state while letting two otherwise-unrelated flows trigger it.
 */
export function ExtraCharmsModal ({ configurator }: { configurator: CollarConfiguratorState }) {
  const {
    extraCharmsOpen,
    setExtraCharmsOpen,
    extraCharmsPicked,
    extraCharmsQuery,
    setExtraCharmsQuery,
    extraCharmsColor,
    setExtraCharmsColor,
    extraCharmsAdded,
    filteredExtraCharms,
    toggleExtraCharm,
    addExtraCharmsToCart,
  } = configurator

  if (!extraCharmsOpen) return null

  return (
    <div
      onClick={() => setExtraCharmsOpen(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cream" style={{ borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 600, padding: '28px 24px 40px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DisplayHeading as="h2" size="compact" className="m-0" style={{ fontWeight: 400, color: TEXT_PRIMARY }}>Reikia daugiau pakabukų?</DisplayHeading>
          <button onClick={() => setExtraCharmsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
        </div>
        <span style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: -12 }}>
          Pasirinkite papildomus pakabukus — jie bus pridėti į krepšelį atskirai.
        </span>

        {/* Color filter */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
          {[{ key: '', label: 'Visos', hex: '' }, ...CHARM_COLOR_FILTERS].map(({ key, label, hex }) => (
            <button
              key={key || 'all'}
              onClick={() => setExtraCharmsColor(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px 6px 8px',
                borderRadius: 50, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                whiteSpace: 'nowrap',
                background: extraCharmsColor === key ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                color: extraCharmsColor === key ? 'var(--color-cream)' : TEXT_PRIMARY,
                transition: 'background 150ms, color 150ms',
              }}
            >
              {hex && <span style={{ width: 14, height: 14, borderRadius: '50%', background: hex, flexShrink: 0, display: 'inline-block' }} />}
              {label}
            </button>
          ))}
        </div>

        {/* Charm picker */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <CharmPicker
            charms={filteredExtraCharms}
            selected={null}
            selectedIds={extraCharmsPicked.map(c => c.id)}
            onSelect={toggleExtraCharm}
            query={extraCharmsQuery}
            onQueryChange={setExtraCharmsQuery}
          />
        </div>

        {/* CTA */}
        <button
          onClick={addExtraCharmsToCart}
          disabled={!extraCharmsPicked.length}
          style={{
            width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: extraCharmsPicked.length ? 'pointer' : 'not-allowed',
            fontWeight: 600, fontSize: 16,
            background: extraCharmsPicked.length ? 'var(--color-sage)' : '#E8E3DC',
            color: extraCharmsPicked.length ? 'var(--color-interactive-text)' : TEXT_MUTED,
            transition: 'background 150ms',
          }}
        >
          {extraCharmsAdded
            ? '✓ Pridėta į krepšelį!'
            : extraCharmsPicked.length
              ? `Į krepšelį su ${extraCharmsPicked.length} pakabuk${extraCharmsPicked.length > 1 ? 'ais' : 'u'}`
              : 'Pasirinkite bent 1 pakabuką'}
        </button>
      </div>
    </div>
  )
}
