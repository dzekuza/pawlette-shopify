'use client';

import { useEffect } from 'react';
import { fetchCart, trackCheckoutStart } from '@/lib/cart';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function CheckoutPage() {
  useEffect(() => {
    fetchCart().then((cart) => {
      if (!cart?.checkoutUrl) return;
      trackCheckoutStart(cart);
      // This page redirects automatically, with no real user click to carry —
      // GA4's cross-domain linker only decorates a genuine click on an <a>, so
      // unlike the CartDrawer/​cart page checkout buttons this redirect can't
      // preserve GA4 session attribution across to the checkout domain.
      setTimeout(() => {
        window.location.href = cart.checkoutUrl;
      }, 300);
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
