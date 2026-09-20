'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { RichText } from '@/components/products/RichText'
import { TestimonialQuoteCard } from '@/components/storefront/TestimonialCard'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import { DIVIDER } from '@/components/products/configurator/configuratorConstants'
import { BORDER_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, getPdpTrustPoints, getPdpReviews } from '@/components/products/pdpConstants'

/** Purchase reassurance pills shown below the add-to-cart button. */
export function TrustStrip() {
  const tPdp = useTranslations('products.pdp')
  const pdpTrustPoints = getPdpTrustPoints(tPdp)
  return (
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
        {pdpTrustPoints.map((point, i) => (
          <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
            {point}
            {i < pdpTrustPoints.length - 1 ? <span className="sr-only"> · </span> : null}
          </div>
        ))}
      </div>
  )
}

/** Review carousel — cross-sell moved to cart drawer as an upsell. */
export function ReviewCarousel() {
  const t = useTranslations('products.configurator')
  const tPdp = useTranslations('products.pdp')
  const pdpReviews = getPdpReviews(tPdp)
  const [activeReview, setActiveReview] = useState(0)
  return (
      <div
        id="reviews"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              transform: `translateX(-${activeReview * 100}%)`,
              transition: 'transform 280ms ease',
            }}
          >
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
              <button
                key={review.author}
                type="button"
                onClick={() => setActiveReview(index)}
                aria-label={t('reviews.showReview', { n: index + 1 })}
                aria-pressed={activeReview === index}
                style={{
                  width: activeReview === index ? 20 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: activeReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)',
                  transition: 'width 180ms ease, background 180ms ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setActiveReview((current) => (current === 0 ? pdpReviews.length - 1 : current - 1))}
              aria-label={t('reviews.prevReview')}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `1px solid ${BORDER_COLOR}`,
                background: 'transparent',
                color: TEXT_PRIMARY,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveReview((current) => (current + 1) % pdpReviews.length)}
              aria-label={t('reviews.nextReview')}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `1px solid ${BORDER_COLOR}`,
                background: 'transparent',
                color: TEXT_PRIMARY,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
  )
}

/** Description / features / includes / shipping accordion. */
export function InfoAccordion() {
  const t = useTranslations('products.configurator')
  const { state: { configurator: { collar } } } = useCollarConfiguratorContext()
  const [open, setOpen] = useState<string | null>(null)
  const accordionItems = [
    { id: 'description', title: t('accordion.description'), content: collar?.description  || t('accordion.descriptionContent') },
    { id: 'features',    title: t('accordion.features'),     content: collar?.features     || t('accordion.featuresContent') },
    { id: 'includes',    title: t('accordion.includes'),      content: collar?.set_includes || t('accordion.includesContent') },
    { id: 'shipping',    title: t('accordion.shipping'), content: collar?.shipping    || t('accordion.shippingContent') },
  ]
  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {accordionItems.map((item) => {
          const isOpen = open === item.id
          return (
            <div key={item.id} className="bg-white" style={{ borderRadius: 12 }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 16, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY, textAlign: 'left',
                }}
              >
                {item.title}
                <span
                  aria-hidden="true"
                  style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                    background: TEXT_PRIMARY, color: 'var(--color-cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 200ms',
                  }}
                >
                  <Plus size={18} strokeWidth={2.2} />
                </span>
              </button>
              {isOpen && <RichText value={item.content} style={{ margin: '0 16px 16px', color: TEXT_SECONDARY }} />}
            </div>
          )
        })}
      </div>
  )
}

/** Everything below the CTA on the PDP: trust pills, reviews, divider and the info accordion. */
export function Trust() {
  return (
    <>
      <TrustStrip />
      <ReviewCarousel />
      <div style={{ height: 1, background: DIVIDER }} />
      <InfoAccordion />
    </>
  )
}
