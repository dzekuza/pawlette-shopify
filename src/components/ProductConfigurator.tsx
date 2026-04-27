'use client'

import { useState, useEffect } from 'react'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { CommerceFooter } from '@/components/shared/CommerceFooter'
import { SIZES, type CartItem } from '@/lib/data'
import { getCollars, getCollarsSync, getCharms, getCharmsSync, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLinesToCart, fetchCart } from '@/lib/cart'
import { BentoSection } from './BentoSection'
import { CollarStage } from './CollarStage'
import { ConfigPanel } from './ConfigPanel'
import { MiniCart } from './MiniCart'
import { UpsellModal } from './UpsellModal'
import { LandingNav } from './landing/LandingNav'
import { PhotoSlider } from './landing/PhotoSlider'
import { Reviews } from './landing/Reviews'

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

export function ProductConfigurator () {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const [collars, setCollars] = useState<ShopifyCollar[]>(() => getCollarsSync() ?? [])
  const [charms, setCharms] = useState<ShopifyCharm[]>(() => getCharmsSync() ?? [])
  const [collar, setCollar] = useState<ShopifyCollar | null>(() => getCollarsSync()?.[0] ?? null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [selectedCharms, setSelectedCharms] = useState<(string | null)[]>([null, null, null, null, null])
  const [size, setSize] = useState<string>(SIZES[1])
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [leftTab, setLeftTab] = useState<'gallery' | 'preview'>('gallery')

  useEffect(() => {
    getCollars().then(data => {
      setCollars(data)
      if (data.length > 0) setCollar(data[0])
    })
    getCharms().then(setCharms)
    fetchCart().then(c => { if (c) setCheckoutUrl(c.checkoutUrl) })
  }, [])

  const toggleCharm = (id: string) => {
    setSelectedCharms(prev => {
      if (prev.includes(id)) return prev.map(c => c === id ? null : c)
      const idx = prev.indexOf(null)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = id
      return next
    })
  }

  const clearSlot = (index: number) => {
    setSelectedCharms(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const moveCharm = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setSelectedCharms(prev => {
      if (
        fromIndex < 0 || toIndex < 0 ||
        fromIndex >= prev.length || toIndex >= prev.length ||
        !prev[fromIndex]
      ) return prev
      const next = [...prev]
      const src = next[fromIndex]
      next[fromIndex] = next[toIndex]
      next[toIndex] = src
      return next
    })
  }

  const addToCart = async () => {
    if (!collar) return
    const item: CartItem = {
      collarId: collar.id,
      collarName: collar.title,
      collarColor: collar.color,
      collarBgTint: collar.bgTint,
      collarVariantId: collar.variants.find(v => v.size === size)?.id ?? collar.variantId,
      charmIds: selectedCharms,
      charmVariantIds: selectedCharms.map(id => {
        if (!id) return null
        return charms.find(c => c.id === id)?.variantId ?? null
      }),
      size,
      engraving: '',
    }
    const collarVariantId = collar.variants.find(v => v.size === size)?.id ?? collar.variantId
    const charmVariantIds = selectedCharms
      .filter(Boolean)
      .map(id => charms.find(c => c.id === id)?.variantId)
      .filter(Boolean) as string[]
    const lines = [collarVariantId, ...charmVariantIds].map(id => ({ merchandiseId: id, quantity: 1 }))
    const updatedCart = await addLinesToCart(lines)
    setCheckoutUrl(updatedCart.checkoutUrl)
    setCart(prev => [...prev, item])
    setCartOpen(true)
  }

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpsellClose = () => {
    setShowUpsell(false)
    setCartOpen(true)
  }

  const handleAddCharms = (ids: string[]) => {
    if (ids.length === 0 || !collar) return
    const item: CartItem = {
      collarId: collar.id,
      collarName: collar.title,
      collarColor: collar.color,
      collarBgTint: collar.bgTint,
      collarVariantId: collar.variants.find(v => v.size === size)?.id ?? collar.variantId,
      charmIds: ids.map(id => id),
      charmVariantIds: ids.map(id => charms.find(c => c.id === id)?.variantId ?? null),
      size: '',
      engraving: '',
      extra: true,
    }
    setCart(prev => [...prev, item])
  }

  const NAV_H = 72

  return (
    <div className="bg-cream min-h-screen font-sans">
      <LandingNav topOffset={0} cartCount={cart.length} onCart={() => setCartOpen(true)} />

      {/* ─── Configurator hero ─── */}
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

        {/* LEFT — product gallery grid */}
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
            style={{
              background: 'rgba(61,53,48,0.07)',
              width: 'fit-content',
            }}
          >
            {(['gallery', 'preview'] as const).map(tab => (
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

          {/* Gallery view */}
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
              {/* Featured image — spans both rows */}
              <div className="rounded-[20px] overflow-hidden relative" style={{ gridRow: '1 / 3' }}>
                <img
                  key={COLLAR_GALLERY[collar?.id ?? '']?.[0]}
                  src={COLLAR_GALLERY[collar?.id ?? '']?.[0]}
                  alt={`${collar?.title ?? ''} collar`}
                  className="w-full h-full object-cover block"
                />
                <div
                  className="absolute bottom-3.5 left-3.5 rounded-full font-sans font-bold uppercase"
                  style={{
                    background: collar?.color,
                    padding: '5px 14px',
                    fontSize: 11,
                    color: '#3D3530',
                    letterSpacing: '0.08em',
                  }}
                >
                  {collar?.title ?? ''}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={COLLAR_GALLERY[collar?.id ?? '']?.[1]} alt="" className="w-full h-full object-cover block" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={COLLAR_GALLERY[collar?.id ?? '']?.[2]} alt="" className="w-full h-full object-cover block" />
              </div>
            </div>
          )}

          {/* Configurator preview */}
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

        {/* RIGHT — config form */}
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
              style={{
                fontSize: isMobile ? 34 : 40,
                lineHeight: 1.05,
                letterSpacing: '0.02em',
              }}
            >
              Build your collar
            </h1>
            <div className="flex items-baseline gap-2.5">
              <span className="font-bold text-bark" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>
                €28
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
            onAddToCart={addToCart}
            isDark={false}
          />
        </div>
      </div>

      <BentoSection isDark={false} />
      <PhotoSlider />
      <Reviews />
      <CommerceFooter />

      {cartOpen && (
        <MiniCart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          checkoutUrl={checkoutUrl}
        />
      )}
      {showUpsell && (
        <UpsellModal
          collar={collar}
          charms={charms}
          onClose={handleUpsellClose}
          onAddCharms={handleAddCharms}
        />
      )}
    </div>
  )
}
