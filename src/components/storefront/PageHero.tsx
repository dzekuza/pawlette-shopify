import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface PageHeroProps {
  aside?: React.ReactNode
  centered?: boolean
  className?: string
  description?: string
  descriptionClassName?: string
  eyebrow: string
  title: string
  titleClassName?: string
  tone?: 'plain' | 'hero'
}

export function PageHero ({
  aside,
  centered = false,
  className,
  description,
  descriptionClassName,
  eyebrow,
  title,
  titleClassName,
  tone = 'plain',
}: PageHeroProps) {
  const standardContent = (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        centered && 'items-center text-center'
      )}
    >
      <div className={cn(centered ? 'mx-auto max-w-[640px]' : 'max-w-[56ch]')}>
        <Eyebrow className='mb-3'>{eyebrow}</Eyebrow>
        <DisplayHeading
          as='h1'
          size={centered ? 'hero' : 'page'}
          className={cn(centered ? 'mb-5' : 'm-0 max-w-[11ch]', titleClassName)}
        >
          {title}
        </DisplayHeading>
        {description ? (
          <BodyCopy
            className={cn(
              centered
                ? 'm-0 text-[16px] leading-relaxed text-bark/65 md:text-[18px]'
                : 'mb-0 mt-4 max-w-[52ch]',
              descriptionClassName
            )}
          >
            {description}
          </BodyCopy>
        ) : null}
      </div>
      {aside ? <div className={cn('mt-6 self-center')}>{aside}</div> : null}
    </div>
  )

  if (tone === 'hero') {
    return (
      <section
        className={cn(
          'relative mb-12 flex w-full items-center justify-center overflow-hidden px-6 md:px-10',
          'bg-cream',
          className
        )}
      >
        <svg
          className='pointer-events-none absolute -left-20 -top-24 h-[360px] w-[360px] opacity-55 md:h-[520px] md:w-[520px]'
          viewBox='0 0 600 600'
          fill='none'
          aria-hidden
        >
          <path d='M515 181C378 52 129 136 51 294C-27 451 126 600 126 600' stroke='#F4B5C0' strokeWidth='2' strokeLinecap='round' />
        </svg>
        <svg
          className='pointer-events-none absolute -bottom-28 -right-24 h-[420px] w-[420px] opacity-45 md:h-[620px] md:w-[620px]'
          viewBox='0 0 700 700'
          fill='none'
          aria-hidden
        >
          <path d='M27 528C194 690 480 637 594 452C709 267 544 2 544 2' stroke='#A8D5A2' strokeWidth='2' strokeLinecap='round' />
        </svg>
        <svg
          className='pointer-events-none absolute right-10 top-12 h-[220px] w-[220px] opacity-30 md:right-16 md:top-20 md:h-[280px] md:w-[280px]'
          viewBox='0 0 300 300'
          fill='none'
          aria-hidden
        >
          <path d='M260 40C320 120 290 240 180 270C70 300 20 210 60 130C100 50 200 30 260 40Z' stroke='#B8D8F4' strokeWidth='1.5' fill='none' strokeDasharray='8 6' />
        </svg>

        <div className='pointer-events-none absolute left-[4%] top-[12%] hidden md:block'>
          <Image src='/charm-z.png' alt='' width={110} height={110} className='float-c h-auto w-[110px] drop-shadow-[0_10px_24px_rgba(168,213,162,0.4)]' />
        </div>
        <div className='pointer-events-none absolute left-[6%] top-[40%] hidden md:block'>
          <Image src='/charm-flower.png' alt='' width={92} height={92} className='float-a h-auto w-[92px] drop-shadow-[0_8px_20px_rgba(212,184,244,0.45)] [animation-delay:1.2s]' />
        </div>
        <div className='pointer-events-none absolute left-[8%] top-[68%] hidden md:block'>
          <Image src='/charm-star.png' alt='' width={96} height={96} className='float-d h-auto w-[96px] drop-shadow-[0_10px_22px_rgba(249,228,160,0.5)]' />
        </div>
        <div className='pointer-events-none absolute right-[8%] top-[13%] hidden md:block'>
          <Image src='/charm-heart.png' alt='' width={96} height={96} className='float-e h-auto w-[96px] drop-shadow-[0_10px_22px_rgba(244,181,192,0.45)]' />
        </div>
        <div className='pointer-events-none absolute right-[6%] top-[42%] hidden md:block'>
          <Image src='/charm-star.png' alt='' width={78} height={78} className='float-b h-auto w-[78px] drop-shadow-[0_8px_18px_rgba(249,228,160,0.4)] [animation-delay:0.9s]' />
        </div>
        <div className='pointer-events-none absolute right-[8%] top-[66%] hidden md:block'>
          <Image src='/charm-paw.png' alt='' width={104} height={104} className='float-f h-auto w-[104px] drop-shadow-[0_10px_22px_rgba(184,216,244,0.5)]' />
        </div>

        <div className='relative z-10 mx-auto grid w-full max-w-[1160px] gap-8 md:grid-cols-[minmax(0,70%)_minmax(280px,30%)] md:items-start'>
          <div className='max-w-[820px] text-left'>
            <div className='mb-4 flex flex-col items-start gap-3'>
              <div className='font-["Caveat",cursive] text-[24px] leading-none text-bark-muted md:text-[28px]'>
                sukurta
                <br />
                tavo šuniui ♥
              </div>
              <div className='inline-flex items-center gap-2 rounded-full bg-honey/70 px-4 py-2 font-sans text-[12px] font-medium text-[#7a5010] md:text-[13px]'>
                ✦ Pagaminta Lietuvoje · Atsparūs vandeniui
              </div>
            </div>
            <DisplayHeading
              as='h1'
              size='floatingHero'
              className={cn('m-0 max-w-[8.5ch] md:max-w-[9ch]', titleClassName)}
            >
              {title}
            </DisplayHeading>
          </div>

          {description ? (
            <BodyCopy
              className={cn(
                'mb-0 max-w-[30rem] self-start pt-2 text-left text-[16px] leading-[1.7] text-bark/72 md:justify-self-end md:pt-7 md:text-[18px]',
                descriptionClassName
              )}
            >
              {description}
            </BodyCopy>
          ) : null}
        </div>
      </section>
    )
  }

  return <section className={className}>{standardContent}</section>
}
