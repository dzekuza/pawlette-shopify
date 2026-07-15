import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay'];

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 flex-wrap', className)}>
      {PAYMENT_METHODS.map(method => (
        <span
          key={method}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium bg-surface-2 text-bark-muted"
        >
          <CreditCard size={11} strokeWidth={2} />
          {method}
        </span>
      ))}
    </div>
  );
}
