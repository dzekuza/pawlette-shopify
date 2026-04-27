'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCartCount } from '@/hooks/useCartCount';
import type { CustomerAccount, CustomerAddress, CustomerOrder } from '@/lib/customer-types';

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist';
type AuthMode = 'sign-in' | 'create' | 'recover';
type Feedback = { kind: 'error' | 'success'; message: string } | null;

interface AccountPageClientProps {
  initialCustomer: CustomerAccount | null;
}

const inputClass =
  'w-full rounded-[10px] border-[1.5px] border-[#E8E3DC] px-[14px] py-[10px] text-[14px] bg-white outline-none box-border';

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'addresses', label: 'Addresses', icon: '📍' },
  { id: 'wishlist', label: 'Wishlist', icon: '♡' },
];

function formatMoney(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function prettifyStatus(value: string): string {
  return value.toLowerCase().replace(/_/g, ' ');
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
          : 'Something went wrong.';

    throw new Error(message);
  }

  return payload as T;
}

function OrderCard({ order }: { order: CustomerOrder }) {
  return (
    <div
      className="bg-white rounded-2xl px-6 py-5 flex items-center gap-5 mb-4"
      style={{ border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
        style={{ background: '#F4EEE6', color: 'var(--color-bark)', fontSize: 18 }}
      >
        #{String(order.orderNumber).slice(-2)}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-[15px] mb-1"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Order #{order.orderNumber}
        </div>
        <div
          className="text-[13px]"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatOrderDate(order.processedAt)} · {prettifyStatus(order.fulfillmentStatus)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div
          className="inline-block rounded-[20px] px-3 py-[3px] text-[12px] font-semibold mb-1.5"
          style={{ background: '#E8F5E6', color: '#3A7A35', fontFamily: "'DM Sans', sans-serif" }}
        >
          {prettifyStatus(order.financialStatus)}
        </div>
        <div
          className="text-[14px] font-bold"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatMoney(order.totalAmount, order.currencyCode)}
        </div>
      </div>
    </div>
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
    <div
      className="bg-white rounded-2xl px-6 py-5 mb-4 max-w-[420px] relative"
      style={{ border: '1.5px solid #E8E3DC' }}
    >
      {isDefault && (
        <div
          className="absolute top-4 right-4 rounded-[20px] px-[10px] py-[2px] text-[11px] font-semibold"
          style={{ background: '#E8F5E6', color: '#3A7A35', fontFamily: "'DM Sans', sans-serif" }}
        >
          Default
        </div>
      )}
      <div
        className="font-bold text-[15px] mb-1.5"
        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
      >
        {address.name || `${address.firstName} ${address.lastName}`.trim()}
      </div>
      <div
        className="text-[14px] leading-relaxed"
        style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
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
    </div>
  );
}

export function AccountPageClient({ initialCustomer }: AccountPageClientProps) {
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
    country: 'Lithuania',
    phone: initialCustomer?.phone ?? '',
  });

  const customerInitials = useMemo(() => (customer ? getInitials(customer) : 'PC'), [customer]);

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
      setFeedback({ kind: 'success', message: 'You are signed in.' });
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to sign in.' });
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
      setFeedback({ kind: 'success', message: 'Your account is ready.' });
      setRegisterForm({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unable to create your account.',
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
        message: error instanceof Error ? error.message : 'Unable to send the reset email.',
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
      setFeedback({ kind: 'success', message: 'Profile updated.' });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unable to save your profile.',
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
        country: current.country || 'Lithuania',
      }));
      setFeedback({ kind: 'success', message: 'Address saved.' });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unable to save your address.',
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
    setFeedback({ kind: 'success', message: 'You have been signed out.' });
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
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <div className="pt-[100px]">
        {feedbackBanner}

        {customer ? (
          <div className="max-w-[900px] mx-auto px-4 md:px-6 pb-[60px] md:pb-20 flex flex-col md:flex-row gap-6 md:gap-12 items-start">
            <div className="w-full md:w-[240px] shrink-0">
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 pb-5 md:pb-8 mb-0 md:mb-2">
                <div
                  className="rounded-full flex items-center justify-center shrink-0 w-[52px] h-[52px] md:w-[72px] md:h-[72px] text-[18px] md:text-[26px]"
                  style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'Luckiest Guy', cursive" }}
                >
                  {customerInitials}
                </div>
                <div className="md:text-center">
                  <div
                    className="font-bold text-[15px]"
                    style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || customer.email}
                  </div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {customer.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="flex items-center gap-2.5 rounded-xl border-none cursor-pointer text-left whitespace-nowrap text-[14px] transition-[background,color] duration-150 px-[14px] py-[9px] md:px-4 md:py-[11px]"
                      style={{
                        background: isActive ? 'var(--color-sage)' : 'transparent',
                        color: isActive ? 'var(--color-bark)' : '#9B948F',
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <span className="text-[15px]">{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:block mt-8 px-4 py-[10px] rounded-xl bg-transparent text-[13px] font-medium cursor-pointer w-full text-left"
                style={{ border: '1.5px solid #E8E3DC', color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign out
              </button>
            </div>

            <div
              className="hidden md:block w-px self-stretch shrink-0"
              style={{ background: '#E8E3DC' }}
            />

            <div className="flex-1 min-w-0">
              {activeTab === 'orders' && (
                <div>
                  <h2
                    className="text-[26px] mb-6"
                    style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
                  >
                    Your Orders
                  </h2>

                  {customer.orders.length > 0 ? (
                    customer.orders.map((order) => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center px-6 py-[60px] bg-white rounded-2xl text-center"
                      style={{ border: '1.5px solid #E8E3DC' }}
                    >
                      <div className="text-[48px] mb-4">📦</div>
                      <div
                        className="text-[16px] font-semibold mb-2"
                        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        No orders yet
                      </div>
                      <div
                        className="text-[14px] mb-6"
                        style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Your future collar orders will show up here after checkout.
                      </div>
                      <Link
                        href="/products"
                        className="inline-block px-7 py-3 rounded-xl font-bold text-[14px] no-underline"
                        style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Shop products
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2
                    className="text-[26px] mb-6"
                    style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
                  >
                    Profile
                  </h2>

                  <form onSubmit={handleProfileSave} className="flex flex-col gap-4 max-w-[480px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-[13px] font-semibold mb-1.5"
                          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          First name
                        </label>
                        <input
                          className={inputClass}
                          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                          value={profileForm.firstName}
                          onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-[13px] font-semibold mb-1.5"
                          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Last name
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
                      <label
                        className="block text-[13px] font-semibold mb-1.5"
                        style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Email address
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
                      <label
                        className="block text-[13px] font-semibold mb-1.5"
                        style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Phone number
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
                      Email me about launches, offers, and new charm drops.
                    </label>

                    <button
                      type="submit"
                      disabled={isProfileSaving}
                      className="mt-2 self-start px-7 py-3 rounded-xl font-bold text-[15px] cursor-pointer border-none transition-[background] duration-200"
                      style={{
                        background: isProfileSaving ? '#D7E8D5' : 'var(--color-sage)',
                        color: 'var(--color-bark)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {isProfileSaving ? 'Saving...' : 'Save changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2
                    className="text-[26px] mb-6"
                    style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
                  >
                    Addresses
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
                    <div
                      className="bg-white rounded-2xl px-6 py-5 mb-4 max-w-[420px]"
                      style={{ border: '1.5px solid #E8E3DC' }}
                    >
                      <div
                        className="font-bold text-[15px] mb-1.5"
                        style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        No saved addresses yet
                      </div>
                      <div
                        className="text-[14px] leading-relaxed"
                        style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Save an address here so future checkouts are faster.
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddressForm((current) => !current)}
                    className="px-6 py-[11px] rounded-xl font-semibold text-[14px] cursor-pointer bg-transparent"
                    style={{
                      border: '1.5px solid var(--color-bark)',
                      color: 'var(--color-bark)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {showAddressForm ? 'Cancel' : '+ Add address'}
                  </button>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSave} className="mt-6 flex flex-col gap-4 max-w-[520px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="First name"
                          value={addressForm.firstName}
                          onChange={(event) => setAddressForm((current) => ({ ...current, firstName: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Last name"
                          value={addressForm.lastName}
                          onChange={(event) => setAddressForm((current) => ({ ...current, lastName: event.target.value }))}
                        />
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Address line 1"
                        value={addressForm.address1}
                        onChange={(event) => setAddressForm((current) => ({ ...current, address1: event.target.value }))}
                      />
                      <input
                        className={inputClass}
                        placeholder="Address line 2"
                        value={addressForm.address2}
                        onChange={(event) => setAddressForm((current) => ({ ...current, address2: event.target.value }))}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Province / State"
                          value={addressForm.province}
                          onChange={(event) => setAddressForm((current) => ({ ...current, province: event.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className={inputClass}
                          placeholder="Postal code"
                          value={addressForm.zip}
                          onChange={(event) => setAddressForm((current) => ({ ...current, zip: event.target.value }))}
                        />
                        <input
                          className={inputClass}
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}
                        />
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Phone number"
                        value={addressForm.phone}
                        onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))}
                      />
                      <button
                        type="submit"
                        disabled={isAddressSaving}
                        className="self-start px-6 py-3 rounded-xl font-bold text-[15px] cursor-pointer border-none"
                        style={{
                          background: isAddressSaving ? '#D7E8D5' : 'var(--color-sage)',
                          color: 'var(--color-bark)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {isAddressSaving ? 'Saving...' : 'Save address'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2
                    className="text-[26px] mb-6"
                    style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
                  >
                    Wishlist
                  </h2>
                  <div
                    className="flex flex-col items-center justify-center px-6 py-[60px] bg-white rounded-2xl text-center"
                    style={{ border: '1.5px solid #E8E3DC' }}
                  >
                    <div className="text-[48px] mb-4">🐾</div>
                    <div
                      className="text-[16px] font-semibold mb-2"
                      style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Wishlist coming next
                    </div>
                    <div
                      className="text-[14px] mb-6"
                      style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Your customer account is real now. Wishlist support can be the next step.
                    </div>
                    <Link
                      href="/products"
                      className="inline-block px-7 py-3 rounded-xl font-bold text-[14px] no-underline"
                      style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Shop products
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="md:hidden mt-8 px-5 py-3 rounded-xl bg-transparent text-[13px] font-medium cursor-pointer w-full"
                style={{ border: '1.5px solid #E8E3DC', color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-[500px] w-full mx-auto px-4 pb-20">
            <div
              className="bg-white rounded-3xl px-6 md:px-9 py-10"
              style={{ border: '1.5px solid #E8E3DC' }}
            >
              <div className="flex gap-2 mb-8">
                {[
                  { id: 'sign-in', label: 'Sign in' },
                  { id: 'create', label: 'Create account' },
                  { id: 'recover', label: 'Reset password' },
                ].map((mode) => {
                  const active = authMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      onClick={() => setAuthMode(mode.id as AuthMode)}
                      className="rounded-full px-4 py-2 text-[13px] font-semibold border-none cursor-pointer"
                      style={{
                        background: active ? 'var(--color-sage)' : '#F3EEE8',
                        color: 'var(--color-bark)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              <h1
                className="text-[32px] mb-2"
                style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
              >
                {authMode === 'sign-in' ? 'Welcome back' : authMode === 'create' ? 'Create your account' : 'Reset your password'}
              </h1>
              <p
                className="text-[15px] mb-8"
                style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
              >
                {authMode === 'sign-in'
                  ? 'Sign in to view your orders, profile, and saved addresses.'
                  : authMode === 'create'
                    ? 'Set up a real PawCharms customer account connected to Shopify.'
                    : 'We’ll send a reset link if there’s an account for your email.'}
              </p>

              {authMode === 'sign-in' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-[13px] font-semibold mb-1.5"
                      style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email address
                    </label>
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[13px] font-semibold mb-1.5"
                      style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Password
                    </label>
                    <input
                      className={inputClass}
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full py-[13px] rounded-xl font-bold text-[15px] cursor-pointer border-none"
                    style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {isAuthSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              )}

              {authMode === 'create' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className={inputClass}
                      placeholder="First name"
                      value={registerForm.firstName}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, firstName: event.target.value }))}
                    />
                    <input
                      className={inputClass}
                      placeholder="Last name"
                      value={registerForm.lastName}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, lastName: event.target.value }))}
                    />
                  </div>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  />
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                  />
                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full py-[13px] rounded-xl font-bold text-[15px] cursor-pointer border-none"
                    style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {isAuthSubmitting ? 'Creating...' : 'Create account'}
                  </button>
                </form>
              )}

              {authMode === 'recover' && (
                <form onSubmit={handleRecover} className="flex flex-col gap-4">
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                    value={recoverEmail}
                    onChange={(event) => setRecoverEmail(event.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full py-[13px] rounded-xl font-bold text-[15px] cursor-pointer border-none"
                    style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {isAuthSubmitting ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  );
}
