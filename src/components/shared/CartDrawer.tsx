'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { X, PawPrint, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchCart, removeCartLine, SHOPIFY_CART_UPDATED_EVENT, type ShopifyCart } from '@/lib/cart';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { CartUpsell } from '@/components/shared/CartUpsell';
import { EmptyState } from '@/components/storefront/EmptyState';
import { PaymentBadges } from '@/components/storefront/PaymentBadges';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/site-config';
import ltMessages from '@/messages/lt.json';
import enMessages from '@/messages/en.json';

export const CART_DRAWER_OPEN_EVENT = 'cart-drawer:open';

const SHIPPING_COST = 4.9;

// CartDrawer is mounted globally in the root layout (src/app/layout.tsx),
// outside the `[locale]` route segment — it has no NextIntlClientProvider
// ancestor, on migrated routes (/, /en, /configure) OR on non-migrated ones
// (/faq, /cart, /checkout, /account). Calling next-intl's useTranslations()
// here would throw ("No intl context found") on every single page load,
// since the drawer's own render tree never sits inside the provider even
// when the *page* underneath it does. So instead of the hook, resolve copy
// from a plain object keyed by the URL's locale prefix, mirroring the same
// segment check LanguageSwitcher uses (`/en/...` → en, everything else → lt).
const CART_DRAWER_STRINGS = { lt: ltMessages.shared.cartDrawer, en: enMessages.shared.cartDrawer };

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const t = CART_DRAWER_STRINGS[locale];

  const refresh = useCallback(() => {
    fetchCart().then(setCart);
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      refresh();
    };
    window.addEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
    window.addEventListener(SHOPIFY_CART_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
      window.removeEventListener(SHOPIFY_CART_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  async function removeItem(lineId: string) {
    if (!cart) return;
    const updated = await removeCartLine(cart.id, lineId);
    setCart(updated);
  }

  const lines = cart?.lines ?? [];
  const subtotal = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[600]"
            style={{ background: 'var(--color-bark-overlay)' }}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.dialogAriaLabel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-y-0 right-0 z-[601] w-full max-w-[420px] flex flex-col"
            style={{ background: 'var(--color-cream)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-[15px] font-semibold text-bark">
                {t.title} {lines.length > 0 && `(${lines.length})`}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.closeAriaLabel}
                className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer bg-surface-2 text-bark"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-6">
                <EmptyState
                  eyebrow={t.emptyEyebrow}
                  icon={PawPrint}
                  title={t.emptyTitle}
                  description={t.emptyDescription}
                  actionHref="/products"
                  actionLabel={t.emptyActionLabel}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {/* Free shipping progress bar */}
                  {amountToFreeShipping > 0 ? (
                    <div className="mb-4">
                      <p className="text-[13px] font-medium mb-2 text-bark">
                        {t.freeShippingPrefix} <strong>€{amountToFreeShipping.toFixed(2)}</strong>{t.freeShippingSuffix && ` ${t.freeShippingSuffix}`} 🚚
                      </p>
                      <div className="h-1.5 rounded-full overflow-hidden bg-bark/10">
                        <div
                          className="h-full rounded-full transition-[width] duration-[280ms] ease-out bg-sage"
                          style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] font-medium mb-4 text-interactive-text">
                      {t.freeShippingUnlocked}
                    </p>
                  )}

                  {/* Cart lines */}
                  <div className="flex flex-col gap-2.5">
                    {lines.map(line => {
                      const lineTotal = parseFloat(line.cost.totalAmount.amount);
                      const thumb = line.merchandise.image?.url ?? line.merchandise.product.featuredImage?.url;
                      return (
                        <div
                          key={line.id}
                          className="relative flex items-center gap-3 rounded-2xl border border-bark/8 bg-white px-3 py-3"
                        >
                          <div className="shrink-0 w-[56px] h-[56px] rounded-[10px] overflow-hidden bg-surface-2 flex items-center justify-center">
                            {thumb
                              ? <Image src={thumb} alt="" width={56} height={56} className="w-full h-full object-contain" />
                              : <span className="text-[20px]">🐾</span>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold mb-0.5 truncate text-bark">
                              {line.merchandise.product.title}
                            </p>
                            <p className="text-[12px] opacity-60 text-bark">
                              {t.quantity.replace('{count}', String(line.quantity))}
                              {line.merchandise.title && line.merchandise.title !== 'Default Title' && ` · ${line.merchandise.title}`}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="text-[14px] font-medium text-bark">€{lineTotal.toFixed(2)}</span>
                            <button
                              onClick={() => removeItem(line.id)}
                              aria-label={t.removeItemAriaLabel}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 cursor-pointer border-none bg-bark/10 text-bark"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <CartUpsell lines={lines} />
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] opacity-70 text-bark">{t.subtotal}</span>
                    <span className="text-[14px] font-semibold text-bark">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[14px] opacity-70 text-bark">{t.shipping}</span>
                    <span className={`text-[14px] font-semibold ${shipping === 0 ? 'text-interactive-text' : 'text-bark'}`}>
                      {shipping === 0 ? t.shippingFree : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <PrimaryButton
                    onClick={() => { if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl; }}
                    variant="sage"
                    size="lg"
                    fullWidth
                  >
                    {t.checkoutCta.replace('{total}', total.toFixed(2))}
                  </PrimaryButton>

                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="block text-center text-[13px] font-semibold mt-3 no-underline opacity-75 text-bark"
                  >
                    {t.viewFullCart}
                  </Link>

                  <p className="text-[12px] opacity-65 text-center mt-3 inline-flex items-start justify-center gap-1.5 w-full text-bark">
                    <Lock size={12} strokeWidth={2} className="shrink-0 mt-[2px]" />
                    <span>{t.secureCheckout}</span>
                  </p>
                  <PaymentBadges className="mt-2" />
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
