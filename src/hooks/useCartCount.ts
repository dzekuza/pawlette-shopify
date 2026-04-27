'use client';

import { useState, useEffect } from 'react';
import { fetchCart, SHOPIFY_CART_UPDATED_EVENT } from '@/lib/cart';

interface CartUpdatedEventDetail {
  totalQuantity: number;
}

export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const syncCount = async () => {
      const cart = await fetchCart();
      if (mounted) {
        setCount(cart?.totalQuantity ?? 0);
      }
    };

    const handleCartUpdated = (event: Event) => {
      const detail = (event as CustomEvent<CartUpdatedEventDetail>).detail;
      setCount(detail?.totalQuantity ?? 0);
    };

    syncCount();
    window.addEventListener('storage', syncCount);
    window.addEventListener(SHOPIFY_CART_UPDATED_EVENT, handleCartUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('storage', syncCount);
      window.removeEventListener(SHOPIFY_CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, []);

  return count;
}
