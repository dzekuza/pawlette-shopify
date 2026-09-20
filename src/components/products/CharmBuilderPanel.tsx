'use client'

import { useTranslations } from 'next-intl'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
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
  getPdpTrustPoints,
  getPdpReviews,
} from '@/components/products/pdpConstants'
import { CharmColorPicker } from '@/components/products/CharmColorPicker'
import { CharmCTA } from '@/components/products/CharmCTA'
import { CharmAccordion } from '@/components/products/CharmAccordion'
import { CharmDecoratorProvider } from '@/components/products/CharmDecoratorContext'
import { useCharmProduct } from '@/components/products/CharmProductContext'
import { useProductPage } from '@/components/products/ProductPageContext'

/** Shared charm-selection builder used on both the mobile and desktop charm PDP layouts. */
export function CharmBuilderPanel() {
  const { meta: { product, hasCharmVariants } } = useProductPage()
  const {
    state: { selectedCharms, selectedCharmCount, charmName, charmColor, colorOptions, added, activeReview, displayName, displayPrice, originalPrice },
    actions: { toggleCharm, reorder, setCharmName, recolourAt, setCharmColor, setActiveReview, addToCart },
    meta: { charms, mounted, dndSensors, requestMoreCharms },
  } = useCharmProduct()
  const onActiveReviewChange = setActiveReview
  const t = useTranslations('products.pdp')
  const pdpTrustPoints = getPdpTrustPoints(t)
  const pdpReviews = getPdpReviews(t)
  return (
    <>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
          <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{t('reviewCountLabel', { rating: PDP_REVIEW_RATING.toFixed(1), count: PDP_REVIEW_COUNT })}</span>
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
          <CharmColorPicker color={charmColor} onColorChange={setCharmColor} options={colorOptions} />
          <CharmDecoratorProvider
            value={{
              state: { selectedCharms, selectedCharmCount, charmName, allCharms: charms, mounted },
              actions: { setCharmName, recolourAt, toggleCharm, reorder, requestMoreCharms },
              meta: { dndSensors },
            }}
          >
            <CharmDecoratorPanel title={t('decorateCharmTitle')} />
          </CharmDecoratorProvider>
        </>
      )}
      <div style={{ height: 1, background: 'var(--color-surface-2)' }} />
      {/* Review carousel */}
      <div id="reviews" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', transform: `translateX(-${activeReview * 100}%)`, transition: 'transform 280ms ease' }}>
            {pdpReviews.map((review) => (
              <div key={`${review.author}-${review.quote}`} style={{ minWidth: '100%' }}>
                <TestimonialQuoteCard author={review.author} quote={review.quote} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {pdpReviews.map((review, index) => (
              <button key={review.author} type="button" onClick={() => onActiveReviewChange(() => index)} aria-label={t('reviewNav.showReview', { n: index + 1 })} aria-pressed={activeReview === index} style={{ width: activeReview === index ? 20 : 7, height: 7, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: activeReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)', transition: 'width 180ms ease, background 180ms ease' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => onActiveReviewChange((c) => (c === 0 ? pdpReviews.length - 1 : c - 1))} aria-label={t('reviewNav.prevReview')} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>‹</button>
            <button type="button" onClick={() => onActiveReviewChange((c) => (c + 1) % pdpReviews.length)} aria-label={t('reviewNav.nextReview')} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>›</button>
          </div>
        </div>
      </div>
      <CharmCTA added={added} count={selectedCharmCount} onClick={addToCart} />
      {/* Trust strip */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
        {pdpTrustPoints.map((point) => (
          <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>{point}</div>
        ))}
      </div>
      {product.charmVariants && <CharmAccordion product={product} />}
    </>
  )
}
