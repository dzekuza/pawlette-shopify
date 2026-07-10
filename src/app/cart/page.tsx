'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint } from 'lucide-react';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { fetchCart, removeCartLine, type ShopifyCart } from '@/lib/cart';
import { EmptyState } from '@/components/storefront/EmptyState';
import { SurfaceCard } from '@/components/storefront/SurfaceCard';
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/site-config';

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
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen font-sans bg-cream">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">

          {/* Page heading */}
          {lines.length > 0 && (
            <DisplayHeading as='h1' size='section' className='mb-2'>Jūsų krepšelis</DisplayHeading>
          )}

          {lines.length > 0 && (
            <p className="text-[15px] mb-5 opacity-60" style={{ color: 'var(--color-bark)' }}>
              {lines.length} {lines.length === 1 ? 'prekė' : 'prekės'}
            </p>
          )}

          {lines.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-[640px] pt-6 md:pt-8 pb-20">
              <EmptyState
                eyebrow='Krepšelis'
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
                  <SurfaceCard variant='white' padding='compact' className="mb-4 border-bark/10">
                    <p className="text-[14px] font-medium mb-[10px]" style={{ color: 'var(--color-bark)' }}>
                      Iki nemokamo pristatymo trūksta <strong>€{amountToFreeShipping.toFixed(2)}</strong> 🚚
                    </p>
                    <div className="h-2 rounded-full overflow-hidden bg-bark/10">
                      <div
                        className="h-full rounded-full transition-[width] duration-[280ms] ease-out bg-sage"
                        style={{
                          width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                        }}
                      />
                    </div>
                  </SurfaceCard>
                )}

                {amountToFreeShipping === 0 && (
                  <div
                    className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3 bg-sage/15 border border-sage/50"
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--color-sage)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 15,
                    }}>
                      🎉
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-bark)' }}>
                        Nemokamas pristatymas!
                      </p>
                      <p className="text-bark-muted" style={{ margin: 0, fontSize: 12 }}>
                        Jūsų užsakymui priklauso nemokamas pristatymas.
                      </p>
                    </div>
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
                        className="relative flex items-center gap-3 border-bark/8 px-3 py-3 md:px-4 md:py-4"
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-[68px] h-[68px] rounded-[12px] overflow-hidden bg-surface-2 flex items-center justify-center">
                          {thumb
                            ? <Image src={thumb} alt="" width={68} height={68} className="w-full h-full object-contain" />
                            : <span style={{ fontSize: 24 }}>🐾</span>
                          }
                        </div>
                        {/* Item details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold mb-1 truncate text-bark">
                            {line.merchandise.product.title}
                          </p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <Eyebrow className="text-[11px]">Kiekis {line.quantity}</Eyebrow>
                            {line.merchandise.title && line.merchandise.title !== 'Default Title' && (
                              <span className="text-[12px] opacity-50 text-bark">{line.merchandise.title}</span>
                            )}
                          </div>
                        </div>

                        {/* Price + remove */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className="text-[16px] font-medium text-bark"
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
                <SurfaceCard variant='white' className="border-bark/10 px-4 pt-4 pb-4">
                  <p className="text-[11px] font-medium mb-4 uppercase tracking-[0.08em] opacity-50" style={{ color: 'var(--color-bark)' }}>
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
                        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-interactive-text)' }}>
                          Nemokamai
                        </span>
                      ) : (
                        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-bark)' }}>
                          €{shipping.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px my-1 bg-bark/10" />

                    <div className="flex justify-between items-center">
                      <span className="text-[15px] font-bold" style={{ color: 'var(--color-bark)' }}>
                        Iš viso
                      </span>
                      <span
                        className="text-[22px] font-semibold text-bark"
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
                      <div className="h-1.5 rounded-full overflow-hidden bg-bark/10">
                        <div
                          className="h-full rounded-full bg-sage"
                          style={{
                            width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-5">
                    <PrimaryButton
                      onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
                      variant="sage"
                      size="lg"
                      fullWidth
                    >
                      Tęsti atsiskaitymą
                    </PrimaryButton>
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
