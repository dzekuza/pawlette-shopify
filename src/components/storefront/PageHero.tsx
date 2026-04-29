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
          'relative mb-12 flex w-full items-center justify-center overflow-hidden',
          'bg-cream',
          className
        )}
      >
        <div className='relative z-10 mx-auto grid w-full max-w-[1160px] gap-8 gap-3 md:gap-8 md:grid-cols-[minmax(0,70%)_minmax(280px,30%)] md:items-end'>
          <div className='max-w-[820px] text-left'>
            <Eyebrow className='mb-4'>{eyebrow}</Eyebrow>
            <DisplayHeading
              as='h1'
              size='page'
              className={cn('m-0', titleClassName)}
            >
              {title}
            </DisplayHeading>
          </div>

          {description ? (
            <BodyCopy
              className={cn(
                'mb-0 max-w-[30rem] text-left text-[16px] leading-[1.7] text-bark/72 md:justify-self-end md:text-[18px]',
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
