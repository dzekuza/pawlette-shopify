'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LandingNav } from '@/components/landing/LandingNav'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { CommerceFooter } from '@/components/shared/CommerceFooter'
import { Accordion } from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { slugFromProductName } from '@/lib/catalog'
import { getCollars, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLineToCart } from '@/lib/cart'
import type { ProductDetail } from '@/lib/catalog'

const DISPLAY_SIZES = ['S', 'M', 'L'] as const
type DisplaySize = (typeof DISPLAY_SIZES)[number]

const SIZE_INDEX: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3 }

const SIZE_DETAILS: Record<DisplaySize, { range: string; breeds: string }> = {
  S: { range: '28–36', breeds: 'Beagle, Cocker Spaniel' },
  M: { range: '36–44', breeds: 'Labrador, Border Collie' },
  L: { range: '44–52', breeds: 'German Shepherd, Husky' },
}

const ALL_GUIDE_SIZES = [
  { key: 'XS', range: '20–28' },
  { key: 'S', range: '28–36' },
  { key: 'M', range: '36–44' },
  { key: 'L', range: '44–52' },
]

type CharmTab = 'all' | 'letter' | 'icon'

const DEFAULT_CONTENT = {
  features: 'Waterproof silicone construction, lightweight adjustable fit, safe-release buckle, dirt and odor resistance.',
  set_includes: 'Base collar in your chosen colour and size. Five interchangeable snap-on charms. Adjustable safe-release buckle. Linen storage pouch.',
  care: 'Rinse after every swim or muddy walk. Air dry flat — no tumble dryers. Wipe charms with a damp cloth, then air dry.',
  shipping: 'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days of purchase in original condition.',
  charm_features: 'Silicone snap-on charm. Clicks on and off in five seconds without tools. Waterproof and odor-resistant.',
}

const CARE_BULLETS = [
  { title: 'Rinse', desc: 'After every swim or muddy walk.' },
  { title: 'Air dry', desc: 'Lay flat. No tumble dryers.' },
  { title: 'Wipe charms', desc: 'Damp cloth, then air dry.' },
  { title: 'Store flat', desc: 'In the linen pouch.' },
]

const TEXT_PRIMARY = '#3D3530'
const TEXT_SECONDARY = '#6B6460'
const TEXT_MUTED = '#9B948F'
const BORDER_COLOR = '#E8E3DC'
const DIVIDER = '#EDEAE4'

interface Props {
  product: ProductDetail
}

