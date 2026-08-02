'use client';

import { useEffect } from 'react';
import { fetchCart, goToCheckout } from '@/lib/cart';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function CheckoutPage() {
  useEffect(() => {
    fetchCart().then((cart) => {
      if (cart?.checkoutUrl) goToCheckout(cart);
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
