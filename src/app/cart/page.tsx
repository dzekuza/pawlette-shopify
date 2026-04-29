'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint } from 'lucide-react';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Button } from '@/components/ui/button';
import { fetchCart, removeCartLine, type ShopifyCart } from '@/lib/cart';
import { EmptyState } from '@/components/storefront/EmptyState';
import { SurfaceCard } from '@/components/storefront/SurfaceCard';
import { DisplayHeading } from '@/components/storefront/Typography';

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
            <DisplayHeading as='h1' className='mb-2 text-[32px] tracking-[-0.02em] md:text-[48px]'>Jūsų krepšelis</DisplayHeading>
          )}

          {lines.length > 0 && (
            <p className="text-[15px] mb-5 opacity-60" style={{ color: 'var(--color-bark)' }}>
              {lines.length} {lines.length === 1 ? 'prekė' : 'prekės'}
            </p>
          )}

          {lines.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-[640px] pt-8 md:pt-12 pb-20">
              <EmptyState
                eyebrow='Cart'
                icon={PawPrint}
                title='Jūsų krepšelis tuščias'
                description='Sukurkite antkaklį, kurį jūsų šuo tikrai norės nešioti.'
                actionHref='/products'
                actionLabel='Kurti antkaklį'
              />
            </div>
          ) : (
            /* Two-column layout */
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

              {/* Left: Items list */}
              <div className="w-full md:flex-[2]">

                {/* Free shipping progress bar */}
                {amountToFreeShipping > 0 && (
                  <SurfaceCard variant='white' padding='compact' className="mb-4 rounded-2xl border-bark/10">
                    <p className="text-[14px] font-medium mb-[10px]" style={{ color: 'var(--color-bark)' }}>
                      Iki nemokamo pristatymo trūksta <strong>€{amountToFreeShipping.toFixed(2)}</strong> 🚚
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
                  </SurfaceCard>
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
                    Jums priklauso nemokamas pristatymas! 🎉
                  </div>
                )}

                {/* Cart lines */}
                <div className="flex flex-col gap-2.5">
                  {lines.map(line => {
                    const lineTotal = parseFloat(line.merchandise.price.amount) * line.quantity;
                    const thumb = line.merchandise.image?.url ?? line.merchandise.product.featuredImage?.url;
                    return (
                      <SurfaceCard
                        key={line.id}
                        variant='white'
                        padding='compact'
                        className="relative flex items-center gap-3 rounded-[16px] border-bark/8 px-3 py-3 md:px-4 md:py-4"
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-[68px] h-[68px] rounded-[12px] overflow-hidden bg-[#F0EBE5] flex items-center justify-center">
                          {thumb
                            ? <Image src={thumb} alt="" width={68} height={68} className="w-full h-full object-cover" />
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
                              Kiekis {line.quantity}
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
                            aria-label="Pašalinti prekę"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 cursor-pointer border-none transition-[background] duration-150"
                            style={{ background: 'rgba(61,53,48,0.07)', color: 'var(--color-bark)' }}
                          >
                            ×
                          </button>
                        </div>
                      </SurfaceCard>
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
                    ← Tęsti pirkimą
                  </Link>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="w-full md:flex-1 md:sticky md:top-[120px]">
                <SurfaceCard variant='white' className="rounded-2xl border-bark/10 px-5 pt-5 pb-6">
                  <p className="text-[14px] font-semibold mb-4 uppercase tracking-widest opacity-50" style={{ color: 'var(--color-bark)' }}>
                    Užsakymo santrauka
                  </p>

                  {/* Line items */}
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[15px] opacity-70" style={{ color: 'var(--color-bark)' }}>
                        Tarpinė suma ({lines.length} {lines.length === 1 ? 'prekė' : 'prekės'})
                      </span>
                      <span className="text-[15px] font-semibold" style={{ color: 'var(--color-bark)' }}>
                        €{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[15px] opacity-70" style={{ color: 'var(--color-bark)' }}>
                        Pristatymas
                      </span>
                      {shipping === 0 ? (
                        <span className="text-[15px] font-semibold" style={{ color: '#4CAF50' }}>
                          Nemokamai
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
                        Iš viso
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
                        Iki nemokamo pristatymo liko €{amountToFreeShipping.toFixed(2)}
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
                    <Button
                      onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
                      className="w-full"
                      variant='sage'
                      size='pill-lg'
                    >
                      Tęsti atsiskaitymą
                    </Button>
                  </div>

                  {/* Trust note */}
                  <p className="text-[13px] opacity-65 text-center mt-3.5 leading-relaxed" style={{ color: 'var(--color-bark)' }}>
                    Saugus atsiskaitymas · Siunčiama iš Vilniaus 🇱🇹
                  </p>
                </SurfaceCard>
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
