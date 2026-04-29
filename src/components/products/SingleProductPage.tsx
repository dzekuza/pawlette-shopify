'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { LandingNav } from '@/components/landing/LandingNav'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { Reviews } from '@/components/landing/Reviews'
import { FAQ } from '@/components/landing/FAQ'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { BentoSection } from '@/components/BentoSection'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useCartCount } from '@/hooks/useCartCount'
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLinesToCart } from '@/lib/cart'
import type { ProductDetail } from '@/lib/catalog'
import { RichText } from '@/components/products/RichText'
import { ProductCard } from '@/components/products/ProductCard'
import { CharmCollectionProductCard } from '@/components/products/CharmCollectionCard'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars, TestimonialQuoteCard } from '@/components/storefront/TestimonialCard'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'
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
const GALLERY_PHOTO_BG = '#F4EFE8'

function getCharmGallerySurface () {
  return GALLERY_PHOTO_BG
}

const DEFAULT_CHARM_ACCORDION = [
  { id: 'description', title: 'Aprašymas', content: 'Prisegami silikoniniai pakabukai visiems PawCharms antkakliams. Kiekvienas pakabukas užsisega ir nusiima maždaug per penkias sekundes be įrankių.' },
  { id: 'care', title: 'Priežiūra', content: 'Nuvalykite drėgna šluoste ir palikite išdžiūti. Nenaudokite abrazyvinių valiklių.' },
  { id: 'shipping', title: 'Pristatymas ir grąžinimas', content: 'Nemokamas pristatymas užsakymams nuo 40 €. Pristatymas per 2–4 darbo dienas. Grąžinimas per 30 dienų.' },
]

const PDP_REVIEW_RATING = 4.9
const PDP_REVIEW_COUNT = 9
const PDP_TRUST_POINTS = ['2–4 d. pristatymas', '30 d. grąžinimas', 'Pagaminta Lietuvoje']
const PDP_REVIEW_QUOTE = 'Prisisega per kelias sekundes ir net po purvinų pasivaikščiojimų atrodo kaip naujas.'
const DEFAULT_CHARM_COLOR = 'blue'
const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', green: '#A8D5A2', red: '#F4B5C0', yellow: '#F9E4A0' }
const PDP_REVIEWS = [
  {
    quote: PDP_REVIEW_QUOTE,
    author: 'Laima K.',
  },
  {
    quote: 'Minkštas, lengvai valomas, o pakabukai laikėsi vietoje net po lietingo bėgimo parke.',
    author: 'Egle M.',
  },
  {
    quote: 'Gyvai atrodo itin kokybiškai, o mūsų šuo pagaliau turi antkaklį, kuris ir žaismingas, ir tvarkingas.',
    author: 'Rasa T.',
  },
]

const LT_COLOR_LABELS: Record<string, string> = {
  blue: 'Mėlyna',
  green: 'Žalia',
  red: 'Rausva',
  yellow: 'Geltona',
  purple: 'Violetinė',
  pink: 'Rožinė',
  'dark blue': 'Tamsiai mėlyna',
  'ligh blue': 'Šviesiai mėlyna',
  'light blue': 'Šviesiai mėlyna',
}

function translateColorLabel (value: string) {
  return LT_COLOR_LABELS[value.toLowerCase()] ?? value
}

interface Props {
  product: ProductDetail
  recommendedProducts: ProductDetail[]
}

