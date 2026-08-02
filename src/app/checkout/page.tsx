'use client';

import { useEffect } from 'react';
import { fetchCart } from '@/lib/cart';
import { trackMetaEvent } from '@/components/shared/MetaPixel';
import { trackGaEvent, getGaLinkerParam, withGaLinker } from '@/components/shared/GoogleAnalytics';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function CheckoutPage() {
  useEffect(() => {
    fetchCart().then(async (cart) => {
      if (cart?.checkoutUrl) {
        trackMetaEvent('InitiateCheckout', {
          content_ids: cart.lines.map((l) => l.merchandise.id),
          content_type: 'product',
          value: parseFloat(cart.cost.totalAmount.amount),
          currency: cart.cost.totalAmount.currencyCode,
          num_items: cart.totalQuantity,
        });
        trackGaEvent('begin_checkout', {
          currency: cart.cost.totalAmount.currencyCode,
          value: parseFloat(cart.cost.totalAmount.amount),
          items: cart.lines.map((l) => ({
            item_id: l.merchandise.id,
            item_name: l.merchandise.product.title,
            price: parseFloat(l.merchandise.price.amount),
            quantity: l.quantity,
          })),
        });
        // Carries the GA4 client ID across to the checkout domain (see the
        // `linker` config on gtag('config', ...) in the root layout) so the
        // checkout session stays attributed instead of starting fresh.
        const linkerParam = await getGaLinkerParam();
        const checkoutUrl = withGaLinker(cart.checkoutUrl, linkerParam);
        // Give the pixel beacon + gtag beacon a moment to leave the page before
        // the cross-origin navigation to Shopify checkout cancels them mid-flight.
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 300);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream font-sans">
      <LandingNav cartCount={0} onCart={() => {}} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-[18px] text-bark font-medium">
          Nukreipiame į atsiskaitymą…
        </div>
        <div className="text-[14px] text-bark-muted">
          Užsakymą užbaigsite saugioje Shopify atsiskaitymo aplinkoje.
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
