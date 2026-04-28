import { cn } from '@/lib/utils';

interface TrustNoteProps {
  children?: React.ReactNode;
  className?: string;
}

export function TrustNote({ children, className }: TrustNoteProps) {
  return (
    <p className={cn('text-xs text-bark-muted text-center leading-relaxed', className)}>
      {children ?? 'Saugus atsiskaitymas · Siunčiama iš Vilniaus 🇱🇹'}
    </p>
  );
}
