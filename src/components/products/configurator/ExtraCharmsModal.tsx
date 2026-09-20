'use client'

import { useTranslations } from 'next-intl'
import type { CollarConfiguratorState } from '@/lib/useCollarConfigurator'
import { DisplayHeading } from '@/components/storefront/Typography'
import { CharmPicker } from '@/components/products/configurator/CharmPicker'
import { CHARM_COLOR_FILTER_KEYS, COLOR_FILTER_LABEL_KEYS } from '@/components/products/configurator/configuratorConstants'
import { TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY } from '@/components/products/pdpConstants'

/**
 * "Need more charms?" bottom-sheet modal — driven entirely by the shared configurator state, so it
 * can be mounted once per page regardless of product type. Rendered by <CollarConfigurator.Root /> for
 * the collar buy flow, AND mounted directly by ProductPageBody.tsx for the charm-product flow
 * (whose CharmBuilderPanel → CharmDecoratorPanel also exposes a "Reikia daugiau pakabukų?" button
 * wired to the same configurator instance) — this keeps a single source of truth for the modal's
 * state while letting two otherwise-unrelated flows trigger it.
 */
export function ExtraCharmsModal ({ configurator }: { configurator: CollarConfiguratorState }) {
  const t = useTranslations('products.configurator')
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
          <DisplayHeading as="h2" size="compact" className="m-0" style={{ fontWeight: 400, color: TEXT_PRIMARY }}>{t('extraCharmsModal.title')}</DisplayHeading>
          <button onClick={() => setExtraCharmsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
        </div>
        <span style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: -12 }}>
          {t('extraCharmsModal.subtitle')}
        </span>

        {/* Color filter */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
          {[{ key: '', label: t('extraCharmsModal.allColors'), hex: '' }, ...CHARM_COLOR_FILTER_KEYS.map((f) => ({ ...f, label: t(`colorFilters.${COLOR_FILTER_LABEL_KEYS[f.key]}`) }))].map(({ key, label, hex }) => (
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
            ? t('addedToCart')
            : extraCharmsPicked.length
              ? t('extraCharmsModal.addToCart', { count: extraCharmsPicked.length })
              : t('extraCharmsModal.addToCartEmpty')}
        </button>
      </div>
    </div>
  )
}
