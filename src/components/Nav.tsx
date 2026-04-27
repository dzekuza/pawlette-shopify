'use client';

import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

interface NavProps {
  isDark: boolean;
  cartCount: number;
  onCartOpen: () => void;
}

export function Nav({ isDark, cartCount, onCartOpen }: NavProps) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 60,
      background: 'transparent', backdropFilter: 'none', borderBottom: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 40px', transition: 'background 400ms',
    }}>
      <Link
        href="/"
        style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
          color: isDark ? 'rgba(250,247,242,0.5)' : '#9B948F',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'color 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#FAF7F2' : '#3D3530')}
        onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'rgba(250,247,242,0.5)' : '#9B948F')}
      >
        ← Back to shop
      </Link>

      <Link
        href="/"
        aria-label="Žavesys home"
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <img
          src="/pawcharms.svg"
          alt="Žavesys"
          style={{ height: 32, width: 'auto', display: 'block' }}
        />
      </Link>

      <button
        onClick={onCartOpen}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
          padding: 8, color: isDark ? '#FAF7F2' : '#3D3530',
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {cartCount > 0 && (
          <span style={{
            background: '#A8D5A2', color: '#2a5a25', borderRadius: 100,
            padding: '1px 8px', fontSize: 12, fontWeight: 600,
          }}>
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
