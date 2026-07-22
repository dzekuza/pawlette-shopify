import { cn } from '@/lib/utils';

function VisaMark() {
  return (
    <span className="text-[13px] font-black italic tracking-tight leading-none" style={{ color: '#1A1F71' }}>
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="6" r="6" fill="#EB001B" />
      <circle cx="13" cy="6" r="6" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M9.9 7.4c-.02-1.6 1.31-2.37 1.37-2.4-.75-1.1-1.9-1.25-2.32-1.27-.99-.1-1.93.58-2.43.58-.5 0-1.27-.57-2.09-.55-1.07.02-2.07.63-2.62 1.6-1.13 1.97-.29 4.87.8 6.46.55.78 1.2 1.65 2.05 1.61.82-.03 1.13-.53 2.13-.53.99 0 1.27.53 2.13.51.88-.01 1.44-.79 1.99-1.57.62-.9.88-1.78.89-1.82-.02-.01-1.7-.66-1.9-2.62Z" />
      <path d="M8.2 2.55c.46-.56.77-1.33.68-2.1-.66.03-1.47.44-1.94.99-.42.49-.79 1.29-.69 2.04.74.06 1.5-.37 1.95-.93Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.95a9 9 0 0 0 0 8.08l3.02-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.96l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

const PAYMENT_METHODS = [
  { name: 'Visa', mark: <VisaMark />, label: null },
  { name: 'Mastercard', mark: <MastercardMark />, label: 'Mastercard' },
  { name: 'Apple Pay', mark: <AppleMark />, label: 'Pay' },
  { name: 'Google Pay', mark: <GoogleMark />, label: 'Pay' },
];

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {PAYMENT_METHODS.map(({ name, mark, label }) => (
        <span
          key={name}
          className="inline-flex h-7 min-w-[64px] items-center justify-center gap-1.5 rounded-md bg-surface-2 px-2.5 text-[11px] font-medium text-bark-muted"
        >
          {mark}
          {label && <span>{label}</span>}
        </span>
      ))}
    </div>
  );
}
