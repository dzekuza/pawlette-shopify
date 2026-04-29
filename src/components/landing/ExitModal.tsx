'use client';

import { useState } from 'react';

const CHARM_IMAGES = [
  '/charms/005_A_smooth_matte_lavender_flower-shaped_object_is_VsK9Nys5 Background Removed.png',
  '/charms/001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d Background Removed.png',
  '/charms/002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC Background Removed.png',
  '/charms/004_A_light_blue_paw_print_shaped_object_is_centrally_0i_pOMaJ Background Removed.png',
  '/charms/003_A_soft_pink_heart-shaped_object_is_presented_with_TtBIxLMs Background Removed.png'
] as const;

export function ExitModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="fade-in" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(61,53,48,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="slide-up" onClick={e => e.stopPropagation()} style={{ width: 480, background: '#FAF7F2', borderRadius: 28, padding: '48px 44px', position: 'relative', boxShadow: '0 24px 80px rgba(61,53,48,0.2)' }}>
        <button onClick={onClose} className="btn-press" style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#9B948F', lineHeight: 1, transition: 'transform 100ms ease-out' }}>×</button>

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
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B948F', marginBottom: 12 }}>Prieš išeinant</div>
              <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', color: '#3D3530', lineHeight: 1.2, marginBottom: 12 }}>10 % nuolaida pirmajam antkakliui.</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#6B6460', lineHeight: 1.7 }}>Prisijunkite prie mūsų sąrašo ir nuolaidos kodą gaukite iškart. Jokio spamo — tik naujienos ir šunų turinys.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jusu@email.com"
                style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, boxSizing: 'border-box' as const, padding: '12px 16px', borderRadius: 100, border: '1.5px solid #E8E3DC', background: 'white', color: '#3D3530', outline: 'none', transition: 'border-color 150ms ease-out' }}
                onFocus={e => (e.target.style.borderColor = '#A8D5A2')}
                onBlur={e => (e.target.style.borderColor = '#E8E3DC')}
              />
              <button
                className="btn-press"
                onClick={() => email && setSent(true)}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, padding: '12px 22px', borderRadius: 100, border: 'none', background: '#A8D5A2', color: '#2a5a25', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'transform 100ms ease-out' }}>
                Gauti 10 % nuolaidą
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#9B948F' }}>
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
            <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 24, fontWeight: 400, color: '#3D3530', marginBottom: 10 }}>Jūs sąraše!</h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#6B6460', lineHeight: 1.7, marginBottom: 24 }}>Patikrinkite el. paštą — ten rasite 10 % nuolaidos kodą, galiojantį pirmajam užsakymui.</p>
            <button className="btn-press" onClick={onClose} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, padding: '12px 28px', borderRadius: 100, border: 'none', background: '#A8D5A2', color: '#2a5a25', cursor: 'pointer', transition: 'transform 100ms ease-out' }}>Pirkti dabar →</button>
          </div>
        )}
      </div>
    </div>
  );
}
