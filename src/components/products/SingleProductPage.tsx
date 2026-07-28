'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile'
import { CharmBuilderPanel } from '@/components/products/CharmBuilderPanel'
import { CollarConfigurator, ExtraCharmsModal } from '@/components/products/CollarConfigurator'
import { Charm3DGalleryTile } from '@/components/products/Charm3DGalleryTile'
import { LandingNav } from '@/components/landing/LandingNav'
import { TopBar } from '@/components/landing/TopBar'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { FAQ } from '@/components/landing/FAQ'
import { About } from '@/components/landing/About'
import { ProductValueShowcase } from '@/components/products/ProductValueShowcase'
import { ProductStorySection } from '@/components/products/ProductStorySection'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { CharmCard } from '@/components/products/CharmCard'
import { SectionIntro } from '@/components/storefront/SectionIntro'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useCartCount } from '@/hooks/useCartCount'
import { useCollarConfigurator } from '@/lib/useCollarConfigurator'
import type { ShopifyCharm } from '@/lib/shopify'
import { collar3DCharms, collar3DLetters, extractLetter } from '@/lib/collar3dSelection'
import { addLinesToCart } from '@/lib/cart'
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer'
import { trackMetaEvent } from '@/components/shared/MetaPixel'
import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import type { ProductDetail } from '@/lib/catalog'
import { RichText } from '@/components/products/RichText'
import { Accordion } from '@/components/shared/Accordion'
import { GalleryLightbox } from '@/components/products/GalleryLightbox'
import { ProductCard } from '@/components/products/ProductCard'
import { CharmCollectionProductCard } from '@/components/products/CharmCollectionCard'
import { CartToast, type CartToastItem } from '@/components/shared/CartToast'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
import { PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  MAX_CHARMS,
  BORDER_COLOR,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SECONDARY,
  translateColorLabel,
  PDP_REVIEW_RATING,
  PDP_REVIEW_COUNT,
  PDP_TRUST_POINTS,
  PDP_REVIEWS,
} from '@/components/products/pdpConstants'

// Re-exported so existing imports from this file (CharmBuilderPanel.tsx, CharmDecoratorPanel.tsx,
// Collar3DModal.tsx) keep working unchanged — the actual definitions live in pdpConstants.ts, shared
// with the collar configurator (useCollarConfigurator.ts / CollarConfigurator.tsx).
export {
  MAX_CHARMS,
  BORDER_COLOR,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_SECONDARY,
  translateColorLabel,
  PDP_REVIEW_RATING,
  PDP_REVIEW_COUNT,
  PDP_TRUST_POINTS,
  PDP_REVIEWS,
}

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

function getCharmGallerySurface () {
  return 'var(--color-surface-2)'
}

// Used by the charm-product page's own letter-colour recoloring (applyCharmPageLetterColour) —
// the collar configurator has its own copy of this same mapping internally (useCollarConfigurator.ts).
const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', 'sky blue': '#B8D8F4', 'dark blue': '#6B9FD4', green: '#A8D5A2', red: '#F4B5C0', pink: '#F4B5C0', yellow: '#F9E4A0', purple: '#D4B8F4' }

const DEFAULT_CHARM_ACCORDION = [
  { id: 'description', title: 'Aprašymas', content: 'Prisegami silikoniniai pakabukai visiems PawCharms antkakliams. Kiekvienas pakabukas užsisega ir nusiima maždaug per penkias sekundes be įrankių.' },
  { id: 'shipping', title: 'Pristatymas ir grąžinimas', content: 'Nemokamas pristatymas užsakymams nuo 40 € · Pristatymas per 2–4 darbo dienas · Grąžinimas priimamas per 30 dienų, jei prekė originalios būklės' },
]

interface Props {
  product: ProductDetail
  /** 'split' renders the alternate two-column desktop hero: a viewport-height sticky 3D/media stage on the left and an independently scrollable detail panel on the right. */
  layout?: 'standard' | 'split'
}

