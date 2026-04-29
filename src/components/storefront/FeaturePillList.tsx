import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FeaturePillListProps {
  items: string[]
  className?: string
}

export function FeaturePillList ({ items, className }: FeaturePillListProps) {
  if (!items.length) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <Badge key={item} variant='outline' size='sm' className='border-bark/10 bg-bark/[0.03] text-bark-light normal-case tracking-[0.02em]'>
          {item}
        </Badge>
      ))}
    </div>
  )
}
