'use client'

import { createContext, use, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import { trackMetaEvent } from '@/components/shared/MetaPixel'
import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import type { ProductDetail } from '@/lib/catalog'

export const LEASH_SIZES: { label: string; neck: string }[] = [
  { label: 'S', neck: '28–36 cm' },
  { label: 'M', neck: '36–44 cm' },
  { label: 'L', neck: '44–54 cm' },
]

interface LeashState {
  selectedColor: string
  selectedSize: string
  activeSlide: number
  added: boolean
  cartCount: number
  gallery: string[]
}

interface LeashActions {
  selectColor: (color: string) => void
  selectSize: (size: string) => void
  setActiveSlide: (index: number) => void
  addToCart: () => void
}

interface LeashMeta {
  product: ProductDetail
  colors: string[]
  swipeStartRef: MutableRefObject<number | null>
}

interface LeashContextValue {
  state: LeashState
  actions: LeashActions
  meta: LeashMeta
}

const LeashContext = createContext<LeashContextValue | null>(null)

/** Reads the leash PDP state, actions and meta. Must be used inside `<LeashProvider>`. */
export function useLeash(): LeashContextValue {
  const ctx = use(LeashContext)
  if (!ctx) throw new Error('useLeash must be used within <LeashProvider>')
  return ctx
}

/** The only place that knows how leash selection, gallery and cart state are managed. */
export function LeashProvider({ product, children }: { product: ProductDetail; children: ReactNode }) {
  const colors = product.leashColors ?? []
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '')
  const [selectedSize, setSelectedSize] = useState(LEASH_SIZES[1].label)
  const [cartCount, setCartCount] = useState(0)
  const [added, setAdded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const swipeStartRef = useRef<number | null>(null)

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

  // Show images for the selected color variant; fall back to product-level images
  const colorVariants = product.leashVariants?.filter(v =>
    !selectedColor || v.color.toLowerCase() === selectedColor.toLowerCase()
  ) ?? []
  const colorImages: string[] = [...new Set(colorVariants.map(v => v.image).filter((s): s is string => !!s))]
  const gallery: string[] = colorImages.length > 0 ? colorImages : (product.images.length ? product.images : [product.image])

  function selectColor(color: string) {
    setSelectedColor(color)
    setActiveSlide(0)
  }

  function findVariant() {
    return product.leashVariants?.find(
      lv => lv.color.toLowerCase() === selectedColor.toLowerCase() && lv.size === selectedSize
    )
  }

  function addToCart() {
    const variant = findVariant()
    const cart = JSON.parse(localStorage.getItem('pawlette_cart') ?? '[]')
    const item = {
      id: variant?.id ?? product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: selectedColor || undefined,
      size: selectedSize,
      price: variant?.price ?? product.price,
      image: gallery[0] ?? product.image,
      quantity: 1,
    }
    const idx = cart.findIndex((c: typeof item) => c.id === item.id && c.size === item.size)
    if (idx > -1) cart[idx].quantity += 1
    else cart.push(item)
    localStorage.setItem('pawlette_cart', JSON.stringify(cart))
    setCartCount(cart.reduce((s: number, c: { quantity: number }) => s + c.quantity, 0))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <LeashContext
      value={{
        state: { selectedColor, selectedSize, activeSlide, added, cartCount, gallery },
        actions: { selectColor, selectSize: setSelectedSize, setActiveSlide, addToCart },
        meta: { product, colors, swipeStartRef },
      }}
    >
      {children}
    </LeashContext>
  )
}
