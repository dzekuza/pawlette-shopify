'use client'

import type { DragEndEvent, SensorDescriptor, SensorOptions } from '@dnd-kit/core'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
import type { ShopifyCharm } from '@/lib/shopify'
import type { ProductDetail } from '@/lib/catalog'
import { DisplayHeading } from '@/components/storefront/Typography'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars, TestimonialQuoteCard } from '@/components/storefront/TestimonialCard'
import { CharmDecoratorPanel } from '@/components/products/CharmDecoratorPanel'
import {
  BORDER_COLOR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  PDP_REVIEW_RATING,
  PDP_REVIEW_COUNT,
  PDP_TRUST_POINTS,
  PDP_REVIEWS,
  CharmColorPicker,
  CharmCTA,
  CharmAccordion,
} from '@/components/products/SingleProductPage'

interface CharmBuilderPanelProps {
  isMobile: boolean
  displayName: string
  displayPrice: string
  originalPrice?: string
  product: ProductDetail
  hasCharmVariants: boolean
  charmColor: string
  onCharmColorChange: (color: string) => void
  colorOptions: { value: string; label: string; dot: string }[]
  mounted: boolean
  dndSensors: SensorDescriptor<SensorOptions>[]
  selectedCharms: (ShopifyCharm | null)[]
  onDragEnd: (event: DragEndEvent) => void
  onToggleCharm: (charm: ShopifyCharm) => void
  charmName: string
  onCharmNameChange: (name: string) => void
  onCharmColourAt: (charmId: string, colourKey: string) => void
  onNeedMoreCharms?: () => void
  allCharms: ShopifyCharm[]
  activeReview: number
  onActiveReviewChange: (updater: (current: number) => number) => void
  added: boolean
  selectedCharmCount: number
  onAddToCart: () => void
}

/** Shared charm-selection builder used on both the mobile and desktop charm PDP layouts. */
export function CharmBuilderPanel({
  isMobile,
  displayName,
  displayPrice,
  originalPrice,
  product,
  hasCharmVariants,
  charmColor,
  onCharmColorChange,
  colorOptions,
  mounted,
  dndSensors,
  selectedCharms,
  onDragEnd,
  onToggleCharm,
  charmName,
  onCharmNameChange,
  onCharmColourAt,
  onNeedMoreCharms,
  allCharms,
  activeReview,
  onActiveReviewChange,
  added,
  selectedCharmCount,
  onAddToCart,
}: CharmBuilderPanelProps) {
  return (
    <>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
          <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
        </div>
        <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{displayName}</DisplayHeading>
        <ProductPrice
          currentPrice={displayPrice}
          originalPrice={originalPrice}
          note={FREE_SHIPPING_COPY}
          size='detail'
        />
      </div>
      {hasCharmVariants && (
        <>
          <CharmColorPicker color={charmColor} onColorChange={onCharmColorChange} options={colorOptions} />
          <CharmDecoratorPanel
            title="Papuoškite savo pakabuką"
            selectedCharmCount={selectedCharmCount}
            selectedCharms={selectedCharms}
            charmName={charmName}
            onCharmNameChange={onCharmNameChange}
            onCharmColourAt={onCharmColourAt}
            onToggleCharm={onToggleCharm}
            onCharmReorder={onDragEnd}
            onNeedMoreCharms={onNeedMoreCharms}
            mounted={mounted}
            allCharms={allCharms}
            dndSensors={dndSensors}
          />
        </>
      )}
      <div style={{ height: 1, background: 'var(--color-surface-2)' }} />
      {/* Review carousel */}
      <div id="reviews" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', transform: `translateX(-${activeReview * 100}%)`, transition: 'transform 280ms ease' }}>
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
              <button key={review.author} type="button" onClick={() => onActiveReviewChange(() => index)} aria-label={`Rodyti atsiliepimą ${index + 1}`} aria-pressed={activeReview === index} style={{ width: activeReview === index ? 20 : 7, height: 7, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: activeReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)', transition: 'width 180ms ease, background 180ms ease' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => onActiveReviewChange((c) => (c === 0 ? PDP_REVIEWS.length - 1 : c - 1))} aria-label="Ankstesnis atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>‹</button>
            <button type="button" onClick={() => onActiveReviewChange((c) => (c + 1) % PDP_REVIEWS.length)} aria-label="Kitas atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>›</button>
          </div>
        </div>
      </div>
      <CharmCTA added={added} count={selectedCharmCount} onClick={onAddToCart} isMobile={isMobile} />
      {/* Trust strip */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
        {PDP_TRUST_POINTS.map((point) => (
          <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>{point}</div>
        ))}
      </div>
      {product.charmVariants && <CharmAccordion product={product} />}
    </>
  )
}
