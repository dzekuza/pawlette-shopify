'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { LandingNav } from '@/components/landing/LandingNav'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { CommerceFooter } from '@/components/shared/CommerceFooter'
import { Accordion } from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { COLLARS, PRODUCTS } from '@/lib/data'
import { slugFromProductName } from '@/lib/catalog'
import type { Collar } from '@/lib/data'
import type { ProductDetail } from '@/lib/catalog'

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', delay } }),
}

const DISPLAY_SIZES = ['S', 'M', 'L'] as const
type DisplaySize = (typeof DISPLAY_SIZES)[number]

const SIZE_INDEX: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3 }

const SIZE_DETAILS: Record<DisplaySize, { range: string; breeds: string }> = {
  S: { range: '28–36', breeds: 'Beagle, Cocker Spaniel' },
  M: { range: '36–44', breeds: 'Labrador, Border Collie' },
  L: { range: '44–52', breeds: 'German Shepherd, Husky' },
}

const ALL_GUIDE_SIZES = [
  { key: 'XS', range: '20–28' },
  { key: 'S', range: '28–36' },
  { key: 'M', range: '36–44' },
  { key: 'L', range: '44–52' },
]

type InfoTab = 'features' | 'includes' | 'care' | 'shipping'

const DESKTOP_TABS: Array<{ id: InfoTab; label: string }> = [
  { id: 'features', label: 'Product Features' },
  { id: 'includes', label: 'Set Includes' },
  { id: 'care', label: 'Care' },
  { id: 'shipping', label: 'Shipping & Returns' },
]

const DEFAULT_TAB_CONTENT: Record<InfoTab, string> = {
  features:
    'Waterproof collar and leash materials, lightweight adjustable fit, safe-release buckle, dirt and odor resistance, easy-clip leash adjustment, padded handle, and built-in waste bag holder.',
  includes:
    'Base collar in your chosen colour and size. Five interchangeable snap-on charms. Adjustable safe-release buckle. Linen storage pouch.',
  care:
    'Rinse after every swim or muddy walk. Air dry flat — no tumble dryers. Wipe charms with a damp cloth, then air dry. Store flat in the linen pouch.',
  shipping:
    'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days of purchase in original condition.',
}


const CARE_BULLETS = [
  { title: 'Rinse', desc: 'After every swim or muddy walk.' },
  { title: 'Air dry', desc: 'Lay flat. No tumble dryers.' },
  { title: 'Wipe charms', desc: 'Damp cloth, then air dry.' },
  { title: 'Store flat', desc: 'In the linen pouch.' },
]

interface Props {
  product: ProductDetail
}

