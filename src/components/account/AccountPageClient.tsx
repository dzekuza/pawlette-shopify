'use client';

import { useMemo, useState, type ButtonHTMLAttributes, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, MapPin, Package, Plus, UserRound, type LucideIcon } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCartCount } from '@/hooks/useCartCount';
import type { CustomerAccount, CustomerAddress, CustomerOrder } from '@/lib/customer-types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/storefront/EmptyState';
import { SurfaceCard } from '@/components/storefront/SurfaceCard';

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist';
type AuthMode = 'sign-in' | 'create' | 'recover';
type Feedback = { kind: 'error' | 'success'; message: string } | null;

const ACCOUNT_NOT_FOUND_MESSAGE = 'Paskyra su šiuo el. paštu nerasta. Sukurkite paskyrą.';

interface AccountPageClientProps {
  initialCustomer: CustomerAccount | null;
  hostedAccountLoginUrl: string;
  hostedAccountUrl: string;
}

const inputClass =
  'account-input w-full rounded-[10px] border-[1.5px] border-border px-[14px] py-[11px] text-[15px] bg-white outline-none box-border';

const authLinkClass =
  'account-link bg-transparent border-none p-0 cursor-pointer';

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'orders', label: 'Užsakymai', icon: Package },
  { id: 'profile', label: 'Profilis', icon: UserRound },
  { id: 'addresses', label: 'Adresai', icon: MapPin },
  { id: 'wishlist', label: 'Norų sąrašas', icon: Heart },
];

type AccountButtonVariant = 'primary' | 'secondary' | 'ghost';

const CUSTOMER_ACCOUNT_ACTIVATION_MESSAGE =
  'Paskyra su šiuo el. paštu jau yra, bet dar neaktyvuota. Išsiuntėme nuorodą slaptažodžiui nustatyti arba atkurti.';

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

function AccountActionButton({
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
    <button
      className={cn(getAccountButtonClass({ variant, fullWidth, align }), className)}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />}
      <span>{children}</span>
    </button>
  );
}

