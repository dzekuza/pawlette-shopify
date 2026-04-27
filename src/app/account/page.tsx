'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ORDERS = [
  {
    id: 'PW-001',
    name: 'Blossom Collar Set',
    status: 'Delivered',
    date: 'Mar 12, 2026',
    price: '€34.90',
    color: '#F9C8D0',
  },
  {
    id: 'PW-002',
    name: 'Sage Collar Set',
    status: 'Delivered',
    date: 'Apr 3, 2026',
    price: '€34.90',
    color: '#A8D5A2',
  },
];

const MOCK_ADDRESS = {
  name: 'Rysard G.',
  line1: 'Gedimino pr. 9',
  line2: 'Vilnius, LT-01103',
  country: 'Lithuania',
};

const inputClass =
  'w-full rounded-[10px] border-[1.5px] border-[#E8E3DC] px-[14px] py-[10px] text-[14px] bg-white outline-none box-border';

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderCard({ order }: { order: (typeof MOCK_ORDERS)[number] }) {
  return (
    <div
      className="bg-white rounded-2xl px-6 py-5 flex items-center gap-5 mb-4"
      style={{ border: '1.5px solid #E8E3DC' }}
    >
      {/* Color swatch */}
      <div
        className="w-12 h-12 rounded-xl shrink-0"
        style={{ background: order.color }}
      />
      <div className="flex-1">
        <div
          className="font-semibold text-[15px] mb-1"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {order.name}
        </div>
        <div
          className="text-[13px]"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          Order #{order.id} · {order.date}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div
          className="inline-block rounded-[20px] px-3 py-[3px] text-[12px] font-semibold mb-1.5"
          style={{ background: '#E8F5E6', color: '#3A7A35', fontFamily: "'DM Sans', sans-serif" }}
        >
          {order.status}
        </div>
        <div
          className="text-[14px] font-bold"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {order.price}
        </div>
      </div>
    </div>
  );
}