export function SingleProductPage({ product }: Props) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const isCompactHero = width < 1280
  const isCompactBento = width < 1180
  const isScrollableRecommendations = width < 1200

  const isCollar = product.productType === 'collar'
  const initialCollar = COLLARS.find((c) => c.color === product.accentColor) ?? COLLARS[0]

  const tabContent: Record<InfoTab, string> = {
    features: product.features ?? DEFAULT_TAB_CONTENT.features,
    includes: product.set_includes ?? DEFAULT_TAB_CONTENT.includes,
    care: product.care ?? DEFAULT_TAB_CONTENT.care,
    shipping: product.shipping ?? DEFAULT_TAB_CONTENT.shipping,
  }

  const mobileAccordion: AccordionItem[] = [
    { id: 'features', title: 'Product Features', content: tabContent.features },
    { id: 'shipping', title: 'Shipping & Returns', content: tabContent.shipping },
    { id: 'warranty', title: 'Warranty', content: "12-month warranty against manufacturing defects. If something breaks, we'll replace it — no questions asked." },
  ]

  const [selectedCollar, setSelectedCollar] = useState<Collar>(initialCollar)
  const [selectedSize, setSelectedSize] = useState<DisplaySize>('S')
  const [desktopTab, setDesktopTab] = useState<InfoTab>('features')
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    const item = {
      collar: selectedCollar,
      charms: [],
      size: selectedSize,
      engraving: '',
    }
    const existing = JSON.parse(localStorage.getItem('pawlette_cart') ?? '[]')
    localStorage.setItem('pawlette_cart', JSON.stringify([...existing, item]))
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      router.push('/cart')
    }, 800)
  }

  const collarProduct = PRODUCTS.find((p) => p.collarColor === selectedCollar.color)
  const displayImage = product.image || collarProduct?.image || ''
  const displayName = product.name
  const displayBadge = isCollar ? collarProduct?.badge : product.badge
  const displayBadgeColor = collarProduct?.badgeColor
  const displayBadgeBg = collarProduct?.badgeBg

  return (
    <div className="bg-cream text-bark min-h-screen font-sans">
      <LandingNav topOffset={0} />

      <div style={{ paddingTop: 64 }}>
        {/* ── Product hero ── */}
        {isCompactHero ? (
          <section
            className="bg-cream flex flex-col"
            style={{
              padding: isMobile ? '24px 16px' : '32px 24px 48px',
              gap: 24,
              maxWidth: isMobile ? undefined : 960,
              margin: isMobile ? undefined : '0 auto',
            }}
          >
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0}>
              <ProductImage
                src={displayImage}
                alt={displayName}
                height={isMobile ? 384 : 560}
                badge={displayBadge}
                badgeBg={displayBadgeBg}
                badgeColor={displayBadgeColor}
                isCollar={isCollar}
                accentColor={product.accentColor}
              />
            </motion.div>
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0.1}>
              <ProductInfoBlock
                displayName={displayName}
                product={product}
                selectedCollar={selectedCollar}
                selectedSize={selectedSize}
                isCollar={isCollar}
                isMobile={isMobile}
                onCollarChange={setSelectedCollar}
                onSizeChange={setSelectedSize}
              />
            </motion.div>
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0.18}>
              <PrimaryButton variant={added ? 'sage' : 'dark'} fullWidth onClick={handleAddToCart}>
                {added ? '✓ Added to cart' : `${product.price} — Add to cart`}
              </PrimaryButton>
            </motion.div>
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0.24}>
              {isMobile ? (
                <Accordion items={mobileAccordion} isMobile />
              ) : (
                <DesktopTabsPanel desktopTab={desktopTab} onSelect={setDesktopTab} tabContent={tabContent} />
              )}
            </motion.div>
          </section>
        ) : (
          <section
            className="bg-cream flex items-start"
            style={{ padding: '24px 64px 64px', gap: 64, maxWidth: 1440, margin: '0 auto' }}
          >
            {/* Left: sticky image area */}
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0} style={{ flexShrink: 0 }}>
              {isCollar ? (
                <div className="flex flex-col" style={{ position: 'sticky', top: 80, gap: 16 }}>
                  {[[0, 1], [2, 3]].map((row, ri) => (
                    <div key={ri} className="flex" style={{ gap: 16 }}>
                      {row.map((i) => (
                        <ProductImage
                          key={i}
                          src={product.images[i] ?? displayImage}
                          alt={displayName}
                          height={360}
                          width={360}
                          badge={i === 0 ? displayBadge : undefined}
                          badgeBg={displayBadgeBg}
                          badgeColor={displayBadgeColor}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    position: 'sticky', top: 80,
                    width: 480, height: 480, borderRadius: 24,
                    background: product.accentColor,
                  }}
                >
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="object-contain"
                    style={{ width: '72%', height: '72%' }}
                  />
                </div>
              )}
            </motion.div>

            {/* Right: product info */}
            <motion.div
              variants={FADE_UP} initial="hidden" animate="show" custom={0.1}
              className="flex-1 min-w-0 flex flex-col"
              style={{ gap: 24 }}
            >
              <ProductInfoBlock
                displayName={displayName}
                product={product}
                selectedCollar={selectedCollar}
                selectedSize={selectedSize}
                isCollar={isCollar}
                isMobile={isMobile}
                onCollarChange={setSelectedCollar}
                onSizeChange={setSelectedSize}
              />
              <PrimaryButton variant={added ? 'sage' : 'dark'} fullWidth onClick={handleAddToCart}>
                {added ? '✓ Added to cart' : `${product.price} — Add to cart`}
              </PrimaryButton>
              <DesktopTabsPanel desktopTab={desktopTab} onSelect={setDesktopTab} tabContent={tabContent} />
            </motion.div>
          </section>
        )}

        {/* ── Bento section ── */}
        <section
          className="bg-surface-2 flex flex-col"
          style={{
            padding: isMobile ? '24px 16px' : '64px',
            gap: 16,
            maxWidth: isMobile ? undefined : 1440,
            margin: isMobile ? undefined : '0 auto',
          }}
        >
          {isMobile ? (
            <>
              <WaterproofCard />
              <HandmadeCard />
              {isCollar && (
                <SizingGuide selectedSize={selectedSize} onSizeChange={setSelectedSize} sizeIndex={SIZE_INDEX} allSizes={ALL_GUIDE_SIZES} sizeDetails={SIZE_DETAILS} />
              )}
              <CharmCard />
              <CareCard isMobile />
            </>
          ) : (
            <>
              {/* Row 1: Waterproof + Handmade */}
              <div className="flex" style={{ gap: 16, flexWrap: isCompactBento ? 'wrap' : 'nowrap' }}>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><WaterproofCard /></div>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><HandmadeCard /></div>
              </div>
              {/* Row 2: Sizing + Charm + Care */}
              <div className="flex items-stretch" style={{ gap: 16, flexWrap: isCompactBento ? 'wrap' : 'nowrap' }}>
                {isCollar && (
                  <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}>
                    <SizingGuide selectedSize={selectedSize} onSizeChange={setSelectedSize} sizeIndex={SIZE_INDEX} allSizes={ALL_GUIDE_SIZES} sizeDetails={SIZE_DETAILS} />
                  </div>
                )}
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><CharmCard /></div>
                <div style={{ flex: isCompactBento ? '1 1 320px' : 1, minWidth: isCompactBento ? 320 : 0 }}><CareCard isMobile={false} /></div>
              </div>
            </>
          )}
        </section>

        {/* ── Photo slider ── */}
        <PhotoSlider />

        {/* ── You might also like ── */}
        <YouMightAlsoLike
          currentAccentColor={product.accentColor}
          isMobile={isMobile}
          isScrollable={isScrollableRecommendations}
        />
      </div>

      <CommerceFooter />
    </div>
  )
}

