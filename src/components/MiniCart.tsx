'use client';

import { CartItem } from '@/lib/data';

interface MiniCartProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
  checkoutUrl?: string | null;
}

export function MiniCart({ items, onClose, onRemove, checkoutUrl }: MiniCartProps) {
  const total = items.length * 28;

  return (
    <>
      <div onClick={onClose} className="fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      <div className="slide-cart-in" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 400,
        background: '#FAF7F2', zIndex: 401, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E8E3DC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#3D3530' }}>Jūsų krepšelis</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B948F', fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length === 0 ? (
            <div style={{ fontSize: 14, color: '#9B948F', textAlign: 'center', paddingTop: 60 }}>Jūsų krepšelis tuščias.</div>
          ) : items.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid #E8E3DC', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: item.collarBgTint || '#FAF0F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
                <div style={{ height: 8, borderRadius: 4, width: 44, background: item.collarColor }} />
                <div style={{ fontSize: 11, color: '#9B948F' }}>
                  {item.charmIds.filter(Boolean).length} pakab.
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#3D3530' }}>{item.collarName} rinkinys</div>
                <div style={{ fontSize: 12, color: '#9B948F', marginTop: 2 }}>
                  {item.size.split(' ')[0]} · {item.charmIds.filter(Boolean).length} pakab.{item.engraving ? ` · "${item.engraving}"` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#3D3530' }}>€28</div>
                <button onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#B0A8A2', fontFamily: "'DM Sans',sans-serif" }}>Pašalinti</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid #E8E3DC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: '#6B6460' }}>Tarpinė suma</span>
            <span style={{ fontSize: 14, color: '#3D3530', fontWeight: 500 }}>€{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: '#6B6460' }}>Pristatymas</span>
            <span style={{ fontSize: 14, color: total >= 40 ? '#A8D5A2' : '#3D3530', fontWeight: 500 }}>
              {total >= 40 ? 'Nemokamas' : '€4.90'}
            </span>
          </div>
          <button onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }} style={{ width: '100%', fontSize: 15, fontWeight: 500, padding: '14px', borderRadius: 100, border: 'none', background: '#A8D5A2', color: '#2a5a25', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            Apmokėti — €{total >= 40 ? total : total + 4.9}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#9B948F', marginTop: 10 }}>Nemokamas grąžinimas · saugus atsiskaitymas</div>
        </div>
      </div>
    </>
  );
}
