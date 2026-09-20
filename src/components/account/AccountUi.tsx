import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/storefront/EmptyState';
import { SurfaceCard } from '@/components/storefront/SurfaceCard';
import type { CustomerAddress, CustomerOrder } from '@/lib/customer-types';
import { formatMoney, formatOrderDate, prettifyStatus } from './account-format';

export const inputClass =
  'account-input w-full rounded-[10px] border-[1.5px] border-border px-[14px] py-[11px] text-[15px] bg-white outline-none box-border';

type AccountButtonVariant = 'primary' | 'secondary' | 'ghost';

function getAccountButtonClass({
  variant = 'secondary',
  fullWidth = false,
  align = 'center',
}: {
  variant?: AccountButtonVariant;
  fullWidth?: boolean;
  align?: 'center' | 'start';
}) {
  return cn(
    'inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-[14px] font-semibold leading-none transition-[background,color,border-color,box-shadow,transform] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
    'disabled:pointer-events-none disabled:opacity-55',
    fullWidth && 'w-full',
    align === 'start' ? 'justify-start text-left' : 'justify-center text-center',
    variant === 'primary' && 'border border-transparent bg-sage text-bark hover:bg-sage-dark',
    variant === 'secondary' && 'border border-border bg-white text-bark hover:bg-surface-2',
    variant === 'ghost' && 'border border-transparent bg-transparent text-bark-light hover:bg-surface-2 hover:text-bark',
  );
}

export function AccountActionButton({
  variant = 'secondary',
  fullWidth = false,
  align = 'center',
  icon: Icon,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AccountButtonVariant;
  fullWidth?: boolean;
  align?: 'center' | 'start';
  icon?: LucideIcon;
}) {
  return (
    <button className={cn(getAccountButtonClass({ variant, fullWidth, align }), className)} {...props}>
      {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />}
      <span>{children}</span>
    </button>
  );
}

export function AccountNavButton({
  icon: Icon,
  label,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        'group flex shrink-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-[14px] font-semibold transition-[background,color,border-color,box-shadow] duration-150 md:w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        active
          ? 'border-border bg-white text-bark shadow-[0_10px_24px_rgba(61,53,48,0.06)]'
          : 'border-transparent bg-transparent text-bark-light hover:bg-surface-2 hover:text-bark',
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-[background,color] duration-150',
          active ? 'bg-sage text-bark' : 'bg-cream text-bark-light group-hover:bg-white group-hover:text-bark',
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>
      <span>{label}</span>
    </button>
  );
}

export function AccountEmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionHref={actionHref}
      actionLabel={actionLabel}
      className="rounded-[28px] px-6 py-14"
    />
  );
}

export function OrderCard({ order }: { order: CustomerOrder }) {
  return (
    <SurfaceCard className="mb-4 flex items-center gap-5 rounded-2xl px-6 py-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-[18px] text-bark">
        #{String(order.orderNumber).slice(-2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[15px] font-semibold text-bark">Užsakymas #{order.orderNumber}</div>
        <div className="text-[13px] text-bark-muted">
          {formatOrderDate(order.processedAt)} · {prettifyStatus(order.fulfillmentStatus)}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <Badge variant="sage" size="compact" className="mb-1.5 text-[12px]">
          {prettifyStatus(order.financialStatus)}
        </Badge>
        <div className="text-[14px] font-bold text-bark">{formatMoney(order.totalAmount, order.currencyCode)}</div>
      </div>
    </SurfaceCard>
  );
}

export function AddressCard({ address, isDefault }: { address: CustomerAddress; isDefault: boolean }) {
  return (
    <SurfaceCard className="relative mb-4 max-w-[420px] rounded-2xl px-6 py-5">
      {isDefault && (
        <Badge variant="sage" size="compact" className="absolute right-4 top-4 text-[11px]">
          Numatytasis
        </Badge>
      )}
      <div className="mb-1.5 text-[15px] font-bold text-bark">
        {address.name || `${address.firstName} ${address.lastName}`.trim()}
      </div>
      <div className="text-[14px] leading-relaxed text-bark-muted">
        {address.formatted.length > 0 ? (
          address.formatted.map((line) => <div key={line}>{line}</div>)
        ) : (
          <>
            <div>{address.address1}</div>
            {address.address2 && <div>{address.address2}</div>}
            <div>{[address.city, address.province, address.zip].filter(Boolean).join(', ')}</div>
            <div>{address.country}</div>
          </>
        )}
      </div>
    </SurfaceCard>
  );
}
