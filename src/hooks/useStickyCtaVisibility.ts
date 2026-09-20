'use client';

import { useEffect, useState } from 'react';

const SHOW_AFTER_PX = 500;
const DIRECTION_DELTA_PX = 6;

/** Visible only after scrolling past the hero and while scrolling down; hides on scroll up. */
export function useStickyCtaVisibility(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let lastY = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      if (y <= SHOW_AFTER_PX) {
        setVisible(false);
      } else if (y > lastY + DIRECTION_DELTA_PX) {
        setVisible(true);
      } else if (y < lastY - DIRECTION_DELTA_PX) {
        setVisible(false);
      } else {
        return;
      }
      lastY = y;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return visible;
}
