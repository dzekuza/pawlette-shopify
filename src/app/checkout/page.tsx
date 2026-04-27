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
        <div style={{ fontSize: 18, color: '#3D3530', fontWeight: 500 }}>
          Redirecting to checkout…
        </div>
        <div style={{ fontSize: 14, color: '#9B948F' }}>
          You&apos;ll complete your order on Shopify&apos;s secure checkout.
        </div>
      </div>
    </div>
  );
}
