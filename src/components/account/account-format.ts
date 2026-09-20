import type { CustomerAccount } from '@/lib/customer-types';

const STATUS_LABELS: Record<string, string> = {
  paid: 'apmokėta',
  pending: 'laukiama',
  authorized: 'autorizuota',
  partially_paid: 'iš dalies apmokėta',
  refunded: 'grąžinta',
  partially_refunded: 'iš dalies grąžinta',
  fulfilled: 'įvykdyta',
  unfulfilled: 'neįvykdyta',
  partial: 'iš dalies įvykdyta',
  scheduled: 'suplanuota',
  on_hold: 'sulaikyta',
  open: 'atidaryta',
  restocked: 'grąžinta į sandėlį',
};

export function formatMoney(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;

  return new Intl.NumberFormat('lt-LT', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

export function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat('lt-LT', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function prettifyStatus(value: string): string {
  const normalized = value.toLowerCase();
  return STATUS_LABELS[normalized] ?? normalized.replace(/_/g, ' ');
}

export function getInitials(customer: CustomerAccount): string {
  const source = `${customer.firstName} ${customer.lastName}`.trim() || customer.displayName || customer.email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getDisplayName(customer: CustomerAccount): string {
  return customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || customer.email;
}

export async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload.error === 'string'
        ? payload.error
        : typeof payload.message === 'string'
          ? payload.message
          : 'Kažkas nepavyko.';

    throw new Error(message);
  }

  return payload as T;
}
