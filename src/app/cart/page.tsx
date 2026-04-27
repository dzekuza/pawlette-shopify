'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint } from 'lucide-react';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { fetchCart, removeCartLine, type ShopifyCart } from '@/lib/cart';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.9;

export default function CartPage() {
  const router = useRouter();
  const cartCount = useCartCount();

  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCart().then(cart => {
      if (cart) {
        setShopifyCart(cart);
        setCheckoutUrl(cart.checkoutUrl);
      }
    });
  }, []);

  async function removeItem(lineId: string) {
    if (!shopifyCart) return;
    const updated = await removeCartLine(shopifyCart.id, lineId);
    setShopifyCart(updated);
  }

  const lines = shopifyCart?.lines ?? [];
  const subtotal = lines.reduce(
    (sum, line) => sum + parseFloat(line.merchandise.price.amount) * line.quantity,
    0
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="pt-[80px] pb-20">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">

          {/* Page heading */}
          {lines.length > 0 && (
            <h1 className="text-[32px] md:text-[48px] mb-2" style={{ color: 'var(--color-bark)', letterSpacing: '0.02em' }}>
              Your Cart
            </h1>
          )}

          {lines.length > 0 && (
            <p className="text-[15px] mb-5 opacity-60" style={{ color: 'var(--color-bark)' }}>
              {lines.length} {lines.length === 1 ? 'item' : 'items'}
            </p>
          )}

          {lines.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-[640px] pt-8 md:pt-12 pb-20">
              <div
                className="flex flex-col items-center justify-center rounded-[32px] px-7 py-12 md:px-12 md:py-14 text-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,237,230,0.92) 100%)',
                  border: '1.5px solid rgba(61,53,48,0.08)',
                  boxShadow: '0 20px 48px rgba(61,53,48,0.06)',
                }}
              >
                <div
                  className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[24px]"
                  style={{ background: 'rgba(168,213,162,0.18)', color: 'var(--color-bark)' }}
                >
                  <PawPrint className="h-9 w-9" strokeWidth={1.8} />
                </div>
                <p
                  className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--color-bark-light)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Cart
                </p>
                <h1
                  className="m-0 text-[32px] md:text-[40px]"
                  style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' as const }}
                >
                  Your cart is empty
                </h1>
                <p
                  className="mt-4 mb-0 max-w-[32ch] text-[16px] leading-[1.6]"
                  style={{ color: 'var(--color-bark-light)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Build a collar your dog will actually be excited to wear.
                </p>
                <div className="mt-8">
                  <PrimaryButton href="/products" variant="sage" size="lg">
                    Design Your Collar
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ) : (
            /* Two-column layout */
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

              {/* Left: Items list */}
              <div className="w-full md:flex-[2]">

                {/* Free shipping progress bar */}
                {amountToFreeShipping > 0 && (
                  <div className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1.5px solid rgba(61,53,48,0.1)' }}>
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
                    className="rounded-2xl px-5 py-3 mb-4 text-[14px] font-semibold"
                    style={{
                      background: 'rgba(168,213,162,0.18)',
                      border: '1.5px solid var(--color-sage)',
                      color: 'var(--color-bark)',
                    }}
                  >
                    You qualify for free shipping! 🎉
                  </div>
                )}

                {/* Cart lines */}
                <div className="flex flex-col gap-2.5">
                  {lines.map(line => {
                    const lineTotal = parseFloat(line.merchandise.price.amount) * line.quantity;
                    const thumb = line.merchandise.image?.url ?? line.merchandise.product.featuredImage?.url;
                    return (
                      <div
                        key={line.id}
                        className="bg-white rounded-[16px] px-3 py-3 md:px-4 md:py-4 flex items-center gap-3 relative"
                        style={{ border: '1.5px solid rgba(61,53,48,0.08)' }}
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-[68px] h-[68px] rounded-[12px] overflow-hidden bg-[#F0EBE5] flex items-center justify-center">
                          {thumb
                            ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                            : <span style={{ fontSize: 24 }}>🐾</span>
                          }
                        </div>
                        {/* Item details */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[15px] mb-1 truncate"
                            style={{ color: 'var(--color-bark)', letterSpacing: '0.01em', fontFamily: "'Luckiest Guy', cursive" }}
                          >
                            {line.merchandise.product.title}
                          </p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span
                              className="inline-block text-[11px] font-semibold px-[8px] py-[2px] rounded-full"
                              style={{ background: 'rgba(61,53,48,0.07)', color: 'var(--color-bark)' }}
                            >
                              Qty {line.quantity}
                            </span>
                            {line.merchandise.title && line.merchandise.title !== 'Default Title' && (
                              <span className="text-[11px] opacity-50" style={{ color: 'var(--color-bark)' }}>{line.merchandise.title}</span>
                            )}
                          </div>
                        </div>

                        {/* Price + remove */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className="text-[20px]"
                            style={{ color: 'var(--color-bark)', letterSpacing: '0.01em', fontFamily: "'Luckiest Guy', cursive" }}
                          >
                            €{lineTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(line.id)}
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
                    href="/products"
                    className="text-[14px] font-semibold no-underline opacity-75 inline-flex items-center gap-1.5"
                    style={{ color: 'var(--color-bark)' }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="w-full md:flex-1 md:sticky md:top-[120px]">
                <div className="bg-white rounded-2xl px-5 pt-5 pb-6" style={{ border: '1.5px solid rgba(61,53,48,0.1)' }}>
                  <p className="text-[14px] font-semibold mb-4 uppercase tracking-widest opacity-50" style={{ color: 'var(--color-bark)' }}>
                    Order Summary
                  </p>

                  {/* Line items */}
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] opacity-70" style={{ color: 'var(--color-bark)' }}>
                        Subtotal ({lines.length} {lines.length === 1 ? 'item' : 'items'})
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
                    <div className="h-px my-1" style={{ background: 'rgba(61,53,48,0.1)' }} />

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
                  <div className="mt-5">
                    <button
                      onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
                      className="w-full rounded-full py-4 text-[16px] font-bold cursor-pointer border-none"
                      style={{ background: 'var(--color-sage)', color: 'var(--color-bark)' }}
                    >
                      Proceed to Checkout
                    </button>
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
