'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LandingNav } from '@/components/landing/LandingNav'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { Reviews } from '@/components/landing/Reviews'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { BentoSection } from '@/components/BentoSection'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLinesToCart } from '@/lib/cart'
import type { ProductDetail } from '@/lib/catalog'
import { RichText } from '@/components/products/RichText'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const COLLAR_GALLERY: Record<string, string[]> = {
  blossom: [
    '/collar-pink.png',
    '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
    '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
  ],
  sage: [
    '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
    '/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp',
  ],
  sky: [
    '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
    '/A_man_sits_at_an_outdoor_cafe_with_a_French_BfuQAh4h.webp',
    '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
    '/A_man_and_a_woman_sit_on_a_couch_with_a_small_wj6F8xDr.webp',
  ],
  honey: [
    '/collar-yellow.png',
    '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_yellow_star-shaped_object_is_attached_to_a_GDnMbdUH.webp',
  ],
  'honey-collar': [
    '/collar-yellow.png',
    '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_yellow_star-shaped_object_is_attached_to_a_GDnMbdUH.webp',
  ],
  'personalized-waterproof-dog-collar-with-charms': [
    '/collar-yellow.png',
    '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
    '/A_yellow_star-shaped_object_is_attached_to_a_GDnMbdUH.webp',
  ],
}

