'use client'

import { getImageProps } from 'next/image'
import { useTranslations } from 'next-intl'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

/** Full-bleed photo hero: wide art on desktop, a 4:5 crop on phones, headline beside or below the photo. */
export function PhotoHero () {
  const t = useTranslations('landing.hero')
  const alt = t('imageAlt')

  const { props: desktop } = getImageProps({
    src: '/hero/park-moment-cover.jpg',
    alt,
    width: 2200,
    height: 1228,
    sizes: '100vw',
    priority: true,
  })
  const { props: mobile } = getImageProps({
    src: '/hero/park-moment-cover-mobile.jpg',
    alt,
    width: 1080,
    height: 1349,
    sizes: '100vw',
    priority: true,
  })

  // The nav above is 92px tall on phones and 94px from md up (measured); the negative margins must match it
  // exactly or a cream seam shows between the top bar and the photo.
  return (
    <section className='relative -mt-[92px] flex flex-col bg-cream md:-mt-[94px] md:min-h-[100dvh] md:justify-center'>
      <div className='relative aspect-[4/5] w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto'>
        <picture>
          <source media='(min-width: 768px)' srcSet={desktop.srcSet} sizes='100vw' />
          <source srcSet={mobile.srcSet} sizes='100vw' />
          <img
            src={mobile.src}
            alt={alt}
            width={mobile.width}
            height={mobile.height}
            fetchPriority='high'
            decoding='async'
            className='absolute inset-0 h-full w-full object-cover md:object-[70%_50%]'
          />
        </picture>
        <div className='absolute inset-0 hidden bg-linear-to-r from-cream/90 via-cream/45 to-transparent md:block' />
      </div>

      <div className='relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-6 pb-14 pt-8 md:pb-24 md:pt-[132px]'>
        <div className='flex max-w-[560px] flex-col items-start gap-5'>
          <Eyebrow className='text-interactive-text'>{t('eyebrow')}</Eyebrow>
          <DisplayHeading as='h1' size='hero' className='text-bark text-[40px] leading-[1.08] md:text-[64px]'>
            {t('heading')}
          </DisplayHeading>
          <PrimaryButton
            href='#customize'
            size='lg'
            onClick={() => trackGaEvent('cta_click', { cta_id: 'hero_buy_now', cta_location: 'hero' })}
          >
            {t('buyNow')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
