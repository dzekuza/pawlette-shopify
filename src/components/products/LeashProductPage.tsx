'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Droplets, Ruler, Shield, Sparkles } from 'lucide-react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Accordion, type AccordionItem } from '@/components/shared/Accordion'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import type { ProductDetail } from '@/lib/catalog'

const NAV_H = 72

const SIZES: { label: string; neck: string }[] = [
  { label: 'S', neck: '28–36 cm' },
  { label: 'M', neck: '36–44 cm' },
  { label: 'L', neck: '44–54 cm' },
]

const LEASH_FEATURES = [
  { icon: Droplets, label: 'Vandeniui atsparus', desc: '100% atsparus vandeniui maistinė klasės silikonas' },
  { icon: Ruler, label: 'Reguliuojamas ilgis', desc: 'Pritaikomas prie jūsų šuns ir stiliaus' },
  { icon: Shield, label: 'Patvarus', desc: 'Atsparumas UV spinduliams ir kvapams' },
  { icon: Sparkles, label: 'Lengva valyti', desc: 'Paprasčiausiai nušluostykite arba nuplaukite' },
]

interface Props {
  product: ProductDetail
  recommendedProducts: ProductDetail[]
}

function handleSwipeStart (x: number, ref: React.MutableRefObject<number | null>) {
  ref.current = x
}

function handleSwipeEnd (
  x: number,
  startRef: React.MutableRefObject<number | null>,
  total: number,
  current: number,
  set: (n: number) => void,
) {
  if (startRef.current === null) return
  const delta = startRef.current - x
  startRef.current = null
  if (Math.abs(delta) < 40) return
  if (delta > 0) set(Math.min(total - 1, current + 1))
  else set(Math.max(0, current - 1))
}

