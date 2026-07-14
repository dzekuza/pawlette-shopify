'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ShopifyCharm, ShopifyCollar } from '@/lib/shopify'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR } from '@/lib/collar3d'
import { collar3DLetters, extractLetter } from '@/lib/collar3dSelection'

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
  const { letterCharms, iconCharms, name, charmColours } = useMemo(
    () => collar3DLetters(selectedCharms),
    [selectedCharms],
  )

  const [selectedCharmIndex, setSelectedCharmIndex] = useState<number | null>(null)
  const [charmRowFocused, setCharmRowFocused] = useState(false)
  const charmNameInputRef = useRef<HTMLInputElement>(null)

  // Clear the selection if the name shrinks past the selected letter (e.g. after backspacing).
  useEffect(() => {
    setSelectedCharmIndex((s) => (s !== null && s >= letterCharms.length ? null : s))
  }, [letterCharms.length])

  const colorOptions = useMemo(
    () => allCollars.map((c) => ({ colorName: c.colors[0] ?? '', hex: c.color })).filter((o) => o.colorName),
    [allCollars],
  )

  const applyLetters = (rawName: string, colourKey: string) => {
    const clean = rawName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)
    const colourHex = LETTER_COLOURS.find((c) => c.key === colourKey)?.hex
    const newLetterCharms = [...clean]
      .map((letter) => charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex))
      .filter((c): c is ShopifyCharm => !!c)
    const combined = [...newLetterCharms, ...iconCharms].slice(0, 5)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(5 - combined.length).fill(null)]
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
    const combined = [...newLetterCharms, ...iconCharms].slice(0, 5)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(5 - combined.length).fill(null)]
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
            name={name}
            strapColour={collar?.color ?? DEFAULT_STRAP_COLOUR}
            hardwareColour={HARDWARE_COLOUR}
            charmColours={charmColours}
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
              maxLength={5}
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
            {Array.from({ length: 5 }, (_, i) => letterCharms[i] ?? null).map((c, i) => {
              const isActive = selectedCharmIndex === i && !!c
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!c}
                  onClick={c ? () => setSelectedCharmIndex((s) => (s === i ? null : i)) : undefined}
                  aria-label={c ? `Keisti raidės „${extractLetter(c.baseTitle)}“ spalvą` : undefined}
                  aria-pressed={c ? isActive : undefined}
                  style={{
                    aspectRatio: '1 / 1', flex: '1 0 0', borderRadius: 12, overflow: 'hidden',
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

        {iconCharms.length > 0 && (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-bark-muted)', textAlign: 'center' }}>
            Papildomi pakabukai (ne raidės) liks krepšelyje, bet nerodomi 3D peržiūroje.
          </p>
        )}
      </div>
    </div>
  )
}