function AccountNavButton({
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

function AccountEmptyState({
  icon: Icon,
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
      icon={Icon}
      title={title}
      description={description}
      actionHref={actionHref}
      actionLabel={actionLabel}
      className='rounded-[28px] px-6 py-14'
    />
  );
}

function formatMoney(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;

  return new Intl.NumberFormat('lt-LT', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat('lt-LT', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function prettifyStatus(value: string): string {
  const normalized = value.toLowerCase();
  const map: Record<string, string> = {
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

  return map[normalized] ?? normalized.replace(/_/g, ' ');
}

function getInitials(customer: CustomerAccount): string {
  const source = `${customer.firstName} ${customer.lastName}`.trim() || customer.displayName || customer.email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

async function readJson<T>(response: Response): Promise<T> {
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

function OrderCard({ order }: { order: CustomerOrder }) {
  return (
    <SurfaceCard className="mb-4 flex items-center gap-5 rounded-2xl px-6 py-5">
      <div
        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
        style={{ background: 'var(--color-surface-2)', color: 'var(--color-bark)', fontSize: 18 }}
      >
        #{String(order.orderNumber).slice(-2)}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-[15px] mb-1"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Užsakymas #{order.orderNumber}
        </div>
        <div
          className="text-[13px]"
          style={{ color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatOrderDate(order.processedAt)} · {prettifyStatus(order.fulfillmentStatus)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <Badge variant='sage' size='compact' className='mb-1.5 text-[12px]'>
          {prettifyStatus(order.financialStatus)}
        </Badge>
        <div
          className="text-[14px] font-bold"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatMoney(order.totalAmount, order.currencyCode)}
        </div>
      </div>
    </SurfaceCard>
  );
}

function AddressCard({
  address,
  isDefault,
}: {
  address: CustomerAddress;
  isDefault: boolean;
}) {
  return (
    <SurfaceCard className="relative mb-4 max-w-[420px] rounded-2xl px-6 py-5">
      {isDefault && (
        <Badge variant='sage' size='compact' className='absolute right-4 top-4 text-[11px]'>
          Numatytasis
        </Badge>
      )}
      <div
        className="font-bold text-[15px] mb-1.5"
        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
      >
        {address.name || `${address.firstName} ${address.lastName}`.trim()}
      </div>
      <div
        className="text-[14px] leading-relaxed"
        style={{ color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}
      >
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

export function AccountPageClient({
  initialCustomer,
  hostedAccountLoginUrl,
  hostedAccountUrl,
}: AccountPageClientProps) {
  const router = useRouter();
  const cartCount = useCartCount();

  const [customer, setCustomer] = useState<CustomerAccount | null>(initialCustomer);
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [recoverEmail, setRecoverEmail] = useState('');
  const [profileForm, setProfileForm] = useState({
    firstName: initialCustomer?.firstName ?? '',
    lastName: initialCustomer?.lastName ?? '',
    email: initialCustomer?.email ?? '',
    phone: initialCustomer?.phone ?? '',
    acceptsMarketing: initialCustomer?.acceptsMarketing ?? false,
  });
  const [addressForm, setAddressForm] = useState({
    firstName: initialCustomer?.firstName ?? '',
    lastName: initialCustomer?.lastName ?? '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'Lietuva',
    phone: initialCustomer?.phone ?? '',
  });

  const customerInitials = useMemo(() => (customer ? getInitials(customer) : 'PŽ'), [customer]);

  function applyCustomer(nextCustomer: CustomerAccount | null) {
    setCustomer(nextCustomer);

    if (!nextCustomer) {
      return;
    }

    setProfileForm({
      firstName: nextCustomer.firstName,
      lastName: nextCustomer.lastName,
      email: nextCustomer.email,
      phone: nextCustomer.phone,
      acceptsMarketing: nextCustomer.acceptsMarketing,
    });
    setAddressForm((current) => ({
      ...current,
      firstName: nextCustomer.firstName,
      lastName: nextCustomer.lastName,
      phone: nextCustomer.phone,
    }));
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthSubmitting(true);
    setFeedback(null);

    try {
      const payload = await readJson<{ customer: CustomerAccount }>(
        await fetch('/api/account/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        })
      );

      applyCustomer(payload.customer);
      setActiveTab('orders');
      setFeedback({ kind: 'success', message: 'Prisijungėte sėkmingai.' });
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nepavyko prisijungti.';
      if (message === ACCOUNT_NOT_FOUND_MESSAGE) {
        setRegisterForm((current) => ({ ...current, email: loginForm.email }));
        setAuthMode('create');
      }
      if (message === CUSTOMER_ACCOUNT_ACTIVATION_MESSAGE) {
        setRecoverEmail(loginForm.email);
        setAuthMode('recover');
      }
      setFeedback({ kind: 'error', message });
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthSubmitting(true);
    setFeedback(null);

    try {
      const payload = await readJson<{ customer: CustomerAccount }>(
        await fetch('/api/account/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerForm),
        })
      );

      applyCustomer(payload.customer);
      setActiveTab('orders');
      setFeedback({ kind: 'success', message: 'Jūsų paskyra paruošta.' });
      setRegisterForm({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nepavyko sukurti paskyros.';
      if (message === CUSTOMER_ACCOUNT_ACTIVATION_MESSAGE) {
        setRecoverEmail(registerForm.email);
        setAuthMode('recover');
      }
      setFeedback({
        kind: 'error',
        message,
      });
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  async function handleRecover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthSubmitting(true);
    setFeedback(null);

    try {
      const payload = await readJson<{ message: string }>(
        await fetch('/api/account/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: recoverEmail }),
        })
      );

      setFeedback({ kind: 'success', message: payload.message });
      setRecoverEmail('');
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Nepavyko išsiųsti slaptažodžio atkūrimo laiško.',
      });
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsProfileSaving(true);
    setFeedback(null);

    try {
      const payload = await readJson<{ customer: CustomerAccount }>(
        await fetch('/api/account', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileForm),
        })
      );

      applyCustomer(payload.customer);
      setFeedback({ kind: 'success', message: 'Profilis atnaujintas.' });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Nepavyko išsaugoti profilio.',
      });
    } finally {
      setIsProfileSaving(false);
    }
  }

  async function handleAddressSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAddressSaving(true);
    setFeedback(null);

    try {
      const payload = await readJson<{ customer: CustomerAccount }>(
        await fetch('/api/account/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressForm),
        })
      );

      applyCustomer(payload.customer);
      setShowAddressForm(false);
      setAddressForm((current) => ({
        ...current,
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: current.country || 'Lietuva',
      }));
      setFeedback({ kind: 'success', message: 'Adresas išsaugotas.' });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Nepavyko išsaugoti adreso.',
      });
    } finally {
      setIsAddressSaving(false);
    }
  }

  async function handleLogout() {
    setFeedback(null);
    await fetch('/api/account/logout', { method: 'POST' });
    applyCustomer(null);
    setActiveTab('orders');
    setAuthMode('sign-in');
    setFeedback({ kind: 'success', message: 'Atsijungėte sėkmingai.' });
  }

  const feedbackBanner = feedback ? (
    <div
      className="max-w-[900px] mx-auto mt-4 mb-2 px-4 md:px-6"
    >
      <div
        className="rounded-2xl px-4 py-3 text-[14px]"
        style={{
          background: feedback.kind === 'error' ? '#FBEAEA' : '#E8F5E6',
          color: feedback.kind === 'error' ? '#9B2C2C' : '#2F6B2E',
          border: `1.5px solid ${feedback.kind === 'error' ? '#F2C9C9' : '#C9E9C6'}`,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {feedback.message}
      </div>
    </div>
  ) : null;

  return (
    <div className="account-page min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <div className="pt-[100px]">
        {feedbackBanner}

        {customer ? (
          <div className="max-w-[980px] mx-auto px-4 md:px-6 pb-[60px] md:pb-20 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="w-full md:w-[240px] shrink-0">
              <SurfaceCard className="rounded-[28px] p-4 md:p-5">
                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 pb-5 md:pb-6 mb-0 md:mb-1">
                  <div
                    className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] text-[20px] font-bold md:h-[72px] md:w-[72px] md:text-[26px]"
                    style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.04em' }}
                  >
                    {customerInitials}
                  </div>
                  <div className="min-w-0 md:text-center">
                    <div
                      className="truncate font-bold text-[15px]"
                      style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || customer.email}
                    </div>
                    <div
                      className="mt-1 truncate text-[12px]"
                      style={{ color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {customer.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <AccountNavButton
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        icon={item.icon}
                        label={item.label}
                        active={isActive}
                      />
                    );
                  })}
                </div>

                <AccountActionButton
                  onClick={handleLogout}
                  variant="ghost"
                  align="start"
                  fullWidth
                  icon={LogOut}
                  className="hidden md:inline-flex mt-6"
                >
                  Atsijungti
                </AccountActionButton>
              </SurfaceCard>
            </div>

            <div className="flex-1 min-w-0">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="account-heading-2 mb-6">
                    Jūsų užsakymai
                  </h2>

                  {customer.orders.length > 0 ? (
                    customer.orders.map((order) => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <AccountEmptyState
                      icon={Package}
                      title="Užsakymų dar nėra"
                      description="Būsimi jūsų užsakymai atsiras čia po apmokėjimo."
                      actionHref="/products"
                      actionLabel="Peržiūrėti produktus"
                    />
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="account-heading-2 mb-6">
                    Profilis
                  </h2>

                  <form onSubmit={handleProfileSave} className="flex flex-col gap-4 max-w-[480px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="account-label block mb-2">
                          Vardas
                        </label>
                        <input
                          className={inputClass}
                          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                          value={profileForm.firstName}
                          onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="account-label block mb-2">
                          Pavardė
                        </label>
                        <input
                          className={inputClass}
                          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                          value={profileForm.lastName}
                          onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="account-label block mb-2">
                        El. paštas
                      </label>
                      <input
                        className={inputClass}
                        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                        type="email"
                        value={profileForm.email}
                        onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="account-label block mb-2">
                        Telefono numeris
                      </label>
                      <input
                        className={inputClass}
                        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                        value={profileForm.phone}
                        onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                      />
                    </div>

                    <label
                      className="flex items-center gap-3 text-[14px]"
                      style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <input
                        type="checkbox"
                        checked={profileForm.acceptsMarketing}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, acceptsMarketing: event.target.checked }))
                        }
                      />
                      Siųskite man naujienas apie pristatymus, pasiūlymus ir naujus pakabukus.
                    </label>

                    <AccountActionButton
                      type="submit"
                      disabled={isProfileSaving}
                      variant="primary"
                      className="mt-2 self-start"
                    >
                      {isProfileSaving ? 'Saugoma...' : 'Išsaugoti pakeitimus'}
                    </AccountActionButton>
                  </form>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="account-heading-2 mb-6">
                    Adresai
                  </h2>

                  {customer.addresses.length > 0 ? (
                    customer.addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        isDefault={customer.defaultAddressId === address.id}
                      />
                    ))
                  ) : (
                    <div className="mb-4 max-w-[520px]">
                      <AccountEmptyState
                        icon={MapPin}
                        title="Išsaugotų adresų dar nėra"
                        description="Išsaugokite adresą čia, kad kiti atsiskaitymai būtų greitesni."
                      />
                    </div>
                  )}

                  <AccountActionButton
                    onClick={() => setShowAddressForm((current) => !current)}
                    variant={showAddressForm ? 'ghost' : 'secondary'}
                    icon={showAddressForm ? undefined : Plus}
                  >
                    {showAddressForm ? 'Atšaukti' : '+ Pridėti adresą'}
                  </AccountActionButton>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSave} className="mt-6 flex flex-col gap-4 max-w-[520px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="Vardas"
                          value={addressForm.firstName}
                          onChange={(event) => setAddressForm((current) => ({ ...current, firstName: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Pavardė"
                          value={addressForm.lastName}
                          onChange={(event) => setAddressForm((current) => ({ ...current, lastName: event.target.value }))}
                        />
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Adresas 1"
                        value={addressForm.address1}
                        onChange={(event) => setAddressForm((current) => ({ ...current, address1: event.target.value }))}
                      />
                      <input
                        className={inputClass}
                        placeholder="Adresas 2"
                        value={addressForm.address2}
                        onChange={(event) => setAddressForm((current) => ({ ...current, address2: event.target.value }))}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="Miestas"
                          value={addressForm.city}
                          onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Regionas / valstija"
                          value={addressForm.province}
                          onChange={(event) => setAddressForm((current) => ({ ...current, province: event.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="Pašto kodas"
                          value={addressForm.zip}
                          onChange={(event) => setAddressForm((current) => ({ ...current, zip: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Šalis"
                          value={addressForm.country}
                          onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}
                        />
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Telefono numeris"
                        value={addressForm.phone}
                        onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))}
                      />
                      <AccountActionButton
                        type="submit"
                        disabled={isAddressSaving}
                        variant="primary"
                        className="self-start"
                      >
                        {isAddressSaving ? 'Saugoma...' : 'Išsaugoti adresą'}
                      </AccountActionButton>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="account-heading-2 mb-6">
                    Norų sąrašas
                  </h2>
                  <AccountEmptyState
                    icon={Heart}
                    title="Norų sąrašas netrukus"
                    description="Jūsų kliento paskyra jau veikia. Norų sąrašas gali būti kitas žingsnis."
                    actionHref="/products"
                    actionLabel="Peržiūrėti produktus"
                  />
                </div>
              )}

              <AccountActionButton
                onClick={handleLogout}
                variant="ghost"
                align="start"
                fullWidth
                icon={LogOut}
                className="md:hidden mt-8"
              >
                Atsijungti
              </AccountActionButton>
            </div>
          </div>
        ) : (
          <div className="max-w-[560px] w-full mx-auto px-4 pb-20">
            <SurfaceCard className="rounded-3xl px-6 py-10 md:px-9">
              <h1 className="account-heading-1 mb-3">
                Prisijunkite per Shopify
              </h1>
              <p className="account-copy mb-6 max-w-[40ch]">
                PawCharms klientų paskyros dabar naudoja Shopify el. pašto kodo prisijungimą, tokį patį kaip ir atsiskaityme.
              </p>
              <div
                className="mb-8 rounded-[22px] border border-border bg-surface-2/70 px-5 py-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div className="mb-2 text-[14px] font-semibold text-bark">Kaip prisijungti</div>
                <div className="text-[14px] leading-6 text-bark-light">
                  Paspaudę mygtuką būsite nukreipti į oficialų Shopify paskyros langą. Ten įvesite el. paštą ir gausite prisijungimo kodą el. paštu.
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={hostedAccountLoginUrl}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-sage px-5 py-4 text-[15px] font-bold text-bark no-underline transition-colors duration-150 hover:bg-sage-dark"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Tęsti su el. paštu
                </a>
                <a
                  href={hostedAccountUrl}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-white px-5 py-4 text-[15px] font-semibold text-bark no-underline transition-colors duration-150 hover:bg-surface-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Atidaryti paskyros centrą
                </a>
              </div>
              <p className="mt-6 text-[13px] leading-6 text-bark-muted" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Jei paskyra jau aktyvi, Shopify atidarys jūsų užsakymus, profilį ir kitą paskyros informaciją.
              </p>
            </SurfaceCard>
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  );
}
