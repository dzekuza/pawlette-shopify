'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { getCollars, getCharms, getLeashes, charmSizeGroupForCollarSize, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { collar3DLetters, extractLetter } from '@/lib/collar3dSelection'
import { addLinesToCart } from '@/lib/cart'
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer'
import type { CartToastItem } from '@/components/shared/CartToast'
import { MAX_CHARMS } from '@/components/products/pdpConstants'

const DEFAULT_CHARM_COLOR = 'blue'
const COLOR_BG_MAP: Record<string, string> = { blue: '#B8D8F4', 'sky blue': '#B8D8F4', 'dark blue': '#6B9FD4', green: '#A8D5A2', red: '#F4B5C0', pink: '#F4B5C0', yellow: '#F9E4A0', purple: '#D4B8F4' }

export interface UseCollarConfiguratorOptions {
  /** True for leash products (fetches via getLeashes instead of getCollars). */
  isLeash?: boolean
  /** Matches a specific collar/leash by id or handle — pass the product's collar id (SingleProductPage). Omit to default to the first item (LandingBuySection's "buy now" widget). */
  matchId?: string
  /** Matches a specific leash by handle or id (only consulted when isLeash is true). */
  matchSlug?: string
  /** Falls back to matching by accent color when id/handle matching doesn't find anything. */
  accentColor?: string
}

/**
 * Owns all state + handlers for the collar "buy" configurator: color/size selection, the
 * MAX_CHARMS-slot charm picker (with drag-to-reorder), the Personalise + Extra-charms modal
 * flows, letter/name engraving, starter packs, and add-to-cart. Single source of truth shared by
 * SingleProductPage.tsx (product detail page) and LandingBuySection.tsx (homepage buy card) so
 * both render the literal same <CollarConfigurator /> experience.
 */