export function LeashProductPage ({ product, recommendedProducts }: Props) {
  const router = useRouter()
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768

  const gallery = product.images.length ? product.images : [product.image]
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedSize, setSelectedSize] = useState(SIZES[1].label)
  const [cartCount, setCartCount] = useState(0)
  const [added, setAdded] = useState(false)
  const swipeStart = useRef<number | null>(null)

  function addToCart () {
    const cart = JSON.parse(localStorage.getItem('pawlette_cart') ?? '[]')
    const item = {
      id: product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: selectedSize,
      price: product.price,
      image: product.image,
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

  const accordionItems: AccordionItem[] = [
    product.features && { id: 'features', title: 'Savybės', content: product.features },
    product.care && { id: 'care', title: 'Priežiūra', content: product.care },
    product.shipping && { id: 'shipping', title: 'Pristatymas', content: product.shipping },
    product.set_includes && { id: 'includes', title: 'Komplekte', content: product.set_includes },
  ].filter(Boolean) as AccordionItem[]

  return (
    <div style={{ background: 'var(--color-cream)', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {/* ── HERO ── */}
      <div style={{ paddingTop: NAV_H }}>
        {isMobile ? (
          <MobileLayout
            product={product}
            gallery={gallery}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            added={added}
            onAddToCart={addToCart}
            swipeStart={swipeStart}
          />
        ) : (
          <DesktopLayout
            product={product}
            gallery={gallery}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            added={added}
            onAddToCart={addToCart}
          />
        )}
      </div>

      {/* ── FEATURES STRIP ── */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(61,53,48,0.08)', borderBottom: '1px solid rgba(61,53,48,0.08)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: isMobile ? '32px 20px' : '48px 40px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 24 : 40 }}>
          {LEASH_FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color="var(--color-bark)" strokeWidth={1.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-bark)', letterSpacing: '0.01em' }}>{label}</span>
              <span style={{ fontSize: 12, color: 'rgba(61,53,48,0.6)', lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DETAILS ACCORDION ── */}
      {accordionItems.length > 0 && (
        <section style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '40px 20px' : '64px 40px' }}>
          <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: isMobile ? 28 : 36, color: 'var(--color-bark)', marginBottom: 24, textAlign: 'center' }}>
            Informacija
          </h2>
          <Accordion items={accordionItems} />
        </section>
      )}

      {/* ── COMPLETE THE LOOK ── */}
      {recommendedProducts.filter(p => p.productType === 'collar').length > 0 && (
        <section style={{ background: '#fff' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: isMobile ? '40px 20px' : '64px 40px' }}>
            <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: isMobile ? 28 : 36, color: 'var(--color-bark)', marginBottom: 8, textAlign: 'center' }}>
              Sukurk rinkinį
            </h2>
            <p style={{ textAlign: 'center', color: 'rgba(61,53,48,0.6)', fontSize: 15, marginBottom: 32 }}>
              Suderink pavadą su atitinkamu antkaklius
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
              {recommendedProducts.filter(p => p.productType === 'collar').slice(0, 3).map(p => (
                <a key={p.slug} href={`/products/${p.slug}`} style={{ display: 'block', borderRadius: 16, overflow: 'hidden', background: p.tintColor || 'var(--color-cream)', textDecoration: 'none', transition: 'transform 200ms', boxShadow: '0 2px 12px rgba(61,53,48,0.08)' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-bark)' }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: 'rgba(61,53,48,0.6)', marginTop: 4 }}>€{p.price}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RECOMMENDED ── */}
      {recommendedProducts.length > 0 && (
        <section style={{ padding: isMobile ? '40px 20px' : '64px 40px', maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: isMobile ? 28 : 36, color: 'var(--color-bark)', marginBottom: 32, textAlign: 'center' }}>
            Gali patikti ir tai
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {recommendedProducts.slice(0, 3).map(p => (
              <a key={p.slug} href={`/products/${p.slug}`} style={{ display: 'block', borderRadius: 16, overflow: 'hidden', background: p.tintColor || '#fff', textDecoration: 'none', boxShadow: '0 2px 12px rgba(61,53,48,0.08)' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-bark)' }}>{p.name}</div>
                  <div style={{ fontSize: 14, color: 'rgba(61,53,48,0.6)', marginTop: 4 }}>€{p.price}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <LandingFooter />
    </div>
  )
}

/* ─────────────────── Desktop Layout ─────────────────── */

interface LayoutProps {
  product: ProductDetail
  gallery: string[]
  activeSlide: number
  setActiveSlide: (n: number) => void
  selectedSize: string
  setSelectedSize: (s: string) => void
  added: boolean
  onAddToCart: () => void
  swipeStart?: React.MutableRefObject<number | null>
}

function DesktopLayout ({ product, gallery, activeSlide, setActiveSlide, selectedSize, setSelectedSize, added, onAddToCart }: LayoutProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', maxWidth: 1160, margin: '0 auto', padding: '48px 40px', gap: 64, alignItems: 'start' }}>
      {/* Gallery column */}
      <div>
        {/* Main image */}
        <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', aspectRatio: '4/5', marginBottom: 12 }}>
          <Image
            src={gallery[activeSlide]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 50vw, 580px"
            priority
          />
        </div>
        {/* Thumbnail strip */}
        {gallery.length > 1 && (
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative', border: i === activeSlide ? '2px solid var(--color-bark)' : '2px solid transparent', cursor: 'pointer', padding: 0 }}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info column — sticky */}
      <div style={{ position: 'sticky', top: NAV_H + 24 }}>
        <InfoPanel
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          added={added}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  )
}

/* ─────────────────── Mobile Layout ─────────────────── */

function MobileLayout ({ product, gallery, activeSlide, setActiveSlide, selectedSize, setSelectedSize, added, onAddToCart, swipeStart }: LayoutProps) {
  return (
    <div>
      {/* Full-width image slider */}
      <div
        style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', touchAction: 'pan-y' }}
        onPointerDown={e => swipeStart && handleSwipeStart(e.clientX, swipeStart)}
        onPointerUp={e => swipeStart && handleSwipeEnd(e.clientX, swipeStart, gallery.length, activeSlide, setActiveSlide)}
        onPointerCancel={() => swipeStart && (swipeStart.current = null)}
        onPointerLeave={() => swipeStart && (swipeStart.current = null)}
      >
        <div style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
          {gallery.map((src, i) => (
            <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
              <Image src={src} alt={i === 0 ? product.name : ''} fill className="object-cover" sizes="100vw" priority={i === 0} draggable={false} />
            </div>
          ))}
        </div>
        {/* Prev/next tap zones */}
        <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))} style={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Ankstesnis" />
        <button onClick={() => setActiveSlide(Math.min(gallery.length - 1, activeSlide + 1))} style={{ position: 'absolute', right: 0, top: 0, width: '30%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Kitas" />
        {/* Dots */}
        {gallery.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {gallery.map((_, i) => (
              <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'width 200ms' }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '24px 20px 100px' }}>
        <InfoPanel
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          added={added}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  )
}

/* ─────────────────── Info Panel ─────────────────── */

interface InfoPanelProps {
  product: ProductDetail
  selectedSize: string
  setSelectedSize: (s: string) => void
  added: boolean
  onAddToCart: () => void
}

function InfoPanel ({ product, selectedSize, setSelectedSize, added, onAddToCart }: InfoPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: 12, color: 'rgba(61,53,48,0.5)', display: 'flex', gap: 6 }}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Pradžia</a>
        <span>/</span>
        <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Produktai</a>
        <span>/</span>
        <span style={{ color: 'var(--color-bark)' }}>{product.name}</span>
      </nav>

      {/* Name + price */}
      <div>
        {product.badge && (
          <div style={{ display: 'inline-block', background: 'var(--color-sage)', color: 'var(--color-bark)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 99, marginBottom: 10 }}>
            {product.badge}
          </div>
        )}
        <h1 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 32, color: 'var(--color-bark)', lineHeight: 1.1, margin: 0 }}>
          {product.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--color-bark)' }}>
            €{product.price}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: 16, color: 'rgba(61,53,48,0.4)', textDecoration: 'line-through' }}>
              €{product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Short description */}
      <p style={{ fontSize: 15, color: 'rgba(61,53,48,0.7)', lineHeight: 1.6, margin: 0 }}>
        {product.shortDescription}
      </p>

      {/* Size selector */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-bark)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Dydis
          </span>
          <a href="/guide/how-to-measure-dog-collar" style={{ fontSize: 12, color: 'rgba(61,53,48,0.5)', textDecoration: 'underline' }}>
            Kaip išmatuoti?
          </a>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {SIZES.map(({ label, neck }) => (
            <button
              key={label}
              onClick={() => setSelectedSize(label)}
              title={neck}
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                border: selectedSize === label ? '2px solid var(--color-bark)' : '1.5px solid rgba(61,53,48,0.2)',
                background: selectedSize === label ? 'var(--color-bark)' : 'transparent',
                color: selectedSize === label ? '#fff' : 'var(--color-bark)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(61,53,48,0.5)', marginTop: 8 }}>
          {SIZES.find(s => s.label === selectedSize)?.neck}
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={onAddToCart}
        style={{
          width: '100%',
          height: 56,
          borderRadius: 16,
          background: added ? 'var(--color-sage)' : 'var(--color-bark)',
          color: added ? 'var(--color-bark)' : '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 200ms',
        }}
      >
        <ShoppingCart size={18} strokeWidth={2} />
        {added ? 'Pridėta į krepšelį ✓' : 'Pridėti į krepšelį'}
      </button>

      {/* Trust badges */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {['Nemokamas pristatymas nuo €50', '30 dienų grąžinimas', 'Pagaminta Vilniuje'].map(text => (
          <span key={text} style={{ fontSize: 12, color: 'rgba(61,53,48,0.55)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: 'var(--color-sage)' }}>✓</span> {text}
          </span>
        ))}
      </div>
    </div>
  )
}
