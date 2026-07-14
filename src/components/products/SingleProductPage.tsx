'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Collar3DModal } from '@/components/products/Collar3DModal'
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile'
import { LandingNav } from '@/components/landing/LandingNav'
import { TopBar } from '@/components/landing/TopBar'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { FAQ } from '@/components/landing/FAQ'
import { About } from '@/components/landing/About'
import { ProductValueShowcase } from '@/components/products/ProductValueShowcase'
import { ProductStorySection } from '@/components/products/ProductStorySection'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useCartCount } from '@/hooks/useCartCount'
import { getCollars, getCharms, getLeashes, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { collar3DLetters, extractLetter } from '@/lib/collar3dSelection'
import { addLinesToCart, fetchCart } from '@/lib/cart'
import { trackMetaEvent } from '@/components/shared/MetaPixel'
import type { ProductDetail } from '@/lib/catalog'
import { RichText } from '@/components/products/RichText'
import { UpsellSection } from '@/components/products/UpsellSection'
import { Accordion } from '@/components/shared/Accordion'
import { GalleryLightbox } from '@/components/products/GalleryLightbox'
import { ProductCard } from '@/components/products/ProductCard'
import { CharmCollectionProductCard } from '@/components/products/CharmCollectionCard'
import { ProductPrice } from '@/components/storefront/ProductPrice'
import { ReviewStars, TestimonialQuoteCard } from '@/components/storefront/TestimonialCard'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'
import { TrustNote } from '@/components/shared/TrustNote'
import { CartToast, type CartToastItem } from '@/components/shared/CartToast'
import { Badge } from '@/components/ui/badge'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
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

const BORDER_COLOR = 'var(--color-border)'
const TEXT_PRIMARY = 'var(--color-bark)'
const TEXT_MUTED = 'var(--color-muted-foreground)'
const TEXT_SECONDARY = 'var(--color-bark-light)'
const DIVIDER = 'var(--color-border)'
const GALLERY_PHOTO_BG = 'var(--color-surface-2)'

function getCharmGallerySurface () {
  return GALLERY_PHOTO_BG
}

const DEFAULT_CHARM_ACCORDION = [
  { id: 'description', title: 'Aprašymas', content: 'Prisegami silikoniniai pakabukai visiems PawCharms antkakliams. Kiekvienas pakabukas užsisega ir nusiima maždaug per penkias sekundes be įrankių.' },
  { id: 'shipping', title: 'Pristatymas ir grąžinimas', content: 'Nemokamas pristatymas užsakymams nuo 40 €. Pristatymas per 2–4 darbo dienas. Grąžinimas per 30 dienų.' },
]

const PDP_REVIEW_RATING = 4.9
const PDP_REVIEW_COUNT = 9
const PDP_TRUST_POINTS = ['2–4 d. pristatymas', '30 d. grąžinimas', 'Pagaminta Lietuvoje']
const CHARM_TINTS = ['var(--color-blossom)', 'var(--color-sky)', 'var(--color-honey)', 'var(--color-blossom)', 'var(--color-sky)']
const PDP_REVIEW_QUOTE = 'Prisisega per kelias sekundes ir net po purvinų pasivaikščiojimų atrodo kaip naujas.'
const DEFAULT_CHARM_COLOR = 'blue'
const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', 'sky blue': '#B8D8F4', 'dark blue': '#6B9FD4', green: '#A8D5A2', red: '#F4B5C0', pink: '#F4B5C0', yellow: '#F9E4A0', purple: '#D4B8F4' }
// Per-letter colour swatches offered when tapping an individual charm slot on the Personalise tile
const CHARM_LETTER_COLOURS = [
  { key: 'blue', label: 'Mėlyna', hex: '#B8D8F4' },
  { key: 'dark blue', label: 'Tamsiai mėlyna', hex: '#6B9FD4' },
  { key: 'pink', label: 'Rožinė', hex: '#F4B5C0' },
  { key: 'yellow', label: 'Geltona', hex: '#F9E4A0' },
  { key: 'purple', label: 'Violetinė', hex: '#D4B8F4' },
]
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
  'sky blue': 'Dangaus mėlyna',
  'sky-blue': 'Dangaus mėlyna',
  'dark blue': 'Tamsiai mėlyna',
  'dark-blue': 'Tamsiai mėlyna',
  green: 'Žalia',
  red: 'Rausva',
  pink: 'Rožinė',
  yellow: 'Geltona',
  purple: 'Violetinė',
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
  const isLeash = product.productType === 'leash'
  const isCollarOrLeash = isCollar || isLeash
  const hasCharmVariants = !!product.charmVariants?.length
  const isCharmProduct = product.tags?.includes('Charm') || product.tags?.includes('Pakabukas') || product.productType === 'charm'

  // ── Collar PDP state ──
  const [allCollars, setAllCollars] = useState<ShopifyCollar[]>([])
  const [charms, setCharms] = useState<ShopifyCharm[]>([])
  const [collar, setCollar] = useState<ShopifyCollar | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')

  // ── Charm page state ──
  const [selectedCharms, setSelectedCharms] = useState<(ShopifyCharm | null)[]>([null,null,null,null,null])
  const [charmTab] = useState<CharmTab>('all')
  const [charmColor, setCharmColor] = useState<string>(product.charmVariants?.[0]?.bg || '#B8D8F4')
  const [charmQuery, setCharmQuery] = useState('')
  const [added, setAdded] = useState(false)
  const [charmGalleryIndex, setCharmGalleryIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      value: parseFloat(product.price),
      currency: 'EUR',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // ── Personalise dialog ──
  const [personaliseOpen, setPersonaliseOpen] = useState(false)
  const [preview3DOpen, setPreview3DOpen] = useState(false)
  const [selectedCollarCharms, setSelectedCollarCharms] = useState<(ShopifyCharm | null)[]>([null,null,null,null,null])
  const [collarCharmTab] = useState<CharmTab>('all')
  const [collarCharmColor, setCollarCharmColor] = useState<string>(DEFAULT_CHARM_COLOR)
  const [collarCharmQuery, setCollarCharmQuery] = useState('')
  const [charmAdded, setCharmAdded] = useState(false)
  const [cartToastItems, setCartToastItems] = useState<CartToastItem[] | null>(null)

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

  useEffect(() => {
    if (isLeash) {
      getLeashes().then((data) => {
        setAllCollars(data)
        const match = data.find((l) => l.handle === product.slug || l.id === product.slug)
          ?? data.find((l) => l.color === product.accentColor)
          ?? data[0]
          ?? null
        setCollar(match)
        if (match) {
          setSelectedColor(match.colors[0] ?? '')
          setSelectedSize(match.sizes[1] ?? match.sizes[0] ?? '')
        }
      })
    } else {
      getCollars().then((data) => {
        setAllCollars(data)
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
    }
    getCharms().then(setCharms)
  }, [isCollar, isLeash, product.accentColor, product.id, product.slug])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setActiveSlide(0)
    const next = allCollars.find(c => c.colors.includes(color) || c.colors[0] === color)
    if (next) {
      setCollar(next)
      setSelectedSize(s => next.sizes.includes(s) ? s : (next.sizes[1] ?? next.sizes[0] ?? ''))
    }
  }

  // Builds the collar line (deduped against the current cart) plus any charms already
  // picked in the Personalise flow, so every "Pirkti" entry point adds the same bundle.
  const buildCollarBundleLines = async () => {
    if (!collar) return { lines: [] as { merchandiseId: string; quantity: number }[], collarAdded: false }
    const variant = collar.variants.find(v =>
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
    ) ?? collar.variants.find(v => selectedSize ? v.size === selectedSize : true) ?? collar.variants[0]
    const variantId = variant?.id ?? collar.variantId
    const existingCart = await fetchCart()
    const collarAlreadyInCart = !!variantId && !!existingCart?.lines.some(l => l.merchandise.id === variantId)
    const collarAdded = !!variantId && !collarAlreadyInCart
    const picked = selectedCollarCharms.filter(Boolean) as ShopifyCharm[]
    return {
      lines: [
        ...(collarAdded ? [{ merchandiseId: variantId!, quantity: 1 }] : []),
        ...picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })),
      ],
      collarAdded,
    }
  }

  // Collar add to cart → bundles the collar + any selected charms in one operation, redirect to /cart
  const addCollarToCart = async () => {
    const { lines, collarAdded } = await buildCollarBundleLines()
    if (!lines.length) return
    await addLinesToCart(lines)
    const pickedCharms = selectedCollarCharms.filter(Boolean) as ShopifyCharm[]
    if (pickedCharms.length) {
      setCartToastItems([
        ...(collarAdded ? [{ id: collar!.id, title: collar!.parentTitle || collar!.title, image: selectedVariantImage || collar!.image }] : []),
        ...pickedCharms.map(c => ({ id: c.id, title: c.title, image: c.image })),
      ])
      setTimeout(() => router.push('/cart'), 1400)
    } else {
      router.push('/cart')
    }
  }

  const toggleCharm = (charm: ShopifyCharm) => {
    setSelectedCharms(prev => {
      const idx = prev.findIndex(c => c?.id === charm.id)
      if (idx !== -1) { const next = [...prev]; next[idx] = null; return next }
      const empty = prev.findIndex(c => c === null)
      if (empty === -1) return prev
      const next = [...prev]; next[empty] = charm; return next
    })
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

  // Charm add to cart → redirect to /cart
  const addCharmToCart = async () => {
    const picked = selectedCharms.filter(Boolean) as ShopifyCharm[]
    if (!picked.length) return
    setAdded(true)
    await addLinesToCart(picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })))
    setCartToastItems(picked.map(c => ({ id: c.id, title: c.title, image: c.image })))
    setTimeout(() => {
      setAdded(false)
      router.push('/cart')
    }, 1400)
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

  // Filtered charms for the charm picker (charm product page) — green excluded
  const filteredCharms = useMemo(() => {
    if (!product.charmVariants) return []
    let list = (charmTab === 'all'
      ? [...product.charmVariants]
      : product.charmVariants.filter((c) => c.category === charmTab)
    ).filter((c) => c.bg !== '#A8D5A2')
    if (charmColor) list = list.filter((c) => c.bg === charmColor)
    if (charmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(charmQuery.toLowerCase()))
    return list
  }, [product.charmVariants, charmTab, charmColor, charmQuery])

  // Filtered charms for the personalise dialog (collar product page) — green excluded
  const filteredCollarCharms = useMemo(() => {
    let list = (collarCharmTab === 'all' ? [...charms] : charms.filter((c) => c.category === collarCharmTab))
      .filter((c) => c.bg !== '#A8D5A2')
    if (collarCharmColor) list = list.filter((c) => c.bg === COLOR_BG_MAP[collarCharmColor])
    if (collarCharmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(collarCharmQuery.toLowerCase()))
    return list
  }, [charms, collarCharmTab, collarCharmColor, collarCharmQuery])

  const addCollarCharmToCart = async () => {
    const picked = selectedCollarCharms.filter(Boolean) as ShopifyCharm[]
    if (!picked.length) return
    setCharmAdded(true)
    const { lines, collarAdded } = await buildCollarBundleLines()
    await addLinesToCart(lines)
    setCartToastItems([
      ...(collarAdded ? [{ id: collar!.id, title: collar!.parentTitle || collar!.title, image: selectedVariantImage || collar!.image }] : []),
      ...picked.map(c => ({ id: c.id, title: c.title, image: c.image })),
    ])
    setTimeout(() => { setCharmAdded(false); setPersonaliseOpen(false) }, 800)
  }

  const applyStarterPack = (offset: number) => {
    const pool = charms.filter(c => c.bg !== '#A8D5A2')
    const pack = pool.slice(offset, offset + 5)
    if (!pack.length) return
    const slots: (ShopifyCharm | null)[] = [null, null, null, null, null]
    pack.forEach((c, i) => { if (i < 5) slots[i] = c })
    setSelectedCollarCharms(slots)
  }

  // Typed word/number entry → maps each character to a matching letter charm,
  // keeping any already-selected icon charms after the typed letters.
  const collarCharmName = collar3DLetters(selectedCollarCharms).name
  const applyCollarLetters = (rawName: string) => {
    const clean = rawName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
    const colourHex = COLOR_BG_MAP[collarCharmColor]
    const { iconCharms } = collar3DLetters(selectedCollarCharms)
    const newLetterCharms = [...clean]
      .map((letter) => charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex))
      .filter((c): c is ShopifyCharm => !!c)
    const combined = [...newLetterCharms, ...iconCharms].slice(0, 5)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(5 - combined.length).fill(null)]
    setSelectedCollarCharms(padded)
  }

  // Recolours a single already-placed letter charm in place, without touching its slot position.
  const applyCollarLetterColour = (charmId: string, colourKey: string) => {
    const target = selectedCollarCharms.find((c) => c?.id === charmId)
    if (!target || target.category !== 'letter') return
    const letter = extractLetter(target.baseTitle)
    const colourHex = COLOR_BG_MAP[colourKey]
    const replacement = charms.find((c) => c.category === 'letter' && extractLetter(c.baseTitle) === letter && c.bg === colourHex)
    if (!replacement) return
    setSelectedCollarCharms((prev) => prev.map((c) => (c?.id === charmId ? replacement : c)))
  }

  const collarHandle = product.id.replace(/^collar-/, '')
  const galleryKey = collarHandle.replace(/-collar$/, '')
  const localGallery = COLLAR_GALLERY[galleryKey] ?? COLLAR_GALLERY[collarHandle] ?? COLLAR_GALLERY[collar?.handle ?? ''] ?? []
  const selectedVariantImage = collar?.variants.find((variant) =>
    (selectedColor ? variant.color === selectedColor : true) &&
    (selectedSize ? variant.size === selectedSize : true)
  )?.image ?? collar?.variants.find((variant) => selectedColor ? variant.color === selectedColor : true)?.image ?? ''
  const rawGallery = [
    selectedVariantImage,
    ...((collar?.images && collar.images.length > 0) ? collar.images : localGallery),
  ].filter((image, index, list): image is string => Boolean(image) && list.indexOf(image) === index)
  const gallery = rawGallery.length > 0
    ? Array.from({ length: 8 }, (_, i) => rawGallery[i % rawGallery.length])
    : []

  const NAV_H = 72
  const firstSelectedCharm = selectedCharms.find(Boolean) ?? null
  const displayName = selectedCharmCount === 1 ? (firstSelectedCharm?.title ?? product.name) : product.name
  const displayPrice = firstSelectedCharm?.price ?? product.price
  const charmGallery = product.images.length > 0
    ? product.images
    : firstSelectedCharm?.image
      ? [firstSelectedCharm.image]
      : []
  const visibleCharmGallery = charmGallery.slice(0, 7)
  const safeCharmGalleryIndex = visibleCharmGallery[charmGalleryIndex] ? charmGalleryIndex : 0
  const charmHeroImage = visibleCharmGallery[safeCharmGalleryIndex] ?? visibleCharmGallery[0] ?? ''
  const charmThumbnails = visibleCharmGallery
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => index !== safeCharmGalleryIndex)
    .slice(0, 6)

  return (
    <div className="bg-cream min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <CartToast items={cartToastItems} onClose={() => setCartToastItems(null)} />
      <TopBar />
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {/* ── Mobile layout ── */}
      {isMobile && isCollarOrLeash && (
        <>
          <div style={{ padding: '16px 20px 0' }}>
            {/* Slider */}
            <div
              style={{ aspectRatio: '1 / 1', borderRadius: 20, overflow: 'hidden', position: 'relative', touchAction: 'pan-y' }}
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
                <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
              ))}
            </div>
          </div>

          {/* Right panel on mobile */}
          <div style={{ padding: '24px 20px 104px' }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={handleColorChange} allCollars={allCollars} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} charmName={collarCharmName} onCharmNameChange={applyCollarLetters} onCharmColourAt={applyCollarLetterColour} price={collar?.price ?? product.price} name={collar?.parentTitle ?? product.name} showCharms={isCollar && !isCharmProduct} upsellItems={isLeash ? recommendedProducts.filter(p => p.productType === 'collar') : recommendedProducts.filter(p => p.productType === 'leash').slice(0, 1)} upsellLabel={isLeash ? 'Suderink su antkaklius' : 'Pridėk pavadėlį su nuolaidą'} />
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
                    <Image
                      src={src}
                      alt={index === safeCharmGalleryIndex ? displayName : ''}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
                  <div key={index} onClick={() => setCharmGalleryIndex(index)} style={{ width: index === safeCharmGalleryIndex ? 20 : 6, height: 6, borderRadius: 3, background: index === safeCharmGalleryIndex ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* charm right panel content — same as desktop below */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
                <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
              </div>
              <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{displayName}</DisplayHeading>
              <ProductPrice
                currentPrice={displayPrice}
                originalPrice={firstSelectedCharm?.originalPrice ?? product.originalPrice}
                note={FREE_SHIPPING_COPY}
                size='detail'
              />
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} options={availableColorOptions} />
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>
                  Pasirinkite iki 5 pakabukų <span style={{ fontWeight: 500, color: 'rgba(61,53,48,0.76)' }}>( Įeina į šį rinkinį )</span>
                </span>
                {mounted ? (
                  <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleCharmPageDragEnd}>
                    <SortableContext items={selectedCharms.map((_, i) => `charm-slot-${i}`)} strategy={horizontalListSortingStrategy}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {selectedCharms.map((charm, i) => (
                          <SortableCharmSlot key={`charm-slot-${i}`} id={`charm-slot-${i}`} charm={charm} onRemove={() => charm && toggleCharm(charm)} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {selectedCharms.map((charm, i) => (
                      <div key={i} style={{ flex: 1, aspectRatio: '1/1', maxWidth: 64, borderRadius: 16, border: charm ? '2px solid var(--color-bark)' : '2px dashed rgba(61,53,48,0.2)', background: charm ? (charm.bg || '#EEE') + '44' : 'rgba(61,53,48,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                        <span style={{ fontSize: 18, color: 'rgba(61,53,48,0.2)' }}>+</span>
                      </div>
                    ))}
                  </div>
                )}
                <CharmPicker charms={filteredCharms} selected={null} selectedIds={selectedCharms.filter(Boolean).map(c => c!.id)} onSelect={toggleCharm} query={charmQuery} onQueryChange={setCharmQuery} />
              </>
            )}
            <div style={{ height: 1, background: 'var(--color-surface-2)' }} />
            {/* Review carousel */}
            <div id="reviews" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', transform: `translateX(-${activeCharmReview * 100}%)`, transition: 'transform 280ms ease' }}>
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
                    <button key={review.author} type="button" onClick={() => setActiveCharmReview(index)} aria-label={`Rodyti atsiliepimą ${index + 1}`} aria-pressed={activeCharmReview === index} style={{ width: activeCharmReview === index ? 20 : 7, height: 7, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: activeCharmReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)', transition: 'width 180ms ease, background 180ms ease' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => setActiveCharmReview((c) => (c === 0 ? PDP_REVIEWS.length - 1 : c - 1))} aria-label="Ankstesnis atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>‹</button>
                  <button type="button" onClick={() => setActiveCharmReview((c) => (c + 1) % PDP_REVIEWS.length)} aria-label="Kitas atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>›</button>
                </div>
              </div>
            </div>
            <CharmCTA added={added} count={selectedCharmCount} onClick={addCharmToCart} isMobile />
            {/* Trust strip */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              {PDP_TRUST_POINTS.map((point) => (
                <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>{point}</div>
              ))}
            </div>
            {product.charmVariants && <CharmAccordion product={product} />}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden',
            }}
          >
            {isCollar && !isCharmProduct && (
              <Collar3DGalleryTile
                collar={collar}
                selectedCharms={selectedCollarCharms}
                onEdit={() => setPreview3DOpen(true)}
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
        ) : (
          /* Desktop charm left */
          <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1', position: 'relative' }}>
              {charmHeroImage ? <Image src={charmHeroImage} alt={displayName} fill sizes='(max-width: 1280px) 50vw, 600px' priority className='object-cover' /> : null}
            </div>
            {charmThumbnails.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {charmThumbnails.map(({ src, index }, thumbIndex) => (
                  <div key={`${src}-${index}`} onClick={() => setCharmGalleryIndex(index)} style={{ borderRadius: thumbIndex === charmThumbnails.length - 2 ? '8px 8px 8px 20px' : thumbIndex === charmThumbnails.length - 1 ? '8px 8px 20px 8px' : 8, overflow: 'hidden', background: getCharmGallerySurface(), display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: safeCharmGalleryIndex === index ? '2px solid var(--color-bark)' : 'none', position: 'relative' }}>
                    <Image src={src} alt="" fill sizes='(max-width: 1280px) 25vw, 300px' className='object-cover' />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RIGHT (desktop only) ── */}
        {isCollarOrLeash ? (
          <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, paddingLeft: 8, paddingRight: 8 }}>
            <CollarPDP collar={collar} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={handleColorChange} allCollars={allCollars} onSizeChange={setSelectedSize} onAddToCart={addCollarToCart} onPersonalise={() => setPersonaliseOpen(true)} selectedCharmCount={selectedCollarCharmCount} selectedCharms={selectedCollarCharms} charmName={collarCharmName} onCharmNameChange={applyCollarLetters} onCharmColourAt={applyCollarLetterColour} price={collar?.price ?? product.price} name={collar?.parentTitle ?? product.name} showCharms={isCollar && !isCharmProduct} upsellItems={isLeash ? recommendedProducts.filter(p => p.productType === 'collar') : recommendedProducts.filter(p => p.productType === 'leash').slice(0, 1)} upsellLabel={isLeash ? 'Suderink su antkaklius' : 'Pridėk pavadėlį su nuolaidą'} />
          </div>
        ) : (
          /* Desktop charm right */
          <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
                <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
              </div>
              <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{displayName}</DisplayHeading>
              <ProductPrice
                currentPrice={displayPrice}
                originalPrice={firstSelectedCharm?.originalPrice ?? product.originalPrice}
                note={FREE_SHIPPING_COPY}
                size='detail'
              />
            </div>
            {hasCharmVariants && (
              <>
                <CharmColorPicker color={charmColor} onColorChange={setCharmColor} options={availableColorOptions} />
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>
                  Pasirinkite iki 5 pakabukų <span style={{ fontWeight: 500, color: 'rgba(61,53,48,0.76)' }}>( Įeina į šį rinkinį )</span>
                </span>
                {mounted ? (
                  <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleCharmPageDragEnd}>
                    <SortableContext items={selectedCharms.map((_, i) => `charm-slot-${i}`)} strategy={horizontalListSortingStrategy}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {selectedCharms.map((charm, i) => (
                          <SortableCharmSlot key={`charm-slot-${i}`} id={`charm-slot-${i}`} charm={charm} onRemove={() => charm && toggleCharm(charm)} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {selectedCharms.map((charm, i) => (
                      <div key={i} style={{ flex: 1, aspectRatio: '1/1', maxWidth: 64, borderRadius: 16, border: charm ? '2px solid var(--color-bark)' : '2px dashed rgba(61,53,48,0.2)', background: charm ? (charm.bg || '#EEE') + '44' : 'rgba(61,53,48,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                        <span style={{ fontSize: 18, color: 'rgba(61,53,48,0.2)' }}>+</span>
                      </div>
                    ))}
                  </div>
                )}
                <CharmPicker charms={filteredCharms} selected={null} selectedIds={selectedCharms.filter(Boolean).map(c => c!.id)} onSelect={toggleCharm} query={charmQuery} onQueryChange={setCharmQuery} />
              </>
            )}
            <div style={{ height: 1, background: DIVIDER }} />
            {/* Review carousel */}
            <div id="reviews" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', transform: `translateX(-${activeCharmReview * 100}%)`, transition: 'transform 280ms ease' }}>
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
                    <button key={review.author} type="button" onClick={() => setActiveCharmReview(index)} aria-label={`Rodyti atsiliepimą ${index + 1}`} aria-pressed={activeCharmReview === index} style={{ width: activeCharmReview === index ? 20 : 7, height: 7, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: activeCharmReview === index ? TEXT_PRIMARY : 'rgba(61,53,48,0.18)', transition: 'width 180ms ease, background 180ms ease' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => setActiveCharmReview((c) => (c === 0 ? PDP_REVIEWS.length - 1 : c - 1))} aria-label="Ankstesnis atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>‹</button>
                  <button type="button" onClick={() => setActiveCharmReview((c) => (c + 1) % PDP_REVIEWS.length)} aria-label="Kitas atsiliepimas" style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER_COLOR}`, background: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>›</button>
                </div>
              </div>
            </div>
            <CharmCTA added={added} count={selectedCharmCount} onClick={addCharmToCart} isMobile={false} />
            {/* Trust strip */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              {PDP_TRUST_POINTS.map((point) => (
                <div key={point} className="bg-cream" style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>{point}</div>
              ))}
            </div>
            {product.charmVariants && <CharmAccordion product={product} />}
          </div>
        )}
        </div>
      </div>
      )} {/* end !isMobile */}


      <About />

      <ProductStorySection />

      <ProductValueShowcase name={displayName} />

      <ComparisonTable />
      <PhotoSlider product={product} />
      <FAQ />
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
            border: `1px solid var(--color-bark-divider)`,
            background: 'rgba(255,253,249,0.96)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 14px 30px rgba(61,53,48,0.16)',
            padding: '12px 12px calc(12px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                Iki 5 pakabukų nemokamai
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(selectedColor ? translateColorLabel(selectedColor) : 'Spalva')}{selectedSize ? ` • ${selectedSize}` : ''}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, flexShrink: 0 }}>{collar.price}</div>
          </div>
          <button
            onClick={addCollarToCart}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '0.01em',
              background: 'var(--color-sage)',
              color: 'var(--color-interactive-text)',
              boxShadow: '0 4px 20px rgba(168,213,162,0.35)',
            }}
          >
            {selectedCollarCharmCount
              ? `Pirkti su ${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'ais' : 'u'}`
              : 'Pirkti'}
          </button>
        </div>
      )}

      {/* ── Personalise charm dialog ── */}
      {personaliseOpen && (
        <div
          onClick={() => setPersonaliseOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream" style={{ borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 600, padding: '28px 24px 40px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DisplayHeading as="h2" size="compact" className="m-0" style={{ fontWeight: 400, color: TEXT_PRIMARY }}>Pridėkite pakabukų</DisplayHeading>
                <Badge variant="sage">Nemokama</Badge>
              </div>
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

            {/* Starter packs — one tap fills all 5 slots for shoppers who don't want to hand-pick */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => applyStarterPack(0)}
                style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                ✨ Populiariausias rinkinys
              </button>
              <button
                type="button"
                onClick={() => applyStarterPack(5)}
                style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${BORDER_COLOR}`, background: 'var(--color-cream)', color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                🌸 Gėlių rinkinys
              </button>
            </div>

            {/* Color filter */}
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
              {[
                { key: 'blue', label: 'Mėlyna', hex: '#B8D8F4' },
                { key: 'dark blue', label: 'Tamsiai mėlyna', hex: '#6B9FD4' },
                { key: 'pink', label: 'Rožinė', hex: '#F4B5C0' },
                { key: 'yellow', label: 'Geltona', hex: '#F9E4A0' },
                { key: 'purple', label: 'Violetinė', hex: '#D4B8F4' },
              ].map(({ key, label, hex }) => (
                <button
                  key={key}
                  onClick={() => setCollarCharmColor(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px 6px 8px',
                    borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500,
                    whiteSpace: 'nowrap',
                    background: collarCharmColor === key ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                    color: collarCharmColor === key ? 'var(--color-cream)' : TEXT_PRIMARY,
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
                fontWeight: 600, fontSize: 16,
                background: selectedCollarCharmCount ? 'var(--color-sage)' : '#E8E3DC',
                color: selectedCollarCharmCount ? 'var(--color-interactive-text)' : TEXT_MUTED,
                transition: 'background 150ms',
              }}
            >
              {charmAdded ? '✓ Pridėta į krepšelį!' : selectedCollarCharmCount ? `Į krepšelį su ${selectedCollarCharmCount} pakabuk${selectedCollarCharmCount > 1 ? 'ais' : 'u'}` : 'Pasirinkite bent 1 pakabuką'}
            </button>
            <button
              type="button"
              onClick={() => setPersonaliseOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, textDecoration: 'underline', textAlign: 'center' }}
            >
              Praleisti ir pirkti be pakabukų
            </button>
          </div>
        </div>
      )}

      <Collar3DModal
        open={preview3DOpen}
        onClose={() => setPreview3DOpen(false)}
        collar={collar}
        allCollars={allCollars}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        charms={charms}
        selectedCharms={selectedCollarCharms}
        onCharmsChange={setSelectedCollarCharms}
        charmColorKey={collarCharmColor}
        onCharmColorChange={setCollarCharmColor}
      />

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
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
  Black:      'var(--color-bark)',
}

interface CollarPDPProps {
  collar: ShopifyCollar | null
  allCollars?: ShopifyCollar[]
  selectedColor: string
  selectedSize: string
  onColorChange: (c: string) => void
  onSizeChange: (s: string) => void
  onAddToCart: () => void
  onPersonalise: () => void
  selectedCharmCount?: number
  selectedCharms?: (ShopifyCharm | null)[]
  charmName?: string
  onCharmNameChange?: (name: string) => void
  onCharmColourAt?: (charmId: string, colourKey: string) => void
  price: string
  name: string
  showCharms?: boolean
  upsellItems?: ProductDetail[]
  upsellLabel?: string
}

function CollarPDP ({ collar, allCollars = [], selectedColor, selectedSize, onColorChange, onSizeChange, onAddToCart, onPersonalise, selectedCharmCount, selectedCharms, charmName = '', onCharmNameChange, onCharmColourAt, price, name, showCharms = true, upsellItems, upsellLabel }: CollarPDPProps) {
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [fitGuideOpen, setFitGuideOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [activeColourSlot, setActiveColourSlot] = useState<number | null>(null)
  const [charmRowFocused, setCharmRowFocused] = useState(false)
  const charmRowRef = useRef<HTMLDivElement>(null)
  const charmNameInputRef = useRef<HTMLInputElement>(null)

  const sourceCollars = allCollars.length > 0 ? allCollars : (collar ? [collar] : [])
  const hasColors = sourceCollars.length > 0
  const hasSizes = (collar?.sizes?.length ?? 0) > 0
  const colorOptions = useMemo(() => {
    return sourceCollars.map((c) => {
      const colorName = c.colors[0] ?? ''
      const representativeVariant = c.variants.find((v) => v.image) ?? c.variants[0]
      return {
        color: colorName,
        image: representativeVariant?.image || c.image,
        fallback: COLOR_SWATCHES[colorName] ?? '#E8E3DC',
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCollars, collar])

  const handleAddToCart = async () => {
    setAdded(true)
    await onAddToCart()
    setTimeout(() => setAdded(false), 800)
  }

  const accordionItems = [
    { id: 'description', title: 'Aprašymas',       content: collar?.description  || 'Vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais. Lengvas, reguliuojamas ir su saugia sagtimi.' },
    { id: 'features',    title: 'Savybės',  content: collar?.features     || 'Vandeniui atsparus silikonas · lengvas reguliuojamas prigludimas · saugi sagtis · atsparumas purvui ir kvapams.' },
    { id: 'includes',    title: 'Į rinkinį įeina',      content: collar?.set_includes || 'Pagrindinis pasirinktos spalvos ir dydžio antkaklis. Penki keičiami prisegami pakabukai. Reguliuojama saugi sagtis. Lininis laikymo maišelis.' },
    { id: 'shipping',    title: 'Pristatymas ir grąžinimas', content: collar?.shipping    || 'Nemokamas pristatymas užsakymams nuo 40 €. Pristatymas per 2–4 darbo dienas. Grąžinimas priimamas per 30 dienų, jei prekė originalios būklės.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title & price */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(61,53,48,0.05)', color: TEXT_PRIMARY, marginBottom: 18 }}>
          <ReviewStars rating={PDP_REVIEW_RATING} className='gap-[2px]' showValue={false} textClassName='text-bark' />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{PDP_REVIEW_RATING.toFixed(1)} iš {PDP_REVIEW_COUNT} atsiliepimų</span>
        </div>
        <DisplayHeading as="h1" size="compact" className="m-0 mb-[10px]" style={{ lineHeight: 1.1, color: TEXT_PRIMARY }}>{name}</DisplayHeading>
        <ProductPrice
          currentPrice={price}
          originalPrice={collar?.originalPrice}
          note={FREE_SHIPPING_COPY}
          size='detail'
        />
        <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: TEXT_MUTED }}>
          Galutinė kaina skaičiuojama atsiskaitant
        </p>
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
                    boxShadow: isSelected ? `0 0 0 2px var(--color-cream), 0 0 0 4px ${TEXT_PRIMARY}` : '0 0 0 1.5px var(--color-bark-border)',
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
                    fontWeight: 600, fontSize: 14,
                    border: `2px solid ${isSelected ? TEXT_PRIMARY : BORDER_COLOR}`,
                    background: isSelected ? TEXT_PRIMARY : 'transparent',
                    color: isSelected ? 'var(--color-cream)' : TEXT_PRIMARY,
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
                color: 'var(--color-interactive-text)',
                textDecoration: 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>Papuoškite savo antkaklį</span>
          <Badge variant="sage">Nemokama</Badge>
        </div>
        <div
          ref={charmRowRef}
          role="group"
          aria-label="Pasirinkti pakabukus"
          onClick={() => charmNameInputRef.current?.focus()}
          style={{
            width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10,
            padding: 10, borderRadius: 16, cursor: 'text', position: 'relative',
            border: `1px solid ${charmRowFocused ? 'var(--color-sage)' : 'rgba(255,214,165,0.95)'}`,
            outline: 'none',
          }}
        >
          <input
            ref={charmNameInputRef}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={5}
            value={charmName}
            aria-label="Įrašykite raides"
            onChange={(e) => {
              const next = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5)
              onCharmNameChange?.(next)
            }}
            onFocus={() => setCharmRowFocused(true)}
            onBlur={() => setCharmRowFocused(false)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              opacity: 0, border: 'none', outline: 'none', padding: 0,
              background: 'transparent', cursor: 'text', pointerEvents: 'none',
            }}
          />
          {Array.from({ length: 5 }, (_, i) => selectedCharms?.[i] ?? null).map((c, i) => {
            const isLetter = c?.category === 'letter'
            const isActive = activeColourSlot === i && isLetter
            const Tag = isLetter ? 'button' : 'div'
            return (
              <Tag
                key={i}
                type={isLetter ? 'button' : undefined}
                onClick={isLetter ? () => setActiveColourSlot((s) => (s === i ? null : i)) : undefined}
                aria-label={isLetter ? `Keisti raidės „${extractLetter(c!.baseTitle)}“ spalvą` : undefined}
                aria-pressed={isLetter ? isActive : undefined}
                style={{
                  aspectRatio: '1 / 1', flex: '1 0 0', borderRadius: 12, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: c ? 'var(--color-surface-2)' : `${CHARM_TINTS[i]}33`,
                  transition: 'transform 150ms, background 150ms, border-color 150ms',
                  transform: c ? 'scale(1)' : 'scale(0.96)',
                  border: isActive ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent',
                  padding: 0,
                  cursor: isLetter ? 'pointer' : 'default',
                }}
              >
                {c?.image
                  ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      width={48}
                      height={48}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )
                  : charmRowFocused && i === charmName.length
                    ? <span aria-hidden="true" className="animate-pulse" style={{ width: 2, height: '44%', background: TEXT_PRIMARY, display: 'inline-block' }} />
                    : <span aria-hidden="true" style={{ fontSize: 22, fontWeight: 700, color: CHARM_TINTS[i] }}>_</span>}
              </Tag>
            )
          })}
        </div>
        <span style={{ display: 'block', marginTop: 6, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>Įrašykite raides</span>
        {activeColourSlot !== null && selectedCharms?.[activeColourSlot]?.category === 'letter' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            {CHARM_LETTER_COLOURS.map(({ key, label, hex }) => {
              const charm = selectedCharms[activeColourSlot]!
              const isActiveColour = charm.bg === hex
              return (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onClick={() => onCharmColourAt?.(charm.id, key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px 6px 8px', borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                    background: isActiveColour ? TEXT_PRIMARY : 'rgba(61,53,48,0.07)',
                    color: isActiveColour ? 'var(--color-cream)' : TEXT_PRIMARY,
                    transition: 'background 150ms, color 150ms',
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: hex, flexShrink: 0, display: 'inline-block' }} />
                  {label}
                </button>
              )
            })}
          </div>
        )}
        <button
          type="button"
          onClick={onPersonalise}
          style={{
            marginTop: 10, padding: 0, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: 'var(--color-interactive-text)',
          }}
        >
          Rinktis pakabukus rankiniu būdu →
        </button>
      </div>
      )}

      {/* Add to cart — label reflects any charms already picked so the payoff of customizing is visible at purchase */}
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
          background: 'var(--color-sage)', color: 'var(--color-interactive-text)',
          boxShadow: '0 4px 20px rgba(168,213,162,0.45)', transition: 'background-color 150ms ease-out, transform 80ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-sage)'; e.currentTarget.style.transform = 'translateY(0)' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {added
          ? '✓ Pridėta į krepšelį!'
          : selectedCharmCount
            ? `Pirkti su ${selectedCharmCount} pakabuk${selectedCharmCount > 1 ? 'ais' : 'u'} · ${price}`
            : `Pirkti · ${price}`}
      </button>
      {/* Trust strip — purchase reassurance below CTA */}
      <TrustNote>
        {PDP_TRUST_POINTS.join(' · ')} · ⭐ {PDP_REVIEW_RATING.toFixed(1)} ({PDP_REVIEW_COUNT} atsiliepimai)
      </TrustNote>

      {/* Upsell — cross-sell item */}
      {upsellItems && upsellItems.length > 0 && (
        <UpsellSection items={upsellItems} label={upsellLabel ?? 'Suderink rinkinį'} />
      )}

      {/* Review carousel — below upsell for conversion lift */}
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

      {fitGuideOpen && (
        <div
          onClick={() => setFitGuideOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 700,
            background: 'var(--color-bark-overlay)',
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
              background: 'var(--color-cream)',
              boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
              padding: '24px 22px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <Eyebrow className="font-semibold tracking-[0.1em]">Dydžių gidas</Eyebrow>
                <DisplayHeading as="h3" size="compact" className="mt-[6px] m-0" style={{ lineHeight: 1.15, color: TEXT_PRIMARY, fontWeight: 400 }}>
                  Kaip išmatuoti savo šunį
                </DisplayHeading>
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
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(168,213,162,0.22)', color: 'var(--color-interactive-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: TEXT_SECONDARY }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 16, background: 'var(--color-surface-2)', padding: '14px 16px' }}>
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

function CharmColorPicker ({ color, onColorChange, options }: { color: string; onColorChange: (c: string) => void; options: { value: string; label: string; dot: string }[] }) {
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
<input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Ieškoti pakabukų…" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, background: 'var(--color-surface-2)', color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-sage)' }} onBlur={(e) => { e.target.style.borderColor = BORDER_COLOR }} />
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
              <button key={charm.id} onClick={() => onSelect(charm)} title={charm.title} style={{ minHeight: 82, borderRadius: 10, background: 'var(--color-surface-2)', cursor: 'pointer', padding: '8px 6px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, outline: 'none', border: isSelected ? `2px solid ${TEXT_PRIMARY}` : '2px solid transparent', boxShadow: isSelected ? '0 0 0 1px var(--color-bark-divider)' : 'none', transition: 'border-color 120ms' }}>
                {charm.image
                  ? <Image src={charm.image} alt="" aria-hidden="true" width={34} height={34} style={{ width: 34, height: 34, objectFit: 'contain' }} />
                  : <span aria-hidden="true" className="font-display" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: charm.bg ?? 'rgba(61,53,48,0.75)', lineHeight: 1 }}>{charm.baseTitle.replace(/^(?:Letter|Raidė)\s+/i, '')}</span>
                }
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.6)', textAlign: 'center', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charm.baseTitle}</span>
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
              background: 'var(--color-cream)',
              color: TEXT_PRIMARY,
              cursor: 'pointer',
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

function CharmCTA ({ added, count, onClick, isMobile }: { added: boolean; count: number; onClick: () => void; isMobile: boolean }) {
  const label = added
    ? '✓ Pridėta į krepšelį!'
    : count > 0
      ? `Pirkti su ${count} pakabuk${count > 1 ? 'ais' : 'u'} →`
      : 'Pasirinkite iki 5 pakabukų'
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

function CharmAccordion ({ product }: { product: ProductDetail }) {
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
