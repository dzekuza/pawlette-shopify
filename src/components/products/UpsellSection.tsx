'use client'

import Image from 'next/image'
import { useState } from 'react'
import { addLinesToCart } from '@/lib/cart'
import type { ProductDetail } from '@/lib/catalog'

const LEASH_COLOR_HEX: Record<string, string> = {
  pink:        '#F4B5C0',
  purple:      '#C3A8D5',
  'dark blue': '#6B9FD4',
  blue:        '#B8D8F4',
  yellow:      '#F9E4A0',
  sage:        '#A8D5A2',
  blossom:     '#F4B5C0',
  sky:         '#B8D8F4',
  honey:       '#F9E4A0',
  // Lithuanian ASCII (no diacritics)
  'melyna':         '#B8D8F4',
  'tamsiai melyna': '#6B9FD4',
  'rozine':         '#F4B5C0',
  'geltona':        '#F9E4A0',
  'violetine':      '#C3A8D5',
  // Lithuanian with diacritics
  'mėlyna':         '#B8D8F4',
  'tamsiai mėlyna': '#6B9FD4',
  'rožinė':         '#F4B5C0',
  'violetinė':      '#C3A8D5',
}

function discounted (price: string): { orig: number; disc: number } {
  const orig = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
  return { orig, disc: +(orig * 0.9).toFixed(2) }
}

function PriceLine ({ price }: { price: string }) {
  const { orig, disc } = discounted(price)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
      <span style={{ fontSize: 12, color: 'rgba(61,53,48,0.4)', textDecoration: 'line-through' }}>€{orig.toFixed(2)}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#2a5a25' }}>€{disc.toFixed(2)}</span>
      <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(168,213,162,0.3)', color: '#2a5a25', borderRadius: 99, padding: '1px 6px' }}>−10%</span>
    </div>
  )
}

function AddButton ({ adding, added, onClick, label }: { adding: boolean; added: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={adding || added}
      aria-label={label}
      style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 10, border: 'none',
        background: added ? '#2a5a25' : 'var(--color-bark)', color: '#fff', fontSize: added ? 16 : 20, lineHeight: 1,
        cursor: (adding || added) ? 'default' : 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', opacity: adding ? 0.6 : 1, transition: 'background 200ms, opacity 150ms',
      }}
    >
      {added ? '✓' : '+'}
    </button>
  )
}

interface UpsellSectionProps {
  items: ProductDetail[]
  label: string
}

export function UpsellSection ({ items, label }: UpsellSectionProps) {
  if (!items.length) return null

  const isLeashGroup = items[0].productType === 'leash' && (items[0].leashColors?.length ?? 0) > 0

  return (
    <div style={{ borderTop: '1px solid rgba(61,53,48,0.1)', paddingTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.45)', marginBottom: 12 }}>
        {label}
      </div>
      {isLeashGroup
        ? <LeashUpsellCard item={items[0]} />
        : <CollarUpsellCard items={items} />
      }
    </div>
  )
}

/* ── Collar upsell: each ProductDetail = one color ─────────────────── */

function CollarUpsellCard ({ items }: { items: ProductDetail[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const item = items[selectedIdx]

  async function handleAdd () {
    if (adding || added || !item.variantId) return
    setAdding(true)
    try {
      await addLinesToCart([{ merchandiseId: item.variantId, quantity: 1 }])
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{ padding: 12, borderRadius: 14, border: '1.5px solid rgba(61,53,48,0.1)', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href={`/products/${item.slug}`} style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'block' }}>
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
        </a>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </div>
          <PriceLine price={item.price} />
        </div>
        <AddButton adding={adding} added={added} onClick={handleAdd} label={`Pridėti ${item.name} į krepšelį`} />
      </div>

      {items.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {items.map((it, i) => (
            <button
              key={it.slug}
              onClick={() => setSelectedIdx(i)}
              title={it.name}
              aria-label={it.name}
              style={{
                width: 24, height: 24, borderRadius: '50%', padding: 0, border: 'none',
                cursor: 'pointer',
                background: it.accentColor ?? '#ccc',
                outline: i === selectedIdx ? '2.5px solid var(--color-bark)' : '1.5px solid rgba(61,53,48,0.15)',
                outlineOffset: 2,
                transform: i === selectedIdx ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 120ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Leash upsell: single item with leashColors + leashVariants ─────── */

function LeashUpsellCard ({ item }: { item: ProductDetail }) {
  const colors = item.leashColors ?? []
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const variant = item.leashVariants?.find(v => v.color.toLowerCase() === selectedColor.toLowerCase())
  const variantId = variant?.id ?? item.variantId
  const price = variant?.price ?? item.price
  const image = variant?.image ?? item.image

  async function handleAdd () {
    if (adding || added || !variantId) return
    setAdding(true)
    try {
      await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }])
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{ padding: 12, borderRadius: 14, border: '1.5px solid rgba(61,53,48,0.1)', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href={`/products/${item.slug}`} style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'block' }}>
          <Image src={image} alt={item.name} fill className="object-cover" sizes="56px" />
        </a>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </div>
          <PriceLine price={price} />
        </div>
        <AddButton adding={adding} added={added} onClick={handleAdd} label={`Pridėti ${item.name} į krepšelį`} />
      </div>

      {colors.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              title={color}
              aria-label={color}
              style={{
                width: 24, height: 24, borderRadius: '50%', padding: 0, border: 'none',
                cursor: 'pointer',
                background: LEASH_COLOR_HEX[color.toLowerCase()] ?? '#ccc',
                outline: color === selectedColor ? '2.5px solid var(--color-bark)' : '1.5px solid rgba(61,53,48,0.15)',
                outlineOffset: 2,
                transform: color === selectedColor ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 120ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
