'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent, type SensorDescriptor, type SensorOptions } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import type { ShopifyCharm } from '@/lib/shopify'
import { extractLetter } from '@/lib/collar3dSelection'
import { MAX_CHARMS, BORDER_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, translateColorLabel } from '@/components/products/SingleProductPage'

const CHARM_TINTS = ['var(--color-blossom)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-blossom)', 'var(--color-sky)']

// Per-letter colour swatches offered when tapping an individual charm slot on the Personalise tile
const CHARM_LETTER_COLOURS = [
  { key: 'blue', label: 'Mėlyna', hex: '#B8D8F4' },
  { key: 'dark blue', label: 'Tamsiai mėlyna', hex: '#6B9FD4' },
  { key: 'pink', label: 'Rožinė', hex: '#F4B5C0' },
  { key: 'yellow', label: 'Geltona', hex: '#F9E4A0' },
  { key: 'purple', label: 'Violetinė', hex: '#D4B8F4' },
]

function SortableLetterSlot({
  id, index, charm, isActive, showCursorBefore, showCursorAfter, onClick,
}: {
  id: string
  index: number
  charm: ShopifyCharm | null
  isActive: boolean
  showCursorBefore: boolean
  showCursorAfter: boolean
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const isLetter = charm?.category === 'letter'
  const hasCharm = !!charm
  const Tag = hasCharm ? 'button' : 'div'
  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative', flex: '1 0 0', aspectRatio: '1 / 1',
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.5 : 1, touchAction: 'none',
      }}
    >
      {showCursorBefore && (
        <span aria-hidden="true" className="animate-pulse" style={{ position: 'absolute', left: -6, top: '50%', width: 2, height: 22, transform: 'translateY(-50%)', background: TEXT_PRIMARY, zIndex: 1 }} />
      )}
      {showCursorAfter && (
        <span aria-hidden="true" className="animate-pulse" style={{ position: 'absolute', right: -6, top: '50%', width: 2, height: 22, transform: 'translateY(-50%)', background: TEXT_PRIMARY, zIndex: 1 }} />
      )}
      {index === MAX_CHARMS - 1 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
            padding: '2px 6px', borderRadius: 999, background: 'var(--color-sage)',
            boxShadow: '0 1px 3px rgba(61,53,48,0.18)',
            color: 'var(--color-interactive-text)', fontSize: 9, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap',
          }}
        >
          €3.99
        </span>
      )}
      <Tag
        {...attributes}
        {...listeners}
        type={hasCharm ? 'button' : undefined}
        onClick={onClick}
        aria-label={
          isLetter
            ? `Keisti raidės „${extractLetter(charm!.baseTitle)}" spalvą`
            : hasCharm
              ? `Keisti „${charm!.title}" spalvą`
              : `Pasirinkti ${index + 1}-ą raidės vietą`
        }
        aria-pressed={hasCharm ? isActive : undefined}
        style={{
          width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: charm ? 'var(--color-surface-2)' : `${CHARM_TINTS[index]}33`,
          transition: 'transform 150ms, background 150ms, border-color 150ms',
          transform: charm ? 'scale(1)' : 'scale(0.96)',
          border: isActive ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
          padding: 0,
          cursor: charm ? 'grab' : 'pointer',
        }}
      >
        {charm?.image
          ? (
            <Image
              src={charm.image}
              alt={charm.title}
              width={48}
              height={48}
              style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            />
          )
          : (
            <span aria-hidden="true" style={{ width: 18, height: 3, borderRadius: 2, background: CHARM_TINTS[index] }} />
          )}
      </Tag>
    </div>
  )
}

interface CharmDecoratorPanelProps {
  title: string
  selectedCharmCount?: number
  selectedCharms?: (ShopifyCharm | null)[]
  charmName?: string
  onCharmNameChange?: (name: string) => void
  onCharmColourAt?: (charmId: string, colourKey: string) => void
  onToggleCharm?: (charm: ShopifyCharm) => void
  onCharmReorder?: (event: DragEndEvent) => void
  onNeedMoreCharms?: () => void
  mounted?: boolean
  allCharms?: ShopifyCharm[]
  dndSensors: SensorDescriptor<SensorOptions>[]
}