function DesktopTabsPanel({
  desktopTab,
  onSelect,
  tabContent,
}: {
  desktopTab: InfoTab
  onSelect: (tab: InfoTab) => void
  tabContent: Record<InfoTab, string>
}) {
  return (
    <div className="bg-white rounded-2xl flex flex-col" style={{ padding: '24px 16px', gap: 18 }}>
      <div className="flex gap-2 flex-wrap">
        {DESKTOP_TABS.map((tab) => {
          const active = tab.id === desktopTab
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className="rounded-[10px] border-none cursor-pointer font-sans whitespace-nowrap"
              style={{
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                background: active ? 'var(--color-bark)' : '#f4efe8',
                color: active ? 'var(--color-cream)' : 'var(--color-bark-light)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <p className="m-0 text-bark-light" style={{ fontSize: 14, lineHeight: '24.5px' }}>
        {tabContent[desktopTab]}
      </p>
    </div>
  )
}

/* ── Sub-components ── */

function ProductImage({
  src, alt, height, width, badge, badgeBg, badgeColor, isCollar, accentColor,
}: {
  src: string; alt: string; height: number; width?: number
  badge?: string; badgeBg?: string; badgeColor?: string
  isCollar?: boolean; accentColor?: string
}) {
  const isCharm = isCollar === false
  return (
    <div
      className="rounded-[20px] overflow-hidden relative"
      style={{
        height, width: width ?? '100%', flexShrink: width ? 0 : undefined,
        background: isCharm ? accentColor : undefined,
        display: isCharm ? 'flex' : undefined,
        alignItems: isCharm ? 'center' : undefined,
        justifyContent: isCharm ? 'center' : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: isCharm ? '72%' : '100%',
          height: isCharm ? '72%' : '100%',
          objectFit: isCharm ? 'contain' : 'cover',
        }}
      />
      {badge && (
        <div className="absolute top-3.5 right-3.5 rounded-[20px]" style={{ background: badgeBg, padding: '3.5px 10px' }}>
          <span className="font-medium uppercase" style={{ fontSize: 10, color: badgeColor, letterSpacing: '0.6px' }}>
            {badge}
          </span>
        </div>
      )}
    </div>
  )
}

function ProductInfoBlock({
  displayName, product, selectedCollar, selectedSize,
  isCollar, isMobile, onCollarChange, onSizeChange,
}: {
  displayName: string
  product: ProductDetail
  selectedCollar: Collar
  selectedSize: DisplaySize
  isCollar: boolean
  isMobile: boolean
  onCollarChange: (c: Collar) => void
  onSizeChange: (s: DisplaySize) => void
}) {
  return (
    <div className="flex flex-col min-w-0" style={{ gap: 16 }}>
      {/* Name + price */}
      <div
        className="flex"
        style={{
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: 12,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <div className="flex flex-col min-w-0 flex-1" style={{ gap: isMobile ? 0 : 8 }}>
          <p className="m-0 font-medium text-bark" style={{ fontSize: isMobile ? 24 : 32, lineHeight: isMobile ? '32px' : '40px' }}>
            {displayName}
          </p>
          <p className="m-0 text-bark-muted" style={{ fontSize: 16, lineHeight: '24px' }}>
            {product.shortDescription}
          </p>
        </div>
        <p className="m-0 ml-auto font-medium text-bark whitespace-nowrap" style={{ fontSize: isMobile ? 20 : 24, lineHeight: '30px' }}>
          {product.price}
        </p>
      </div>

      {/* Colour selector */}
      {isCollar && (
        <div className="flex flex-col" style={{ gap: 12 }}>
          <SectionLabel>
            Select colour —{' '}
            <span style={{ fontWeight: 400, color: 'var(--color-bark-light)', textTransform: 'none', letterSpacing: 0 }}>
              {selectedCollar.name}
            </span>
          </SectionLabel>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {COLLARS.map((collar) => {
              const active = collar.id === selectedCollar.id
              return (
                <motion.button
                  key={collar.id}
                  onClick={() => onCollarChange(collar)}
                  aria-label={`Select ${collar.name} colour`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="cursor-pointer p-0"
                  style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: collar.color,
                    border: active ? '2px solid var(--color-bark)' : '3px solid transparent',
                    boxShadow: active ? 'none' : `0 2px 8px 0 ${collar.glowColor}`,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      {isCollar && (
        <div className="flex flex-col" style={{ gap: 12 }}>
          <SectionLabel>Size</SectionLabel>
          <div className="flex flex-wrap" style={{ gap: 12 }}>
            {DISPLAY_SIZES.map((size) => {
              const active = size === selectedSize
              return (
                <motion.button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="cursor-pointer font-sans font-medium text-center border-none"
                  style={{
                    flex: '1 1 96px', padding: '12px 4px', borderRadius: 10,
                    background: active ? 'var(--color-bark)' : '#fff',
                    color: active ? 'var(--color-cream)' : 'rgba(45,45,45,0.87)',
                    fontSize: 16,
                    letterSpacing: '0.44px',
                  }}
                >
                  {size}
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


function WaterproofCard() {
  return (
    <div
      className="bg-sage rounded-[20px] flex flex-col h-full box-border"
      style={{ padding: 24, gap: 24 }}
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel color="rgba(42,90,37,0.6)">The material</SectionLabel>
        <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'var(--color-interactive-text)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          <p className="m-0">Waterproof.</p>
          <p className="m-0">No odor. No stains.</p>
        </div>
        <p className="m-0" style={{ fontSize: 15, color: 'rgba(42,90,37,0.75)', lineHeight: '25.5px' }}>
          TPU-coated nylon that shrugs off lakes, mud, and rain. Wipe with a damp cloth — it comes up looking new every time.
        </p>
      </div>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {['Lakes', 'Mud', 'Rain', 'Snow'].map((tag) => (
          <div key={tag} className="rounded-full" style={{ background: 'rgba(42,90,37,0.12)', padding: '6px 14px' }}>
            <span className="font-medium" style={{ fontSize: 12, color: 'var(--color-interactive-text)' }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HandmadeCard() {
  return (
    <div
      className="bg-bark rounded-[20px] flex flex-col h-full box-border"
      style={{ padding: 24, gap: 16 }}
    >
      <SectionLabel color="rgba(250,247,242,0.35)">Origin</SectionLabel>
      <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'var(--color-cream)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
        <p className="m-0">Handmade in</p>
        <p className="m-0">Vilnius, Lithuania.</p>
      </div>
      <p className="m-0" style={{ fontSize: 14, color: 'rgba(250,247,242,0.55)', lineHeight: '23.8px' }}>
        Small batch. Cut and assembled by hand in our workshop. Each collar ships in a linen pouch.
      </p>
      <p className="m-0 italic font-medium" style={{ fontSize: 22, color: 'rgba(250,247,242,0.2)', lineHeight: '33px', letterSpacing: '-0.22px' }}>
        Vandeniui atspari.
      </p>
    </div>
  )
}

function CharmCard() {
  return (
    <div
      className="bg-blossom rounded-[20px] flex flex-col justify-between h-full box-border"
      style={{ padding: '32px 28px', minHeight: 260, gap: 24 }}
    >
      <div>
        <SectionLabel color="rgba(61,20,30,0.45)">Charm system</SectionLabel>
        <p className="m-0 mb-2" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'rgba(61,20,30,0.85)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          Snaps on in 5 seconds.
        </p>
        <p className="m-0" style={{ fontSize: 14, color: 'rgba(61,20,30,0.6)', lineHeight: '22.4px' }}>
          Magnetic connector. No clips. No tools. No fuss.
        </p>
      </div>
      <div className="flex items-center" style={{ gap: 8 }}>
        {['🌸', '⭐', '🦋', '🌿'].map((emoji) => (
          <div key={emoji} className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
            {emoji}
          </div>
        ))}
        <span className="ml-1" style={{ fontSize: 12, color: 'rgba(61,20,30,0.5)' }}>+8 more</span>
      </div>
    </div>
  )
}

function CareCard({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="bg-cream rounded-[20px] flex flex-col border border-[var(--color-border)]" style={{ padding: 24, gap: 24 }}>
        <p className="m-0" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, color: 'rgba(61,20,30,0.85)', lineHeight: '50.4px', letterSpacing: '0.48px' }}>
          Care
        </p>
        <div className="flex flex-col" style={{ gap: 16 }}>
          {[[0, 1], [2, 3]].map((row, ri) => (
            <div key={ri} className="flex" style={{ gap: 24 }}>
              {row.map((i) => (
                <div key={i} className="flex-1">
                  <p className="m-0 mb-0.5 font-medium text-bark" style={{ fontSize: 13 }}>{CARE_BULLETS[i].title}</p>
                  <p className="m-0 text-bark-muted" style={{ fontSize: 12, lineHeight: '18px' }}>{CARE_BULLETS[i].desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream rounded-[20px] flex flex-col h-full box-border border border-[var(--color-border)]" style={{ padding: 24, gap: 16 }}>
      <SectionLabel>Care</SectionLabel>
      <div className="flex flex-col" style={{ gap: 12 }}>
        {CARE_BULLETS.map((item) => (
          <div key={item.title} className="flex items-start" style={{ gap: 16 }}>
            <div className="rounded-full bg-sage flex-shrink-0" style={{ width: 6, height: 6, marginTop: 7 }} />
            <div>
              <p className="m-0 font-medium text-bark" style={{ marginBottom: 1, fontSize: 13, lineHeight: '19.5px' }}>{item.title}</p>
              <p className="m-0 text-bark-muted" style={{ fontSize: 12, lineHeight: '18px' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SizingGuideProps {
  selectedSize: DisplaySize
  onSizeChange: (s: DisplaySize) => void
  sizeIndex: Record<string, number>
  allSizes: Array<{ key: string; range: string }>
  sizeDetails: Record<DisplaySize, { range: string; breeds: string }>
}

function SizingGuide({ selectedSize, onSizeChange, sizeIndex, allSizes, sizeDetails }: SizingGuideProps) {
  const details = sizeDetails[selectedSize]
  const progressPct = (sizeIndex[selectedSize] / 3) * 100

  return (
    <div
      className="bg-white rounded-[20px] flex flex-col h-full box-border border border-[var(--color-border)]"
      style={{ padding: 24, gap: 12 }}
    >
      <SectionLabel>Sizing guide</SectionLabel>
      <div className="flex items-end" style={{ gap: 10 }}>
        <span className="text-bark" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, lineHeight: '48px', letterSpacing: '0.48px' }}>
          {selectedSize}
        </span>
        <span className="text-bark-light mb-1" style={{ fontSize: 15, lineHeight: '22.5px' }}>
          {details.range} cm
        </span>
      </div>
      <p className="m-0 text-bark-muted" style={{ fontSize: 13 }}>{details.breeds}</p>
      <div className="rounded-[3px] mt-1" style={{ background: 'var(--color-border)', height: 6 }}>
        <div className="bg-sage rounded-[3px]" style={{ height: 6, width: `${Math.max(progressPct, 8)}%`, transition: 'width 0.2s ease' }} />
      </div>
      <div className="flex justify-between mt-0.5">
        {allSizes.map((s) => {
          const isActive = s.key === selectedSize
          const isSelectable = DISPLAY_SIZES.includes(s.key as DisplaySize)
          return (
            <button
              key={s.key}
              onClick={() => isSelectable && onSizeChange(s.key as DisplaySize)}
              className="bg-transparent border-none flex flex-col items-center font-sans p-0"
              style={{ cursor: isSelectable ? 'pointer' : 'default', gap: 2 }}
            >
              <span className="font-medium" style={{ fontSize: 12, color: isActive ? 'var(--color-bark)' : 'var(--color-bark-muted)', lineHeight: '18px' }}>{s.key}</span>
              <span style={{ fontSize: 10, color: 'var(--color-bark-muted)', lineHeight: '15px' }}>{s.range}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function YouMightAlsoLike({
  currentAccentColor,
  isMobile,
  isScrollable,
}: {
  currentAccentColor: string
  isMobile: boolean
  isScrollable: boolean
}) {
  const products = isMobile
    ? PRODUCTS.filter((p) => p.collarColor !== currentAccentColor)
    : [...PRODUCTS]

  return (
    <section
      className="bg-cream"
      style={{ padding: isMobile ? '64px 16px 48px' : '64px' }}
    >
      <div className="flex justify-between items-end mb-6" style={{ gap: 12 }}>
        <div>
          <SectionLabel>Recommended</SectionLabel>
          <p className="m-0 mt-2 text-bark" style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 48, lineHeight: '52.8px', letterSpacing: '-0.96px' }}>
            You might also like
          </p>
        </div>
        <Link href="/products" className="no-underline flex-shrink-0 text-bark-muted" style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
          View all →
        </Link>
      </div>

      <div
        className="flex"
        style={{
          gap: 16,
          overflowX: isScrollable ? 'auto' : 'visible',
          paddingBottom: isScrollable ? 8 : 0,
          scrollSnapType: isScrollable ? 'x mandatory' : undefined,
          msOverflowStyle: isScrollable ? 'none' : undefined,
          scrollbarWidth: isScrollable ? 'none' : undefined,
        }}
      >
        {products.map((p) => {
          const slug = slugFromProductName(p.name)
          return (
            <Link
              key={p.id}
              href={`/products/${slug}`}
              className="no-underline text-inherit flex-shrink-0"
              style={{
                width: 272,
                scrollSnapAlign: isScrollable ? 'start' : undefined,
              }}
            >
              <div className="rounded-[20px] overflow-hidden relative" style={{ height: 200 }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.badge && (
                  <div className="absolute top-3.5 right-3.5 rounded-[20px]" style={{ background: p.badgeBg, padding: '3.5px 10px' }}>
                    <span className="font-medium uppercase" style={{ fontSize: 10, color: p.badgeColor, letterSpacing: '0.6px' }}>
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 4px 0' }}>
                <p className="m-0 mb-1 font-medium text-bark" style={{ fontSize: 15 }}>{p.name}</p>
                <p className="m-0 mb-3 text-bark-muted" style={{ fontSize: 13 }}>{p.desc}</p>
                <div className="flex mb-3.5" style={{ gap: 6 }}>
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: p.collarColor, border: '1px solid rgba(61,53,48,0.15)' }} />
                  {p.charms.slice(0, 4).map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full self-center" style={{ background: c.bg, border: '1px solid rgba(61,53,48,0.12)' }} />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-bark" style={{ fontSize: 18 }}>
                    {p.price}{' '}
                    <span className="font-normal text-bark-muted" style={{ fontSize: 12 }}>· 5 charms</span>
                  </span>
                  <PrimaryButton variant="sage" size="sm">Add to cart</PrimaryButton>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
