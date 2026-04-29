import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard'
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface EmptyStateProps {
  actionHref?: string
  actionLabel?: string
  className?: string
  description: string
  eyebrow?: string
  icon: LucideIcon
  title: string
}

export function EmptyState ({
  actionHref,
  actionLabel,
  className,
  description,
  eyebrow,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <SurfaceCard variant='soft' padding='roomy' className={className}>
      <SurfaceCardBody className='flex flex-col items-center justify-center text-center'>
        <div className='mb-5 flex size-[76px] items-center justify-center rounded-[24px] bg-sage/18 text-bark'>
          <Icon className='size-9' strokeWidth={1.8} />
        </div>
        {eyebrow ? <Eyebrow className='mb-3 text-[12px] tracking-[0.18em] text-bark-light'>{eyebrow}</Eyebrow> : null}
        <DisplayHeading as='h2' size='section' className='m-0 text-[32px] leading-[1.02] tracking-[-0.03em] md:text-[40px]'>
          {title}
        </DisplayHeading>
        <BodyCopy className='mb-0 mt-4 max-w-[32ch] text-[16px] leading-[1.6]'>
          {description}
        </BodyCopy>
        {actionHref && actionLabel ? (
          <Button asChild variant='sage' size='pill-lg' className='mt-8'>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </SurfaceCardBody>
    </SurfaceCard>
  )
}
