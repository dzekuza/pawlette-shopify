'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LandingNav } from '@/components/landing/LandingNav'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { Reviews } from '@/components/landing/Reviews'
import { CommerceFooter } from '@/components/shared/CommerceFooter'
import { BentoSection } from '@/components/BentoSection'
import { CollarStage } from '@/components/CollarStage'
import { ConfigPanel } from '@/components/ConfigPanel'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { SIZES } from '@/lib/data'
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLinesToCart } from '@/lib/cart'
import type { ProductDetail } from '@/lib/catalog'

const COLLAR_GALLERY: Record<string, string[]> = {
  blossom: [
    '/In_a_minimalist_style_a_delicate_pink_hzs32ACd.webp',
    '/collar-pink.png',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  ],
  sage: [
    '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  ],
  sky: [
    '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
  ],
  honey: [
    '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    '/collar-yellow.png',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  ],
}

type CharmTab = 'all' | 'letter' | 'icon'

const BORDER_COLOR = '#E8E3DC'
const TEXT_PRIMARY = '#3D3530'
const TEXT_MUTED = '#9B948F'
const TEXT_SECONDARY = '#6B6460'
const DIVIDER = '#EDEAE4'

const DEFAULT_CHARM_ACCORDION = [
  { id: 'description', title: 'Description', content: 'Snap-on silicone charms for all PawCharms collars. Each charm clicks on and off in around five seconds without tools.' },
  { id: 'care', title: 'Care', content: 'Wipe with a damp cloth, then air dry. Do not use abrasive cleaners.' },
  { id: 'shipping', title: 'Shipping & Returns', content: 'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days.' },
]

interface Props {
  product: ProductDetail
}

export function SingleProductPage ({ product }: Props) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const router = useRouter()

  const isCollar = product.productType === 'collar'
  const hasCharmVariants = !!product.charmVariants?.length

  // ── Collar configurator state ──
  const [collars, setCollars] = useState<ShopifyCollar[]>([])
  const [charms, setCharms] = useState<ShopifyCharm[]>([])
  const [collar, setCollar] = useState<ShopifyCollar | null>(null)
  const [selectedCharms, setSelectedCharms] = useState<(string | null)[]>([null, null, null, null, null])
  const [size, setSize] = useState<string>(SIZES[1])
  const [leftTab, setLeftTab] = useState<'gallery' | 'preview'>('gallery')

  // ── Charm page state ──
  const [selectedCharm, setSelectedCharm] = useState<ShopifyCharm | null>(product.charmVariants?.[0] ?? null)
  const [charmTab, setCharmTab] = useState<CharmTab>('all')
  const [charmQuery, setCharmQuery] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getCollars().then((data) => {
      setCollars(data)
      const match = data.find((c) => c.color === product.accentColor) ?? data[0] ?? null
      setCollar(match)
    })
    if (isCollar) {
      getCharms().then(setCharms)
    }
  }, [isCollar, product.accentColor])

  const toggleCharm = (id: string) => {
    setSelectedCharms((prev) => {
      if (prev.includes(id)) return prev.map((c) => (c === id ? null : c))
      const idx = prev.indexOf(null)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = id
      return next
    })
  }

  const clearSlot = (index: number) => {
    setSelectedCharms((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const moveCharm = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setSelectedCharms((prev) => {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length || !prev[fromIndex]) return prev
      const next = [...prev]
      const src = next[fromIndex]
      next[fromIndex] = next[toIndex]
      next[toIndex] = src
      return next
    })
  }

  // Collar add to cart → redirect to /cart
  const addCollarToCart = async () => {
    if (!collar) return
    const charmVariantIds = selectedCharms
      .filter(Boolean)
      .map((id) => charms.find((c) => c.id === id)?.variantId)
      .filter(Boolean) as string[]
    const lines = [collar.variantId, ...charmVariantIds].map((id) => ({ merchandiseId: id, quantity: 1 }))
    await addLinesToCart(lines)
    router.push('/cart')
  }

  // Charm add to cart → redirect to /cart
  const addCharmToCart = async () => {
    const variantId = selectedCharm?.variantId ?? product.variantId
    if (!variantId) return
    setAdded(true)
    await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }])
    setTimeout(() => {
      setAdded(false)
      router.push('/cart')
    }, 800)
  }

  // Filtered charms for the charm picker
  const filteredCharms = useMemo(() => {
    if (!product.charmVariants) return []
    let list = charmTab === 'all' ? [...product.charmVariants] : product.charmVariants.filter((c) => c.category === charmTab)
    if (charmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(charmQuery.toLowerCase()))
    return list
  }, [product.charmVariants, charmTab, charmQuery])

  const galleryKey = collar?.handle?.replace(/-collar$/, '') ?? ''
  const gallery = COLLAR_GALLERY[galleryKey] ?? []

  const NAV_H = 72
  const displayAccentColor = selectedCharm?.bg ?? product.accentColor
  const displayImage = selectedCharm?.image ?? product.image ?? ''
  const displayName = selectedCharm?.title ?? product.name
  const displayPrice = selectedCharm?.price ?? product.price

  return (
    <div className="bg-cream min-h-screen font-sans">
      <LandingNav topOffset={0} />

      {/* ── Configurator-style hero ── */}
      <div
        className="w-full mx-auto"
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '1fr 440px',
          gap: isMobile ? 0 : 32,
          minHeight: isMobile ? 'auto' : '80vh',
          maxWidth: 1200,
          marginTop: isMobile ? 0 : NAV_H,
          paddingBottom: isMobile ? 80 : 64,
        }}
      >

        {/* ── LEFT ── */}
        {isCollar ? (
          <div
            className="flex flex-col overflow-hidden"
            style={{
              position: isMobile ? 'relative' : 'sticky',
              top: NAV_H,
              height: isMobile ? 'auto' : '80vh',
            }}
          >
            {/* Tab bar */}
            <div
              className="relative flex gap-1 mb-4 rounded-full p-1"
              style={{ background: 'rgba(61,53,48,0.07)', width: 'fit-content' }}
            >
              {(['gallery', 'preview'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className="rounded-full border-none cursor-pointer font-sans font-semibold"
                  style={{
                    padding: '7px 18px',
                    fontSize: 12,
                    letterSpacing: '0.04em',
                    background: leftTab === tab ? '#FAF7F2' : 'transparent',
                    color: leftTab === tab ? '#3D3530' : 'rgba(61,53,48,0.45)',
                    boxShadow: leftTab === tab ? '0 1px 4px rgba(61,53,48,0.12)' : 'none',
                    transition: 'background 150ms, color 150ms, box-shadow 150ms',
                  }}
                >
                  {tab === 'gallery' ? 'Gallery' : 'Preview'}
                </button>
              ))}
            </div>

            {/* Gallery */}
            {leftTab === 'gallery' && (
              <div
                className="relative flex-1 overflow-hidden grid"
                style={{
                  minHeight: isMobile ? 320 : 0,
                  gridTemplateColumns: '3fr 2fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 10,
                }}
              >
                <div className="rounded-[20px] overflow-hidden relative" style={{ gridRow: '1 / 3' }}>
                  <img
                    src={gallery[0]}
                    alt={`${collar?.title ?? ''} collar`}
                    className="w-full h-full object-cover block"
                  />
                  <div
                    className="absolute bottom-3.5 left-3.5 rounded-full font-sans font-bold uppercase"
                    style={{ background: collar?.color, padding: '5px 14px', fontSize: 11, color: '#3D3530', letterSpacing: '0.08em' }}
                  >
                    {collar?.title ?? ''}
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src={gallery[1]} alt="" className="w-full h-full object-cover block" />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src={gallery[2]} alt="" className="w-full h-full object-cover block" />
                </div>
              </div>
            )}

            {/* Preview */}
            {leftTab === 'preview' && (
              <div className="relative flex-1 flex flex-col min-h-0">
                <CollarStage
                  collar={collar}
                  charms={charms}
                  selectedCharms={selectedCharms}
                  isDark={false}
                  moveCharm={moveCharm}
                  onClearSlot={clearSlot}
                  showGallery={false}
                />
              </div>
            )}
          </div>
        ) : (
          /* Charm image preview */
          <div
            style={{
              position: isMobile ? 'relative' : 'sticky',
              top: NAV_H,
              height: isMobile ? 340 : '80vh',
              borderRadius: 28,
              overflow: 'hidden',
              background: displayAccentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 300ms ease-out',
            }}
          >
            {displayImage && (
              <img
                src={displayImage}
                alt={displayName}
                style={{ width: '60%', height: '60%', objectFit: 'contain' }}
              />
            )}
          </div>
        )}

        {/* ── RIGHT ── */}
        {isCollar ? (
          <div
            className="flex flex-col"
            style={{ overflowY: isMobile ? 'visible' : 'auto' }}
          >
            {/* Heading block */}
            <div className="mb-8">
              <p className="font-sans font-semibold uppercase tracking-widest text-bark-muted m-0 mb-2" style={{ fontSize: 11 }}>
                Collar Set
              </p>
              <h1
                className="text-bark m-0 mb-2.5"
                style={{ fontSize: isMobile ? 34 : 40, lineHeight: 1.05, letterSpacing: '0.02em' }}
              >
                Build your collar
              </h1>
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-bark" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>
                  {collar?.price ?? product.price}
                </span>
                <span className="text-bark-muted" style={{ fontSize: 13 }}>
                  free shipping over €50
                </span>
              </div>
            </div>

            <ConfigPanel
              collar={collar}
              collars={collars}
              charms={charms}
              setCollar={setCollar}
              selectedCharms={selectedCharms}
              toggleCharm={toggleCharm}
              size={size}
              setSize={setSize}
              onAddToCart={addCollarToCart}
              isDark={false}
            />
          </div>
        ) : (
          /* Charm right panel */
          <div
            className="flex flex-col"
            style={{ overflowY: isMobile ? 'visible' : 'auto', gap: 24, fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="font-sans font-semibold uppercase tracking-widest text-bark-muted m-0" style={{ fontSize: 11 }}>
                Snap-on charm
              </p>
              <h1 className="text-bark m-0" style={{ fontSize: isMobile ? 28 : 36, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                {displayName}
              </h1>
              <div className="flex items-baseline" style={{ gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: TEXT_PRIMARY }}>{displayPrice}</span>
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>free shipping over €50</span>
              </div>
            </div>

            {/* Charm picker */}
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
                      className="rounded-full border-none cursor-pointer font-sans font-semibold"
                      style={{
                        padding: '7px 18px', fontSize: 12, letterSpacing: '0.04em',
                        background: charmTab === t ? '#FAF7F2' : 'transparent',
                        color: charmTab === t ? '#3D3530' : 'rgba(61,53,48,0.45)',
                        boxShadow: charmTab === t ? '0 1px 4px rgba(61,53,48,0.12)' : 'none',
                        transition: 'background 150ms, color 150ms, box-shadow 150ms',
                        backgroundColor: charmTab === t ? '#FAF7F2' : 'rgba(61,53,48,0.07)',
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
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#A8D5A2' }}
                  onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }}
                />

                {/* Grid */}
                <div style={{ overflowY: 'auto', maxHeight: 320, paddingRight: 2 }}>
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
                            outline: 'none', border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                            boxShadow: isSelected ? '0 0 0 1px rgba(61,53,48,0.08)' : 'none',
                            transition: 'border-color 120ms ease-out',
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

            {/* Divider */}
            <div style={{ height: 1, background: DIVIDER }} />

            {/* CTA */}
            <div style={{ marginTop: 4 }}>
              <button
                onClick={addCharmToCart}
                className="w-full rounded-full border-none cursor-pointer font-sans font-semibold"
                style={{
                  padding: isMobile ? '14px' : '16px',
                  background: '#A8D5A2', color: '#2a5a25',
                  fontSize: 16, letterSpacing: '0.01em',
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

            {/* Accordion */}
            {product.charmVariants && (
              <CharmAccordion product={product} />
            )}
          </div>
        )}
      </div>

      <BentoSection isDark={false} />
      <PhotoSlider />
      <Reviews />
      <CommerceFooter />
    </div>
  )
}

function CharmAccordion ({ product }: { product: ProductDetail }) {
  const [open, setOpen] = useState<string | null>(null)

  const items = [
    { id: 'description', title: 'Description', content: product.longDescription || DEFAULT_CHARM_ACCORDION[0].content },
    { id: 'care', title: 'Care', content: product.care || DEFAULT_CHARM_ACCORDION[1].content },
    { id: 'shipping', title: 'Shipping & Returns', content: product.shipping || DEFAULT_CHARM_ACCORDION[2].content },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id} style={{ borderTop: '1px solid #EDEAE4' }}>
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#3D3530', textAlign: 'left',
              }}
            >
              {item.title}
              <span style={{ fontSize: 18, color: '#9B948F', lineHeight: 1, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 200ms' }}>+</span>
            </button>
            {isOpen && (
              <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6B6460', lineHeight: 1.7 }}>
                {item.content}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
