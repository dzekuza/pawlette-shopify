'use client'

import { PrimaryButton } from '@/components/shared/PrimaryButton';
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CharmDecoratorPanel } from '@/components/products/CharmDecoratorPanel'
import { CharmDecoratorProvider } from '@/components/products/CharmDecoratorContext'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars } from '@/components/storefront/TestimonialCard'
import { DisplayHeading } from '@/components/storefront/Typography'
import { getReviewSummary } from '@/lib/reviews'
import { VideoCircles } from '@/components/products/configurator/VideoCircles'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import {
  translateColorLabel,
} from '@/components/products/pdpConstants'

/** Review badge, product name and price. */
export function Header({ as = 'h1' }: { as?: 'h1' | 'h2' }) {
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { collar } }, meta: { name, price } } = useCollarConfiguratorContext()
  const reviewSummary = getReviewSummary()
  return (
    <div className='flex flex-col gap-3'>
      {reviewSummary ? (
        <div className='inline-flex w-fit items-center gap-2 rounded-full bg-bark/5 py-1.5 pl-2.5 pr-3 text-bark'>
          <ReviewStars rating={reviewSummary.rating} className='gap-[2px]' />
          <span className='text-[13px] font-semibold leading-none'>{tPdp('reviewCountLabel', { rating: reviewSummary.rating.toFixed(1), count: reviewSummary.count })}</span>
        </div>
      ) : null}
      <DisplayHeading as={as} size="compact" className="m-0 leading-[1.1] text-bark">{name}</DisplayHeading>
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
    <div className='mb-3 flex items-center justify-between gap-3'>
      <span className='text-sm font-semibold text-bark'>{label}</span>
      {value && <span className='rounded-full bg-bark/5 px-2.5 py-1 text-xs font-medium leading-none text-bark-light'>{value}</span>}
    </div>
  )
}

/** The colour swatch row on its own (no label) — reused by <Colors /> and the guided stepper. */
export function ColorSwatches() {
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { selectedColor, onColorChange } }, meta: { colorOptions } } = useCollarConfiguratorContext()
  return (
    <div className='flex gap-2.5'>
      {colorOptions.map((option) => {
        const isSelected = option.color === selectedColor
        return (
          <button
            key={option.color}
            type='button'
            title={translateColorLabel(tPdp, option.color)}
            onClick={() => onColorChange(option.color)}
            style={{ background: option.fallback }}
            className={cn(
              'relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl border-2 p-0 transition-[border-color,transform] duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
              isSelected ? 'border-bark' : 'border-transparent hover:-translate-y-0.5 hover:border-bark/25',
            )}
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
                className='block h-full w-full object-cover'
              />
            ) : null}
            {isSelected && (
              <span className='absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bark text-cream'>
                <Check className='h-3 w-3' strokeWidth={3} aria-hidden='true' />
              </span>
            )}
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
    <div className='flex flex-col gap-3'>
      <div className='flex gap-1 rounded-2xl bg-surface-2 p-1'>
        {(collar?.sizes ?? []).map((s) => {
          const isSelected = s === selectedSize
          return (
            <button
              key={s}
              type='button'
              onClick={() => onSizeChange(s)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-0 flex-1 rounded-xl px-2 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                isSelected ? 'bg-bark text-cream' : 'text-bark hover:bg-white',
              )}
            >
              {s}
            </button>
          )
        })}
      </div>
      <button
        type='button'
        onClick={() => openFitGuide()}
        className='w-fit border-0 bg-transparent p-0 text-[13px] font-semibold text-interactive-text underline-offset-4 hover:underline'
      >
        {t('howToMeasure')}
      </button>
    </div>
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
  const { state: { configurator: { selectedCollarCharmCount, canAddToCart }, added }, actions: { addToCart: handleAddToCart }, meta: { price } } = useCollarConfiguratorContext()
  return (
    <PrimaryButton variant='sage' size='lg' fullWidth className='h-14 text-base font-semibold' onClick={handleAddToCart} disabled={!canAddToCart}>
      {!canAddToCart
        ? t('selectOptionsToBuy')
        : added
        ? t('addedToCart')
        : selectedCollarCharmCount
          ? t('buyWithCharms', { count: selectedCollarCharmCount, price })
          : t('buyPlain', { price })}
    </PrimaryButton>
  )
}