export function useCollarConfigurator (options: UseCollarConfiguratorOptions = {}) {
  const { isLeash = false, matchId, matchSlug, accentColor } = options

  const [allCollars, setAllCollars] = useState<ShopifyCollar[]>([])
  const [charms, setCharms] = useState<ShopifyCharm[]>([])
  const [collar, setCollar] = useState<ShopifyCollar | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  const [personaliseOpen, setPersonaliseOpen] = useState(false)
  const [extraCharmsOpen, setExtraCharmsOpen] = useState(false)
  const [extraCharmsPicked, setExtraCharmsPicked] = useState<ShopifyCharm[]>([])
  const [extraCharmsQuery, setExtraCharmsQuery] = useState('')
  const [extraCharmsColor, setExtraCharmsColor] = useState('')
  const [extraCharmsAdded, setExtraCharmsAdded] = useState(false)
  const [preview3DOpen, setPreview3DOpen] = useState(false)
  const [selectedCollarCharms, setSelectedCollarCharms] = useState<(ShopifyCharm | null)[]>(Array(MAX_CHARMS).fill(null))
  const [collarCharmColor, setCollarCharmColor] = useState<string>(DEFAULT_CHARM_COLOR)
  const [collarCharmQuery, setCollarCharmQuery] = useState('')
  const [charmAdded, setCharmAdded] = useState(false)
  const [cartToastItems, setCartToastItems] = useState<CartToastItem[] | null>(null)

  useEffect(() => {
    if (isLeash) {
      getLeashes().then((data) => {
        setAllCollars(data)
        const match = data.find((l) => l.handle === matchSlug || l.id === matchSlug)
          ?? data.find((l) => l.color === accentColor)
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
        const match = data.find((c) => c.id === matchId || c.handle === matchId)
          ?? data.find((c) => c.color === accentColor)
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
  }, [isLeash, matchId, matchSlug, accentColor])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    const next = allCollars.find(c => c.colors.includes(color) || c.colors[0] === color)
    if (next) {
      setCollar(next)
      setSelectedSize(s => next.sizes.includes(s) ? s : (next.sizes[1] ?? next.sizes[0] ?? ''))
    }
  }

  // S/M collars pair with the small ("Maži") charm product, L collars with the large
  // ("Dideli/M-L") one — the free-charms discount is scoped per product, so the two must
  // never mix. Whenever the active group flips (color or size change), drop any already-picked
  // charms that no longer belong to it rather than silently charging for a mismatched charm.
  const activeCharmSizeGroup = useMemo(() => charmSizeGroupForCollarSize(selectedSize), [selectedSize])
  // All charms matching the active size group, with no color exclusion — for surfaces (inline
  // decorator panel, 3D preview modal) that offer the full color range, unlike the personalise
  // dialog's filteredCollarCharms below, which additionally excludes green.
  const sizeMatchedCharms = useMemo(() => charms.filter((c) => c.sizeGroup === activeCharmSizeGroup), [charms, activeCharmSizeGroup])
  const prevCharmSizeGroupRef = useRef(activeCharmSizeGroup)
  useEffect(() => {
    if (prevCharmSizeGroupRef.current !== activeCharmSizeGroup) {
      prevCharmSizeGroupRef.current = activeCharmSizeGroup
      setSelectedCollarCharms(prev => prev.map(c => (c && c.sizeGroup !== activeCharmSizeGroup) ? null : c))
    }
  }, [activeCharmSizeGroup])

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

  const selectedVariantImage = collar?.variants.find((variant) =>
    (selectedColor ? variant.color === selectedColor : true) &&
    (selectedSize ? variant.size === selectedSize : true)
  )?.image ?? collar?.variants.find((variant) => selectedColor ? variant.color === selectedColor : true)?.image ?? ''

  // Builds the collar line plus any charms already picked in the Personalise flow, so
  // every "Pirkti" entry point adds the same bundle. Always adds a new collar unit —
  // Shopify merges it into an existing line of the same variant, incrementing quantity,
  // so buying a 2nd collar (same color/size) correctly counts as 2 for BXGY-style
  // "N free charms per collar" discounts instead of being silently skipped.
  const buildCollarBundleLines = async () => {
    if (!collar) return { lines: [] as { merchandiseId: string; quantity: number }[], collarAdded: false }
    const variant = collar.variants.find(v =>
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
    ) ?? collar.variants.find(v => selectedSize ? v.size === selectedSize : true) ?? collar.variants[0]
    const variantId = variant?.id ?? collar.variantId
    const collarAdded = !!variantId
    const picked = selectedCollarCharms.filter(Boolean) as ShopifyCharm[]
    return {
      lines: [
        ...(collarAdded ? [{ merchandiseId: variantId!, quantity: 1 }] : []),
        ...picked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })),
      ],
      collarAdded,
    }
  }

  // Collar add to cart → bundles the collar + any selected charms in one operation, opens the cart drawer
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
    }
    window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))
  }

  // Filtered charms for the personalise dialog (collar product page) — green excluded, and
  // scoped to the charm size that matches the currently selected collar size (S/M → small
  // charms, L → large charms) so the free-charms discount always applies.
  const filteredCollarCharms = useMemo(() => {
    let list = charms.filter((c) => c.bg !== '#A8D5A2' && c.sizeGroup === activeCharmSizeGroup)
    if (collarCharmColor) list = list.filter((c) => c.bg === COLOR_BG_MAP[collarCharmColor])
    if (collarCharmQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(collarCharmQuery.toLowerCase()))
    return list
  }, [charms, collarCharmColor, collarCharmQuery, activeCharmSizeGroup])

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

  // Filtered charms for the "need more charms?" dialog — letters and icon charms both
  // selectable, scoped to the same size group as the collar being personalised.
  const filteredExtraCharms = useMemo(() => {
    let list = charms.filter((c) => c.bg !== '#A8D5A2' && c.sizeGroup === activeCharmSizeGroup)
    if (extraCharmsColor) list = list.filter((c) => c.bg === COLOR_BG_MAP[extraCharmsColor])
    if (extraCharmsQuery.trim()) list = list.filter((c) => c.title.toLowerCase().includes(extraCharmsQuery.toLowerCase()))
    return list
  }, [charms, extraCharmsColor, extraCharmsQuery, activeCharmSizeGroup])

  const toggleExtraCharm = (charm: ShopifyCharm) => {
    setExtraCharmsPicked(prev => (
      prev.some(c => c.id === charm.id) ? prev.filter(c => c.id !== charm.id) : [...prev, charm]
    ))
  }

  const addExtraCharmsToCart = async () => {
    if (!extraCharmsPicked.length) return
    setExtraCharmsAdded(true)
    await addLinesToCart(extraCharmsPicked.map(c => ({ merchandiseId: c.variantId, quantity: 1 })))
    setCartToastItems(extraCharmsPicked.map(c => ({ id: c.id, title: c.title, image: c.image })))
    window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))
    setTimeout(() => {
      setExtraCharmsAdded(false)
      setExtraCharmsOpen(false)
      setExtraCharmsPicked([])
      setExtraCharmsQuery('')
      setExtraCharmsColor('')
    }, 800)
  }

  const applyStarterPack = (offset: number) => {
    const pool = charms.filter(c => c.bg !== '#A8D5A2' && c.sizeGroup === activeCharmSizeGroup)
    const pack = pool.slice(offset, offset + MAX_CHARMS)
    if (!pack.length) return
    const slots: (ShopifyCharm | null)[] = Array(MAX_CHARMS).fill(null)
    pack.forEach((c, i) => { if (i < MAX_CHARMS) slots[i] = c })
    setSelectedCollarCharms(slots)
  }

  // Typed word/number entry → maps each character to a matching letter charm,
  // keeping any already-selected icon charms after the typed letters.
  const collarCharmName = collar3DLetters(selectedCollarCharms).name
  const applyCollarLetters = (rawName: string) => {
    const clean = rawName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, MAX_CHARMS)
    const colourHex = COLOR_BG_MAP[collarCharmColor]
    const { iconCharms } = collar3DLetters(selectedCollarCharms)
    const newLetterCharms = [...clean]
      .map((letter) => charms.find((c) => c.category === 'letter' && c.sizeGroup === activeCharmSizeGroup && extractLetter(c.baseTitle) === letter && c.bg === colourHex))
      .filter((c): c is ShopifyCharm => !!c)
    const combined = [...newLetterCharms, ...iconCharms].slice(0, MAX_CHARMS)
    const padded: (ShopifyCharm | null)[] = [...combined, ...Array(MAX_CHARMS - combined.length).fill(null)]
    setSelectedCollarCharms(padded)
  }

  // Recolours a single already-placed charm in place, without touching its slot position.
  // Letters match on their extracted letter; icon charms (paw, heart, star, flower…) match on shape.
  const applyCollarLetterColour = (index: number, colourKey: string) => {
    const target = selectedCollarCharms[index]
    if (!target) return
    // Letters pass a COLOR_BG_MAP key ("blue"); icon charms pass their swatch hex directly,
    // since icon variant titles don't reliably carry a usable colour-key (see resolveCharmMeta).
    const colourHex = target.category === 'letter' ? COLOR_BG_MAP[colourKey] : colourKey
    const replacement = target.category === 'letter'
      ? charms.find((c) => c.category === 'letter' && c.sizeGroup === target.sizeGroup && extractLetter(c.baseTitle) === extractLetter(target.baseTitle) && c.bg === colourHex)
      : target.shape
        ? charms.find((c) => c.category === 'icon' && c.sizeGroup === target.sizeGroup && c.shape === target.shape && c.bg === colourHex)
        : undefined
    if (!replacement) return
    // Recolour only the tapped slot — identical letters share the same charm id,
    // so id-based matching would recolour every duplicate at once.
    setSelectedCollarCharms((prev) => prev.map((c, i) => (i === index ? replacement : c)))
  }

  const clearCartToast = () => setCartToastItems(null)

  return {
    // data
    allCollars,
    charms,
    sizeMatchedCharms,
    collar,
    selectedColor,
    selectedSize,
    mounted,
    selectedVariantImage,
    // color/size
    onColorChange: handleColorChange,
    onSizeChange: setSelectedSize,
    // personalise modal
    personaliseOpen,
    setPersonaliseOpen,
    // extra charms modal
    extraCharmsOpen,
    setExtraCharmsOpen,
    extraCharmsPicked,
    extraCharmsQuery,
    setExtraCharmsQuery,
    extraCharmsColor,
    setExtraCharmsColor,
    extraCharmsAdded,
    filteredExtraCharms,
    toggleExtraCharm,
    addExtraCharmsToCart,
    // 3D preview modal
    preview3DOpen,
    setPreview3DOpen,
    // charm slots
    selectedCollarCharms,
    setSelectedCollarCharms,
    selectedCollarCharmCount,
    toggleCollarCharm,
    dndSensors,
    handleCharmDragEnd,
    collarCharmColor,
    setCollarCharmColor,
    collarCharmQuery,
    setCollarCharmQuery,
    filteredCollarCharms,
    charmAdded,
    addCollarCharmToCart,
    applyStarterPack,
    collarCharmName,
    applyCollarLetters,
    applyCollarLetterColour,
    // cart
    addCollarToCart,
    cartToastItems,
    clearCartToast,
  }
}

export type CollarConfiguratorState = ReturnType<typeof useCollarConfigurator>
