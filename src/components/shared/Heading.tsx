import { cn } from '@/lib/utils';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  xl: 'text-5xl md:text-6xl',
  lg: 'text-4xl md:text-5xl',
  md: 'text-3xl md:text-4xl',
  sm: 'text-2xl md:text-3xl',
};

export function Heading({ as: Tag = 'h2', size = 'md', children, className }: HeadingProps) {
  return (
    <Tag className={cn('font-display text-bark leading-tight tracking-wide', sizeClasses[size], className)}>
      {children}
    </Tag>
  );
}
