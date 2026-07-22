'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ShopifyCharm, ShopifyCollar } from '@/lib/shopify'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR } from '@/lib/collar3d'
import { collar3DCharms, collar3DLetters, extractLetter, hasUnrenderableIconCharms } from '@/lib/collar3dSelection'
import { MAX_CHARMS, BORDER_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, translateColorLabel } from '@/components/products/SingleProductPage'

const CHARM_TINTS = ['var(--color-blossom)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-blossom)', 'var(--color-sky)']

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
})

/** Letter-charm colours available in the real catalog (mirrors the Personalise dialog's colour filter). */
const LETTER_COLOURS = [
  { key: 'blue', label: 'Mėlyna', hex: '#B8D8F4' },
  { key: 'dark blue', label: 'Tamsiai mėlyna', hex: '#6B9FD4' },
  { key: 'pink', label: 'Rožinė', hex: '#F4B5C0' },
  { key: 'yellow', label: 'Geltona', hex: '#F9E4A0' },
  { key: 'purple', label: 'Violetinė', hex: '#D4B8F4' },
]

type Collar3DModalProps = {
  open: boolean
  onClose: () => void
  collar: ShopifyCollar | null
  allCollars?: ShopifyCollar[]
  selectedColor: string
  onColorChange: (color: string) => void
  charms: ShopifyCharm[]
  selectedCharms?: (ShopifyCharm | null)[]
  onCharmsChange: (charms: (ShopifyCharm | null)[]) => void
  charmColorKey: string
  onCharmColorChange: (key: string) => void
}

