'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductDetail } from '@/lib/catalog'

interface ProductDetailSummaryProps {
  isMobile: boolean
  product: ProductDetail
}

type DetailTab = 'overview' | 'fit' | 'shipping'

const TAB_LABELS: Array<{ id: DetailTab, label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'fit', label: 'Compatibility' },
  { id: 'shipping', label: 'Shipping' }
]

export function ProductDetailSummary ({ isMobile, product }: ProductDetailSummaryProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [openFaq, setOpenFaq] = useState(0)

  const isCharm = product.productType === 'charm'

  const quickPoints = isCharm
    ? [
        'Snap-on change in about 5 seconds',
        'Works with every PawCharms collar set',
        'Best as a low-friction add-on'
      ]
    : [
        'Waterproof silicone for everyday wear',
        'Includes 5 swappable charms',
        'Built to refresh over time'
      ]

  const statItems = isCharm
    ? [
        { label: 'Format', value: 'Single charm' },
        { label: 'Fit', value: 'All PawCharms collars' },
        { label: 'Use case', value: 'Easy upsell add-on' }
      ]
    : [
        { label: 'Format', value: 'Collar set' },
        { label: 'Material', value: 'Waterproof silicone' },
        { label: 'Use case', value: 'Daily wear' }
      ]

  const tabContent: Record<DetailTab, { intro: string, bullets: string[] }> = isCharm
    ? {
        overview: {
          intro: 'This page should make the add-on decision feel easy. The value is not complexity, it is instant visual refresh, universal fit, and a low-commitment price point.',
          bullets: [
            'Adds variety without replacing the whole collar',
            'Easy way to increase basket size with almost no friction',
            'Collectible, giftable, and simple to mix by mood or season'
          ]
        },
        fit: {
          intro: product.compatibilityNote,
          bullets: [
            'Designed to work across the full PawCharms collar range',
            'Best bought alongside a collar set or with multiple charms',
            'Good choice for returning customers who already own a set'
          ]
        },
        shipping: {
          intro: 'Ships from Vilnius, Lithuania. For best conversion, pair this with a collar set or build a mini bundle of several charms in one order.',
          bullets: [
            'Ships from Vilnius, LT',
            'Strong add-on item for gifting and repeat orders',
            'Simple product to bundle with bestsellers'
          ]
        }
      }
    : {
        overview: {
          intro: 'The strongest conversion story here is comfort, waterproof durability, and the ability to refresh the look over time without buying a whole new setup.',
          bullets: [
            'Built for repeated everyday use',
            'Personal look with swappable add-ons',
            'Easy to clean after wet walks and muddy days'
          ]
        },
        fit: {
          intro: product.compatibilityNote,
          bullets: [
            'Includes five charms in the starter set',
            'Expandable with the wider charm collection',
            'Balanced for both gifting and first purchase confidence'
          ]
        },
        shipping: {
          intro: 'Ships from Vilnius, Lithuania, with a clear path to expand the set later through add-on charms and seasonal drops.',
          bullets: [
            'Ships from Vilnius, LT',
            'Good first purchase with clear next-step upsells',
            'Designed for repeat styling over time'
          ]
        }
      }

  const faqItems = isCharm
    ? [
        {
          question: 'Will this fit my collar?',
          answer: 'Yes. Every PawCharms charm is made to work with all PawCharms collar sets, so shoppers do not need to worry about matching a specific base collar.'
        },
        {
          question: 'When is a single charm the right purchase?',
          answer: 'Single charms work best for existing PawCharms customers, gift add-ons, and shoppers who want to build a small multi-charm bundle instead of committing to another full set.'
        },
        {
          question: 'How do I get the best value from this page?',
          answer: 'Use it as an add-on. The strongest basket-building path is to pair the charm with a collar set or add several charms together to create a more complete look.'
        }
      ]
    : [
        {
          question: 'What comes with the set?',
          answer: 'Each collar set includes the base collar and five compatible charms, giving the customer a ready-to-wear starter look from day one.'
        },
        {
          question: 'Can I update the look later?',
          answer: 'Yes. That is one of the strongest reasons to buy the set. Additional charms can refresh the style over time without replacing the whole collar.'
        },
        {
          question: 'Why is this easier to buy than a standard collar?',
          answer: 'It reduces decision fatigue by combining everyday practicality with a built-in styling system. Customers buy one base and keep evolving the look later.'
        }
      ]

  return (
    <div style={{ paddingTop: isMobile ? 8 : 12 }}>
      {product.badge && (
        <div
          style={{
            marginBottom: 14,
            display: 'inline-flex',
            borderRadius: 100,
            padding: '5px 11px',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#3D3530',
            background: `${product.accentColor}22`
          }}
        >
          {product.badge}
        </div>
      )}

      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? 34 : 48,
          lineHeight: 1.03,
          letterSpacing: '-0.04em'
        }}
      >
        {product.name}
      </h1>

      <p
        style={{
          marginTop: 12,
          maxWidth: 560,
          fontSize: 16,
          lineHeight: 1.65,
          color: '#8f8680'
        }}
      >
        {product.shortDescription}
      </p>

      <div
        style={{
          marginTop: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8
        }}
      >
        {quickPoints.map((point) => (
          <span
            key={point}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 999,
              padding: '8px 12px',
              background: 'rgba(61,53,48,0.045)',
              color: '#6B6460',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {point}
          </span>
        ))}
      </div>

      <section
        style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: '1px solid rgba(61,53,48,0.10)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9B948F', marginBottom: 8 }}>
                  Price
                </div>
                <div style={{ fontSize: isMobile ? 38 : 44, lineHeight: 0.95, letterSpacing: '-0.05em', color: '#3D3530' }}>
                  {product.price}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#8f8680' }}>
                Ships from Vilnius, LT
              </div>
            </div>
          </div>

          <div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#6B6460', maxWidth: 560 }}>
              {product.compatibilityNote}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 10,
                marginTop: 18,
                alignItems: 'stretch'
              }}
            >
              <Link
                href={product.ctaHref}
                style={{
                  textDecoration: 'none',
                  borderRadius: 999,
                  background: '#A8D5A2',
                  color: '#2a5a25',
                  padding: isMobile ? '12px 16px' : '13px 18px',
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: 'center',
                  flex: isMobile ? '1 1 100%' : '0 0 auto',
                  minWidth: isMobile ? undefined : 220
                }}
              >
                {product.ctaLabel}
              </Link>
              <Link
                href='/products'
                style={{
                  textDecoration: 'none',
                  borderRadius: 999,
                  border: '1px solid rgba(61,53,48,0.14)',
                  color: '#3D3530',
                  padding: isMobile ? '12px 16px' : '13px 18px',
                  fontSize: 15,
                  textAlign: 'center',
                  flex: isMobile ? '1 1 100%' : '0 0 auto',
                  minWidth: isMobile ? undefined : 220
                }}
              >
                View more products
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 12 : 18,
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid rgba(61,53,48,0.08)'
          }}
        >
          {statItems.map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B948F', marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.45, color: '#3D3530', fontWeight: 500 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div
          style={{
            display: 'flex',
            gap: 18,
            borderBottom: '1px solid rgba(61,53,48,0.10)',
            overflowX: 'auto'
          }}
        >
          {TAB_LABELS.map((tab) => {
            const active = tab.id === activeTab

            return (
              <button
                key={tab.id}
                className='btn-press'
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '0 0 12px',
                  borderBottom: active ? '2px solid #3D3530' : '2px solid transparent',
                  color: active ? '#3D3530' : '#9B948F',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ paddingTop: 18 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#4f4843' }}>
            {tabContent[activeTab].intro}
          </p>

          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            {tabContent[activeTab].bullets.map((bullet) => (
              <div key={bullet} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: product.accentColor,
                    flexShrink: 0,
                    marginTop: 8
                  }}
                />
                <span style={{ fontSize: 14, lineHeight: 1.7, color: '#6B6460' }}>
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid rgba(61,53,48,0.10)' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9B948F', fontWeight: 600, marginBottom: 8 }}>
          Good to know
        </div>

        {faqItems.map((item, index) => {
          const isOpen = openFaq === index

          return (
            <div key={item.question} style={{ borderBottom: '1px solid rgba(61,53,48,0.08)' }}>
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#3D3530', lineHeight: 1.45 }}>
                  {item.question}
                </span>
                <span style={{ fontSize: 20, lineHeight: 1, color: '#9B948F' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 0 16px', fontSize: 14, lineHeight: 1.8, color: '#6B6460', maxWidth: 620 }}>
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
