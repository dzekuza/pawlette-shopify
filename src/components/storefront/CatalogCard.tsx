import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CatalogCardLinkProps {
  children: React.ReactNode
  className?: string
  href: string
}

interface CatalogCardMediaProps {
  alt: string
  background?: string
  children?: React.ReactNode
  className?: string
  image?: string
}

interface CatalogCardDescriptionProps {
  children: React.ReactNode
  className?: string
  lines?: 3 | 4
}

export function CatalogCardLink ({ children, className, href }: CatalogCardLinkProps) {
  return (
    <Link
      href={href}
      data-animate='card'
      className={cn(
        'group block rounded-[20px] no-underline transition-transform duration-200 ease-out hover:-translate-y-1',
        className
      )}
    >
      {children}
    </Link>
  )
}

export function CatalogCard ({ children, className }: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('flex h-full flex-col rounded-[20px] border-0 bg-transparent shadow-none', className)}>
      {children}
    </Card>
  )
}

export function CatalogCardMedia ({
  alt,
  background,
  children,
  className,
  image,
}: CatalogCardMediaProps) {
  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-[20px]', className)} style={background ? { background } : undefined}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw'
          className='block h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105'
        />
      ) : null}
      {children}
    </div>
  )
}

export function CatalogCardBody ({ children, className }: React.ComponentProps<'div'>) {
  return (
    <CardContent className={cn('flex flex-1 flex-col px-1 pb-1.5 pt-4', className)}>
      {children}
    </CardContent>
  )
}

export function CatalogCardTitle ({ children, className }: React.ComponentProps<'div'>) {
  return <div className={cn('mb-1 font-sans text-[15px] font-medium text-bark', className)}>{children}</div>
}

export function CatalogCardDescription ({
  children,
  className,
  lines = 3,
}: CatalogCardDescriptionProps) {
  const lineClampClass = lines === 4 ? '[-webkit-line-clamp:4]' : '[-webkit-line-clamp:3]'

  return (
    <div
      className={cn(
        'mb-3.5 overflow-hidden font-sans text-[13px] leading-[1.5] text-bark-muted [display:-webkit-box] [-webkit-box-orient:vertical]',
        lineClampClass,
        className
      )}
    >
      {children}
    </div>
  )
}

export function CatalogCardFooter ({ children, className }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex items-center justify-between gap-4', className)}>{children}</div>
}

export function CatalogCardAction ({
  children,
  className,
  variant = 'pill',
}: React.ComponentProps<'span'> & { variant?: 'pill' | 'link' }) {
  return (
    <span
      className={cn(
        variant === 'pill'
          ? 'btn-press rounded-full bg-sage px-[18px] py-2 font-sans text-[13px] font-medium text-interactive-text transition-colors duration-150 ease-out group-hover:bg-sage-dark'
          : 'font-sans text-[13px] font-medium text-interactive-text',
        className
      )}
    >
      {children}
    </span>
  )
}