export function Collar3DModal({
  open,
  onClose,
  collar,
  allCollars = [],
  selectedColor,
  onColorChange,
  charms,
  selectedCharms,
  onCharmsChange,
  charmColorKey,
  onCharmColorChange,
}: Collar3DModalProps) {
  const { letterCharms, iconCharms, name } = useMemo(
    () => collar3DLetters(selectedCharms),
    [selectedCharms],
  )
  const items = useMemo(() => collar3DCharms(selectedCharms), [selectedCharms])
  const showUnrenderableDisclaimer = useMemo(() => hasUnrenderableIconCharms(selectedCharms), [selectedCharms])

  const [modalTab, setModalTab] = useState<'letters' | 'charms'>('letters')
  const [selectedCharmIndex, setSelectedCharmIndex] = useState<number | null>(null)
  const [charmRowFocused, setCharmRowFocused] = useState(false)
  const [charmPickerQuery, setCharmPickerQuery] = useState('')
  const [activeIconCharmIndex, setActiveIconCharmIndex] = useState<number | null>(null)
  const charmNameInputRef = useRef<HTMLInputElement>(null)

  const toggleCharm = (charm: ShopifyCharm) => {
    const current = selectedCharms ?? Array(MAX_CHARMS).fill(null)
    const idx = current.findIndex((c) => c?.id === charm.id)
    if (idx !== -1) {
      const next = [...current]
      next[idx] = null
      onCharmsChange(next)
      setActiveIconCharmIndex((s) => (s === idx ? null : s))
      return
    }
    const empty = current.findIndex((c) => c === null)
    if (empty === -1) return
    const next = [...current]
    next[empty] = charm
    onCharmsChange(next)
  }

  const iconColourOptionsFor = (target: ShopifyCharm | null) =>
    target?.category === 'icon' && target.shape
      ? Array.from(
          new Map(
            charms
              .filter((c) => c.category === 'icon' && c.shape === target.shape)
              .map((c) => [c.color || c.bg, c])
          ).values()
        )
      : []

  const activeIconCharm = activeIconCharmIndex !== null ? selectedCharms?.[activeIconCharmIndex] ?? null : null
  const activeIconColours = iconColourOptionsFor(activeIconCharm)

  // Clear the selection if the name shrinks past the selected letter (e.g. after backspacing).
  useEffect(() => {
    setSelectedCharmIndex((s) => (s !== null && s >= letterCharms.length ? null : s))
  }, [letterCharms.length])

  const colorOptions = useMemo(
    () => allCollars.map((c) => ({ colorName: c.colors[0] ?? '', hex: c.color })).filter((o) => o.colorName),
    [allCollars],
  )

  const applyLetters = (rawName: string, colourKey: string) => {
    const clean = rawName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, MAX_CHARMS)
    const colourHex = LETTER_COLOURS.find((c) => c.key === colourKey)?.hex
    const newLetterCharms = [...clean]
      .map((letter) => charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex))
      .filter((c): c is ShopifyCharm => !!c)
    const combined = [...newLetterCharms, ...iconCharms].slice(0, MAX_CHARMS)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(MAX_CHARMS - combined.length).fill(null)]
    onCharmsChange(padded)
  }

  const applyColourToCharm = (index: number, colourKey: string) => {
    const target = letterCharms[index]
    if (!target) return
    const letter = extractLetter(target.baseTitle)
    const colourHex = LETTER_COLOURS.find((c) => c.key === colourKey)?.hex
    const replacement = charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex)
    if (!replacement) return
    const newLetterCharms = letterCharms.map((c, i) => (i === index ? replacement : c))
    const combined = [...newLetterCharms, ...iconCharms].slice(0, MAX_CHARMS)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(MAX_CHARMS - combined.length).fill(null)]
    onCharmsChange(padded)
  }

  const activeColourKey = selectedCharmIndex !== null
    ? LETTER_COLOURS.find((c) => c.hex === letterCharms[selectedCharmIndex]?.bg)?.key ?? charmColorKey
    : charmColorKey

  const handleColourSwatchClick = (colourKey: string) => {
    onCharmColorChange(colourKey)
    if (selectedCharmIndex !== null) {
      applyColourToCharm(selectedCharmIndex, colourKey)
    } else {
      applyLetters(name, colourKey)
    }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cream"
        style={{ borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 600, padding: '20px 20px 32px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-bark)' }}>3D peržiūra</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Uždaryti"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--color-bark-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '45vh', borderRadius: 16, overflow: 'hidden', background: 'var(--color-surface-2)' }}>
          <Collar3DScene
            items={items}
            strapColour={collar?.color ?? DEFAULT_STRAP_COLOUR}
            hardwareColour={HARDWARE_COLOUR}
            selectedCharm={selectedCharmIndex}
            onSelectCharm={(i) => setSelectedCharmIndex((s) => (s === i ? null : i))}
          />
          <p
            style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 12, color: 'var(--color-bark-muted)', pointerEvents: 'none' }}
          >
            Vilkite, kad pasuktumėte
          </p>
        </div>

        {colorOptions.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)' }}>Antkaklio spalva</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colorOptions.map((option) => (
                <button
                  key={option.colorName}
                  type="button"
                  title={option.colorName}
                  onClick={() => onColorChange(option.colorName)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: option.hex,
                    boxShadow: option.colorName === selectedColor
                      ? '0 0 0 2px var(--color-cream), 0 0 0 4px var(--color-bark)'
                      : '0 0 0 1.5px var(--color-border)',
                    transition: 'box-shadow 150ms',
                  }}
                  aria-label={option.colorName}
                  aria-pressed={option.colorName === selectedColor}
                />
              ))}
            </div>
          </section>
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {(['letters', 'charms'] as const).map((tab) => {
            const active = modalTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setModalTab(tab)}
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

        {modalTab === 'letters' ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)' }}>Raidžių pakabukai</span>
            <span style={{ fontSize: 12, color: 'var(--color-bark-muted)' }}>
              {selectedCharmIndex === null
                ? 'Spalva taikoma visoms raidėms'
                : `Spalva taikoma raidei „${name[selectedCharmIndex] ?? ''}“`}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-bark-muted)' }}>
            Spustelėkite raidę 3D peržiūroje arba žemiau, jei norite jai pritaikyti kitą spalvą.
          </p>
          <div
            onClick={() => charmNameInputRef.current?.focus()}
            style={{
              width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10,
              padding: 10, borderRadius: 16, cursor: 'text', position: 'relative',
              border: `1px solid ${charmRowFocused ? 'var(--color-sage)' : 'var(--color-border)'}`,
              outline: 'none',
            }}
          >
            <input
              ref={charmNameInputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={MAX_CHARMS}
              value={name}
              aria-label="Raidės ant antkaklio"
              onChange={(e) => applyLetters(e.target.value, charmColorKey)}
              onFocus={() => setCharmRowFocused(true)}
              onBlur={() => setCharmRowFocused(false)}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0, border: 'none', outline: 'none', padding: 0, fontSize: 16,
                background: 'transparent', cursor: 'text', pointerEvents: 'none',
              }}
            />
            {Array.from({ length: MAX_CHARMS }, (_, i) => letterCharms[i] ?? null).map((c, i) => {
              const isActive = selectedCharmIndex === i && !!c
              return (
                <div key={i} style={{ position: 'relative', flex: '1 0 0', aspectRatio: '1 / 1' }}>
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
                  <button
                    type="button"
                    disabled={!c}
                    onClick={c ? () => setSelectedCharmIndex((s) => (s === i ? null : i)) : undefined}
                    aria-label={c ? `Keisti raidės „${extractLetter(c.baseTitle)}“ spalvą` : undefined}
                    aria-pressed={c ? isActive : undefined}
                    style={{
                      width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: c ? 'var(--color-surface-2)' : `${CHARM_TINTS[i]}33`,
                      transition: 'transform 150ms, background 150ms, border-color 150ms',
                      transform: c ? 'scale(1)' : 'scale(0.96)',
                      border: isActive ? '2px solid var(--color-bark)' : '2px solid transparent',
                      padding: 0,
                      cursor: c ? 'pointer' : 'default',
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
                      : charmRowFocused && i === name.length
                        ? <span aria-hidden="true" className="animate-pulse" style={{ width: 2, height: '44%', background: 'var(--color-bark)', display: 'inline-block' }} />
                        : <span aria-hidden="true" style={{ fontSize: 22, fontWeight: 700, color: CHARM_TINTS[i] }}>_</span>}
                  </button>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LETTER_COLOURS.map(({ key, label, hex }) => (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => handleColourSwatchClick(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px 6px 8px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                  background: activeColourKey === key ? 'var(--color-bark)' : 'rgba(61,53,48,0.07)',
                  color: activeColourKey === key ? 'var(--color-cream)' : 'var(--color-bark)',
                  transition: 'background 150ms, color 150ms',
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: hex, flexShrink: 0, display: 'inline-block' }} />
                {label}
              </button>
            ))}
          </div>
        </section>
        ) : (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: MAX_CHARMS }, (_, i) => selectedCharms?.[i] ?? null).map((c, i) => {
                const isActive = !!c && activeIconCharmIndex === i
                const Tag = c ? 'button' : 'div'
                return (
                  <div key={i} style={{ position: 'relative', flex: '1 0 0', aspectRatio: '1 / 1' }}>
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
                      type={c ? 'button' : undefined}
                      onClick={c ? () => setActiveIconCharmIndex((idx) => (idx === i ? null : i)) : undefined}
                      aria-label={c ? `Keisti „${c.title}" spalvą` : undefined}
                      aria-pressed={c ? isActive : undefined}
                      style={{
                        width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: c ? 'var(--color-surface-2)' : `${CHARM_TINTS[i % CHARM_TINTS.length]}33`,
                        border: isActive ? '2px solid var(--color-sage-dark)' : c ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                        transition: 'background 150ms, border-color 150ms',
                        padding: 0, cursor: c ? 'pointer' : 'default',
                      }}
                    >
                      {c?.image
                        ? <Image src={c.image} alt={c.title} width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                        : <span aria-hidden="true" style={{ width: 18, height: 3, borderRadius: 2, background: CHARM_TINTS[i % CHARM_TINTS.length] }} />}
                    </Tag>
                    {c && (
                      <button
                        type="button"
                        aria-label={`Pašalinti ${c.title}`}
                        onClick={() => toggleCharm(c)}
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
              <div>
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
                        onClick={() => {
                          if (activeIconCharmIndex === null) return
                          const next = [...(selectedCharms ?? Array(MAX_CHARMS).fill(null))]
                          next[activeIconCharmIndex] = charm
                          onCharmsChange(next)
                        }}
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

            <input
              type="search"
              value={charmPickerQuery}
              onChange={(e) => setCharmPickerQuery(e.target.value)}
              placeholder="Ieškoti pakabukų…"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10,
                border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-surface-2)',
                color: TEXT_PRIMARY, fontSize: 13, outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-sage)' }}
              onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 8, maxHeight: 260, overflowY: 'auto', paddingRight: 2 }}>
              {charms
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
                      onClick={() => toggleCharm(charm)}
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
              {charms.filter((c) => c.category !== 'letter').filter((c) => !charmPickerQuery || c.title.toLowerCase().includes(charmPickerQuery.toLowerCase())).length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>Pakabukų nerasta</div>
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
              {(selectedCharms ?? []).filter(Boolean).length} / {MAX_CHARMS} pasirinkta
            </span>
          </section>
        )}

        {showUnrenderableDisclaimer && (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-bark-muted)', textAlign: 'center' }}>
            Papildomi pakabukai (ne raidės) liks krepšelyje, bet nerodomi 3D peržiūroje.
          </p>
        )}
      </div>
    </div>
  )
}
