'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LandingNav } from '@/components/landing/LandingNav'
import { TopBar } from '@/components/landing/TopBar'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { FAQ } from '@/components/landing/FAQ'
import { About } from '@/components/landing/About'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { CharmCard } from '@/components/products/CharmCard'
import { GalleryLightbox } from '@/components/products/GalleryLightbox'
import { ProductStorySection } from '@/components/products/ProductStorySection'
import { ProductValueShowcase } from '@/components/products/ProductValueShowcase'
import { useProductPage } from '@/components/products/ProductPageContext'
import { SectionIntro } from '@/components/storefront/SectionIntro'
import { useCartCount } from '@/hooks/useCartCount'

interface ProductPageShellProps {
  /** Name shown in the value showcase; defaults to the product name (charm pages pass the picked charm's name). */
  name?: string
  /** The hero: gallery + buy panel for the current layout. */
  children: ReactNode
}

/** Page chrome shared by every product layout: nav, the hero slot, then the sections below the fold and the lightbox. */
export function ProductPageShell({ name, children }: ProductPageShellProps) {
  const t = useTranslations('products.pdp')
  const router = useRouter()
  const cartCount = useCartCount()
  const {
    state: { configurator: { charms }, gallery, lightboxIndex },
    actions: { closeLightbox, setLightboxIndex },
    meta: { product, hasCharmVariants },
  } = useProductPage()
  const displayName = name ?? product.name

  return (
    <div className="bg-cream min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <TopBar />
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {children}

      {/* Individual charm PDPs (e.g. /products/charm-letter-a-blue) otherwise have no internal
          link pointing to them — the builder above adds variants straight to cart by id, it never
          navigates here. This grid is their only discoverable path, so search traffic landing on
          one still finds the rest instead of hitting a dead end. */}
      {hasCharmVariants && charms.length > 0 && (
        <section className='mx-auto max-w-[1200px] px-4 py-16 md:px-6'>
          <SectionIntro eyebrow={t('allCharms.eyebrow')} title={t('allCharms.title')} />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {charms.map((charm) => (
              <CharmCard key={charm.id} charm={charm} />
            ))}
          </div>
        </section>
      )}

      <About
        eyebrow={t('aboutHeading.eyebrow')}
        heading={t.rich('aboutHeading.title', { br: () => <br /> })}
        craftsmanshipCard={{
          eyebrow: t('aboutCards.craftsmanship.eyebrow'),
          heading: t('aboutCards.craftsmanship.heading'),
          description: t('aboutCards.craftsmanship.description'),
        }}
        personalizationCard={{
          eyebrow: t('aboutCards.personalization.eyebrow'),
          heading: t('aboutCards.personalization.heading'),
          description: t('aboutCards.personalization.description'),
        }}
        pairingCard={{
          eyebrow: t('aboutCards.pairing.eyebrow'),
          heading: t('aboutCards.pairing.heading'),
          description: t('aboutCards.pairing.description'),
        }}
      />

      <ProductStorySection
        eyebrow={t('story.eyebrow')}
        title={t('story.title')}
        body={t('story.body')}
      />

      <ProductValueShowcase name={displayName} />

      <ComparisonTable />
      <PhotoSlider product={product} />
      <FAQ />

      <LandingFooter />

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  )
}