export function SingleProductPage ({ product, layout = 'standard' }: Props) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const isSplit = layout === 'split'
  const router = useRouter()
  const cartCount = useCartCount()

  const isCollar = product.productType === 'collar'
  const isLeash = product.productType === 'leash'
  const isCollarOrLeash = isCollar || isLeash
  const hasCharmVariants = !!product.charmVariants?.length
  const isCharmProduct = product.tags?.includes('Charm') || product.tags?.includes('Pakabukas') || product.productType === 'charm'
  const showCollar3DViewer = isCollar && !isCharmProduct
  const showCollarCharmPicker = isCollar

  // ── Collar configurator — single source of truth shared with LandingBuySection.tsx ──
  const collarConfigurator = useCollarConfigurator({
    isLeash,
    matchId: product.id.replace(/^collar-/, ''),
    matchSlug: product.slug,
    accentColor: product.accentColor,
  })
  const { collar, charms, mounted, selectedCollarCharms, selectedVariantImage } = collarConfigurator

  // ── Charm page state ──
  const [selectedCharms, setSelectedCharms] = useState<(ShopifyCharm | null)[]>(Array(MAX_CHARMS).fill(null))
  const [charmColor, setCharmColor] = useState<string>(product.charmVariants?.[0]?.bg || '#B8D8F4')
  const [added, setAdded] = useState(false)
  const [charmGalleryIndex, setCharmGalleryIndex] = useState(0)
  const [previewCharmImage, setPreviewCharmImage] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [cartToastItems, setCartToastItems] = useState<CartToastItem[] | null>(null)

  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      value: parseFloat(product.price),
      currency: 'EUR',
    })
    trackGaEvent('view_item', {
      currency: 'EUR',
      value: parseFloat(product.price),
      items: [{ item_id: product.id, item_name: product.name, price: parseFloat(product.price) }],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // ── Mobile gallery slider ──
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeCharmReview, setActiveCharmReview] = useState(0)
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

  // Charm-page-only DnD (the collar configurator owns its own sensors internally)
  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const toggleCharm = (charm: ShopifyCharm) => {
    const isSelected = selectedCharms.some(c => c?.id === charm.id)
    setSelectedCharms(prev => {
      const idx = prev.findIndex(c => c?.id === charm.id)
      if (idx !== -1) { const next = [...prev]; next[idx] = null; return next }
      const empty = prev.findIndex(c => c === null)
      if (empty === -1) return prev
      const next = [...prev]; next[empty] = charm; return next
    })
    // Picking a charm swaps only the top gallery image to that charm's photo — the thumbnails below stay static.
    if (!isSelected && charm.image) {
      setPreviewCharmImage(charm.image)
      setCharmGalleryIndex(0)
    } else if (isSelected) {
      setPreviewCharmImage(current => (current === charm.image ? null : current))
    }
  }
  const selectedCharmCount = selectedCharms.filter(Boolean).length
  const handleCharmPageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSelectedCharms(prev => {
        const oldIndex = prev.findIndex((_, i) => `charm-slot-${i}` === active.id)
        const newIndex = prev.findIndex((_, i) => `charm-slot-${i}` === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // Charm add to cart → opens the cart drawer
  const addCharmToCart = async () => {
    const picked = selectedCharms.filter(Boolean) as ShopifyCharm[]
    if (!picked.length) return
    setAdded(true)
    await addLinesToCart(picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })))
    setCartToastItems(picked.map(c => ({ id: c.id, title: c.title, image: c.image })))
    window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))
    setTimeout(() => setAdded(false), 1400)
  }

  // Unique color options derived from the real charm variants (green excluded)
  const availableColorOptions = useMemo(() => {
    if (!product.charmVariants) return []
    const seenBg = new Set<string>()
    const options: { value: string; label: string; dot: string }[] = []
    for (const charm of product.charmVariants) {
      if (charm.bg && charm.bg !== '#A8D5A2' && !seenBg.has(charm.bg)) {
        seenBg.add(charm.bg)
        options.push({ value: charm.bg, label: translateColorLabel(charm.color), dot: charm.bg })
      }
    }
    return options
  }, [product.charmVariants])

  // Same letter-engraving helpers as the collar page, operating on the charm page's own selectedCharms state.
  const charmPageCharmName = collar3DLetters(selectedCharms).name
  const applyCharmPageLetters = (rawName: string) => {
    const clean = rawName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, MAX_CHARMS)
    const colourHex = charmColor
    const { iconCharms } = collar3DLetters(selectedCharms)
    const newLetterCharms = [...clean]
      .map((letter) => charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex))
      .filter((c): c is ShopifyCharm => !!c)
    const combined = [...newLetterCharms, ...iconCharms].slice(0, MAX_CHARMS)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(MAX_CHARMS - combined.length).fill(null)]
    setSelectedCharms(padded)
  }

  const applyCharmPageLetterColour = (index: number, colourKey: string) => {
    const target = selectedCharms[index]
    if (!target) return
    // Letters pass a COLOR_BG_MAP key ("blue"); icon charms pass their swatch hex directly,
    // since icon variant titles don't reliably carry a usable colour-key (see resolveCharmMeta).
    const colourHex = target.category === 'letter' ? COLOR_BG_MAP[colourKey] : colourKey
    const replacement = target.category === 'letter'
      ? charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === extractLetter(target.baseTitle) && c.bg === colourHex)
      : target.shape
        ? charms.find((c) => c.category === 'icon' && c.shape === target.shape && c.bg === colourHex)
        : undefined
    if (!replacement) return
    // Recolour only the tapped slot — identical letters share the same charm id,
    // so id-based matching would recolour every duplicate at once.
    setSelectedCharms((prev) => prev.map((c, i) => (i === index ? replacement : c)))
  }

  const collarHandle = product.id.replace(/^collar-/, '')
  const galleryKey = collarHandle.replace(/-collar$/, '')
  const localGallery = COLLAR_GALLERY[galleryKey] ?? COLLAR_GALLERY[collarHandle] ?? COLLAR_GALLERY[collar?.handle ?? ''] ?? []
  const rawGallery = [
    selectedVariantImage,
    ...((collar?.images && collar.images.length > 0) ? collar.images : localGallery),
  ].filter((image, index, list): image is string => Boolean(image) && list.indexOf(image) === index)
  const gallery = rawGallery.length > 0
    ? Array.from({ length: 8 }, (_, i) => rawGallery[i % rawGallery.length])
    : []

  const NAV_H = 72
  const splitPanelHeight = `calc(100vh - ${NAV_H}px)`
  const firstSelectedCharm = selectedCharms.find(Boolean) ?? null
  const displayName = selectedCharmCount === 1 ? (firstSelectedCharm?.title ?? product.name) : product.name
  const displayPrice = firstSelectedCharm?.price ?? product.price
  // Picking a charm only replaces the top gallery image (previewCharmImage) — the static
  // product thumbnails below stay in place, same as the collar page's non-3D gallery tiles.
  const baseCharmGallery = product.images.length > 0
    ? product.images
    : firstSelectedCharm?.image
      ? [firstSelectedCharm.image]
      : []
  const charmGallery = previewCharmImage
    ? [previewCharmImage, ...baseCharmGallery.filter((src) => src !== previewCharmImage)]
    : baseCharmGallery
  const visibleCharmGallery = charmGallery.slice(0, 7)
  const safeCharmGalleryIndex = visibleCharmGallery[charmGalleryIndex] ? charmGalleryIndex : 0
  const charmHeroImage = visibleCharmGallery[safeCharmGalleryIndex] ?? visibleCharmGallery[0] ?? ''
  // Every currently selected charm that has a Blender-authored mesh, in pick order — icon charms
  // without one yet (leaf/bow/sun/drop) are dropped, same as the collar's 3D view. Falls back to
  // the static photo gallery when nothing selected is renderable.
  const previewCharms3D = useMemo(() => collar3DCharms(selectedCharms), [selectedCharms])
  const showCharmHero3D = safeCharmGalleryIndex === 0 && previewCharms3D.length > 0
  const charmThumbnails = visibleCharmGallery
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => index !== safeCharmGalleryIndex)
    .slice(0, 4)

  return (
    <div className="bg-cream min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <CartToast items={cartToastItems} onClose={() => setCartToastItems(null)} />
      <TopBar />
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {/* ── Mobile layout ── */}
      {isMobile && isCollarOrLeash && (
        <>
          <div style={{ padding: '16px 20px 0' }}>
            {/* Slider — the 3D preview is slide 0 when this is a collar, so it's visible without any extra tap */}
            {(() => {
              const show3DSlide = showCollar3DViewer
              const totalSlides = gallery.length + (show3DSlide ? 1 : 0)
              const on3DSlide = show3DSlide && activeSlide === 0
              return (
                <>
                  <div
                    style={{ aspectRatio: '1 / 1', borderRadius: 20, overflow: 'hidden', position: 'relative', touchAction: on3DSlide ? 'none' : 'pan-y' }}
                    onPointerDown={(e) => {
                      if (on3DSlide) return
                      if (e.pointerType === 'mouse' && e.button !== 0) return
                      handleSwipeStart(e.clientX)
                    }}
                    onPointerUp={(e) => {
                      if (on3DSlide) return
                      handleSwipeEnd(e.clientX, totalSlides, setActiveSlide)
                    }}
                    onPointerCancel={clearSwipe}
                    onPointerLeave={clearSwipe}
                  >
                    <div ref={sliderRef} style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
                      {show3DSlide && (
                        <Collar3DGalleryTile
                          collar={collar}
                          selectedCharms={selectedCollarCharms}
                          variant="slide"
                        />
                      )}
                      {gallery.map((src, i) => (
                        <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                          <Image
                            src={src}
                            alt={`${collar?.title ?? ''} antkaklis su vardu${i > 0 ? ` — nuotrauka ${i + 1}` : ''}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            priority={i === 0 && !show3DSlide}
                            draggable={false}
                            className='select-none object-cover'
                          />
                        </div>
                      ))}
                    </div>
                    {activeSlide > 0 && (
                      <button
                        onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                        aria-label="Ankstesnis"
                        style={{
                          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-bark)',
                        }}
                      >
                        <ChevronLeft size={16} strokeWidth={2.2} />
                      </button>
                    )}
                    {activeSlide < totalSlides - 1 && (
                      <button
                        onClick={() => setActiveSlide(s => Math.min(totalSlides - 1, s + 1))}
                        aria-label="Kitas"
                        style={{
                          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-bark)',
                        }}
                      >
                        <ChevronRight size={16} strokeWidth={2.2} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                    {Array.from({ length: totalSlides }, (_, i) => (
                      <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                    ))}
                  </div>
                  {gallery.length > 1 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      {gallery.slice(0, 4).map((src, i) => {
                        const slideIndex = show3DSlide ? i + 1 : i
                        return (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            onClick={() => setActiveSlide(slideIndex)}
                            aria-label={`Rodyti nuotrauką ${i + 1}`}
                            style={{
                              flex: '1 0 0', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', position: 'relative',
                              border: `1px solid ${activeSlide === slideIndex ? 'var(--color-bark)' : 'var(--color-border)'}`,
                              padding: 0, cursor: 'pointer', background: 'none',
                            }}
                          >
                            <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          {/* Right panel on mobile */}
          <div style={{ padding: '24px 20px 104px' }}>
            <CollarConfigurator
              configurator={collarConfigurator}
              name={collar?.parentTitle ?? product.name}
              price={collar?.price ?? product.price}
              videos={product.videos}
              showCharms={showCollarCharmPicker}
            />
          </div>
        </>
      )}

      {/* ── Mobile charm layout ── */}
      {isMobile && !isCollarOrLeash && (
        <>
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
                    {index === 0 && showCharmHero3D ? (
                      <Charm3DGalleryTile items={previewCharms3D} variant="slide" />
                    ) : (
                      <Image
                        src={src}
                        alt={index === safeCharmGalleryIndex ? displayName : ''}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        priority={index === safeCharmGalleryIndex && index === 0}
                        draggable={false}
                        className='select-none object-cover'
                      />
                    )}
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
                  <div key={index} onClick={() => setCharmGalleryIndex(index)} style={{ width: index === safeCharmGalleryIndex ? 20 : 6, height: 6, borderRadius: 3, background: index === safeCharmGalleryIndex ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <CharmBuilderPanel
              isMobile
              displayName={displayName}
              displayPrice={displayPrice}
              originalPrice={firstSelectedCharm?.originalPrice ?? product.originalPrice}
              product={product}
              hasCharmVariants={hasCharmVariants}
              charmColor={charmColor}
              onCharmColorChange={setCharmColor}
              colorOptions={availableColorOptions}
              mounted={mounted}
              dndSensors={dndSensors}
              selectedCharms={selectedCharms}
              onDragEnd={handleCharmPageDragEnd}
              onToggleCharm={toggleCharm}
              charmName={charmPageCharmName}
              onCharmNameChange={applyCharmPageLetters}
              onCharmColourAt={applyCharmPageLetterColour}
              onNeedMoreCharms={() => collarConfigurator.setExtraCharmsOpen(true)}
              allCharms={charms}
              activeReview={activeCharmReview}
              onActiveReviewChange={setActiveCharmReview}
              added={added}
              selectedCharmCount={selectedCharmCount}
              onAddToCart={addCharmToCart}
            />
          </div>
        </>
      )}

      {/* ── Desktop layout ── */}
      {!isMobile && (
      <div
        className="w-full mx-auto px-6"
        style={{ maxWidth: 1200, paddingBottom: 48 }}
      >
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="font-sans" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 12, fontSize: 13, color: 'var(--color-bark-muted)' }}>
          <Link href="/products" style={{ color: 'var(--color-bark-muted)', textDecoration: 'none' }}>Parduotuvė</Link>
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
        {isCollarOrLeash ? (
          isSplit ? (
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, borderRadius: 24, overflow: 'hidden', background: 'var(--color-surface-2)' }}>
              {showCollar3DViewer ? (
                <Collar3DGalleryTile
                  collar={collar}
                  selectedCharms={selectedCollarCharms}
                  variant='slide'
                />
              ) : gallery[0] ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={gallery[0]}
                    alt={`${collar?.title ?? ''} antkaklis`}
                    fill
                    sizes='50vw'
                    priority
                    className='object-cover'
                  />
                </div>
              ) : null}
            </div>
          ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden',
            }}
          >
            {showCollar3DViewer && (
              <Collar3DGalleryTile
                collar={collar}
                selectedCharms={selectedCollarCharms}
              />
            )}
            {gallery.map((src, i) => (
              <button
                key={i}
                type='button'
                onClick={() => setLightboxIndex(i)}
                aria-label='Padidinti nuotrauką'
                style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1', border: 'none', padding: 0, cursor: 'zoom-in' }}
              >
                <Image
                  src={src}
                  alt={i === 0 ? `${collar?.title ?? ''} antkaklis` : ''}
                  fill
                  sizes='(max-width: 1280px) 50vw, 600px'
                  priority={i === 0}
                  className='object-cover'
                />
              </button>
            ))}
          </div>
          )
        ) : (
          isSplit ? (
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, borderRadius: 24, overflow: 'hidden', background: getCharmGallerySurface() }}>
              {showCharmHero3D ? (
                <Charm3DGalleryTile items={previewCharms3D} variant='slide' />
              ) : charmHeroImage ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={charmHeroImage} alt={displayName} fill sizes='50vw' priority className='object-cover' />
                </div>
              ) : null}
            </div>
          ) : (
          /* Desktop charm left — same grid layout as the collar page: full-width hero on top, 2x2 thumbnail grid below */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden' }}>
            {showCharmHero3D ? (
              <Charm3DGalleryTile items={previewCharms3D} variant="grid" />
            ) : (
              <div style={{ gridColumn: 'span 2', borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1', position: 'relative' }}>
                {charmHeroImage ? <Image src={charmHeroImage} alt={displayName} fill sizes='(max-width: 1280px) 50vw, 600px' priority className='object-cover' /> : null}
              </div>
            )}
            {charmThumbnails.map(({ src, index }, thumbIndex) => (
              <div key={`${src}-${index}`} onClick={() => setCharmGalleryIndex(index)} style={{ borderRadius: thumbIndex === charmThumbnails.length - 2 ? '8px 8px 8px 20px' : thumbIndex === charmThumbnails.length - 1 ? '8px 8px 20px 8px' : 8, overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: safeCharmGalleryIndex === index ? '2px solid var(--color-bark)' : 'none', position: 'relative' }}>
                <Image src={src} alt="" fill sizes='(max-width: 1280px) 25vw, 300px' className='object-cover' />
              </div>
            ))}
          </div>
          )
        )}

        {/* ── RIGHT (desktop only) ── */}
        {isCollarOrLeash ? (
          <div style={isSplit
            ? { position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, overflowY: 'auto', minWidth: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 24 }
            : { position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, paddingLeft: 8, paddingRight: 8 }}
          >
            <CollarConfigurator
              configurator={collarConfigurator}
              name={collar?.parentTitle ?? product.name}
              price={collar?.price ?? product.price}
              videos={product.videos}
              showCharms={showCollarCharmPicker}
            />
          </div>
        ) : (
          /* Desktop charm right */
          <div style={isSplit
            ? { position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }
            : { position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <CharmBuilderPanel
              isMobile={false}
              displayName={displayName}
              displayPrice={displayPrice}
              originalPrice={firstSelectedCharm?.originalPrice ?? product.originalPrice}
              product={product}
              hasCharmVariants={hasCharmVariants}
              charmColor={charmColor}
              onCharmColorChange={setCharmColor}
              colorOptions={availableColorOptions}
              mounted={mounted}
              dndSensors={dndSensors}
              selectedCharms={selectedCharms}
              onDragEnd={handleCharmPageDragEnd}
              onToggleCharm={toggleCharm}
              charmName={charmPageCharmName}
              onCharmNameChange={applyCharmPageLetters}
              onCharmColourAt={applyCharmPageLetterColour}
              onNeedMoreCharms={() => collarConfigurator.setExtraCharmsOpen(true)}
              allCharms={charms}
              activeReview={activeCharmReview}
              onActiveReviewChange={setActiveCharmReview}
              added={added}
              selectedCharmCount={selectedCharmCount}
              onAddToCart={addCharmToCart}
            />
          </div>
        )}
        </div>
      </div>
      )} {/* end !isMobile */}

      {/* Individual charm PDPs (e.g. /products/charm-letter-a-blue) otherwise have no internal
          link pointing to them — the builder above adds variants straight to cart by id, it never
          navigates here. This grid is their only discoverable path, so search traffic landing on
          one still finds the rest instead of hitting a dead end. */}
      {hasCharmVariants && charms.length > 0 && (
        <section className='mx-auto max-w-[1200px] px-4 py-16 md:px-6'>
          <SectionIntro eyebrow='Visi pakabukai' title='Naršykite kiekvieną pakabuką' />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {charms.map((charm) => (
              <CharmCard key={charm.id} charm={charm} />
            ))}
          </div>
        </section>
      )}

      <About showCta={false} />

      <ProductStorySection />

      <ProductValueShowcase name={displayName} />

      <ComparisonTable />
      <PhotoSlider product={product} />
      <FAQ showCta={false} />
      <LandingFooter />

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}

      {/* The charm-product flow's CharmBuilderPanel → CharmDecoratorPanel also exposes a "Reikia
          daugiau pakabukų?" button wired to the same collarConfigurator instance — for the collar/leash
          flow this same modal is already mounted inside <CollarConfigurator />. */}
      {!isCollarOrLeash && <ExtraCharmsModal configurator={collarConfigurator} />}
    </div>
  )
}

const CHARM_COLOR_OPTIONS = [
  { value: 'blue',   label: 'Mėlyna',   dot: '#B8D8F4' },
  { value: 'green',  label: 'Žalia',    dot: '#A8D5A2' },
  { value: 'red',    label: 'Rausva',   dot: '#F4B5C0' },
  { value: 'yellow', label: 'Geltona',  dot: '#F9E4A0' },
]

export function CharmColorPicker ({ color, onColorChange, options }: { color: string; onColorChange: (c: string) => void; options: { value: string; label: string; dot: string }[] }) {
  const selectedLabel = options.find((option) => option.value === color)?.label
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED, flexShrink: 0 }}>Spalva</span>
      {selectedLabel && <span style={{ fontSize: 13, color: TEXT_SECONDARY, flexShrink: 0 }}>{selectedLabel}</span>}
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map(({ value, label, dot }) => (
          <button
            key={value}
            onClick={() => onColorChange(value)}
            title={label}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: color === value ? '2px solid var(--color-bark)' : '2px solid transparent',
              background: dot, cursor: 'pointer', outline: 'none',
              boxShadow: color === value ? '0 0 0 1px var(--color-bark-border)' : 'none',
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

export function CharmCTA ({ added, count, onClick, isMobile }: { added: boolean; count: number; onClick: () => void; isMobile: boolean }) {
  const label = added
    ? '✓ Pridėta į krepšelį!'
    : count > 0
      ? `Pirkti su ${count} pakabuk${count > 1 ? 'ais' : 'u'} →`
      : `Pasirinkite iki ${MAX_CHARMS} pakabukų`
  return (
    <div>
      <button
        onClick={onClick}
        disabled={!count}
        style={{
          width: '100%', padding: isMobile ? '14px' : '16px', borderRadius: 50, border: 'none',
          cursor: count ? 'pointer' : 'not-allowed',
          fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
          background: count ? 'var(--color-sage)' : '#E8E3DC',
          color: count ? 'var(--color-interactive-text)' : TEXT_MUTED,
          transition: 'background-color 150ms ease-out, transform 80ms ease-out',
          boxShadow: count ? '0 4px 20px rgba(168,213,162,0.45)' : 'none',
        }}
        onMouseEnter={(e) => { if (count) { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
        onMouseLeave={(e) => { if (count) { e.currentTarget.style.background = 'var(--color-sage)'; e.currentTarget.style.transform = 'translateY(0)' } }}
        onMouseDown={(e) => { if (count) e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { if (count) e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {label}
      </button>
      <p style={{ textAlign: 'center', marginTop: 2, marginBottom: 0, fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>{FREE_SHIPPING_COPY} · Pagaminta Lietuvoje</p>
    </div>
  )
}

export function CharmAccordion ({ product }: { product: ProductDetail }) {
  const items = [
    {
      id: 'description',
      title: 'Aprašymas',
      content: <RichText value={product.longDescription || DEFAULT_CHARM_ACCORDION[0].content} />,
    },
    {
      id: 'shipping',
      title: 'Pristatymas ir grąžinimas',
      content: <RichText value={product.shipping || DEFAULT_CHARM_ACCORDION[1].content} />,
    },
  ]

  return <Accordion items={items} />
}