export function SingleProductPage({ product }: Props) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const isCompactBento = width < 1180
  const isScrollableRecommendations = width < 1200

  const isCollar = product.productType === 'collar'
  const hasCharmVariants = !!product.charmVariants?.length

  const [collars, setCollars] = useState<ShopifyCollar[]>([])
  const [selectedCollar, setSelectedCollar] = useState<ShopifyCollar | null>(null)
  const [selectedSize, setSelectedSize] = useState<DisplaySize>('M')
  const [selectedCharm, setSelectedCharm] = useState<ShopifyCharm | null>(
    product.charmVariants?.[0] ?? null
  )
  const [charmTab, setCharmTab] = useState<CharmTab>('all')
  const [charmQuery, setCharmQuery] = useState('')
  const [added, setAdded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isCollar) return
    getCollars().then((data) => {
      setCollars(data)
      const match = data.find((c) => c.color === product.accentColor) ?? data[0] ?? null
      setSelectedCollar(match)
    })
  }, [isCollar, product.accentColor])

  const activeCharm = hasCharmVariants ? selectedCharm : null
  const displayImage = activeCharm?.image || product.image || ''
  const displayAccentColor = activeCharm?.bg || product.accentColor
  const displayName = hasCharmVariants && activeCharm ? activeCharm.title : product.name
  const displayPrice = hasCharmVariants
    ? (activeCharm?.price ?? product.price)
    : isCollar
      ? (selectedCollar?.price ?? product.price)
      : product.price

  const filteredCharms = useMemo(() => {
    if (!product.charmVariants) return []
    let list = charmTab === 'all'
      ? [...product.charmVariants]
      : product.charmVariants.filter((c) => c.category === charmTab)
    if (charmQuery.trim()) {
      list = list.filter((c) => c.title.toLowerCase().includes(charmQuery.toLowerCase()))
    }
    return list
  }, [product.charmVariants, charmTab, charmQuery])

  const accordionItems: AccordionItem[] = isCollar
    ? [
        { id: 'description', title: 'Description', content: product.shortDescription },
        { id: 'features', title: 'Product Features', content: product.features ?? DEFAULT_CONTENT.features },
        { id: 'includes', title: 'Set Includes', content: product.set_includes ?? DEFAULT_CONTENT.set_includes },
        { id: 'care', title: 'Care', content: product.care ?? DEFAULT_CONTENT.care },
        { id: 'shipping', title: 'Shipping & Returns', content: product.shipping ?? DEFAULT_CONTENT.shipping },
      ]
    : [
        { id: 'description', title: 'Description', content: product.shortDescription },
        { id: 'features', title: 'Product Features', content: product.features ?? DEFAULT_CONTENT.charm_features },
        { id: 'care', title: 'Care', content: product.care ?? DEFAULT_CONTENT.care },
        { id: 'shipping', title: 'Shipping & Returns', content: product.shipping ?? DEFAULT_CONTENT.shipping },
      ]

  const handleAddToCart = async () => {
    const variantId = isCollar
      ? (selectedCollar?.variantId ?? product.variantId)
      : hasCharmVariants
        ? (selectedCharm?.variantId ?? product.variantId)
        : product.variantId
    if (!variantId) return
    setAdded(true)
    try {
      await addLineToCart(variantId)
    } catch (e) {
      console.error('Add to cart failed', e)
    }
    setTimeout(() => {
      setAdded(false)
      router.push('/cart')
    }, 800)
  }

  const leftImage = (
    <div
      style={{
        position: 'sticky',
        top: 80,
        borderRadius: 28,
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '1 / 1',
        background: isCollar ? '#F0EBE5' : displayAccentColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 300ms ease-out',
      }}
    >
      {displayImage ? (
        <img
          src={displayImage}
          alt={displayName}
          style={{
            width: isCollar ? '100%' : '72%',
            height: isCollar ? '100%' : '72%',
            objectFit: isCollar ? 'cover' : 'contain',
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: displayAccentColor }} />
      )}
    </div>
  )

  const rightPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Title + description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 32, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {displayName}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
          {product.shortDescription}
        </p>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: TEXT_PRIMARY }}>{displayPrice}</span>
        <span style={{ fontSize: 13, color: TEXT_MUTED }}>incl. VAT</span>
      </div>

      {/* Colour selector — collars */}
      {isCollar && collars.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>
              Colour
            </span>
            <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{selectedCollar?.title ?? ''}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {collars.map((collar) => {
              const active = collar.id === selectedCollar?.id
              return (
                <button
                  key={collar.id}
                  onClick={() => setSelectedCollar(collar)}
                  aria-label={`Select ${collar.title}`}
                  style={{
                    width: 44, height: 44, borderRadius: 14, padding: 0,
                    background: collar.color, cursor: 'pointer',
                    border: active ? `2.5px solid ${TEXT_PRIMARY}` : '2.5px solid transparent',
                    boxShadow: active ? 'none' : `0 2px 8px 0 ${collar.glowColor}`,
                    transition: 'border-color 150ms ease-out, transform 100ms ease-out',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Charm picker — charm-charms page */}
      {hasCharmVariants && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>
              Choose charm
            </span>
            {selectedCharm && (
              <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{selectedCharm.title}</span>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'letter', 'icon'] as CharmTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setCharmTab(t)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                  background: charmTab === t ? TEXT_PRIMARY : '#EDE8E2',
                  color: charmTab === t ? '#FAF7F2' : TEXT_MUTED,
                  transition: 'background-color 150ms ease-out, color 150ms ease-out',
                }}
              >
                {t === 'all' ? 'All' : t === 'letter' ? 'Letters' : 'Icons'}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="search"
            value={charmQuery}
            onChange={(e) => setCharmQuery(e.target.value)}
            placeholder="Search charms…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10,
              border: `1.5px solid ${BORDER_COLOR}`, background: '#F8F5F1', color: TEXT_PRIMARY,
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
              transition: 'border-color 150ms ease-out',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#A8D5A2' }}
            onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }}
          />

          {/* Grid */}
          <div style={{ overflowY: 'auto', maxHeight: 300, paddingRight: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {filteredCharms.map((charm) => {
                const isSelected = selectedCharm?.id === charm.id
                return (
                  <button
                    key={charm.id}
                    onClick={() => setSelectedCharm(charm)}
                    title={charm.title}
                    style={{
                      borderRadius: 14, background: '#F0EBE5', cursor: 'pointer', padding: '10px 6px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                      outline: 'none',
                      border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                      boxShadow: isSelected ? '0 0 0 1px rgba(61,53,48,0.08)' : 'none',
                      transition: 'border-color 120ms ease-out, transform 100ms ease-out',
                    }}
                  >
                    <img src={charm.image} alt="" aria-hidden="true" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                    <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2 }}>
                      {charm.title}
                    </span>
                  </button>
                )
              })}
              {filteredCharms.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>
                  No charms found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Size selector — collars */}
      {isCollar && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>
            Size
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            {DISPLAY_SIZES.map((size) => {
              const active = size === selectedSize
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    flex: 1, padding: '12px 4px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, textAlign: 'center',
                    border: 'none',
                    background: active ? TEXT_PRIMARY : '#fff',
                    color: active ? '#FAF7F2' : TEXT_PRIMARY,
                    boxShadow: active ? 'none' : `0 0 0 1.5px ${BORDER_COLOR}`,
                    transition: 'background-color 150ms ease-out, color 150ms ease-out',
                  }}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: DIVIDER }} />

      {/* CTA */}
      <div>
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%', padding: isMobile ? '14px' : '16px', borderRadius: 50, border: 'none',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
            background: '#A8D5A2', color: '#2a5a25',
            transition: 'background-color 150ms ease-out, transform 80ms ease-out',
            boxShadow: '0 4px 20px rgba(168,213,162,0.45)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#A8D5A2'; e.currentTarget.style.transform = 'translateY(0)' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        >
          {added ? '✓ Added to cart' : `Add to cart — ${displayPrice}`}
        </button>
        <p style={{ textAlign: 'center', marginTop: 10, marginBottom: 0, fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>
          Free shipping over €50 · Made in Lithuania
        </p>
      </div>

      {/* Product info accordion */}
      <Accordion items={accordionItems} isMobile={isMobile} />
    </div>
  )

  return (
    <div className="bg-cream text-bark min-h-screen font-sans">
      <LandingNav topOffset={0} />

      <div style={{ paddingTop: 64 }}>
        {/* ── Hero ── */}
        {isMobile ? (
          <section style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {leftImage}
            {rightPanel}
          </section>
        ) : (
          <section style={{ padding: '32px 64px 64px', maxWidth: 1440, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 440px', gap: 64, alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                {leftImage}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
                {rightPanel}
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Bento ── */}
        <section
          className="bg-surface-2"
          style={{
            padding: isMobile ? '24px 16px' : '64px',
            display: 'flex', flexDirection: 'column', gap: 16,
            maxWidth: isMobile ? undefined : 1440,
            margin: isMobile ? undefined : '0 auto',
          }}
        >
          {isMobile ? (
            <>
              <WaterproofCard />
              <HandmadeCard />
              {isCollar && (
                <SizingGuide selectedSize={selectedSize} onSizeChange={setSelectedSize} sizeIndex={SIZE_INDEX} allSizes={ALL_GUIDE_SIZES} sizeDetails={SIZE_DETAILS} />
              )}
              <CharmCard />
              <CareCard isMobile />
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 16, flexWrap: isCompactBento ? 'wrap' : 'nowrap' }}>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><WaterproofCard /></div>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><HandmadeCard /></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 16, flexWrap: isCompactBento ? 'wrap' : 'nowrap' }}>
                {isCollar && (
                  <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}>
                    <SizingGuide selectedSize={selectedSize} onSizeChange={setSelectedSize} sizeIndex={SIZE_INDEX} allSizes={ALL_GUIDE_SIZES} sizeDetails={SIZE_DETAILS} />
                  </div>
                )}
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><CharmCard /></div>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><CareCard isMobile={false} /></div>
              </div>
            </>
          )}
        </section>

        {/* ── Photo slider ── */}
        <PhotoSlider />

        {/* ── You might also like ── */}
        <YouMightAlsoLike
          currentAccentColor={displayAccentColor}
          isMobile={isMobile}
          isScrollable={isScrollableRecommendations}
        />
      </div>

      <CommerceFooter />
    </div>
  )
}

/* ── Sub-components ── */

function WaterproofCard() {
  return (
    <div
      className="bg-sage rounded-[20px] flex flex-col h-full box-border"
      style={{ padding: 24, gap: 24 }}
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel color="rgba(42,90,37,0.6)">The material</SectionLabel>
        <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'var(--color-interactive-text)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          <p className="m-0">Waterproof.</p>
          <p className="m-0">No odor. No stains.</p>
        </div>
        <p className="m-0" style={{ fontSize: 15, color: 'rgba(42,90,37,0.75)', lineHeight: '25.5px' }}>
          TPU-coated nylon that shrugs off lakes, mud, and rain. Wipe with a damp cloth — it comes up looking new every time.
        </p>
      </div>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {['Lakes', 'Mud', 'Rain', 'Snow'].map((tag) => (
          <div key={tag} className="rounded-full" style={{ background: 'rgba(42,90,37,0.12)', padding: '6px 14px' }}>
            <span className="font-medium" style={{ fontSize: 12, color: 'var(--color-interactive-text)' }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HandmadeCard() {
  return (
    <div
      className="bg-bark rounded-[20px] flex flex-col h-full box-border"
      style={{ padding: 24, gap: 16 }}
    >
      <SectionLabel color="rgba(250,247,242,0.35)">Origin</SectionLabel>
      <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'var(--color-cream)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
        <p className="m-0">Handmade in</p>
        <p className="m-0">Vilnius, Lithuania.</p>
      </div>
      <p className="m-0" style={{ fontSize: 14, color: 'rgba(250,247,242,0.55)', lineHeight: '23.8px' }}>
        Small batch. Cut and assembled by hand in our workshop. Each collar ships in a linen pouch.
      </p>
      <p className="m-0 italic font-medium" style={{ fontSize: 22, color: 'rgba(250,247,242,0.2)', lineHeight: '33px', letterSpacing: '-0.22px' }}>
        Vandeniui atspari.
      </p>
    </div>
  )
}

function CharmCard() {
  return (
    <div
      className="bg-blossom rounded-[20px] flex flex-col justify-between h-full box-border"
      style={{ padding: '32px 28px', minHeight: 260, gap: 24 }}
    >
      <div>
        <SectionLabel color="rgba(61,20,30,0.45)">Charm system</SectionLabel>
        <p className="m-0 mb-2" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'rgba(61,20,30,0.85)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          Snaps on in 5 seconds.
        </p>
        <p className="m-0" style={{ fontSize: 14, color: 'rgba(61,20,30,0.6)', lineHeight: '22.4px' }}>
          Magnetic connector. No clips. No tools. No fuss.
        </p>
      </div>
      <div className="flex items-center" style={{ gap: 8 }}>
        {['🌸', '⭐', '🦋', '🌿'].map((emoji) => (
          <div key={emoji} className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
            {emoji}
          </div>
        ))}
        <span className="ml-1" style={{ fontSize: 12, color: 'rgba(61,20,30,0.5)' }}>+8 more</span>
      </div>
    </div>
  )
}

function CareCard({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="bg-cream rounded-[20px] flex flex-col border border-[var(--color-border)]" style={{ padding: 24, gap: 24 }}>
        <p className="m-0" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'rgba(61,20,30,0.85)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          Care
        </p>
        <div className="flex flex-col" style={{ gap: 16 }}>
          {[[0, 1], [2, 3]].map((row, ri) => (
            <div key={ri} className="flex" style={{ gap: 24 }}>
              {row.map((i) => (
                <div key={i} className="flex-1">
                  <p className="m-0 mb-0.5 font-medium text-bark" style={{ fontSize: 13 }}>{CARE_BULLETS[i].title}</p>
                  <p className="m-0 text-bark-muted" style={{ fontSize: 12, lineHeight: '18px' }}>{CARE_BULLETS[i].desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream rounded-[20px] flex flex-col h-full box-border border border-[var(--color-border)]" style={{ padding: 24, gap: 16 }}>
      <SectionLabel>Care</SectionLabel>
      <div className="flex flex-col" style={{ gap: 12 }}>
        {CARE_BULLETS.map((item) => (
          <div key={item.title} className="flex items-start" style={{ gap: 16 }}>
            <div className="rounded-full bg-sage flex-shrink-0" style={{ width: 6, height: 6, marginTop: 7 }} />
            <div>
              <p className="m-0 font-medium text-bark" style={{ marginBottom: 1, fontSize: 13, lineHeight: '19.5px' }}>{item.title}</p>
              <p className="m-0 text-bark-muted" style={{ fontSize: 12, lineHeight: '18px' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SizingGuideProps {
  selectedSize: DisplaySize
  onSizeChange: (s: DisplaySize) => void
  sizeIndex: Record<string, number>
  allSizes: Array<{ key: string; range: string }>
  sizeDetails: Record<DisplaySize, { range: string; breeds: string }>
}

function SizingGuide({ selectedSize, onSizeChange, sizeIndex, allSizes, sizeDetails }: SizingGuideProps) {
  const details = sizeDetails[selectedSize]
  const progressPct = (sizeIndex[selectedSize] / 3) * 100

  return (
    <div
      className="bg-white rounded-[20px] flex flex-col h-full box-border border border-[var(--color-border)]"
      style={{ padding: 24, gap: 12 }}
    >
      <SectionLabel>Sizing guide</SectionLabel>
      <div className="flex items-end" style={{ gap: 10 }}>
        <span className="text-bark" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, lineHeight: '48px', letterSpacing: '0.48px' }}>
          {selectedSize}
        </span>
        <span className="text-bark-light mb-1" style={{ fontSize: 15, lineHeight: '22.5px' }}>
          {details.range} cm
        </span>
      </div>
      <p className="m-0 text-bark-muted" style={{ fontSize: 13 }}>{details.breeds}</p>
      <div className="rounded-[3px] mt-1" style={{ background: 'var(--color-border)', height: 6 }}>
        <div className="bg-sage rounded-[3px]" style={{ height: 6, width: `${Math.max(progressPct, 8)}%`, transition: 'width 0.2s ease' }} />
      </div>
      <div className="flex justify-between mt-0.5">
        {allSizes.map((s) => {
          const isActive = s.key === selectedSize
          const isSelectable = DISPLAY_SIZES.includes(s.key as DisplaySize)
          return (
            <button
              key={s.key}
              onClick={() => isSelectable && onSizeChange(s.key as DisplaySize)}
              className="bg-transparent border-none flex flex-col items-center font-sans p-0"
              style={{ cursor: isSelectable ? 'pointer' : 'default', gap: 2 }}
            >
              <span className="font-medium" style={{ fontSize: 12, color: isActive ? 'var(--color-bark)' : 'var(--color-bark-muted)', lineHeight: '18px' }}>{s.key}</span>
              <span style={{ fontSize: 10, color: 'var(--color-bark-muted)', lineHeight: '15px' }}>{s.range}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function YouMightAlsoLike({
  currentAccentColor,
  isMobile,
  isScrollable,
}: {
  currentAccentColor: string
  isMobile: boolean
  isScrollable: boolean
}) {
  const [allProducts, setAllProducts] = useState<import('@/lib/db').LandingCollar[]>([])
  useEffect(() => {
    import('@/lib/db').then(({ getLandingCollars }) => getLandingCollars().then(setAllProducts))
  }, [])
  const products = isMobile
    ? allProducts.filter((p) => p.collarColor !== currentAccentColor)
    : [...allProducts]

  return (
    <section
      className="bg-cream"
      style={{ padding: isMobile ? '64px 16px 48px' : '64px' }}
    >
      <div className="flex justify-between items-end mb-6" style={{ gap: 12 }}>
        <div>
          <SectionLabel>Recommended</SectionLabel>
          <p className="m-0 mt-2 text-bark" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, lineHeight: '52.8px', letterSpacing: '-0.96px' }}>
            You might also like
          </p>
        </div>
        <Link href="/products" className="no-underline flex-shrink-0 text-bark-muted" style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
          View all →
        </Link>
      </div>

      <div
        className="flex"
        style={{
          gap: 16,
          overflowX: isScrollable ? 'auto' : 'visible',
          paddingBottom: isScrollable ? 8 : 0,
          scrollSnapType: isScrollable ? 'x mandatory' : undefined,
          msOverflowStyle: isScrollable ? 'none' : undefined,
          scrollbarWidth: isScrollable ? 'none' : undefined,
        }}
      >
        {products.map((p) => {
          const slug = slugFromProductName(p.name)
          return (
            <Link
              key={p.id}
              href={`/products/${slug}`}
              className="no-underline text-inherit flex-shrink-0"
              style={{ width: 272, scrollSnapAlign: isScrollable ? 'start' : undefined }}
            >
              <div className="rounded-[20px] overflow-hidden relative" style={{ height: 200 }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.badge && (
                  <div className="absolute top-3.5 right-3.5 rounded-[20px]" style={{ background: p.badgeBg, padding: '3.5px 10px' }}>
                    <span className="font-medium uppercase" style={{ fontSize: 10, color: p.badgeColor, letterSpacing: '0.6px' }}>
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 4px 0' }}>
                <p className="m-0 mb-1 font-medium text-bark" style={{ fontSize: 15 }}>{p.name}</p>
                <p className="m-0 mb-3 text-bark-muted" style={{ fontSize: 13 }}>{p.desc}</p>
                <div className="flex mb-3.5" style={{ gap: 6 }}>
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: p.collarColor, border: '1px solid rgba(61,53,48,0.15)' }} />
                  {p.charms.slice(0, 4).map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full self-center" style={{ background: c.bg, border: '1px solid rgba(61,53,48,0.12)' }} />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-bark" style={{ fontSize: 18 }}>
                    {p.price}{' '}
                    <span className="font-normal text-bark-muted" style={{ fontSize: 12 }}>· 5 charms</span>
                  </span>
                  <PrimaryButton variant="sage" size="sm">Add to cart</PrimaryButton>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
