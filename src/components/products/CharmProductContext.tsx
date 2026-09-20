'use client'

import { createContext, use, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type SensorDescriptor, type SensorOptions } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { ShopifyCharm } from '@/lib/shopify'
import { collar3DCharms, collar3DLetters, extractLetter } from '@/lib/collar3dSelection'
import { addLinesToCart } from '@/lib/cart'
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer'
import { useProductPage } from '@/components/products/ProductPageContext'
import { MAX_CHARMS, translateColorLabel } from '@/components/products/pdpConstants'

// Used by the charm-product page's own letter-colour recoloring (recolourAt) —
// the collar configurator has its own copy of this same mapping internally (useCollarConfigurator.ts).
const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', 'sky blue': '#B8D8F4', 'dark blue': '#6B9FD4', green: '#A8D5A2', red: '#F4B5C0', pink: '#F4B5C0', yellow: '#F9E4A0', purple: '#D4B8F4' }

interface CharmColorOption {
  value: string
  label: string
  dot: string
}

interface CharmProductGallery {
  /** Up to 7 photos; a picked charm's own photo replaces the first. */
  images: string[]
  index: number
  heroImage: string
  /** Up to 4 photos other than the hero, for the standard layout's thumbnail grid. */
  thumbnails: { src: string; index: number }[]
  /** Selected charms that have a Blender-authored mesh, in pick order. */
  charms3D: ReturnType<typeof collar3DCharms>
  showHero3D: boolean
}

interface CharmProductState {
  selectedCharms: (ShopifyCharm | null)[]
  selectedCharmCount: number
  /** Letters currently engraved, derived from selectedCharms. */
  charmName: string
  charmColor: string
  colorOptions: CharmColorOption[]
  added: boolean
  activeReview: number
  displayName: string
  displayPrice: string
  originalPrice: string | undefined
  gallery: CharmProductGallery
}

interface CharmProductActions {
  toggleCharm: (charm: ShopifyCharm) => void
  reorder: (event: DragEndEvent) => void
  setCharmName: (rawName: string) => void
  recolourAt: (index: number, colourKey: string) => void
  setCharmColor: (color: string) => void
  setGalleryIndex: Dispatch<SetStateAction<number>>
  setActiveReview: Dispatch<SetStateAction<number>>
  addToCart: () => Promise<void>
}

interface CharmProductMeta {
  /** Every charm the picker may offer (from the shared configurator). */
  charms: ShopifyCharm[]
  mounted: boolean
  dndSensors: SensorDescriptor<SensorOptions>[]
  requestMoreCharms: () => void
}

interface CharmProductContextValue {
  state: CharmProductState
  actions: CharmProductActions
  meta: CharmProductMeta
}

const CharmProductContext = createContext<CharmProductContextValue | null>(null)

/** Reads the charm-product page state, actions and meta. Must be used inside `<CharmProductProvider>`. */
export function useCharmProduct(): CharmProductContextValue {
  const ctx = use(CharmProductContext)
  if (!ctx) throw new Error('useCharmProduct must be used within <CharmProductProvider>')
  return ctx
}

/**
 * Owns the charm-product page's selection, gallery and cart state. Deliberately separate from
 * useCollarConfigurator: charms here are not size-group filtered, colour is a variant hex rather than
 * a colour key, and picking a charm swaps the hero photo.
 */
export function CharmProductProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('products.pdp')
  const { state: { configurator }, meta: { product } } = useProductPage()
  const { charms, mounted } = configurator

  const [selectedCharms, setSelectedCharms] = useState<(ShopifyCharm | null)[]>(Array(MAX_CHARMS).fill(null))
  const [charmColor, setCharmColor] = useState<string>(product.charmVariants?.[0]?.bg || '#B8D8F4')
  const [added, setAdded] = useState(false)
  const [charmGalleryIndex, setCharmGalleryIndex] = useState(0)
  const [previewCharmImage, setPreviewCharmImage] = useState<string | null>(null)
  const [activeReview, setActiveReview] = useState(0)

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
  const reorder = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSelectedCharms(prev => {
        const oldIndex = prev.findIndex((_, i) => `slot-${i}` === active.id)
        const newIndex = prev.findIndex((_, i) => `slot-${i}` === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // Charm add to cart → opens the cart drawer
  const addToCart = async () => {
    const picked = selectedCharms.filter(Boolean) as ShopifyCharm[]
    if (!picked.length) return
    setAdded(true)
    await addLinesToCart(picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })))
    window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))
    setTimeout(() => setAdded(false), 1400)
  }

  // Unique color options derived from the real charm variants (green excluded)
  const colorOptions = useMemo(() => {
    if (!product.charmVariants) return []
    const seenBg = new Set<string>()
    const options: CharmColorOption[] = []
    for (const charm of product.charmVariants) {
      if (charm.bg && charm.bg !== '#A8D5A2' && !seenBg.has(charm.bg)) {
        seenBg.add(charm.bg)
        options.push({ value: charm.bg, label: translateColorLabel(t, charm.color), dot: charm.bg })
      }
    }
    return options
  }, [product.charmVariants, t])

  // Same letter-engraving helpers as the collar page, operating on the charm page's own selectedCharms state.
  const charmName = collar3DLetters(selectedCharms).name
  const setCharmName = (rawName: string) => {
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

  const recolourAt = (index: number, colourKey: string) => {
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
  const showHero3D = safeCharmGalleryIndex === 0 && previewCharms3D.length > 0
  const thumbnails = visibleCharmGallery
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => index !== safeCharmGalleryIndex)
    .slice(0, 4)

  return (
    <CharmProductContext
      value={{
        state: {
          selectedCharms,
          selectedCharmCount,
          charmName,
          charmColor,
          colorOptions,
          added,
          activeReview,
          displayName,
          displayPrice,
          originalPrice: firstSelectedCharm?.originalPrice ?? product.originalPrice,
          gallery: { images: visibleCharmGallery, index: safeCharmGalleryIndex, heroImage: charmHeroImage, thumbnails, charms3D: previewCharms3D, showHero3D },
        },
        actions: { toggleCharm, reorder, setCharmName, recolourAt, setCharmColor, setGalleryIndex: setCharmGalleryIndex, setActiveReview, addToCart },
        meta: { charms, mounted, dndSensors, requestMoreCharms: () => configurator.setExtraCharmsOpen(true) },
      }}
    >
      {children}
    </CharmProductContext>
  )
}
