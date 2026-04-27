'use client';

import { useState } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const HERO_CHARMS = [
  { bg: '#F4B5C0', e: '🌸' },
  { bg: '#A8D5A2', e: '🌿' },
  { bg: '#B8D8F4', e: '⭐' },
  { bg: '#F9E4A0', e: '☀️' },
  { bg: '#D4B8F4', e: '🦋' },
];

const BOLD_COLLARS = [
  { name: 'Blossom', color: '#F4B5C0', charms: [{ bg: '#A8D5A2', e: '🌿' }, { bg: '#B8D8F4', e: '⭐' }, { bg: '#D4B8F4', e: '🌸' }] },
  { name: 'Sage',    color: '#A8D5A2', charms: [{ bg: '#F4B5C0', e: '🌸' }, { bg: '#D4B8F4', e: '🦋' }, { bg: '#F9E4A0', e: '🍃' }] },
  { name: 'Sky',     color: '#B8D8F4', charms: [{ bg: '#D4B8F4', e: '💎' }, { bg: '#A8D5A2', e: '🌊' }, { bg: '#F4B5C0', e: '🐾' }] },
  { name: 'Honey',   color: '#F9E4A0', charms: [{ bg: '#F4B5C0', e: '🌻' }, { bg: '#A8D5A2', e: '🍀' }, { bg: '#D4B8F4', e: '⭐' }] },
];

function Pill({ children, onClick, variant = 'primary', size = 'md' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; size?: 'md' | 'lg';
}) {
  const [hov, setHov] = useState(false);
  const pad = size === 'lg' ? '14px 32px' : '11px 24px';
  const fs = size === 'lg' ? 15 : 14;
  const base = variant === 'primary'
    ? { background: hov ? '#8fc489' : '#A8D5A2', color: '#2a5a25', border: '2px solid transparent' }
    : { background: hov ? '#D4EDD1' : 'transparent', color: '#A8D5A2', border: '2px solid #A8D5A2' };
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="btn-press"
      style={{ fontFamily: "'DM Sans',sans-serif", fontSize: fs, fontWeight: 500, padding: pad, borderRadius: 100, cursor: 'pointer', transition: 'background-color 150ms ease-out, transform 100ms ease-out', ...base }}>
      {children}
    </button>
  );
}

export function HeroCream({ heroSize }: { heroSize: number }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [activeCharm, setActiveCharm] = useState(0);

  return (
    <section style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', padding: isMobile ? '100px 20px 60px' : '120px 40px 60px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B948F', marginBottom: 20 }}>Made in Lithuania · Handcrafted</div>
          <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: heroSize, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#3D3530', marginBottom: 28 }}>
            Waterproof.<br />Playful.<br />
            <span style={{ color: '#A8D5A2' }}>Yours.</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: '#6B6460', lineHeight: 1.7, maxWidth: 400, marginBottom: 40 }}>
            Snap on a charm, change your dog&apos;s look. Five seconds. That&apos;s it.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/products" style={{ textDecoration: 'none' }}><Pill size="lg">Shop collars</Pill></a>
            <Pill size="lg" variant="secondary">See all charms</Pill>
          </div>
          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            {[['€28', 'per collar set'], ['5 charms', 'included'], ['Free ship', 'over €40']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 22, fontWeight: 500, color: '#3D3530' }}>{v}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#9B948F', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 440, height: 420, borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
              <img
                src="/In_a_minimalist_style_a_delicate_pink_hzs32ACd.webp"
                alt="Blossom collar set"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: 16, right: 16, background: 'white', borderRadius: 20, padding: '4px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3a7a3a' }}>Waterproof</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  {HERO_CHARMS.map((c, i) => (
                    <div key={i} onClick={() => setActiveCharm(i)} style={{
                      width: i === activeCharm ? 52 : 38, height: i === activeCharm ? 52 : 38,
                      borderRadius: '50%', background: c.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: i === activeCharm ? 24 : 17,
                      boxShadow: i === activeCharm ? '0 6px 20px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      transition: 'box-shadow 200ms ease-out, width 200ms ease-out, height 200ms ease-out, font-size 200ms ease-out',
                    }}>{c.e}</div>
                  ))}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>Click a charm to try it on</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function HeroBold({ heroSize }: { heroSize: number }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [activeCollar, setActiveCollar] = useState(0);
  const c = BOLD_COLLARS[activeCollar];

  return (
    <section style={{ minHeight: '100vh', background: '#3D3530', display: 'flex', alignItems: 'center', padding: isMobile ? '100px 20px 60px' : '120px 40px 60px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, borderRadius: '50%', background: c.color, opacity: 0.18, transition: 'background-color 300ms ease-out' }} />
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center', position: 'relative' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B948F', marginBottom: 20 }}>Made in Lithuania · Handcrafted</div>
          <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: heroSize, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#FAF7F2', marginBottom: 28 }}>
            Snap it on.<br />Show it off.
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: 'rgba(250,247,242,0.65)', lineHeight: 1.7, maxWidth: 400, marginBottom: 40 }}>
            Waterproof dog collars with snap-on charms. Change your dog&apos;s look in five seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="/products" style={{ textDecoration: 'none' }}><Pill size="lg">Shop collars</Pill></a>
            <button className="btn-press"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 100, cursor: 'pointer', background: 'transparent', border: '2px solid rgba(250,247,242,0.3)', color: 'rgba(250,247,242,0.7)', transition: 'border-color 150ms ease-out, color 150ms ease-out, transform 100ms ease-out' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.7)'; e.currentTarget.style.color = '#FAF7F2'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.3)'; e.currentTarget.style.color = 'rgba(250,247,242,0.7)'; }}>
              See all charms
            </button>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)', marginBottom: 12 }}>Pick a collar</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {BOLD_COLLARS.map((col, i) => (
                <button key={i} onClick={() => setActiveCollar(i)} style={{
                  width: 36, height: 36, borderRadius: '50%', background: col.color, border: 'none', cursor: 'pointer',
                  outline: i === activeCollar ? '3px solid #FAF7F2' : '3px solid transparent',
                  outlineOffset: 3, transition: 'outline-color 150ms ease-out',
                }} />
              ))}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 420, height: 400, borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
              <img
                src="/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp"
                alt="Playful dog with collar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,53,48,0.75) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.6)', marginBottom: 10 }}>{c.name} collar set</div>
                <div style={{ height: 12, borderRadius: 6, width: 160, background: c.color, boxShadow: `0 4px 16px ${c.color}88`, transition: 'background-color 300ms ease-out', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  {c.charms.map((ch, i) => (
                    <div key={i} style={{ width: i === 1 ? 48 : 36, height: i === 1 ? 48 : 36, borderRadius: '50%', background: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? 24 : 17, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'background-color 300ms ease-out' }}>
                      {ch.e}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 500, color: '#FAF7F2' }}>€28 <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(250,247,242,0.55)' }}>· 5 charms incl.</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