/** Tabbed charm decorator — "Raidžių charmsai" (letter engraving) + "Kiti charmsai" (grid/search picker). */
export function CharmDecoratorPanel({
  title,
  selectedCharmCount,
  selectedCharms,
  charmName = '',
  onCharmNameChange,
  onCharmColourAt,
  onToggleCharm,
  onCharmReorder,
  onNeedMoreCharms,
  mounted = false,
  allCharms = [],
  dndSensors,
}: CharmDecoratorPanelProps) {
  const [charmTab, setCharmTab] = useState<'letters' | 'charms'>('letters')
  const [charmPickerQuery, setCharmPickerQuery] = useState('')
  const [activeColourSlot, setActiveColourSlot] = useState<number | null>(null)
  const [activeIconCharmIndex, setActiveIconCharmIndex] = useState<number | null>(null)
  const [charmRowFocused, setCharmRowFocused] = useState(false)
  const [charmCursor, setCharmCursor] = useState(0)
  const charmRowRef = useRef<HTMLDivElement>(null)
  const charmNameInputRef = useRef<HTMLInputElement>(null)

  const syncCharmCursor = (el: HTMLInputElement | null) => {
    if (!el) return
    setCharmCursor(el.selectionStart ?? el.value.length)
  }

  const placeCharmCursor = (i: number) => {
    const el = charmNameInputRef.current
    if (!el) return
    const pos = Math.min(i, charmName.length)
    el.focus()
    el.setSelectionRange(pos, pos)
    setCharmCursor(pos)
  }

  useEffect(() => {
    setCharmCursor((pos) => Math.min(pos, charmName.length))
  }, [charmName])

  // Defaults to the most recently typed letter so step 2 (colour) appears as soon as one character exists,
  // even before the shopper explicitly taps a slot. An explicit tap can target ANY charm — letter or icon.
  const lastLetterIndex = (selectedCharms ?? []).reduce((last, c, i) => (c?.category === 'letter' ? i : last), -1)
  const colourTargetIndex = activeColourSlot !== null && selectedCharms?.[activeColourSlot]
    ? activeColourSlot
    : (lastLetterIndex >= 0 ? lastLetterIndex : null)
  const colourTargetCharm = colourTargetIndex !== null ? selectedCharms?.[colourTargetIndex] ?? null : null

  // Icon charms (paw, heart, star, flower…) recolour via a shape match rather than the fixed letter
  // palette, since not every shape necessarily ships in all five letter colours.
  const iconColourOptionsFor = (target: ShopifyCharm | null) =>
    target?.category === 'icon' && target.shape
      ? Array.from(
          new Map(
            allCharms
              .filter((c) => c.category === 'icon' && c.shape === target.shape)
              .map((c) => [c.color || c.bg, c])
          ).values()
        )
      : []
  const colourTargetIconOptions = iconColourOptionsFor(colourTargetCharm)

  const activeIconCharm = activeIconCharmIndex !== null ? selectedCharms?.[activeIconCharmIndex] ?? null : null
  const activeIconColours = iconColourOptionsFor(activeIconCharm)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>{title}</span>
        <Badge variant="sage">
          {selectedCharmCount
            ? `${selectedCharmCount} pakabuk${selectedCharmCount > 1 ? 'ai' : 'as'} įskaičiuoti`
            : 'Nemokama'}
        </Badge>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['letters', 'charms'] as const).map((tab) => {
          const active = charmTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setCharmTab(tab)}
              style={{
                padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                background: active ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                color: active ? 'var(--color-cream)' : TEXT_PRIMARY,
                transition: 'background 150ms, color 150ms',
              }}
            >
              {tab === 'letters' ? 'Raidžių charmsai' : 'Kiti charmsai'}
            </button>
          )
        })}
      </div>

      {charmTab === 'letters' ? (
        <>
          <div
            ref={charmRowRef}
            role="group"
            aria-label="Pasirinkti pakabukus"
            onClick={() => charmNameInputRef.current?.focus()}
            style={{
              width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12,
              padding: 14, borderRadius: 12, cursor: 'text', position: 'relative',
              border: `2px solid ${charmRowFocused ? 'var(--color-sage)' : 'rgba(232,227,220,0.95)'}`,
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>1. Įrašykite raides</span>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', marginTop: 8 }}>
            <input
              ref={charmNameInputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={MAX_CHARMS}
              value={charmName}
              aria-label="Įrašykite raides"
              onChange={(e) => {
                const next = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, MAX_CHARMS)
                onCharmNameChange?.(next)
                syncCharmCursor(e.target)
              }}
              onFocus={(e) => { setCharmRowFocused(true); syncCharmCursor(e.target) }}
              onBlur={() => setCharmRowFocused(false)}
              onSelect={(e) => syncCharmCursor(e.currentTarget)}
              onKeyUp={(e) => syncCharmCursor(e.currentTarget)}
              onClick={(e) => syncCharmCursor(e.currentTarget)}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0, border: 'none', outline: 'none', padding: 0,
                background: 'transparent', cursor: 'text', pointerEvents: 'none',
              }}
            />
            {mounted ? (
              <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={onCharmReorder}>
                <SortableContext items={Array.from({ length: MAX_CHARMS }, (_, i) => `slot-${i}`)} strategy={horizontalListSortingStrategy}>
                  {Array.from({ length: MAX_CHARMS }, (_, i) => selectedCharms?.[i] ?? null).map((c, i) => (
                    <SortableLetterSlot
                      key={i}
                      id={`slot-${i}`}
                      index={i}
                      charm={c}
                      isActive={colourTargetIndex === i && !!c}
                      showCursorBefore={charmRowFocused && charmCursor === i}
                      showCursorAfter={charmRowFocused && charmCursor === MAX_CHARMS && i === MAX_CHARMS - 1}
                      onClick={() => {
                        placeCharmCursor(i)
                        if (c) setActiveColourSlot((s) => (s === i ? null : i))
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              Array.from({ length: MAX_CHARMS }, (_, i) => selectedCharms?.[i] ?? null).map((c, i) => {
                const isLetter = c?.category === 'letter'
                const hasCharm = !!c
                const isActive = colourTargetIndex === i && hasCharm
                const Tag = hasCharm ? 'button' : 'div'
                const showCursorBefore = charmRowFocused && charmCursor === i
                const showCursorAfter = charmRowFocused && charmCursor === MAX_CHARMS && i === MAX_CHARMS - 1
                return (
                  <div key={i} style={{ position: 'relative', flex: '1 0 0', aspectRatio: '1 / 1' }}>
                    {showCursorBefore && (
                      <span aria-hidden="true" className="animate-pulse" style={{ position: 'absolute', left: -6, top: '50%', width: 2, height: 22, transform: 'translateY(-50%)', background: TEXT_PRIMARY, zIndex: 1 }} />
                    )}
                    {showCursorAfter && (
                      <span aria-hidden="true" className="animate-pulse" style={{ position: 'absolute', right: -6, top: '50%', width: 2, height: 22, transform: 'translateY(-50%)', background: TEXT_PRIMARY, zIndex: 1 }} />
                    )}
                    {i === MAX_CHARMS - 1 && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
                          padding: '2px 6px', borderRadius: 999, background: 'var(--color-sage)',
                          boxShadow: '0 1px 3px rgba(61,53,48,0.18)',
                          color: 'var(--color-interactive-text)', fontSize: 9, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap',
                        }}
                      >
                        €3.99
                      </span>
                    )}
                    <Tag
                      type={hasCharm ? 'button' : undefined}
                      onClick={() => {
                        placeCharmCursor(i)
                        if (hasCharm) setActiveColourSlot((s) => (s === i ? null : i))
                      }}
                      aria-label={
                        isLetter
                          ? `Keisti raidės „${extractLetter(c!.baseTitle)}" spalvą`
                          : hasCharm
                            ? `Keisti „${c!.title}" spalvą`
                            : `Pasirinkti ${i + 1}-ą raidės vietą`
                      }
                      aria-pressed={hasCharm ? isActive : undefined}
                      style={{
                        width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: c ? 'var(--color-surface-2)' : `${CHARM_TINTS[i]}33`,
                        transition: 'transform 150ms, background 150ms, border-color 150ms',
                        transform: c ? 'scale(1)' : 'scale(0.96)',
                        border: isActive ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    >
                      {c?.image
                        ? (
                          <Image
                            src={c.image}
                            alt={c.title}
                            width={48}
                            height={48}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        )
                        : (
                          <span aria-hidden="true" style={{ width: 18, height: 3, borderRadius: 2, background: CHARM_TINTS[i] }} />
                        )}
                    </Tag>
                  </div>
                )
              })
            )}
            </div>
            {colourTargetIndex !== null && colourTargetCharm && (colourTargetCharm.category === 'letter' || colourTargetIconOptions.length > 0) && (
              <>
                <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>2. Pasirinkite spalvą pažymėto charmo</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {colourTargetCharm.category === 'letter' ? (
                  CHARM_LETTER_COLOURS.map(({ key, label, hex }) => {
                    const isActiveColour = colourTargetCharm.bg === hex
                    return (
                      <button
                        key={key}
                        type="button"
                        title={label}
                        aria-label={label}
                        aria-pressed={isActiveColour}
                        onClick={() => onCharmColourAt?.(colourTargetCharm.id, key)}
                        style={{
                          width: 28, height: 28, padding: 0, borderRadius: '50%', cursor: 'pointer',
                          background: hex,
                          border: isActiveColour ? '2px solid var(--color-sage-dark)' : '2px solid transparent',
                          transition: 'border-color 150ms',
                        }}
                      />
                    )
                  })
                ) : (
                  colourTargetIconOptions.map((charm) => {
                    const isActiveColour = colourTargetCharm.bg === charm.bg
                    return (
                      <button
                        key={charm.id}
                        type="button"
                        title={translateColorLabel(charm.color)}
                        aria-label={translateColorLabel(charm.color)}
                        aria-pressed={isActiveColour}
                        onClick={() => onCharmColourAt?.(colourTargetCharm.id, charm.bg)}
                        style={{
                          width: 28, height: 28, padding: 0, borderRadius: '50%', cursor: 'pointer',
                          background: charm.bg,
                          border: isActiveColour ? '2px solid var(--color-sage-dark)' : '2px solid transparent',
                          transition: 'border-color 150ms',
                        }}
                      />
                    )
                  })
                )}
                </div>
              </>
            )}
          </div>
          {(selectedCharms ?? []).filter(Boolean).length >= MAX_CHARMS && (
            <button
              type="button"
              onClick={onNeedMoreCharms}
              style={{
                display: 'block', width: '100%', marginTop: 10, padding: '12px', borderRadius: 50,
                border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
              }}
            >
              Reikia daugiau pakabukų?
            </button>
          )}
        </>
      ) : (
        /* ── Charm picker tab ── */
        <div>
          {/* Selected slots preview */}
          <div style={{ display: 'flex', gap: 8, marginBottom: activeIconCharm ? 8 : 12 }}>
            {Array.from({ length: MAX_CHARMS }, (_, i) => selectedCharms?.[i] ?? null).map((c, i) => {
              const isActive = !!c && activeIconCharmIndex === i
              const Tag = c ? 'button' : 'div'
              return (
                <div key={i} style={{ position: 'relative', flex: '1 0 0', aspectRatio: '1 / 1' }}>
                  <Tag
                    type={c ? 'button' : undefined}
                    onClick={c ? () => setActiveIconCharmIndex((idx) => (idx === i ? null : i)) : undefined}
                    aria-label={c ? `Keisti „${c.title}" spalvą` : undefined}
                    aria-pressed={c ? isActive : undefined}
                    style={{
                      width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: c ? 'var(--color-surface-2)' : `${CHARM_TINTS[i]}33`,
                      border: isActive ? '2px solid var(--color-sage-dark)' : c ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                      transition: 'background 150ms, border-color 150ms',
                      padding: 0, cursor: c ? 'pointer' : 'default',
                    }}
                  >
                    {c?.image
                      ? <Image src={c.image} alt={c.title} width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                      : <span aria-hidden="true" style={{ width: 18, height: 3, borderRadius: 2, background: CHARM_TINTS[i] }} />}
                  </Tag>
                  {c && onToggleCharm && (
                    <button
                      type="button"
                      aria-label={`Pašalinti ${c.title}`}
                      onClick={() => {
                        onToggleCharm(c)
                        setActiveIconCharmIndex((idx) => (idx === i ? null : idx))
                      }}
                      style={{
                        position: 'absolute', top: 2, right: 2, width: 16, height: 16,
                        borderRadius: '50%', border: 'none', background: TEXT_PRIMARY,
                        color: 'var(--color-cream)', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: 0, fontSize: 10, lineHeight: 1,
                      }}
                    >×</button>
                  )}
                </div>
              )
            })}
          </div>

          {activeIconCharm && activeIconColours.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
                Pasirinkite „{activeIconCharm.baseTitle}{'"'} spalvą
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {activeIconColours.map((charm) => {
                  const isActiveColour = activeIconCharm.bg === charm.bg
                  return (
                    <button
                      key={charm.id}
                      type="button"
                      title={translateColorLabel(charm.color)}
                      aria-label={translateColorLabel(charm.color)}
                      aria-pressed={isActiveColour}
                      onClick={() => onCharmColourAt?.(activeIconCharm.id, charm.bg)}
                      style={{
                        width: 28, height: 28, padding: 0, borderRadius: '50%', cursor: 'pointer',
                        background: charm.bg,
                        border: isActiveColour ? '2px solid var(--color-sage-dark)' : '2px solid transparent',
                        transition: 'border-color 150ms',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <input
            type="search"
            value={charmPickerQuery}
            onChange={(e) => setCharmPickerQuery(e.target.value)}
            placeholder="Ieškoti pakabukų…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10,
              border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-surface-2)',
              color: TEXT_PRIMARY, fontSize: 13, outline: 'none', marginBottom: 10,
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-sage)' }}
            onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }}
          />

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 8, maxHeight: 260, overflowY: 'auto', paddingRight: 2 }}>
            {allCharms
              .filter((charm) => charm.category !== 'letter')
              .filter((charm) => !charmPickerQuery || charm.title.toLowerCase().includes(charmPickerQuery.toLowerCase()))
              .map((charm) => {
                const selectedIds = (selectedCharms ?? []).filter(Boolean).map((c) => c!.id)
                const isSelected = selectedIds.includes(charm.id)
                const isFull = selectedIds.length >= MAX_CHARMS && !isSelected
                return (
                  <button
                    key={charm.id}
                    type="button"
                    title={charm.title}
                    disabled={isFull}
                    onClick={() => onToggleCharm?.(charm)}
                    style={{
                      minHeight: 78, borderRadius: 10, border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                      background: 'var(--color-surface-2)', cursor: isFull ? 'not-allowed' : 'pointer',
                      padding: '8px 6px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 4, opacity: isFull ? 0.3 : 1,
                      outline: 'none', transition: 'border-color 120ms, opacity 150ms',
                    }}
                  >
                    {charm.image
                      ? <Image src={charm.image} alt="" aria-hidden="true" width={34} height={34} style={{ width: 34, height: 34, objectFit: 'contain' }} />
                      : <span aria-hidden="true" className="font-display" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: charm.bg ?? 'rgba(61,53,48,0.75)', lineHeight: 1 }}>{charm.baseTitle.replace(/^(?:Letter|Raidė)\s+/i, '')}</span>}
                    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charm.baseTitle}</span>
                  </button>
                )
              })}
            {allCharms.filter((c) => c.category !== 'letter').filter((c) => !charmPickerQuery || c.title.toLowerCase().includes(charmPickerQuery.toLowerCase())).length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>Pakabukų nerasta</div>
            )}
          </div>
          <span style={{ display: 'block', marginTop: 8, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
            {(selectedCharms ?? []).filter(Boolean).length} / {MAX_CHARMS} pasirinkta
          </span>
          {(selectedCharms ?? []).filter(Boolean).length >= MAX_CHARMS && (
            <button
              type="button"
              onClick={onNeedMoreCharms}
              style={{
                display: 'block', width: '100%', marginTop: 10, padding: '12px', borderRadius: 50,
                border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
              }}
            >
              Reikia daugiau pakabukų?
            </button>
          )}
        </div>
      )}
    </div>
  )
}
