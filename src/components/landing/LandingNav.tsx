'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const NAV_LINKS = [
  { label: 'Antkakliai', href: '/products/collar-dark-blue-collar' },
  { label: 'Pavadeliai', href: '/products/pawlette-leash' },
  { label: "Charm'sai", href: '/products/charm-charms' },
];

const DESKTOP_NAV = [
  { label: 'Antkakliai', href: '/products/collar-dark-blue-collar' },
  { label: 'Pavadeliai', href: '/products/pawlette-leash' },
  { label: "Charm'sai", href: '/products/charm-charms' },
];

interface LandingNavProps {
  cartCount?: number;
  onCart?: () => void;
  topOffset?: number;
}

export function LandingNav({ cartCount = 0, onCart }: LandingNavProps) {
  const width = useWindowWidth() ?? 1200;
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        padding: isMobile ? '12px 16px' : '12px 24px',
      }}>
        <div style={{
          maxWidth: 1292,
          margin: '0 auto',
          width: '100%',
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          borderRadius: 84,
          padding: '12px 12px 12px 16px',
          overflow: 'clip',
        }}>
          {/* Logo */}
          <Link href="/" aria-label="PawCharms pagrindinis" style={{ flexShrink: 0, lineHeight: 0 }}>
            <img src="/pawcharms.svg" alt="PawCharms" style={{ height: 42, width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {DESKTOP_NAV.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="nav-link"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--color-bark-light)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right: cart + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cart */}
            <button
              onClick={onCart}
              aria-label="Krepšelis"
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 10px',
                color: 'var(--color-bark)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--color-sage)',
                  color: 'var(--color-interactive-text)',
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
                aria-expanded={menuOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                }}
              >
                <span style={{ width: 20, height: 1.5, background: 'var(--color-bark)', borderRadius: 2, display: 'block', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'transform 250ms ease-out' }} />
                <span style={{ width: 20, height: 1.5, background: 'var(--color-bark)', borderRadius: 2, display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 250ms ease-out' }} />
                <span style={{ width: 20, height: 1.5, background: 'var(--color-bark)', borderRadius: 2, display: 'block', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'transform 250ms ease-out' }} />
              </button>
            )}

            {/* Shop now CTA */}
            <Link
              href="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-sage)',
                borderRadius: 100,
                padding: '12px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--color-interactive-text)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Pirkti dabar
            </Link>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          background: 'var(--color-cream)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 250ms ease-out',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              style={{
                fontFamily: "'Tomato Grotesk VF', 'DM Sans', sans-serif",
                fontSize: 'clamp(36px, 8vw, 64px)',
                color: 'var(--color-bark)',
                textDecoration: 'none',
                lineHeight: 1.15,
                display: 'block',
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: `color 150ms ease-out, transform 250ms ease-out ${i * 40}ms`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--color-muted-foreground)' }}>Pagaminta Vilniuje, Lietuvoje</span>
          <a
            href="mailto:hello@pawcharms.lt"
            tabIndex={menuOpen ? 0 : -1}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--color-muted-foreground)', textDecoration: 'none' }}
          >
            hello@pawcharms.lt
          </a>
        </div>
      </div>
    </>
  );
}
