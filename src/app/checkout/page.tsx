'use client';

import { useEffect } from 'react';
import { fetchCart } from '@/lib/cart';
import { LandingNav } from '@/components/landing/LandingNav';

export default function CheckoutPage() {
  useEffect(() => {
    fetchCart().then(cart => {
      if (cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
      }
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', fontFamily: "'DM Sans', sans-serif" }}>
      <LandingNav cartCount={0} onCart={() => {}} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div style={{ fontSize: 18, color: 'var(--color-bark)', fontWeight: 500 }}>
          Nukreipiame į atsiskaitymą…
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-bark-muted)' }}>
          Užsakymą užbaigsite saugioje Shopify atsiskaitymo aplinkoje.
        </div>
      </div>
    </div>
  );
}