function TabOrders() {
  return (
    <div>
      <h2
        className="text-[26px] mb-6"
        style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
      >
        Your Orders
      </h2>
      {MOCK_ORDERS.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function TabProfile() {
  const [name, setName] = useState('Rysard G.');
  const [email, setEmail] = useState('hello@pawlette.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2
        className="text-[26px] mb-6"
        style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
      >
        Profile
      </h2>
      <div className="flex flex-col gap-4 max-w-[440px]">
        <div>
          <label
            className="block text-[13px] font-semibold mb-1.5"
            style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
          >
            Full name
          </label>
          <input
            className={inputClass}
            style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-2 self-start px-7 py-3 rounded-xl font-bold text-[15px] cursor-pointer border-none transition-[background] duration-200"
          style={{
            background: saved ? '#7bbf74' : 'var(--color-sage)',
            color: 'var(--color-bark)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function TabAddresses() {
  return (
    <div>
      <h2
        className="text-[26px] mb-6"
        style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
      >
        Addresses
      </h2>
      {/* Saved address card */}
      <div
        className="bg-white rounded-2xl px-6 py-5 mb-4 max-w-[380px] relative"
        style={{ border: '1.5px solid #E8E3DC' }}
      >
        <div
          className="absolute top-4 right-4 rounded-[20px] px-[10px] py-[2px] text-[11px] font-semibold"
          style={{ background: '#E8F5E6', color: '#3A7A35', fontFamily: "'DM Sans', sans-serif" }}
        >
          Default
        </div>
        <div
          className="font-bold text-[15px] mb-1.5"
          style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {MOCK_ADDRESS.name}
        </div>
        <div
          className="text-[14px] leading-relaxed"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          {MOCK_ADDRESS.line1}
          <br />
          {MOCK_ADDRESS.line2}
          <br />
          {MOCK_ADDRESS.country}
        </div>
      </div>
      {/* Add address button */}
      <button
        className="px-6 py-[11px] rounded-xl font-semibold text-[14px] cursor-pointer bg-transparent"
        style={{
          border: '1.5px solid var(--color-bark)',
          color: 'var(--color-bark)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        + Add address
      </button>
    </div>
  );
}

function TabWishlist() {
  return (
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
          Nothing saved yet
        </div>
        <div
          className="text-[14px] mb-6"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          Browse our collars and charm sets and save your favourites.
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
  );
}

// ─── Logged-in dashboard ──────────────────────────────────────────────────────

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'addresses', label: 'Addresses', icon: '📍' },
  { id: 'wishlist', label: 'Wishlist', icon: '♡' },
];

function Dashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const sidebar = (
    <div className="w-full md:w-[240px] shrink-0">
      {/* Avatar + name */}
      <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 pb-5 md:pb-8 mb-0 md:mb-2">
        <div
          className="rounded-full flex items-center justify-center shrink-0 w-[52px] h-[52px] md:w-[72px] md:h-[72px] text-[18px] md:text-[26px]"
          style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'Luckiest Guy', cursive" }}
        >
          RG
        </div>
        <div className="md:text-center">
          <div
            className="font-bold text-[15px]"
            style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Rysard G.
          </div>
          <div
            className="text-[12px] mt-0.5"
            style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
          >
            Pawlette Member
          </div>
        </div>
      </div>

      {/* Nav items */}
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

      {/* Sign out — desktop only */}
      <button
        onClick={onLogout}
        className="hidden md:block mt-8 px-4 py-[10px] rounded-xl bg-transparent text-[13px] font-medium cursor-pointer w-full text-left"
        style={{ border: '1.5px solid #E8E3DC', color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
      >
        Sign out
      </button>
    </div>
  );

  const content = (
    <div className="flex-1 min-w-0">
      {activeTab === 'orders' && <TabOrders />}
      {activeTab === 'profile' && <TabProfile />}
      {activeTab === 'addresses' && <TabAddresses />}
      {activeTab === 'wishlist' && <TabWishlist />}

      <button
        onClick={onLogout}
        className="md:hidden mt-8 px-5 py-3 rounded-xl bg-transparent text-[13px] font-medium cursor-pointer w-full"
        style={{ border: '1.5px solid #E8E3DC', color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
      >
        Sign out
      </button>
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 pb-[60px] md:pb-20 flex flex-col md:flex-row gap-6 md:gap-12 items-start">
      {sidebar}
      {/* Vertical divider on desktop */}
      <div
        className="hidden md:block w-px self-stretch shrink-0"
        style={{ background: '#E8E3DC' }}
      />
      {content}
    </div>
  );
}

// ─── Login card ───────────────────────────────────────────────────────────────

function LoginCard({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (email.trim() && password.trim()) {
      onLogin();
    }
  };

  return (
    <div className="max-w-[440px] w-full mx-auto px-4 pb-20">
      <div
        className="bg-white rounded-3xl px-9 py-10"
        style={{ border: '1.5px solid #E8E3DC' }}
      >
        {/* Heading */}
        <h1
          className="text-[32px] mb-2 text-center"
          style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}
        >
          Welcome back
        </h1>
        <p
          className="text-[15px] text-center mb-8"
          style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign in to manage your orders and profile.
        </p>

        {/* Email */}
        <div className="mb-4">
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
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label
            className="block text-[13px] font-semibold mb-1.5"
            style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
          >
            Password
          </label>
          <input
            className={inputClass}
            style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />
        </div>

        {/* Sign in button */}
        <button
          onClick={handleSignIn}
          className="w-full py-[13px] rounded-xl font-bold text-[15px] cursor-pointer border-none mb-5"
          style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign in
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: '#E8E3DC' }} />
          <span
            className="text-[13px]"
            style={{ color: '#9B948F', fontFamily: "'DM Sans', sans-serif" }}
          >
            or
          </span>
          <div className="flex-1 h-px" style={{ background: '#E8E3DC' }} />
        </div>

        {/* Create account button */}
        <button
          className="w-full py-[13px] rounded-xl font-semibold text-[15px] cursor-pointer bg-transparent"
          style={{
            border: '1.5px solid var(--color-bark)',
            color: 'var(--color-bark)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Create account
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const router = useRouter();
  const cartCount = useCartCount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <div className="pt-[100px]">
        {isLoggedIn ? (
          <Dashboard onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <LoginCard onLogin={() => setIsLoggedIn(true)} />
        )}
      </div>

      <LandingFooter />
    </div>
  );
}
