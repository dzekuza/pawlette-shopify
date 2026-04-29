import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-transparent font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.08em] transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-bark',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-border bg-transparent text-bark',
        sage: 'bg-sage/20 text-interactive-text',
        sky: 'bg-sky/30 text-bark',
        honey: 'bg-honey/40 text-bark',
        blossom: 'bg-blossom/30 text-bark',
        glass: 'bg-cream/90 text-bark shadow-[0_6px_18px_rgba(61,53,48,0.08)] backdrop-blur-[6px]',
        personalize:
          'bg-[linear-gradient(135deg,rgba(255,170,120,0.96)_0%,rgba(255,108,155,0.92)_34%,rgba(109,166,255,0.94)_68%,rgba(88,208,170,0.92)_100%)] px-3 py-[5px] text-[9px] tracking-[0.12em] text-[#FFFDF9] shadow-[0_10px_24px_rgba(105,94,160,0.24),inset_0_1px_0_rgba(255,255,255,0.22)]',
      },
      size: {
        default: 'px-3 py-1',
        sm: 'px-2.5 py-0.5 text-[9px]',
        compact: 'px-2.5 py-[3px]',
        customize: 'px-3 py-[5px]',
      },
    },
    compoundVariants: [
      {
        variant: 'personalize',
        size: 'default',
        className: 'px-3 py-[5px]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Badge ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
