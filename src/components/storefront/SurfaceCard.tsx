import { cva, type VariantProps } from 'class-variance-authority'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const surfaceCardVariants = cva('rounded-[28px] border shadow-none', {
  variants: {
    variant: {
      white: 'border-border bg-white',
      muted: 'border-bark/8 bg-surface-2/70',
      hero:
        'border-bark/8 bg-[linear-gradient(135deg,rgba(255,196,168,0.22)_0%,rgba(255,245,238,0.92)_28%,rgba(184,216,244,0.2)_68%,rgba(168,213,162,0.22)_100%)] shadow-[0_20px_48px_rgba(61,53,48,0.06)]',
      soft: 'border-bark/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,237,230,0.92)_100%)] shadow-[0_20px_48px_rgba(61,53,48,0.06)]',
    },
    padding: {
      default: 'p-6 md:p-8',
      compact: 'p-4 md:p-5',
      roomy: 'px-7 py-12 md:px-12 md:py-14',
    },
  },
  defaultVariants: {
    variant: 'white',
    padding: 'default',
  },
})

export function SurfaceCard ({
  className,
  padding,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof surfaceCardVariants>) {
  return <Card className={cn(surfaceCardVariants({ variant, padding }), className)} {...props} />
}

export function SurfaceCardBody ({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <CardContent className={cn('p-0', className)} {...props} />
}