type CharmTab = 'all' | 'letter'

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
  const isCharmProduct = product.tags?.includes('Charm') || product.productType === 'charm'

  // ── Collar PDP state ──
  const [collars, setCollars] = useState<ShopifyCollar[]>([])
  const [charms, setCharms] = useState<ShopifyCharm[]>([])
  const [collar, setCollar] = useState<ShopifyCollar | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')

  // ── Charm page state ──
  const [selectedCharm, setSelectedCharm] = useState<ShopifyCharm | null>(product.charmVariants?.[0] ?? null)
  const [charmTab, setCharmTab] = useState<CharmTab>('all')
  const [charmColor, setCharmColor] = useState<string>('all')
  const [charmQuery, setCharmQuery] = useState('')
  const [added, setAdded] = useState(false)
  const [charmGalleryIndex, setCharmGalleryIndex] = useState(0)

  // ── Personalise dialog ──
  const [personaliseOpen, setPersonaliseOpen] = useState(false)
  const [selectedCollarCharms, setSelectedCollarCharms] = useState<(ShopifyCharm | null)[]>([null,null,null,null,null])
  const [collarCharmTab, setCollarCharmTab] = useState<CharmTab>('all')
  const [collarCharmColor, setCollarCharmColor] = useState<string>('all')
  const [collarCharmQuery, setCollarCharmQuery] = useState('')
  const [charmAdded, setCharmAdded] = useState(false)

  const toggleCollarCharm = (charm: ShopifyCharm) => {
    setSelectedCollarCharms(prev => {
      const idx = prev.findIndex(c => c?.id === charm.id)
      if (idx !== -1) { const next = [...prev]; next[idx] = null; return next }
      const empty = prev.findIndex(c => c === null)
      if (empty === -1) return prev
      const next = [...prev]; next[empty] = charm; return next
    })
  }
  const selectedCollarCharmCount = selectedCollarCharms.filter(Boolean).length
  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleCharmDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSelectedCollarCharms(prev => {
        const oldIndex = prev.findIndex((_, i) => `slot-${i}` === active.id)
        const newIndex = prev.findIndex((_, i) => `slot-${i}` === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // ── Mobile gallery slider ──
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent, length: number) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -40) setActiveSlide(s => Math.min(s + 1, length - 1))
    else if (dx > 40) setActiveSlide(s => Math.max(s - 1, 0))
  }

  useEffect(() => {
    getCollars().then((data) => {
      setCollars(data)
      const collarId = product.id.replace(/^collar-/, '')
      const match = data.find((c) => c.id === collarId || c.handle === collarId)
        ?? data.find((c) => c.color === product.accentColor)
        ?? data[0]
        ?? null
      setCollar(match)
      if (match) {
        setSelectedColor(match.colors[0] ?? '')
        setSelectedSize(match.sizes[1] ?? match.sizes[0] ?? '')
      }
    })
    getCharms().then(setCharms)
  }, [isCollar, product.accentColor])

  // Collar add to cart → pick variant by color+size, redirect to /cart
  const addCollarToCart = async () => {
    if (!collar) return
    const variant = collar.variants.find(v =>
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
    ) ?? collar.variants.find(v => selectedSize ? v.size === selectedSize : true) ?? collar.variants[0]
    const variantId = variant?.id ?? collar.variantId
    await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }])
    router.push('/cart')
  }

  // When selecting a charm, also sync the color filter
  const handleCharmSelect = (charm: ShopifyCharm) => {
    setSelectedCharm(prev => prev?.id === charm.id ? null : charm)
    if (charm.color) setCharmColor(charm.color)
    setCharmGalleryIndex(0)
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

  // Filtered charms for the charm picker (charm product page)
  const filteredCharms = useMemo(() => {
    if (!product.charmVariants) return []
    let list = charmTab === 'all'
      ? [...product.charmVariants]
      : product.charmVariants.filter((c) => c.category === charmTab)
    if (charmColor !== 'all') list = list.filter((c) => c.color === charmColor)
    if (charmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(charmQuery.toLowerCase()))
    return list
  }, [product.charmVariants, charmTab, charmColor, charmQuery])

  const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', green: '#A8D5A2', red: '#F4B5C0', yellow: '#F9E4A0' }

  // Filtered charms for the personalise dialog (collar product page)
  const filteredCollarCharms = useMemo(() => {
    let list = collarCharmTab === 'all' ? [...charms] : charms.filter((c) => c.category === collarCharmTab)
    if (collarCharmColor !== 'all') list = list.filter((c) => c.bg === COLOR_BG_MAP[collarCharmColor])
    if (collarCharmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(collarCharmQuery.toLowerCase()))
    return list
  }, [charms, collarCharmTab, collarCharmColor, collarCharmQuery])

  const addCollarCharmToCart = async () => {
    const picked = selectedCollarCharms.filter(Boolean) as ShopifyCharm[]
    if (!picked.length) return
    setCharmAdded(true)
    await addLinesToCart(picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })))
    setTimeout(() => { setCharmAdded(false); setPersonaliseOpen(false) }, 800)
  }

  const collarHandle = product.id.replace(/^collar-/, '')
  const galleryKey = collarHandle.replace(/-collar$/, '')
  const localGallery = COLLAR_GALLERY[galleryKey] ?? COLLAR_GALLERY[collarHandle] ?? COLLAR_GALLERY[collar?.handle ?? ''] ?? []
  const gallery = (collar?.images && collar.images.length > 0) ? collar.images : localGallery

  const NAV_H = 72
  const displayAccentColor = selectedCharm?.bg ?? product.accentColor
  const displayImage = selectedCharm?.image ?? product.image ?? ''
  const displayName = selectedCharm?.title ?? product.name
  const displayPrice = selectedCharm?.price ?? product.price
  const charmGallery = product.images.length > 0
    ? product.images
    : selectedCharm?.image
      ? [selectedCharm.image]
      : []
  const charmHeroImage = charmGallery[charmGalleryIndex] ?? charmGallery[0] ?? ''

  return (
    <div className="bg-cream min-h-screen font-sans">
      <LandingNav topOffset={0} />

      {/* ── Mobile layout ── */}
      {isMobile && isCollar && (
        <div style={{ paddingTop: NAV_H }}>
          <div style={{ padding: '16px 20px 0' }}>
            {/* Slider */}
            <div style={{ height: 320, borderRadius: 20, overflow: 'hidden', position: 'relative' }} onTouchStart={handleTouchStart} onTouchEnd={(e) => handleTouchEnd(e, gallery.length)}>
              <div ref={sliderRef} style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
                {gallery.map((src, i) => (
                  <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                    <img src={src} alt={i === 0 ? `${collar?.title ?? ''} collar` : ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {i === 0 && collar?.title && (
                      <div style={{ position: 'absolute', bottom: 14, left: 14, background: collar.color, padding: '5px 14px', borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, color: '#3D3530', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {collar.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveSlide(s => Math.max(0, s - 1))} style={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Previous" />
              <button onClick={() => setActiveSlide(s => Math.min(gallery.length - 1, s + 1))} style={{ position: 'absolute', right: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Next" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {gallery.map((_, i) => (
                <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? '#3D3530' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
              ))}
            </div>
          </div>

          {/* Right panel on mobile */}
          <div style={{ padding: '24px 20px 80px' }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} price={collar?.price ?? product.price} name={collar?.title ?? product.name} showCharms={!isCharmProduct} />
          </div>
        </div>
      )}

      {/* ── Mobile charm layout ── */}
      {isMobile && !isCollar && (
        <div style={{ paddingTop: NAV_H }}>
          <div style={{ margin: '16px 16px 0' }}>
            <div style={{ borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: displayAccentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1' }}>
              {charmHeroImage ? <img src={charmHeroImage} alt={displayName} style={{ width: '65%', height: '65%', objectFit: 'contain' }} /> : null}
            </div>
            {charmGallery.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                {charmGallery.slice(1).map((src, i) => (
                  <div key={i} onClick={() => setCharmGalleryIndex(i + 1)} style={{ borderRadius: 12, overflow: 'hidden', background: displayAccentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: charmGalleryIndex === i + 1 ? '2px solid #3D3530' : 'none' }}>
                    <img src={src} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
            {/* charm right panel content — same as desktop below */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, color: '#9B948F' }}>Snap-on charm</p>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: '#3D3530' }}>{displayName}</h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#3D3530' }}>{displayPrice}</span>
                <span style={{ fontSize: 14, color: '#9B948F' }}>free shipping over €50</span>
              </div>
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} />
                <CharmPicker charms={filteredCharms} selected={selectedCharm} onSelect={handleCharmSelect} tab={charmTab} onTabChange={setCharmTab} query={charmQuery} onQueryChange={setCharmQuery} />
              </>
            )}
            <div style={{ height: 1, background: '#EDEAE4' }} />
            <CharmCTA added={added} price={displayPrice} onClick={addCharmToCart} isMobile />
            {product.charmVariants && <CharmAccordion product={product} />}
          </div>
        </div>
      )}

      {/* ── Desktop layout ── */}
      {!isMobile && (
      <div
        className="w-full mx-auto px-5 md:px-10"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 440px',
          gap: 32,
          minHeight: '80vh',
          maxWidth: 1200,
          marginTop: NAV_H,
          paddingBottom: 64,
          
          
        }}
      >
        {/* ── LEFT ── */}
        {isCollar ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden',
            }}
          >
            {gallery.map((src, i) => (
              <div key={i} style={{ borderRadius: i === 0 ? '20px 8px 8px 8px' : i === 1 ? '8px 20px 8px 8px' : i === 2 ? '8px 8px 8px 20px' : '8px 8px 20px 8px', overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1' }}>
                <img src={src} alt={i === 0 ? `${collar?.title ?? ''} collar` : ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
                {i === 0 && (
                  <div style={{ position: 'absolute', bottom: 14, left: 14, background: collar?.color, padding: '5px 14px', borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, color: '#3D3530', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {collar?.title ?? ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Desktop charm left */
          <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: displayAccentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1' }}>
              {charmHeroImage ? <img src={charmHeroImage} alt={displayName} style={{ width: '65%', height: '65%', objectFit: 'contain' }} /> : null}
            </div>
            {charmGallery.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {charmGallery.slice(1).map((src, i) => (
                  <div key={i} onClick={() => setCharmGalleryIndex(i + 1)} style={{ borderRadius: i === charmGallery.length - 3 ? '8px 8px 8px 20px' : i === charmGallery.length - 2 ? '8px 8px 20px 8px' : 8, overflow: 'hidden', background: displayAccentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: charmGalleryIndex === i + 1 ? '2px solid #3D3530' : 'none' }}>
                    <img src={src} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RIGHT (desktop only) ── */}
        {isCollar ? (
          <div style={{ overflowY: 'auto', paddingLeft: 8, paddingRight: 8 }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} price={collar?.price ?? product.price} name={collar?.title ?? product.name} product={product} showCharms={!isCharmProduct} />
          </div>
        ) : (
          /* Desktop charm right */
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, color: '#9B948F' }}>Snap-on charm</p>
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, lineHeight: 1.2, color: '#3D3530' }}>{displayName}</h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: TEXT_PRIMARY }}>{displayPrice}</span>
                <span style={{ fontSize: 14, color: TEXT_MUTED }}>free shipping over €50</span>
              </div>
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} />
                <CharmPicker charms={filteredCharms} selected={selectedCharm} onSelect={handleCharmSelect} tab={charmTab} onTabChange={setCharmTab} query={charmQuery} onQueryChange={setCharmQuery} />
              </>
            )}
            <div style={{ height: 1, background: DIVIDER }} />
            <CharmCTA added={added} price={displayPrice} onClick={addCharmToCart} isMobile={false} />
            {product.charmVariants && <CharmAccordion product={product} />}
          </div>
        )}
      </div>
      )} {/* end !isMobile */}

      <BentoSection isDark={false} />
      <PhotoSlider />
      <Reviews />
      <LandingFooter />

      {/* ── Personalise charm dialog ── */}
      {personaliseOpen && (
        <div
          onClick={() => setPersonaliseOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(61,53,48,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FAF7F2', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 600, padding: '28px 24px 40px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "'DM Sans',sans-serif" }}>Add a charm</h2>
              <button onClick={() => setPersonaliseOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
            </div>

            {/* 5-slot sortable preview */}
            <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleCharmDragEnd}>
              <SortableContext items={selectedCollarCharms.map((_, i) => `slot-${i}`)} strategy={horizontalListSortingStrategy}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {selectedCollarCharms.map((charm, i) => (
                    <SortableCharmSlot key={`slot-${i}`} id={`slot-${i}`} charm={charm} onRemove={() => charm && toggleCollarCharm(charm)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Color filter */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[
                { key: 'all', label: 'All', hex: null },
                { key: 'blue', label: 'Blue', hex: '#B8D8F4' },
                { key: 'green', label: 'Green', hex: '#A8D5A2' },
                { key: 'red', label: 'Pink', hex: '#F4B5C0' },
                { key: 'yellow', label: 'Yellow', hex: '#F9E4A0' },
              ].map(({ key, label, hex }) => (
                <button
                  key={key}
                  onClick={() => setCollarCharmColor(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: hex ? '6px 12px 6px 8px' : '6px 12px',
                    borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500,
                    background: collarCharmColor === key ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                    color: collarCharmColor === key ? '#FAF7F2' : TEXT_PRIMARY,
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
                charms={filteredCollarCharms}
                selected={null}
                selectedIds={selectedCollarCharms.filter(Boolean).map(c => c!.id)}
                onSelect={toggleCollarCharm}
                tab={collarCharmTab}
                onTabChange={setCollarCharmTab}
                query={collarCharmQuery}
                onQueryChange={setCollarCharmQuery}
              />
            </div>

            {/* CTA */}
            <button
              onClick={addCollarCharmToCart}
              disabled={!selectedCollarCharmCount}
              style={{
                width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: selectedCollarCharmCount ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16,
                background: selectedCollarCharmCount ? '#A8D5A2' : '#E8E3DC',
                color: selectedCollarCharmCount ? '#2A5A25' : TEXT_MUTED,
                transition: 'background 150ms',
              }}
            >
              {charmAdded ? '✓ Added to cart!' : selectedCollarCharmCount ? `Add ${selectedCollarCharmCount} charm${selectedCollarCharmCount > 1 ? 's' : ''} to cart` : 'Select up to 5 charms'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SortableCharmSlot({ id, charm, onRemove }: { id: string; charm: ShopifyCharm | null; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onRemove}
      style={{
        flex: 1, aspectRatio: '1/1', maxWidth: 64, borderRadius: 16,
        border: charm ? `2px solid ${TEXT_PRIMARY}` : `2px dashed rgba(61,53,48,0.2)`,
        background: charm ? charm.bg + '44' : 'rgba(61,53,48,0.04)',
        cursor: charm ? 'grab' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 6,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
      }}
      title={charm?.title}
    >
      {charm?.image
        ? <img src={charm.image} alt={charm.title} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
        : <span style={{ fontSize: 18, color: 'rgba(61,53,48,0.2)', pointerEvents: 'none' }}>+</span>
      }
    </div>
  )
}

// Color name → hex swatch mapping for display
const COLOR_SWATCHES: Record<string, string> = {
  Pink:       '#F4B5C0',
  Blue:       '#B8D8F4',
  Cyan:       '#A8E6E6',
  'Blue/Green': '#A8D5C8',
  Green:      '#A8D5A2',
  Black:      '#3D3530',
}

interface CollarPDPProps {
  collar: ShopifyCollar | null
  selectedColor: string
  selectedSize: string
  onColorChange: (c: string) => void
  onSizeChange: (s: string) => void
  onAddToCart: () => void
  onPersonalise: () => void
  selectedCharmCount?: number
  selectedCharms?: (ShopifyCharm | null)[]
  price: string
  name: string
  product?: ProductDetail
  showCharms?: boolean
}

function CollarPDP ({ collar, selectedColor, selectedSize, onColorChange, onSizeChange, onAddToCart, onPersonalise, selectedCharmCount, selectedCharms, price, name, product, showCharms = true }: CollarPDPProps) {
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  const hasColors = (collar?.colors?.length ?? 0) > 0
  const hasSizes = (collar?.sizes?.length ?? 0) > 0

  const handleAddToCart = async () => {
    setAdded(true)
    await onAddToCart()
    setTimeout(() => setAdded(false), 800)
  }

  const accordionItems = [
    { id: 'description', title: 'Description',       content: collar?.description  || 'Waterproof silicone collar with snap-on charms. Lightweight, adjustable fit with safe-release buckle.' },
    { id: 'features',    title: 'Product Features',  content: collar?.features     || 'Waterproof silicone construction · lightweight adjustable fit · safe-release buckle · dirt and odor resistance.' },
    { id: 'includes',    title: 'Set Includes',      content: collar?.set_includes || 'Base collar in your chosen colour and size. Five interchangeable snap-on charms. Adjustable safe-release buckle. Linen storage pouch.' },
    { id: 'care',        title: 'Care',              content: collar?.care         || 'Rinse after every swim or muddy walk. Air dry flat — no tumble dryers. Wipe charms with a damp cloth, then air dry.' },
    { id: 'shipping',    title: 'Shipping & Returns', content: collar?.shipping    || 'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days of purchase in original condition.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
      {/* Title & price */}
      <div>
        <p style={{ margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, color: TEXT_MUTED }}>Waterproof Collar</p>
        <h1 style={{ margin: '0 0 10px', fontSize: 34, lineHeight: 1.15, color: TEXT_PRIMARY, fontFamily: "'Luckiest Guy', cursive" }}>{name}</h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 26, color: TEXT_PRIMARY }}>{price}</span>
          <span style={{ fontSize: 14, color: TEXT_MUTED }}>free shipping over €50</span>
        </div>
      </div>

      {/* Color swatches */}
      {hasColors && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Color</span>
            {selectedColor && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{selectedColor}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {collar!.colors.map((c) => {
              const hex = COLOR_SWATCHES[c] ?? '#ccc'
              const isSelected = c === selectedColor
              return (
                <button
                  key={c}
                  title={c}
                  onClick={() => onColorChange(c)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: hex,
                    boxShadow: isSelected ? `0 0 0 2px #FAF7F2, 0 0 0 4px ${TEXT_PRIMARY}` : '0 0 0 1.5px rgba(61,53,48,0.15)',
                    transition: 'box-shadow 150ms',
                  }}
                  aria-label={c}
                  aria-pressed={isSelected}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      {hasSizes && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Size</span>
            {selectedSize && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{selectedSize}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {collar!.sizes.map((s) => {
              const isSelected = s === selectedSize
              return (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  style={{
                    minWidth: 48, padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14,
                    border: `2px solid ${isSelected ? TEXT_PRIMARY : BORDER_COLOR}`,
                    background: isSelected ? TEXT_PRIMARY : 'transparent',
                    color: isSelected ? '#FAF7F2' : TEXT_PRIMARY,
                    transition: 'background 150ms, border-color 150ms, color 150ms',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ height: 1, background: DIVIDER }} />

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
          background: '#A8D5A2', color: '#2a5a25',
          boxShadow: '0 4px 20px rgba(168,213,162,0.45)', transition: 'background-color 150ms ease-out, transform 80ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#A8D5A2'; e.currentTarget.style.transform = 'translateY(0)' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {added ? '✓ Added to cart' : `Add to cart — ${price}`}
      </button>
      {showCharms && (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT_MUTED }}>Charms</span>
          {!!selectedCharmCount && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: TEXT_SECONDARY }}>{selectedCharmCount} selected</span>}
        </div>
        <button
          onClick={onPersonalise}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`,
            background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, transition: 'border-color 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#A8D5A2' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER_COLOR }}
        >
          {selectedCharmCount && selectedCharms ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {selectedCharms.filter(Boolean).map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: c!.bg + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c!.image && <img src={c!.image} alt={c!.title} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                </div>
              ))}
              <span style={{ fontSize: 13, color: TEXT_SECONDARY, marginLeft: 4 }}>Edit</span>
            </div>
          ) : (
            <span>Add charms</span>
          )}
          <span style={{ fontSize: 20, lineHeight: 1, color: TEXT_MUTED }}>+</span>
        </button>
      </div>
      )}
      <p style={{ textAlign: 'center', margin: '-8px 0 0', fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>
        Free shipping over €50 · Made in Lithuania
      </p>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {accordionItems.map((item) => {
          const isOpen = open === item.id
          return (
            <div key={item.id} style={{ borderTop: `1px solid ${DIVIDER}` }}>
              <button
                onClick={() => setOpen(isOpen ? null : item.id)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, textAlign: 'left',
                }}
              >
                {item.title}
                <span style={{ fontSize: 18, color: TEXT_MUTED, lineHeight: 1, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 200ms' }}>+</span>
              </button>
              {isOpen && <RichText value={item.content} style={{ margin: '0 0 16px', color: TEXT_SECONDARY }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CHARM_COLOR_OPTIONS = [
  { value: 'all',    label: 'All',    dot: '#EDEAE4' },
  { value: 'blue',   label: 'Blue',   dot: '#B8D8F4' },
  { value: 'green',  label: 'Green',  dot: '#A8D5A2' },
  { value: 'red',    label: 'Red',    dot: '#F4B5C0' },
  { value: 'yellow', label: 'Yellow', dot: '#F9E4A0' },
]

function CharmColorPicker ({ color, onColorChange }: { color: string; onColorChange: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED, flexShrink: 0 }}>Color</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {CHARM_COLOR_OPTIONS.map(({ value, label, dot }) => (
          <button
            key={value}
            onClick={() => onColorChange(value)}
            title={label}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: color === value ? '2px solid #3D3530' : '2px solid transparent',
              background: dot, cursor: 'pointer', outline: 'none',
              boxShadow: color === value ? '0 0 0 1px rgba(61,53,48,0.15)' : 'none',
              transition: 'border-color 120ms',
              padding: 0,
            }}
            aria-label={label}
            aria-pressed={color === value}
          />
        ))}
      </div>
    </div>
  )
}

function CharmPicker ({
  charms, selected, selectedIds, onSelect, tab, onTabChange, query, onQueryChange,
}: {
  charms: ShopifyCharm[]; selected: ShopifyCharm | null; selectedIds?: string[]; onSelect: (c: ShopifyCharm) => void
  tab: CharmTab; onTabChange: (t: CharmTab) => void; query: string; onQueryChange: (q: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>Choose charm</span>
        {selected && <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{selected.title}</span>}
      </div>
<input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search charms…" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, background: '#F8F5F1', color: TEXT_PRIMARY, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#A8D5A2' }} onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }} />
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {charms.map((charm) => {
            const isSelected = selected?.id === charm.id || selectedIds?.includes(charm.id)
            return (
              <button key={charm.id} onClick={() => onSelect(charm)} title={charm.title} style={{ borderRadius: 10, background: '#F0EBE5', cursor: 'pointer', padding: '6px 4px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, outline: 'none', border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent', boxShadow: isSelected ? '0 0 0 1px rgba(61,53,48,0.08)' : 'none', transition: 'border-color 120ms' }}>
                <img src={charm.image} alt="" aria-hidden="true" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2 }}>{charm.title}</span>
              </button>
            )
          })}
          {charms.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>No charms found</div>}
        </div>
      </div>
    </div>
  )
}

function CharmCTA ({ added, price, onClick, isMobile }: { added: boolean; price: string; onClick: () => void; isMobile: boolean }) {
  return (
    <div>
      <button onClick={onClick} style={{ width: '100%', padding: isMobile ? '14px' : '16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: '0.01em', background: '#A8D5A2', color: '#2a5a25', transition: 'background-color 150ms ease-out, transform 80ms ease-out', boxShadow: '0 4px 20px rgba(168,213,162,0.45)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#A8D5A2'; e.currentTarget.style.transform = 'translateY(0)' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {added ? '✓ Added to cart' : `Add to cart — ${price}`}
      </button>
      <p style={{ textAlign: 'center', marginTop: 2, marginBottom: 0, fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>Free shipping over €50 · Made in Lithuania</p>
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
            {isOpen && <RichText value={item.content} style={{ margin: '0 0 16px', color: '#6B6460' }} />}
          </div>
        )
      })}
    </div>
  )
}