export function SingleProductPage ({ product, recommendedProducts }: Props) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const router = useRouter()
  const cartCount = useCartCount()

  const isCollar = product.productType === 'collar'
  const hasCharmVariants = !!product.charmVariants?.length
  const isCharmProduct = product.tags?.includes('Charm') || product.tags?.includes('Pakabukas') || product.productType === 'charm'

  // ── Collar PDP state ──
  const [, setCollars] = useState<ShopifyCollar[]>([])
  const [charms, setCharms] = useState<ShopifyCharm[]>([])
  const [collar, setCollar] = useState<ShopifyCollar | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')

  // ── Charm page state ──
  const [selectedCharm, setSelectedCharm] = useState<ShopifyCharm | null>(product.charmVariants?.[0] ?? null)
  const [charmTab] = useState<CharmTab>('all')
  const [charmColor, setCharmColor] = useState<string>(product.charmVariants?.[0]?.color || DEFAULT_CHARM_COLOR)
  const [charmQuery, setCharmQuery] = useState('')
  const [added, setAdded] = useState(false)
  const [charmGalleryIndex, setCharmGalleryIndex] = useState(0)

  // ── Personalise dialog ──
  const [personaliseOpen, setPersonaliseOpen] = useState(false)
  const [selectedCollarCharms, setSelectedCollarCharms] = useState<(ShopifyCharm | null)[]>([null,null,null,null,null])
  const [collarCharmTab] = useState<CharmTab>('all')
  const [collarCharmColor, setCollarCharmColor] = useState<string>(DEFAULT_CHARM_COLOR)
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
  const swipeStartX = useRef<number | null>(null)

  const handleSwipeStart = (clientX: number) => {
    swipeStartX.current = clientX
  }
  const handleSwipeEnd = (
    clientX: number,
    length: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (swipeStartX.current === null) return
    const dx = clientX - swipeStartX.current
    swipeStartX.current = null
    if (dx < -40) setIndex(s => Math.min(s + 1, length - 1))
    else if (dx > 40) setIndex(s => Math.max(s - 1, 0))
  }
  const clearSwipe = () => {
    swipeStartX.current = null
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
  }, [isCollar, product.accentColor, product.id])

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
    if (charmColor) list = list.filter((c) => c.color === charmColor)
    if (charmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(charmQuery.toLowerCase()))
    return list
  }, [product.charmVariants, charmTab, charmColor, charmQuery])

  // Filtered charms for the personalise dialog (collar product page)
  const filteredCollarCharms = useMemo(() => {
    let list = collarCharmTab === 'all' ? [...charms] : charms.filter((c) => c.category === collarCharmTab)
    if (collarCharmColor) list = list.filter((c) => c.bg === COLOR_BG_MAP[collarCharmColor])
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
  const displayName = selectedCharm?.title ?? product.name
  const displayPrice = selectedCharm?.price ?? product.price
  const charmGallery = product.images.length > 0
    ? product.images
    : selectedCharm?.image
      ? [selectedCharm.image]
      : []
  const visibleCharmGallery = charmGallery.slice(0, 7)
  const safeCharmGalleryIndex = visibleCharmGallery[charmGalleryIndex] ? charmGalleryIndex : 0
  const charmHeroImage = visibleCharmGallery[safeCharmGalleryIndex] ?? visibleCharmGallery[0] ?? ''
  const charmThumbnails = visibleCharmGallery
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => index !== safeCharmGalleryIndex)
    .slice(0, 6)

  return (
    <div className="bg-cream min-h-screen font-sans">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {/* ── Mobile layout ── */}
      {isMobile && isCollar && (
        <div style={{ paddingTop: NAV_H }}>
          <div style={{ padding: '16px 20px 0' }}>
            {/* Slider */}
            <div
              style={{ height: 320, borderRadius: 20, overflow: 'hidden', position: 'relative', touchAction: 'pan-y' }}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return
                handleSwipeStart(e.clientX)
              }}
              onPointerUp={(e) => handleSwipeEnd(e.clientX, gallery.length, setActiveSlide)}
              onPointerCancel={clearSwipe}
              onPointerLeave={clearSwipe}
            >
              <div ref={sliderRef} style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
                {gallery.map((src, i) => (
                  <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                    <Image
                      src={src}
                      alt={i === 0 ? `${collar?.title ?? ''} antkaklis` : ''}
                      fill
                      sizes='100vw'
                      priority={i === 0}
                      draggable={false}
                      className='select-none object-cover'
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveSlide(s => Math.max(0, s - 1))} style={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Ankstesnis" />
              <button onClick={() => setActiveSlide(s => Math.min(gallery.length - 1, s + 1))} style={{ position: 'absolute', right: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Kitas" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {gallery.map((_, i) => (
                <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? '#3D3530' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
              ))}
            </div>
          </div>

          {/* Right panel on mobile */}
          <div style={{ padding: '24px 20px 104px' }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} price={collar?.price ?? product.price} name={collar?.title ?? product.name} showCharms={!isCharmProduct} />
          </div>
        </div>
      )}

      {/* ── Mobile charm layout ── */}
      {isMobile && !isCollar && (
        <div style={{ paddingTop: NAV_H }}>
          <div style={{ margin: '16px 16px 0' }}>
            <div
              style={{ height: 'auto', borderRadius: 20, overflow: 'hidden', position: 'relative', background: getCharmGallerySurface(), aspectRatio: '1 / 1', touchAction: 'pan-y' }}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return
                handleSwipeStart(e.clientX)
              }}
              onPointerUp={(e) => handleSwipeEnd(e.clientX, visibleCharmGallery.length, setCharmGalleryIndex)}
              onPointerCancel={clearSwipe}
              onPointerLeave={clearSwipe}
            >
              <div style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${safeCharmGalleryIndex * 100}%)` }}>
                {visibleCharmGallery.map((src, index) => (
                  <div key={`${src}-${index}`} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                    <Image
                      src={src}
                      alt={index === safeCharmGalleryIndex ? displayName : ''}
                      fill
                      sizes='100vw'
                      priority={index === safeCharmGalleryIndex && index === 0}
                      draggable={false}
                      className='select-none object-cover'
                    />
                  </div>
                ))}
              </div>
              {visibleCharmGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCharmGalleryIndex((current) => Math.max(current - 1, 0))}
                    style={{ position: 'absolute', left: 0, top: 0, width: '28%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Ankstesnis vaizdas"
                  />
                  <button
                    type="button"
                    onClick={() => setCharmGalleryIndex((current) => Math.min(current + 1, visibleCharmGallery.length - 1))}
                    style={{ position: 'absolute', right: 0, top: 0, width: '28%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Kitas vaizdas"
                  />
                </>
              )}
            </div>
            {visibleCharmGallery.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                {visibleCharmGallery.map((_, index) => (
                  <div key={index} onClick={() => setCharmGalleryIndex(index)} style={{ width: index === safeCharmGalleryIndex ? 20 : 6, height: 6, borderRadius: 3, background: index === safeCharmGalleryIndex ? '#3D3530' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
            {/* charm right panel content — same as desktop below */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, color: '#9B948F' }}>Prisegamas pakabukas</p>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, lineHeight: 1.18, color: '#3D3530' }}>{displayName}</h1>
              <ProductPrice
                currentPrice={displayPrice}
                originalPrice={selectedCharm?.originalPrice ?? product.originalPrice}
                note='Nemokamas pristatymas nuo €50'
                size='detail'
              />
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} />
                <CharmPicker charms={filteredCharms} selected={selectedCharm} onSelect={handleCharmSelect} query={charmQuery} onQueryChange={setCharmQuery} />
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
        style={{ maxWidth: 1200, marginTop: NAV_H, paddingBottom: 64 }}
      >
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 24, paddingBottom: 20, fontSize: 13, color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}>
          <a href="/products" style={{ color: 'var(--color-bark-muted)', textDecoration: 'none' }}>Parduotuvė</a>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: 'var(--color-bark)' }}>{product.name}</span>
        </nav>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 440px',
            gap: 32,
            minHeight: '80vh',
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
                <Image
                  src={src}
                  alt={i === 0 ? `${collar?.title ?? ''} antkaklis` : ''}
                  fill
                  sizes='(max-width: 1280px) 50vw, 600px'
                  priority={i === 0}
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop charm left */
          <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1', position: 'relative' }}>
              {charmHeroImage ? <Image src={charmHeroImage} alt={displayName} fill sizes='(max-width: 1280px) 50vw, 600px' priority className='object-cover' /> : null}
            </div>
            {charmThumbnails.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {charmThumbnails.map(({ src, index }, thumbIndex) => (
                  <div key={`${src}-${index}`} onClick={() => setCharmGalleryIndex(index)} style={{ borderRadius: thumbIndex === charmThumbnails.length - 2 ? '8px 8px 8px 20px' : thumbIndex === charmThumbnails.length - 1 ? '8px 8px 20px 8px' : 8, overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: safeCharmGalleryIndex === index ? '2px solid #3D3530' : 'none', position: 'relative' }}>
                    <Image src={src} alt="" fill sizes='(max-width: 1280px) 25vw, 300px' className='object-cover' />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RIGHT (desktop only) ── */}
        {isCollar ? (
          <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, paddingLeft: 8, paddingRight: 8 }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} price={collar?.price ?? product.price} name={collar?.title ?? product.name} showCharms={!isCharmProduct} />
          </div>
        ) : (
          /* Desktop charm right */
          <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, color: '#9B948F' }}>Prisegamas pakabukas</p>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, lineHeight: 1.14, color: '#3D3530' }}>{displayName}</h1>
              <ProductPrice
                currentPrice={displayPrice}
                originalPrice={selectedCharm?.originalPrice ?? product.originalPrice}
                note='Nemokamas pristatymas nuo €50'
                size='detail'
              />
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} />
                <CharmPicker charms={filteredCharms} selected={selectedCharm} onSelect={handleCharmSelect} query={charmQuery} onQueryChange={setCharmQuery} />
              </>
            )}
            <div style={{ height: 1, background: DIVIDER }} />
            <CharmCTA added={added} price={displayPrice} onClick={addCharmToCart} isMobile={false} />
            {product.charmVariants && <CharmAccordion product={product} />}
          </div>
        )}
        </div>
      </div>
      )} {/* end !isMobile */}

      <BentoSection isDark={false} />
      <PhotoSlider />
      <Reviews />
      <FAQ />
      <RecommendedProductsSection products={recommendedProducts} />
      <LandingFooter />

      {isMobile && isCollar && collar && (
        <div
          style={{
            position: 'fixed',
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 450,
            borderRadius: 22,
            border: `1px solid rgba(61,53,48,0.08)`,
            background: 'rgba(255,253,249,0.96)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 14px 30px rgba(61,53,48,0.16)',
            padding: '12px 12px calc(12px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                Includes 5 charms
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(selectedColor ? translateColorLabel(selectedColor) : 'Spalva')}{selectedSize ? ` • ${selectedSize}` : ''}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY, flexShrink: 0 }}>{collar.price}</div>
          </div>
          <button
            onClick={addCollarToCart}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '0.01em',
              background: '#A8D5A2',
              color: '#2A5A25',
              boxShadow: '0 4px 20px rgba(168,213,162,0.35)',
            }}
          >
            Į krepšelį
          </button>
        </div>
      )}

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
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: TEXT_PRIMARY, fontFamily: "'Luckiest Guy', cursive" }}>Pridėti pakabuką</h2>
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
                    padding: '6px 12px 6px 8px',
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
              {charmAdded ? '✓ Pridėta į krepšelį!' : selectedCollarCharmCount ? `Pridėti ${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'us' : 'ą'} į krepšelį` : 'Pasirinkite iki 5 pakabukų'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RecommendedProductsSection ({ products }: { products: ProductDetail[] }) {
  if (!products.length) return null

  return (
    <section className="bg-cream py-[60px] md:py-[96px]">
      <div className="mx-auto max-w-[1160px] px-5 md:px-10">
        <div className="mb-10 md:mb-12">
          <Eyebrow className="mb-3.5">Rekomenduojami produktai</Eyebrow>
          <DisplayHeading as='h2' className="m-0 text-[28px] tracking-[-0.02em] md:text-[40px]">
            You might also like
          </DisplayHeading>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {products.slice(0, 4).map((recommendedProduct) => (
            recommendedProduct.productType === 'charm'
              ? <CharmCollectionProductCard key={recommendedProduct.slug} product={recommendedProduct} />
              : <ProductCard key={recommendedProduct.slug} product={recommendedProduct} />
          ))}
        </div>
      </div>
    </section>
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
        ? <Image src={charm.image} alt={charm.title} width={52} height={52} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
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
  showCharms?: boolean
}

function CollarPDP ({ collar, selectedColor, selectedSize, onColorChange, onSizeChange, onAddToCart, onPersonalise, selectedCharmCount, selectedCharms, price, name, showCharms = true }: CollarPDPProps) {
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [fitGuideOpen, setFitGuideOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)

  const hasColors = (collar?.colors?.length ?? 0) > 0
  const hasSizes = (collar?.sizes?.length ?? 0) > 0
  const colorOptions = useMemo(() => {
    if (!collar) return []

    return collar.colors.map((colorName) => {
      const matchingVariants = collar.variants.filter((variant) => variant.color === colorName)
      const representativeVariant = matchingVariants.find((variant) => variant.image) ?? matchingVariants[0]

      return {
        color: colorName,
        image: representativeVariant?.image || collar.image,
        fallback: COLOR_SWATCHES[colorName] ?? '#E8E3DC',
      }
    })
  }, [collar])

  const handleAddToCart = async () => {
    setAdded(true)
    await onAddToCart()
    setTimeout(() => setAdded(false), 800)
  }

  const accordionItems = [
    { id: 'description', title: 'Aprašymas',       content: collar?.description  || 'Vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais. Lengvas, reguliuojamas ir su saugia sagtimi.' },
    { id: 'features',    title: 'Savybės',  content: collar?.features     || 'Vandeniui atsparus silikonas · lengvas reguliuojamas prigludimas · saugi sagtis · atsparumas purvui ir kvapams.' },
    { id: 'includes',    title: 'Į rinkinį įeina',      content: collar?.set_includes || 'Pagrindinis pasirinktos spalvos ir dydžio antkaklis. Penki keičiami prisegami pakabukai. Reguliuojama saugi sagtis. Lininis laikymo maišelis.' },
    { id: 'care',        title: 'Priežiūra',              content: collar?.care         || 'Po maudynių ar purvino pasivaikščiojimo nuskalaukite. Džiovinkite padėję lygiai — ne džiovyklėje. Pakabukus nuvalykite drėgna šluoste.' },
    { id: 'shipping',    title: 'Pristatymas ir grąžinimas', content: collar?.shipping    || 'Nemokamas pristatymas užsakymams nuo 40 €. Pristatymas per 2–4 darbo dienas. Grąžinimas priimamas per 30 dienų, jei prekė originalios būklės.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans',sans-serif" }}>
      {/* Title & price */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
          <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontSize: 30, lineHeight: 1.1, color: TEXT_PRIMARY, fontFamily: "'Luckiest Guy', cursive" }}>{name}</h1>
        <ProductPrice
          currentPrice={price}
          originalPrice={collar?.originalPrice}
          note='Nemokamas pristatymas nuo €50'
          size='detail'
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {PDP_TRUST_POINTS.map((point) => (
            <div key={point} style={{ padding: '8px 12px', borderRadius: 999, background: '#FFFDF9', border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
              {point}
            </div>
          ))}
        </div>
      </div>

      {/* Color swatches */}
      {hasColors && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Spalva</span>
            {selectedColor && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{translateColorLabel(selectedColor)}</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {colorOptions.map((option) => {
              const isSelected = option.color === selectedColor
              return (
                <button
                  key={option.color}
                    title={translateColorLabel(option.color)}
                  onClick={() => onColorChange(option.color)}
                  style={{
                    width: 52,
                    height: 52,
                    padding: 0,
                    borderRadius: 14,
                    border: 'none',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: option.fallback,
                    boxShadow: isSelected ? `0 0 0 2px #FAF7F2, 0 0 0 4px ${TEXT_PRIMARY}` : '0 0 0 1.5px rgba(61,53,48,0.15)',
                    transition: 'box-shadow 150ms, transform 150ms',
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
        </div>
      )}

      {/* Size selector */}
      {hasSizes && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Dydis</span>
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
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: TEXT_SECONDARY }}>
              Prieš užsakydami išmatuokite šuns kaklą. Jei esate tarp dydžių, prieš atsiskaitydami pasitikrinkite dydžių gidą.
            </p>
            <button
              type="button"
              onClick={() => setFitGuideOpen(true)}
              style={{
                width: 'fit-content',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#2A5A25',
                textDecoration: 'none',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Kaip išmatuoti tinkamą dydį →
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 1, background: DIVIDER }} />

      {showCharms && (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT_MUTED }}>Įtraukti pakabukai</span>
          {!!selectedCharmCount && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: TEXT_SECONDARY }}>{selectedCharmCount} pasirinkti</span>}
        </div>
        <button
          onClick={onPersonalise}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.55)',
            background: 'linear-gradient(135deg, rgba(255,214,165,0.95) 0%, rgba(255,182,193,0.92) 34%, rgba(184,216,244,0.94) 68%, rgba(168,213,162,0.92) 100%)',
            boxShadow: '0 14px 28px rgba(196,165,145,0.18), inset 0 1px 0 rgba(255,255,255,0.45)',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 18px 34px rgba(196,165,145,0.24), inset 0 1px 0 rgba(255,255,255,0.55)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 14px 28px rgba(196,165,145,0.18), inset 0 1px 0 rgba(255,255,255,0.45)'
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.26), rgba(255,255,255,0) 45%, rgba(255,255,255,0.18) 100%)',
              pointerEvents: 'none',
            }}
          />
          {selectedCharmCount && selectedCharms ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
              {selectedCharms.filter(Boolean).map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: 10, background: c!.bg + '66', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>
                  {c!.image && <Image src={c!.image} alt={c!.title} width={24} height={24} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                </div>
              ))}
              <span style={{ fontSize: 13, color: TEXT_PRIMARY, marginLeft: 4 }}>Redaguoti</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>Pasirinkite 5 pakabukus</span>
              <span style={{ fontSize: 12, color: 'rgba(61,53,48,0.76)' }}>Įeina į šį rinkinį</span>
            </div>
          )}
          <span
            style={{
              color: TEXT_PRIMARY,
              position: 'relative',
              zIndex: 1,
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,253,249,0.55)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
          >
            <Plus aria-hidden size={18} strokeWidth={2.2} />
          </span>
        </button>
        <p style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.45, color: TEXT_MUTED }}>
          Jūsų rinkinyje jau yra penki pakabukai. Čia galite pasirinkti jų derinį prieš atsiskaitymą.
        </p>
      </div>
      )}

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
        {added ? '✓ Pridėta į krepšelį' : `Į krepšelį — ${price}`}
      </button>
      <p style={{ textAlign: 'center', margin: '-8px 0 0', fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>
        Nemokamas pristatymas nuo 50 € · Pagaminta Lietuvoje
      </p>

      <div
        style={{
          marginTop: 14,
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
              <button
                key={review.author}
                type="button"
                onClick={() => setActiveReview(index)}
                aria-label={`Rodyti atsiliepimą ${index + 1}`}
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
              onClick={() => setActiveReview((current) => (current === 0 ? PDP_REVIEWS.length - 1 : current - 1))}
              aria-label="Ankstesnis atsiliepimas"
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
              onClick={() => setActiveReview((current) => (current + 1) % PDP_REVIEWS.length)}
              aria-label="Kitas atsiliepimas"
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

      {fitGuideOpen && (
        <div
          onClick={() => setFitGuideOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 700,
            background: 'rgba(61,53,48,0.42)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 24,
              background: '#FFFDF9',
              boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
              padding: '24px 22px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                  Dydžių gidas
                </div>
                <h3 style={{ margin: '6px 0 0', fontSize: 24, lineHeight: 1.15, color: TEXT_PRIMARY, fontFamily: "'Luckiest Guy', cursive", fontWeight: 400 }}>
                  Kaip išmatuoti savo šunį
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFitGuideOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, lineHeight: 1, color: TEXT_MUTED, padding: 0 }}
                aria-label="Uždaryti dydžių gidą"
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Apjuoskite minkšta matavimo juosta šuns kaklo vidurį ten, kur paprastai būna antkaklis.',
                'Juosta turi priglusti, bet neveržti. Tarp juostos ir kaklo turi tilpti du pirštai.',
                'Jei matmuo patenka tarp dydžių, kasdieniam patogumui rinkitės didesnį.',
              ].map((step, index) => (
                <div key={step} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(168,213,162,0.22)', color: '#2A5A25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: TEXT_SECONDARY }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 16, background: '#F7F2EB', padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: TEXT_PRIMARY }}>
                <strong>Patarimas:</strong> Matuokite dienos pabaigoje, kai šuo atsipalaidavęs. Jei kailis purus, matuokite po juo, o ne virš jo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CHARM_COLOR_OPTIONS = [
  { value: 'blue',   label: 'Mėlyna',   dot: '#B8D8F4' },
  { value: 'green',  label: 'Žalia',    dot: '#A8D5A2' },
  { value: 'red',    label: 'Rausva',   dot: '#F4B5C0' },
  { value: 'yellow', label: 'Geltona',  dot: '#F9E4A0' },
]

function CharmColorPicker ({ color, onColorChange }: { color: string; onColorChange: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED, flexShrink: 0 }}>Spalva</span>
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
  charms, selected, selectedIds, onSelect, query, onQueryChange,
}: {
  charms: ShopifyCharm[]; selected: ShopifyCharm | null; selectedIds?: string[]; onSelect: (c: ShopifyCharm) => void
  query: string; onQueryChange: (q: string) => void
}) {
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const width = useWindowWidth() ?? 1200
  const gridRef = useRef<HTMLDivElement | null>(null)
  const COLLAPSED_ROWS = 3
  const TILE_HEIGHT = 82
  const GRID_GAP = 8
  const collapsedHeight = COLLAPSED_ROWS * TILE_HEIGHT + (COLLAPSED_ROWS - 1) * GRID_GAP
  const expansionKey = `${width}:${query}:${charms.map((charm) => charm.id).join(',')}`
  const expanded = expandedFor === expansionKey

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const grid = gridRef.current
      if (!grid) return
      setHasOverflow(grid.scrollHeight > collapsedHeight + 4)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [charms, query, width, collapsedHeight])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>Rinktis pakabuką</span>
        {selected && <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{selected.title}</span>}
      </div>
<input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Ieškoti pakabukų…" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, background: '#F8F5F1', color: TEXT_PRIMARY, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#A8D5A2' }} onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
        <div
          style={{
            overflowY: expanded ? 'auto' : 'hidden',
            flex: 1,
            minHeight: 0,
            maxHeight: expanded ? undefined : collapsedHeight,
            transition: 'max-height 200ms ease',
          }}
        >
        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8 }}>
          {charms.map((charm) => {
            const isSelected = selected?.id === charm.id || selectedIds?.includes(charm.id)
            return (
              <button key={charm.id} onClick={() => onSelect(charm)} title={charm.title} style={{ minHeight: 82, borderRadius: 10, background: '#F0EBE5', cursor: 'pointer', padding: '8px 6px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, outline: 'none', border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent', boxShadow: isSelected ? '0 0 0 1px rgba(61,53,48,0.08)' : 'none', transition: 'border-color 120ms' }}>
                <Image src={charm.image} alt="" aria-hidden="true" width={34} height={34} style={{ width: 34, height: 34, objectFit: 'contain' }} />
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charm.title}</span>
              </button>
            )
          })}
          {charms.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0', fontSize: 13, color: TEXT_MUTED }}>Pakabukų nerasta</div>}
        </div>
        </div>
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpandedFor((current) => current === expansionKey ? null : expansionKey)}
            style={{
              alignSelf: 'center',
              padding: '0 14px',
              height: 34,
              borderRadius: 999,
              border: `1.5px solid ${BORDER_COLOR}`,
              background: '#FFFDF9',
              color: TEXT_PRIMARY,
              cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {expanded ? 'Rodyti mažiau' : 'Rodyti daugiau'}
          </button>
        )}
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
        {added ? '✓ Pridėta į krepšelį' : `Į krepšelį — ${price}`}
      </button>
      <p style={{ textAlign: 'center', marginTop: 2, marginBottom: 0, fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>Nemokamas pristatymas nuo 50 € · Pagaminta Lietuvoje</p>
    </div>
  )
}

function CharmAccordion ({ product }: { product: ProductDetail }) {
  const [open, setOpen] = useState<string | null>(null)

  const items = [
    { id: 'description', title: 'Aprašymas', content: product.longDescription || DEFAULT_CHARM_ACCORDION[0].content },
    { id: 'care', title: 'Priežiūra', content: product.care || DEFAULT_CHARM_ACCORDION[1].content },
    { id: 'shipping', title: 'Pristatymas ir grąžinimas', content: product.shipping || DEFAULT_CHARM_ACCORDION[2].content },
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
