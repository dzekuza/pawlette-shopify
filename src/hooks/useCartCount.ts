'use client';

import { useState, useEffect } from 'react';

export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(localStorage.getItem('pawlette_cart') || '[]');
        setCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);

  return count;
}
