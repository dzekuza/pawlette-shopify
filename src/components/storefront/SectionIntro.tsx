import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface SectionIntroProps {
  actionHref?: string
  actionLabel?: string
  children?: React.ReactNode
  className?: string
  description?: string
  eyebrow: string
  title: string
}

export function SectionIntro ({
  actionHref,
  actionLabel,
  children,
  className,
  description,
  eyebrow,
  title,
}: SectionIntroProps) {
  return (
    <div className={cn('mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        <Eyebrow className='mb-3'>{eyebrow}</Eyebrow>
        <DisplayHeading>{title}</DisplayHeading>
        {description ? (
          <BodyCopy className='mt-4 max-w-[480px] text-base leading-[1.7]'>{description}</BodyCopy>
        ) : null}
      </div>
      {children ? (
        <div className='flex shrink-0 flex-col items-start gap-3 md:items-end'>{children}</div>
      ) : actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className='hidden self-start font-sans text-sm text-bark-muted no-underline md:inline md:self-auto'
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
