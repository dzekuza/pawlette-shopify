import { cn } from '@/lib/utils'

export function Eyebrow ({
  children,
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-bark-muted', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function DisplayHeading ({
  as: Tag = 'h2',
  children,
  className,
  size = 'section',
  ...props
}: React.ComponentProps<'h2'> & {
  as?: 'h1' | 'h2' | 'h3'
  size?: 'hero' | 'page' | 'section' | 'compact' | 'floatingHero'
}) {
  const sizeClasses = {
    hero: 'text-[48px] leading-[1.05] tracking-[-0.03em] md:text-[72px]',
    page: 'text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.96] tracking-[-0.04em]',
    section: 'text-[30px] leading-[1.05] tracking-[-0.03em] md:text-[40px] md:leading-[1.1]',
    compact: 'text-[22px] leading-[1.08] tracking-[-0.03em] md:text-[26px]',
    floatingHero: 'text-[clamp(3.9rem,8vw,6.8rem)] leading-[0.92] tracking-[-0.05em] md:text-[72px]',
  }

  return (
    <Tag className={cn('font-display font-normal text-bark', sizeClasses[size], className)} {...props}>
      {children}
    </Tag>
  )
}

export function BodyCopy ({
  children,
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p className={cn('font-sans text-[15px] leading-7 text-bark-light md:text-[17px]', className)} {...props}>
      {children}
    </p>
  )
}
