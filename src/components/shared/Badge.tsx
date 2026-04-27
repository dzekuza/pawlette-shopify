import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sage' | 'sky' | 'honey' | 'blossom';
}

const variantClasses = {
  default: 'bg-surface-2 text-bark',
  sage: 'bg-sage/20 text-interactive-text',
  sky: 'bg-sky/30 text-blue-800',
  honey: 'bg-honey/40 text-amber-800',
  blossom: 'bg-blossom/30 text-rose-800',
};

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-block rounded-full px-3 py-0.5 text-[10px] font-medium tracking-widest uppercase',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
}
