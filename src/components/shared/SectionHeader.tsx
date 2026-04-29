import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h2 className="font-display text-2xl font-normal tracking-tight text-bark">{title}</h2>
      {subtitle && (
        <p className="mt-1.5 text-sm text-bark-muted">{subtitle}</p>
      )}
    </div>
  );
}
