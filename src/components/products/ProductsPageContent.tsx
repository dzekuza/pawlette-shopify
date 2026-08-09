'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ProductDetail } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useTranslations } from 'next-intl'
import { Accordion } from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface ProductsPageContentProps {
  products: ProductDetail[]
}

export function ProductsPageContent ({ products }: ProductsPageContentProps) {
  const t = useTranslations('products.pageContent')
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768

  const faqItems = t.raw('faq.items') as Array<{ id: string; question: string; answer: string }>
  const accordionItems: AccordionItem[] = faqItems.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer,
  }))

  return (
    <>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="max-w-[1200px] mx-auto" style={{ padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div id={t('gridId')} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Personalization + material — real supporting copy for the collar landing page, not just the product grid */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-2 md:gap-14">
          <div>
            <Eyebrow className="mb-3">{t('sections.personalization.eyebrow')}</Eyebrow>
            <DisplayHeading size="compact" className="mb-4">{t('sections.personalization.heading')}</DisplayHeading>
            <BodyCopy>{t('sections.personalization.body')}</BodyCopy>
          </div>
          <div>
            <Eyebrow className="mb-3">{t('sections.material.eyebrow')}</Eyebrow>
            <DisplayHeading size="compact" className="mb-4">{t('sections.material.heading')}</DisplayHeading>
            <BodyCopy>{t('sections.material.body')}</BodyCopy>
          </div>
        </div>

        {/* FAQ — also lets the target keyword phrases appear naturally a second time */}
        <div className="mt-16 max-w-[720px] md:mt-24">
          <DisplayHeading size="compact" className="mb-6">{t('faq.heading')}</DisplayHeading>
          <Accordion items={accordionItems} isMobile={isMobile} />
        </div>
      </main>

      <section className="px-5 py-[60px] text-center bg-bark md:px-10 md:py-[80px]">
        <p className="font-handwriting text-[22px] mb-2 text-sage tracking-[0.01em] md:text-[28px]">
          {t('cta.kicker')}
        </p>
        <DisplayHeading as="h2" size="section" className="mb-6 text-cream">
          {t('cta.heading')}
        </DisplayHeading>
        <PrimaryButton href={`#${t('gridId')}`} variant="sage" size="lg">
          {t('cta.button')}
        </PrimaryButton>
      </section>

      <LandingFooter />
    </>
  )
}
