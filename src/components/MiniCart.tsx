'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/data';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

interface MiniCartProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
  checkoutUrl?: string | null;
}

export function MiniCart({ items, onClose, onRemove, checkoutUrl }: MiniCartProps) {
  const total = items.length * 28;
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  };

  return (
    <>
      <div onClick={handleClose} className="fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      <div className={isClosing ? 'slide-cart-out' : 'slide-cart-in'} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 400,
        background: 'var(--color-cream)', zIndex: 401, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-bark)' }}>Jūsų krepšelis</div>
          <button
            onClick={handleClose}
            onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
            onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
            onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-bark-muted)', fontSize: 22, lineHeight: 1, transition: 'transform 120ms ease-out' }}
          >×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--color-bark-muted)', textAlign: 'center', paddingTop: 60 }}>Jūsų krepšelis tuščias.</div>
          ) : items.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid var(--color-border)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: item.collarBgTint || '#FAF0F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
                <div style={{ height: 8, borderRadius: 4, width: 44, background: item.collarColor }} />
                <div style={{ fontSize: 11, color: 'var(--color-bark-muted)' }}>
                  {item.charmIds.filter(Boolean).length} pakab.
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-bark)' }}>{item.collarName} rinkinys</div>
                <div style={{ fontSize: 12, color: 'var(--color-bark-muted)', marginTop: 2 }}>
                  {item.size.split(' ')[0]} · {item.charmIds.filter(Boolean).length} pakab.{item.engraving ? ` · "${item.engraving}"` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-bark)' }}>€28</div>
                <button
                  onClick={() => onRemove(i)}
                  onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
                  onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
                  onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--color-bark-muted)', transition: 'transform 120ms ease-out' }}
                >Pašalinti</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: 'var(--color-bark-muted)' }}>Tarpinė suma</span>
            <span style={{ fontSize: 14, color: 'var(--color-bark)', fontWeight: 500 }}>€{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: 'var(--color-bark-muted)' }}>Pristatymas</span>
            <span style={{ fontSize: 14, color: total >= 40 ? 'var(--color-sage)' : 'var(--color-bark)', fontWeight: 500 }}>
              {total >= 40 ? 'Nemokamas' : '€4.90'}
            </span>
          </div>
          <button
            onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
            onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
            onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
            onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
            style={{ width: '100%', fontSize: 15, fontWeight: 500, padding: '14px', borderRadius: 100, border: 'none', background: 'var(--color-sage)', color: 'var(--color-bark)', cursor: 'pointer', transition: 'transform 120ms ease-out' }}
          >
            Apmokėti — €{total >= 40 ? total : total + 4.9}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-bark-muted)', marginTop: 10 }}>Nemokamas grąžinimas · saugus atsiskaitymas</div>
        </div>
      </div>
    </>
  );
}
