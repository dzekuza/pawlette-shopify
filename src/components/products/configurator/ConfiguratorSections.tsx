'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CharmDecoratorPanel } from '@/components/products/CharmDecoratorPanel'
import { CharmDecoratorProvider } from '@/components/products/CharmDecoratorContext'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars } from '@/components/storefront/TestimonialCard'
import { DisplayHeading } from '@/components/storefront/Typography'
import { VideoCircles } from '@/components/products/configurator/VideoCircles'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import {
  BORDER_COLOR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  PDP_REVIEW_RATING,
  PDP_REVIEW_COUNT,
  translateColorLabel,
} from '@/components/products/pdpConstants'

/** Review badge, product name and price. */
export function Header() {
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { collar } }, meta: { name, price } } = useCollarConfiguratorContext()
  return (
  <div>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
      <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{tPdp('reviewCountLabel', { rating: PDP_REVIEW_RATING.toFixed(1), count: PDP_REVIEW_COUNT })}</span>
    </div>
    <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{name}</DisplayHeading>
    <ProductPrice
      currentPrice={price}
      originalPrice={collar?.originalPrice}
      size='detail'
    />
  </div>
  )
}

/** Circular video previews shown above the colour swatches. Renders nothing without videos. */
export function Videos({ videos }: { videos: string[] }) {
  if (videos.length === 0) return null
  return <VideoCircles videos={videos} />
}

/** "Label ........ value" row above a picker. */
function FieldLabel({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{value}</span>}
    </div>
  )
}

/** The colour swatch row on its own (no label) — reused by <Colors /> and the guided stepper. */
export function ColorSwatches() {
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { selectedColor, onColorChange } }, meta: { colorOptions } } = useCollarConfiguratorContext()
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {colorOptions.map((option) => {
        const isSelected = option.color === selectedColor
        return (
          <button
            key={option.color}
              title={translateColorLabel(tPdp, option.color)}
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
  )
}

/** Labelled colour picker. Renders nothing when there are no colours. */
export function Colors() {
  const t = useTranslations('products.configurator')
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { selectedColor } }, meta: { hasColors } } = useCollarConfiguratorContext()
  if (!hasColors) return null
  return (
    <div>
      <FieldLabel label={t('chooseColor')} value={selectedColor ? translateColorLabel(tPdp, selectedColor) : undefined} />
      <ColorSwatches />
    </div>
  )
}

/** The size buttons plus the "how to measure" link on their own (no label) — reused by <Sizes /> and the guided stepper. */
export function SizeOptions() {
  const t = useTranslations('products.configurator')
  const { state: { configurator: { collar, selectedSize, onSizeChange } }, actions: { openFitGuide } } = useCollarConfiguratorContext()
  return (
    <>
    <div style={{ display: 'flex', gap: 8 }}>
      {(collar?.sizes ?? []).map((s) => {
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
      <button
        type="button"
        onClick={() => openFitGuide()}
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
        {t('howToMeasure')}
      </button>
    </div>
    </>
  )
}

/** Labelled size picker. Renders nothing when the collar has no sizes. */
export function Sizes() {
  const t = useTranslations('products.configurator')
  const { state: { configurator: { selectedSize } }, meta: { hasSizes } } = useCollarConfiguratorContext()
  if (!hasSizes) return null
  return (
    <div>
      <FieldLabel label={t('size')} value={selectedSize || undefined} />
      <SizeOptions />
    </div>
  )
}

/** Charm decorator wired to the collar's size-matched charm selection. */
export function Charms() {
  const t = useTranslations('products.configurator')
  const { state: { configurator: c } } = useCollarConfiguratorContext()
  return (
    <CharmDecoratorProvider
      value={{
        state: {
          selectedCharms: c.selectedCollarCharms,
          selectedCharmCount: c.selectedCollarCharmCount,
          charmName: c.collarCharmName,
          allCharms: c.sizeMatchedCharms,
          mounted: c.mounted,
        },
        actions: {
          setCharmName: c.applyCollarLetters,
          recolourAt: c.applyCollarLetterColour,
          toggleCharm: c.toggleCollarCharm,
          reorder: c.handleCharmDragEnd,
          requestMoreCharms: () => c.setExtraCharmsOpen(true),
        },
        meta: { dndSensors: c.dndSensors },
      }}
    >
      <CharmDecoratorPanel title={t('decoratePanelTitle')} />
    </CharmDecoratorProvider>
  )
}

/** Add-to-cart — label reflects any charms already picked so the payoff of customizing is visible at purchase. */
export function AddToCart() {
  const t = useTranslations('products.configurator')
  const { state: { configurator: { selectedCollarCharmCount }, added }, actions: { addToCart: handleAddToCart }, meta: { price } } = useCollarConfiguratorContext()
  return (
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
      ? t('addedToCart')
      : selectedCollarCharmCount
        ? t('buyWithCharms', { count: selectedCollarCharmCount, price })
        : t('buyPlain', { price })}
  </button>
  )
}
