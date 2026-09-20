'use client'

import { useTranslations } from 'next-intl'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { DisplayHeading } from '@/components/storefront/Typography'
import { Badge } from '@/components/ui/badge'
import { CharmPicker, SortableCharmSlot } from '@/components/products/configurator/CharmPicker'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import { CHARM_COLOR_FILTER_KEYS, COLOR_FILTER_LABEL_KEYS } from '@/components/products/configurator/configuratorConstants'
import { MAX_CHARMS, BORDER_COLOR, TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY } from '@/components/products/pdpConstants'

/** "Personalise" charm bottom-sheet: sortable slots, starter packs, colour filter and picker. */
export function PersonaliseModal() {
  const t = useTranslations('products.configurator')
  const { state: { configurator } } = useCollarConfiguratorContext()
  const {
    personaliseOpen,
    setPersonaliseOpen,
    dndSensors,
    handleCharmDragEnd,
    selectedCollarCharms,
    selectedCollarCharmCount,
    toggleCollarCharm,
    applyStarterPack,
    collarCharmColor,
    setCollarCharmColor,
    filteredCollarCharms,
    collarCharmQuery,
    setCollarCharmQuery,
    addCollarCharmToCart,
    charmAdded,
  } = configurator

  if (!personaliseOpen) return null

  return (
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
              <DisplayHeading as="h2" size="compact" className="m-0" style={{ fontWeight: 400, color: TEXT_PRIMARY }}>{t('personaliseModal.title')}</DisplayHeading>
              <Badge variant="sage">{t('personaliseModal.free')}</Badge>
            </div>
            <button onClick={() => setPersonaliseOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
          </div>

          {/* MAX_CHARMS-slot sortable preview */}
          <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleCharmDragEnd}>
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
              {t('personaliseModal.starterPopular')}
            </button>
            <button
              type="button"
              onClick={() => applyStarterPack(MAX_CHARMS)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              {t('personaliseModal.starterFlower')}
            </button>
          </div>

          {/* Color filter */}
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
            {CHARM_COLOR_FILTER_KEYS.map(({ key, hex }) => (
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
                {t(`colorFilters.${COLOR_FILTER_LABEL_KEYS[key]}`)}
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
            {charmAdded ? t('addedToCart') : selectedCollarCharmCount ? t('personaliseModal.addToCart', { count: selectedCollarCharmCount }) : t('personaliseModal.addToCartEmpty')}
          </button>
          <button
            type="button"
            onClick={() => setPersonaliseOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, textDecoration: 'underline', textAlign: 'center' }}
          >
            {t('personaliseModal.skip')}
          </button>
        </div>
      </div>
  )
}
