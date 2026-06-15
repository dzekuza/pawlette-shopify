'use client';

import { useState } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const CHARM_IMAGES = [
  '/charms/Flower_lavender.png',
  '/charms/Star_sage_green.png',
  '/charms/Star_pale_yellow.png',
  '/charms/Paw_blue.png',
  '/charms/Heart_pink.png'
] as const;

export function ExitModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <div className="fade-in" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(61,53,48,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="slide-up" onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 480, background: 'var(--color-cream)', borderRadius: 28, padding: isMobile ? '32px 24px' : '48px 44px', position: 'relative', boxShadow: '0 24px 80px rgba(61,53,48,0.2)' }}>
        <button onClick={onClose} className="btn-press" style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--color-muted-foreground)', lineHeight: 1, transition: 'transform 100ms ease-out' }}>×</button>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 28 }}>
          {CHARM_IMAGES.map((src, i) => (
            <img
              key={i}
              src={encodeURI(src)}
              alt=""
              aria-hidden="true"
              style={{
                width: 52, height: 52, objectFit: 'contain',
                animation: 'slideUp 300ms cubic-bezier(0.23, 1, 0.32, 1) both',
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {!sent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: 12 }}>Prieš išeinant</div>
              <h2 style={{ fontFamily: "'Tomato Grotesk VF', 'DM Sans', sans-serif", fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-bark)', lineHeight: 1.2, marginBottom: 12 }}>10 % nuolaida pirmajam antkakliui.</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'var(--color-bark-light)', lineHeight: 1.7 }}>Prisijunkite prie mūsų sąrašo ir nuolaidos kodą gaukite iškart. Jokio spamo — tik naujienos ir šunų turinys.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jusu@email.com"
                style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, boxSizing: 'border-box' as const, padding: '12px 16px', borderRadius: 100, border: '1.5px solid #E8E3DC', background: 'white', color: 'var(--color-bark)', outline: 'none', transition: 'border-color 150ms ease-out' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-sage)')}
                onBlur={e => (e.target.style.borderColor = '#E8E3DC')}
              />
              <button
                className="btn-press"
                onClick={() => email && setSent(true)}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, padding: '12px 22px', borderRadius: 100, border: 'none', background: 'var(--color-sage)', color: '#2a5a25', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'transform 100ms ease-out' }}>
                Gauti 10 % nuolaidą
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--color-muted-foreground)' }}>
              <span onClick={onClose} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Ne, mokėsiu pilną kainą</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <img
                src={encodeURI(CHARM_IMAGES[0])}
                alt=""
                aria-hidden="true"
                style={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </div>
            <h2 style={{ fontFamily: "'Tomato Grotesk VF', 'DM Sans', sans-serif", fontSize: 24, fontWeight: 400, color: 'var(--color-bark)', marginBottom: 10 }}>Jūs sąraše!</h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'var(--color-bark-light)', lineHeight: 1.7, marginBottom: 24 }}>Patikrinkite el. paštą — ten rasite 10 % nuolaidos kodą, galiojantį pirmajam užsakymui.</p>
            <button className="btn-press" onClick={onClose} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, padding: '12px 28px', borderRadius: 100, border: 'none', background: 'var(--color-sage)', color: '#2a5a25', cursor: 'pointer', transition: 'transform 100ms ease-out' }}>Pirkti dabar →</button>
          </div>
        )}
      </div>
    </div>
  );
}
