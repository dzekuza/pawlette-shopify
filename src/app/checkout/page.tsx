'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing/LandingNav';
import type { CartItem } from '@/lib/data';

const COLLAR_PRICE = 28;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

function inputBaseClass(focused: boolean) {
  return [
    'w-full box-border rounded-[10px] px-[14px] py-[10px]',
    'text-[14px] bg-white outline-none transition-[border-color] duration-[180ms]',
    focused
      ? 'border-[1.5px] border-[var(--color-bark,#3D3530)]'
      : 'border-[1.5px] border-[#E8E3DC]',
  ].join(' ');
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[15px] font-bold mb-4" style={{ color: 'var(--color-bark)' }}>
      {children}
    </div>
  );
}

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[12px] font-semibold uppercase tracking-[0.04em]"
        style={{ color: '#9B948F' }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputBaseClass(focused)}
        style={{
          color: disabled ? '#9B948F' : 'var(--color-bark)',
          background: disabled ? '#F5F2EE' : '#fff',
          cursor: disabled ? 'not-allowed' : undefined,
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[12px] font-semibold uppercase tracking-[0.04em]"
        style={{ color: '#9B948F' }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputBaseClass(focused)}
        style={{
          color: 'var(--color-bark)',
          fontFamily: "'DM Sans', sans-serif",
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239B948F' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: 36,
          cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CharmBubbles({ charms }: { charms: (string | null)[] }) {
  const filled = charms.filter(Boolean);
  if (!filled.length) return null;
  return (
    <div className="flex gap-1 flex-wrap mt-1">
      {filled.map((c, i) => (
        <span
          key={i}
          className="text-[16px] rounded-lg px-1.5 py-0.5 leading-none"
          style={{ background: '#F5F2EE', fontFamily: "'DM Sans', sans-serif" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('LT');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pawlette_cart');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCartItems(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  const subtotal = cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + COLLAR_PRICE + (item.extra ? 5 : 0), 0)
    : 0;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  function handlePlaceOrder() {
    localStorage.removeItem('pawlette_cart');
    router.push('/');
  }

  const COUNTRIES = [
    { value: 'LT', label: 'Lithuania' },
    { value: 'LV', label: 'Latvia' },
    { value: 'EE', label: 'Estonia' },
    { value: 'PL', label: 'Poland' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'SE', label: 'Sweden' },
    { value: 'FI', label: 'Finland' },
    { value: 'DK', label: 'Denmark' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
  ];

  const cardClass = 'bg-white rounded-2xl p-6 mb-5 shadow-[0_1px_4px_rgba(61,53,48,0.06)]';

  const formColumn = (
    <div className="md:flex-[3] min-w-0">
      {/* Contact */}
      <div className={cardClass}>
        <SectionTitle>Contact</SectionTitle>
        <div className="flex flex-col gap-3.5">
          <InputField label="Email address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
          <InputField label="Phone number" type="tel" placeholder="+370 600 00000" value={phone} onChange={setPhone} autoComplete="tel" />
        </div>
      </div>

      {/* Shipping address */}
      <div className={cardClass}>
        <SectionTitle>Shipping address</SectionTitle>
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="First name" placeholder="Mia" value={firstName} onChange={setFirstName} autoComplete="given-name" />
            <InputField label="Last name" placeholder="Kowalski" value={lastName} onChange={setLastName} autoComplete="family-name" />
          </div>
          <InputField label="Address" placeholder="Gedimino pr. 1" value={address} onChange={setAddress} autoComplete="street-address" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="City" placeholder="Vilnius" value={city} onChange={setCity} autoComplete="address-level2" />
            <InputField label="Postal code" placeholder="01103" value={postal} onChange={setPostal} autoComplete="postal-code" />
          </div>
          <SelectField label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
        </div>
      </div>

      {/* Payment */}
      <div className={cardClass}>
        <SectionTitle>Payment</SectionTitle>

        {/* Stripe badge */}
        <div className="flex items-center gap-[7px] mb-4 text-[13px]" style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}>
          <LockIcon />
          <span>Secure payment via Stripe</span>
        </div>

        {/* Fake card UI */}
        <div
          className="rounded-[14px] px-[22px] pt-[22px] pb-[18px] mb-[18px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-bark) 0%, #5C4E47 100%)' }}
        >
          {/* decorative circles */}
          <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute -bottom-[20px] right-[40px] w-[70px] h-[70px] rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

          <div className="text-[11px] uppercase tracking-[0.12em] mb-[18px]" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif" }}>
            Pawlette
          </div>
          <div className="text-[16px] tracking-[0.2em] mb-[18px]" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'DM Sans', sans-serif" }}>
            •••• •••• •••• ••••
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-[9px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>CARD HOLDER</div>
              <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'DM Sans', sans-serif" }}>Your Name</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>EXPIRES</div>
              <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'DM Sans', sans-serif" }}>MM / YY</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <InputField label="Card number" placeholder="1234 5678 9012 3456" disabled />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Expiry date" placeholder="MM / YY" disabled />
            <InputField label="CVC" placeholder="•••" disabled />
          </div>
        </div>

        <div
          className="mt-3.5 px-[14px] py-[10px] rounded-[10px] text-[12px] flex items-center gap-1.5"
          style={{ background: '#F5F2EE', color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          <LockIcon />
          Payment fields are powered by Stripe — your card details are never stored by Pawlette.
        </div>
      </div>

      {/* Submit on mobile */}
      <button
        onClick={handlePlaceOrder}
        className="w-full md:hidden rounded-[14px] px-6 py-4 text-[17px] font-bold cursor-pointer border-none mb-10"
        style={{
          background: 'var(--color-sage)',
          color: 'var(--color-bark)',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 4px 16px rgba(168,213,162,0.4)',
        }}
      >
        Place order — €{total.toFixed(2)}
      </button>
    </div>
  );

  const summaryColumn = (
    <div className="w-full md:flex-[2] min-w-0">
      <div
        className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(61,53,48,0.06)] md:sticky md:top-[100px]"
      >
        <SectionTitle>Order summary</SectionTitle>

        {cartItems.length === 0 ? (
          <div
            className="text-[14px] py-3 text-center"
            style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
          >
            Your cart is empty
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 mb-5">
            {cartItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Collar colour swatch */}
                <div
                  className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: item.collar.bgTint, border: '1.5px solid #E8E3DC' }}
                >
                  <div
                    className="w-6 h-2 rounded"
                    style={{ background: item.collar.color }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14px] font-semibold"
                    style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.collar.name} collar
                    {item.size ? ` — ${item.size}` : ''}
                  </div>
                  {item.engraving && (
                    <div
                      className="text-[13px] mt-0.5"
                      style={{ color: '#9B948F', fontFamily: "'Caveat', cursive" }}
                    >
                      &ldquo;{item.engraving}&rdquo;
                    </div>
                  )}
                  <CharmBubbles charms={item.charms} />
                </div>

                <div
                  className="text-[14px] font-semibold whitespace-nowrap"
                  style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  €{(COLLAR_PRICE + (item.extra ? 5 : 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: '#E8E3DC' }} />

        {/* Totals */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[14px]" style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
            <span className="text-[14px]" style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px]" style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}>Shipping</span>
            <span
              className="text-[14px]"
              style={{ color: shipping === 0 && subtotal > 0 ? '#5A9E54' : 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
            >
              {subtotal === 0 ? '—' : shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}
            </span>
          </div>
          {subtotal > 0 && shipping > 0 && (
            <div
              className="text-[12px] rounded-lg px-[10px] py-[7px]"
              style={{ color: '#9B948F', background: '#F5F2EE', fontFamily: "'DM Sans', sans-serif" }}
            >
              Add €{(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px my-4" style={{ background: '#E8E3DC' }} />

        {/* Total */}
        <div className="flex justify-between items-center mb-5">
          <span className="text-[15px] font-bold" style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>
            Total
          </span>
          <span
            className="text-[20px]"
            style={{ color: 'var(--color-bark)', letterSpacing: '0.02em', fontFamily: "'Luckiest Guy', cursive" }}
          >
            €{total.toFixed(2)}
          </span>
        </div>

        {/* Submit button — desktop only */}
        <button
          onClick={handlePlaceOrder}
          className="hidden md:block w-full rounded-[14px] px-6 py-4 text-[18px] cursor-pointer border-none transition-[transform,box-shadow] duration-[120ms]"
          style={{
            background: 'var(--color-sage)',
            color: 'var(--color-bark)',
            fontFamily: "'Luckiest Guy', cursive",
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(168,213,162,0.4)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(168,213,162,0.5)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(168,213,162,0.4)';
          }}
        >
          Place order — €{total.toFixed(2)}
        </button>

        {/* Trust note */}
        <div
          className="mt-3.5 flex items-center justify-center gap-1.5 text-[12px]"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          <LockIcon />
          SSL encrypted — safe &amp; secure checkout
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartItems.length} onCart={() => {}} />

      <div className="pt-20">
        {/* Page header */}
        <div className="max-w-[960px] mx-auto px-4 md:px-6 pt-7 md:pt-10">
          <h1
            className="text-[28px] md:text-[36px] mb-1.5"
            style={{ color: 'var(--color-bark)', letterSpacing: '0.04em' }}
          >
            Checkout
          </h1>
          <p className="text-[15px] mb-7 opacity-55" style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>
            Almost there — fill in your details to complete your order.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="max-w-[960px] mx-auto px-4 md:px-6 pb-10 md:pb-[60px] flex flex-col md:flex-row md:gap-7 items-start">
          {/* On mobile: summary first, then form */}
          <div className="contents md:hidden">
            {summaryColumn}
            {formColumn}
          </div>
          <div className="hidden md:contents">
            {formColumn}
            {summaryColumn}
          </div>
        </div>
      </div>
    </div>
  );
}
