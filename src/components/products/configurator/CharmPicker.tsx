'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ShopifyCharm } from '@/lib/shopify'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { BORDER_COLOR, TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY } from '@/components/products/pdpConstants'

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
  const t = useTranslations('products.configurator')
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
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>{t('charmPicker.chooseLabel')}</span>
        {selected && <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{selected.title}</span>}
      </div>
<input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder={t('charmPicker.searchPlaceholder')} style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-surface-2)', color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-sage)' }} onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }} />
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
          {charms.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>{t('charmPicker.noResults')}</div>}
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
            {expanded ? t('charmPicker.showLess') : t('charmPicker.showMore')}
          </button>
        )}
      </div>
    </div>
  )
}
