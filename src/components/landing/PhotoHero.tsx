'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { HeroHotspot } from '@/components/landing/HeroHotspot'
import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { BodyCopy, DisplayHeading } from '@/components/storefront/Typography'
import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config'

function HeroChip ({ children }: { children: React.ReactNode }) {
  return (
    <span className='rounded-full bg-bark/10 px-3.5 py-1.5 text-[12px] font-medium text-bark lg:bg-white/15 lg:text-white lg:backdrop-blur-sm'>
      {children}
    </span>
  )
}

function HeroGhostLink ({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className='inline-flex h-12 items-center justify-center rounded-full border border-bark/30 px-8 text-[15px] font-medium text-bark no-underline transition-colors hover:bg-bark/5 lg:border-white/60 lg:bg-white/10 lg:text-white lg:backdrop-blur-sm lg:hover:bg-white/20'
    >
      {children}
    </Link>
  )
}

/**
 * Card hero: an inset rounded 16:9 photo with the headline over its left (lg+) or below it (phones and tablets).
 * From lg up the card keeps the photo's 2200:1228 aspect ratio so the hotspot percentages stay exact; the card also
 * shrinks to fit the viewport height. Below xl the text may sit over the subjects (a dark scrim keeps it readable); from xl the column stays left of the hotspot.
 */
export function PhotoHero ({ startingPrice }: { startingPrice?: string }) {
  const t = useTranslations('landing.hero')
  const alt = t('imageAlt')

  // The sticky nav above is 92px tall on phones and 94px from md up (measured); the negative margins must match it
  // exactly or a cream seam shows between the top bar and the hero background.
  return (
    <section className='relative -mt-[92px] bg-linear-to-br from-honey/40 via-cream to-sage/30 px-4 pb-8 pt-[104px] md:-mt-[94px] md:px-6 md:pb-12 md:pt-[112px]'>
      <div className='@container relative mx-auto max-w-[720px] [--card-w:min(calc(100vw-48px),1152px,calc((100dvh-172px)*1.79))] lg:aspect-[2200/1228] lg:w-[var(--card-w)] lg:max-w-none'>
        <div className='relative aspect-[2200/1228] overflow-hidden rounded-[28px] lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-[32px]'>
          <Image
            src='/hero/park-moment-cover.jpg'
            alt={alt}
            width={2200}
            height={1228}
            sizes='(min-width: 1200px) 1152px, 100vw'
            priority
            className='absolute inset-0 h-full w-full object-cover'
          />
          <div className='absolute inset-0 hidden bg-linear-to-r from-bark/75 via-bark/35 to-transparent lg:block' />
          <div className='absolute inset-0 hidden bg-linear-to-t from-bark/40 to-transparent lg:block' />
        </div>

        <HeroHotspot label={t('hotspot')} />

        {/* Left padding keeps the text clear of the fixed bottom-left video widget (16px offset, 108px wide): it is 48px by default and only grows when the card's own side margin is smaller than the widget. */}
        <div className='relative z-10 flex flex-col items-start gap-5 px-1 pt-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:max-w-[62%] lg:p-12 lg:pl-[max(3rem,calc(84px-(100vw-var(--card-w))/2))] xl:max-w-[41%] xl:pr-6'>
          <div className='flex flex-wrap gap-2'>
            <HeroChip>{t('chipHandmade')}</HeroChip>
            <HeroChip>{t('chipShipping', { threshold: FREE_SHIPPING_THRESHOLD_TEXT })}</HeroChip>
          </div>
          <DisplayHeading
            as='h1'
            size='hero'
            className='text-[40px] leading-[1.18] text-bark md:text-[48px] lg:text-[clamp(2.25rem,4.6cqw,4.75rem)] lg:text-white'
          >
            {t('heading')}
          </DisplayHeading>
          <BodyCopy className='max-w-[46ch] text-bark-light lg:text-[clamp(0.85rem,1.15cqw,1.05rem)] lg:leading-[1.5] lg:text-white/85'>{t('subheading')}</BodyCopy>
          {startingPrice ? (
            <p className='m-0 text-[15px] font-semibold text-bark lg:text-white'>{t('priceFrom', { price: startingPrice })}</p>
          ) : null}
          <div className='flex flex-wrap items-center gap-3'>
            <PrimaryButton
              href='#customize'
              variant='sage'
              size='lg'
              onClick={() => trackGaEvent('cta_click', { cta_id: 'hero_buy_now', cta_location: 'hero' })}
            >
              {t('buyNow')}
            </PrimaryButton>
            <HeroGhostLink href='/products/charm-charms'>{t('secondaryCta')}</HeroGhostLink>
          </div>
        </div>
      </div>
    </section>
  )
}
