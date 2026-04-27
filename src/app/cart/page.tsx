'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

interface CartItem {
  collar: { id: string; name: string; color: string };
  charms: (string | null)[];
  size: string;
  engraving: string;
  extra?: boolean;
}

const COLLAR_PRICE = 28;
const EXTRA_CHARM_PRICE = 6;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.9;

function collarCharmCount(item: CartItem): number {
  return item.charms.filter(Boolean).length;
}

function itemPrice(item: CartItem): number {
  return COLLAR_PRICE + (item.extra ? EXTRA_CHARM_PRICE : 0);
}

export default function CartPage() {
  const router = useRouter();
  const cartCount = useCartCount();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const raw = localStorage.getItem('pawlette_cart');
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      // ignore malformed localStorage data
    }
  }, []);

  function removeItem(index: number) {
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('pawlette_cart', JSON.stringify(next));
      } catch { /* noop */ }
      return next;
    });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + itemPrice(item), 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  if (!mounted) {
    return (
      <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
        <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartItems.length} onCart={() => router.push('/cart')} />

      <main className="pt-[100px] pb-20">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">

          {/* Page heading */}
          <h1 className="text-[32px] md:text-[48px] mb-2" style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}>
            Your Cart
          </h1>

          {cartItems.length > 0 && (
            <p className="text-[15px] mb-10 opacity-60" style={{ color: 'var(--color-bark)' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          )}

          {cartItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center pt-[60px] pb-20 gap-6 text-center">
              <span className="text-[96px] leading-none">🐾</span>
              <h2 className="text-[26px] md:text-[36px] m-0" style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}>
                Your cart is empty
              </h2>
              <p className="text-[16px] max-w-[360px] leading-relaxed m-0 opacity-60" style={{ color: 'var(--color-bark)' }}>
                Build a collar your dog will actually be excited to wear.
              </p>
              <PrimaryButton href="/configure" variant="sage" size="lg">
                Design Your Collar
              </PrimaryButton>
            </div>
          ) : (
            /* Two-column layout */
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

              {/* Left: Items list */}
              <div className="w-full md:flex-[2]">

                {/* Free shipping progress bar */}
                {amountToFreeShipping > 0 && (
                  <div className="bg-white rounded-2xl p-4 mb-6" style={{ border: '1.5px solid rgba(61,53,48,0.1)' }}>
                    <p className="text-[14px] font-medium mb-[10px]" style={{ color: 'var(--color-bark)' }}>
                      Add <strong>€{amountToFreeShipping.toFixed(2)}</strong> more for free shipping 🚚
                    </p>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(61,53,48,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-[400ms] ease-[ease]"
                        style={{
                          width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%`,
                          background: 'var(--color-sage)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {amountToFreeShipping === 0 && (
                  <div
                    className="rounded-2xl px-5 py-3 mb-6 text-[14px] font-semibold"
                    style={{
                      background: 'rgba(168,213,162,0.18)',
                      border: '1.5px solid var(--color-sage)',
                      color: 'var(--color-bark)',
                    }}
                  >
                    You qualify for free shipping! 🎉
                  </div>
                )}

                {/* Cart items */}
                <div className="flex flex-col gap-4">
                  {cartItems.map((item, index) => {
                    const charmCount = collarCharmCount(item);
                    const price = itemPrice(item);
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-[20px] px-4 py-[18px] md:px-6 md:py-5 flex items-center gap-[18px] relative"
                        style={{ border: '1.5px solid rgba(61,53,48,0.1)' }}
                      >
                        {/* Colour swatch */}
                        <div
                          className="w-[52px] h-[52px] rounded-full shrink-0"
                          style={{
                            background: item.collar.color,
                            boxShadow: `0 2px 12px ${item.collar.color}88`,
                            border: '2px solid rgba(255,255,255,0.8)',
                          }}
                        />

                        {/* Item details */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[17px] mb-1.5 truncate"
                            style={{ color: 'var(--color-bark)', letterSpacing: '0.02em', fontFamily: "'Luckiest Guy', cursive" }}
                          >
                            Collar Set — {item.collar.name}
                          </p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {/* Size badge */}
                            <span
                              className="inline-block text-[12px] font-semibold px-[10px] py-[3px] rounded-full"
                              style={{ background: 'rgba(61,53,48,0.08)', color: 'var(--color-bark)' }}
                            >
                              {item.size}
                            </span>
                            {/* Charm count badge */}
                            {charmCount > 0 && (
                              <span
                                className="inline-block text-[12px] font-semibold px-[10px] py-[3px] rounded-full"
                                style={{ background: 'rgba(168,213,162,0.25)', color: 'var(--color-bark)' }}
                              >
                                {charmCount} {charmCount === 1 ? 'charm' : 'charms'}
                              </span>
                            )}
                            {/* Engraving badge */}
                            {item.engraving && (
                              <span
                                className="inline-block text-[12px] font-semibold px-[10px] py-[3px] rounded-full"
                                style={{ background: 'rgba(249,228,160,0.4)', color: 'var(--color-bark)' }}
                              >
                                &ldquo;{item.engraving}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price + remove */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className="text-[20px]"
                            style={{ color: 'var(--color-bark)', letterSpacing: '0.01em', fontFamily: "'Luckiest Guy', cursive" }}
                          >
                            €{price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(index)}
                            aria-label="Remove item"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 cursor-pointer border-none transition-[background] duration-150"
                            style={{ background: 'rgba(61,53,48,0.07)', color: 'var(--color-bark)' }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue shopping */}
                <div className="mt-6">
                  <Link
                    href="/configure"
                    className="text-[14px] font-semibold no-underline opacity-75 inline-flex items-center gap-1.5"
                    style={{ color: 'var(--color-bark)' }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="w-full md:flex-1 md:sticky md:top-[120px]">
                <div className="bg-white rounded-3xl px-7 pt-7 pb-8" style={{ border: '1.5px solid rgba(61,53,48,0.1)' }}>
                  <p className="text-[16px] font-semibold mb-6" style={{ color: 'var(--color-bark)' }}>
                    Order Summary
                  </p>

                  {/* Line items */}
                  <div className="flex flex-col gap-[14px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] opacity-70" style={{ color: 'var(--color-bark)' }}>
                        Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                      </span>
                      <span className="text-[15px] font-semibold" style={{ color: 'var(--color-bark)' }}>
                        €{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[15px] opacity-70" style={{ color: 'var(--color-bark)' }}>
                        Shipping
                      </span>
                      {shipping === 0 ? (
                        <span className="text-[15px] font-semibold" style={{ color: '#4CAF50' }}>
                          Free
                        </span>
                      ) : (
                        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-bark)' }}>
                          €{shipping.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px my-1.5" style={{ background: 'rgba(61,53,48,0.1)' }} />

                    <div className="flex justify-between items-center">
                      <span className="text-[15px] font-bold" style={{ color: 'var(--color-bark)' }}>
                        Total
                      </span>
                      <span
                        className="text-[22px]"
                        style={{ color: 'var(--color-bark)', letterSpacing: '0.01em', fontFamily: "'Luckiest Guy', cursive" }}
                      >
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Free shipping progress inside summary on mobile */}
                  {amountToFreeShipping > 0 && (
                    <div className="mt-5 md:hidden">
                      <p className="text-[13px] opacity-65 mb-2" style={{ color: 'var(--color-bark)' }}>
                        €{amountToFreeShipping.toFixed(2)} away from free shipping
                      </p>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(61,53,48,0.1)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%`,
                            background: 'var(--color-sage)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-7">
                    <PrimaryButton href="/checkout" variant="sage" size="lg" fullWidth>
                      Proceed to Checkout
                    </PrimaryButton>
                  </div>

                  {/* Trust note */}
                  <p className="text-[13px] opacity-65 text-center mt-3.5 leading-relaxed" style={{ color: 'var(--color-bark)' }}>
                    Secure checkout · Ships from Vilnius 🇱🇹
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
