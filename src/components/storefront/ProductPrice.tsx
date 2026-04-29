import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function parseEuroPrice (value?: string) {
  if (!value) return null
  const parsed = Number(value.replace(/[^\d.,-]/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
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
    ? 'text-[26px] md:text-[30px]'
    : 'text-[22px]'
  const originalSizeClass = size === 'detail'
    ? 'text-[14px]'
    : 'text-[13px]'
  const noteSizeClass = size === 'detail'
    ? 'text-[13px]'
    : 'text-[12px]'

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1 font-sans'>
        <span className={cn('font-semibold text-bark', currentSizeClass, currentPriceClassName)}>
          {currentPrice}
        </span>
        {hasSale && originalPrice ? (
          <span className={cn('font-medium text-bark-muted line-through', originalSizeClass, originalPriceClassName)}>
            {originalPrice}
          </span>
        ) : null}
        {showSavingsBadge && hasSale && savingsPercent ? (
          <Badge variant='sage' size='compact' className='ml-1'>
            -{savingsPercent}%
          </Badge>
        ) : null}
      </div>
      {note ? (
        <span className={cn('font-medium text-bark-muted', noteSizeClass, noteClassName)}>
          {note}
        </span>
      ) : null}
    </div>
  )
}

export function hasDiscountedPrice (currentPrice: string, originalPrice?: string) {
  return getSaleMeta(currentPrice, originalPrice).hasSale
}
