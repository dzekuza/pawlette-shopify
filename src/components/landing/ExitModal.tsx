'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography';
import type { CharmSpec } from '@/lib/collar3d';

const Charm3DScene = dynamic(() => import('@/components/products/Charm3DScene'), { ssr: false });

const CHARM_3D_ITEMS: CharmSpec[] = [
  { meshKey: 'Flower', colour: '#D4B8F4', kind: 'icon' },
  { meshKey: 'Star', colour: '#A8D5A2', kind: 'icon' },
  { meshKey: 'Star', colour: '#F9E4A0', kind: 'icon' },
  { meshKey: 'Paw', colour: '#B8D8F4', kind: 'icon' },
  { meshKey: 'Heart', colour: '#F4B5C0', kind: 'icon' },
];

export function ExitModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <div className="fade-in bg-bark/50" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div className="slide-up" onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 480, background: 'var(--color-cream)', borderRadius: 28, padding: isMobile ? '32px 24px' : '48px 44px', position: 'relative', boxShadow: '0 24px 80px rgba(61,53,48,0.2)' }}>
        <button onClick={onClose} className="btn-press" style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--color-muted-foreground)', lineHeight: 1, transition: 'transform 100ms ease-out' }}>×</button>

        <div className="animate-levitate" style={{ width: '100%', maxWidth: 340, height: 130, margin: '0 auto 28px' }} aria-hidden="true">
          <Charm3DScene items={CHARM_3D_ITEMS} boundsMargin={1} autoRotate={false} />
        </div>

        {!sent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <Eyebrow className="mb-3">Prieš išeinant</Eyebrow>
              <DisplayHeading as="h2" size="compact" className="text-bark mb-3">10 % nuolaida pirmajam antkakliui.</DisplayHeading>
              <p style={{ fontSize: 15, color: 'var(--color-bark-light)', lineHeight: 1.7 }}>Prisijunkite prie mūsų sąrašo ir nuolaidos kodą gaukite iškart. Jokio spamo — tik naujienos ir šunų turinys.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jusu@email.com"
                style={{ flex: 1, fontSize: 14, boxSizing: 'border-box' as const, padding: '12px 16px', borderRadius: 100, border: '1.5px solid var(--color-border)', background: 'var(--color-cream)', color: 'var(--color-bark)', outline: 'none', transition: 'border-color 150ms ease-out' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-sage)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
              <button
                className="btn-press"
                onClick={() => email && setSent(true)}
                style={{ fontSize: 14, fontWeight: 500, padding: '12px 22px', borderRadius: 100, border: 'none', background: 'var(--color-sage)', color: 'var(--color-interactive-text)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'transform 100ms ease-out' }}>
                Gauti 10 % nuolaidą
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--color-muted-foreground)' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 12, color: 'var(--color-muted-foreground)', padding: 0 }}>Ne, mokėsiu pilną kainą</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div className="animate-levitate" style={{ width: 110, height: 110, margin: '0 auto 16px' }} aria-hidden="true">
              <Charm3DScene items={[CHARM_3D_ITEMS[4]]} boundsMargin={1} autoRotate={false} />
            </div>
            <DisplayHeading as="h2" size="compact" className="text-bark mb-2">Jūs sąraše!</DisplayHeading>
            <p style={{ fontSize: 15, color: 'var(--color-bark-light)', lineHeight: 1.7, marginBottom: 24 }}>Patikrinkite el. paštą — ten rasite 10 % nuolaidos kodą, galiojantį pirmajam užsakymui.</p>
            <button className="btn-press" onClick={onClose} style={{ fontSize: 14, fontWeight: 500, padding: '12px 28px', borderRadius: 100, border: 'none', background: 'var(--color-sage)', color: 'var(--color-interactive-text)', cursor: 'pointer', transition: 'transform 100ms ease-out' }}>Pirkti dabar →</button>
          </div>
        )}
      </div>
    </div>
  );
}
