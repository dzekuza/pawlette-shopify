import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function parseEuroPrice (value?: string) {
  if (!value) return null
  const parsed = Number(value.replace(/[^\d.,-]/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function formatPrice (value?: string): string {
  if (!value) return value ?? ''
  const num = parseEuroPrice(value)
  if (num === null) return value
  return `€${num.toFixed(2)}`
}

function getSaleMeta (currentPrice: string, originalPrice?: string) {
  const current = parseEuroPrice(currentPrice)
  const original = parseEuroPrice(originalPrice)

  if (current === null || original === null || original <= current) {
    return { hasSale: false, savingsPercent: null as number | null }
  }

  return {
    hasSale: true,
    savingsPercent: Math.round(((original - current) / original) * 100),
  }
}

interface ProductPriceProps {
  currentPrice: string
  originalPrice?: string
  note?: string
  className?: string
  currentPriceClassName?: string
  noteClassName?: string
  originalPriceClassName?: string
  size?: 'card' | 'detail'
  showSavingsBadge?: boolean
}

export function ProductPrice ({
  currentPrice,
  originalPrice,
  note,
  className,
  currentPriceClassName,
  noteClassName,
  originalPriceClassName,
  size = 'card',
  showSavingsBadge = false,
}: ProductPriceProps) {
  const { hasSale, savingsPercent } = getSaleMeta(currentPrice, originalPrice)

  const currentSizeClass = size === 'detail'
    ? 'text-xl md:text-2xl'
    : 'text-xl'
  const originalSizeClass = size === 'detail'
    ? 'text-sm'
    : 'text-xs'
  const noteSizeClass = size === 'detail'
    ? 'text-xs'
    : 'text-xs'

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1 font-tomato min-w-0', className)}>
      <span className={cn('font-semibold text-bark', currentSizeClass, currentPriceClassName)}>
        {formatPrice(currentPrice)}
      </span>
      {hasSale && originalPrice ? (
        <span className={cn('font-medium text-bark-muted line-through', originalSizeClass, originalPriceClassName)}>
          {formatPrice(originalPrice)}
        </span>
      ) : null}
      {showSavingsBadge && hasSale && savingsPercent ? (
        <Badge variant='sage' size='compact' className='ml-1'>
          -{savingsPercent}%
        </Badge>
      ) : null}
      {note ? (
        <span className={cn('basis-full font-medium text-bark-muted', noteSizeClass, noteClassName)}>
          {note}
        </span>
      ) : null}
    </div>
  )
}

export function hasDiscountedPrice (currentPrice: string, originalPrice?: string) {
  return getSaleMeta(currentPrice, originalPrice).hasSale
}
