import { cn } from '@/lib/utils'
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard'
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
  const content = (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', centered && 'items-center text-center')}>
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
          <BodyCopy className={cn(centered ? 'm-0 text-[16px] leading-relaxed text-bark/65 md:text-[18px]' : 'mb-0 mt-4 max-w-[52ch]', descriptionClassName)}>
            {description}
          </BodyCopy>
        ) : null}
      </div>
      {aside ? <div className={cn('self-start', centered ? 'mt-6 self-center' : 'md:min-w-[260px]')}>{aside}</div> : null}
    </div>
  )

  if (tone === 'hero') {
    return (
      <SurfaceCard variant='hero' className={cn('mb-10 rounded-[32px]', className)}>
        <SurfaceCardBody>{content}</SurfaceCardBody>
      </SurfaceCard>
    )
  }

  return <section className={className}>{content}</section>
}
