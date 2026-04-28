'use client';

import { useState, useEffect, useRef } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const PAWS = ['🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾'];

interface FloatingPaw {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotate: number;
}

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [paws, setPaws] = useState<FloatingPaw[]>([]);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const width = useWindowWidth() ?? 1200;
  const isMobile = width < 520;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setPaws(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 16 + Math.random() * 24,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        opacity: 0.06 + Math.random() * 0.1,
        rotate: Math.random() * 40 - 20,
      }))
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      inputRef.current?.focus();
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('success');
    setEmail('');
  }

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(110vh) rotate(var(--rot)); opacity: 0; }
          10%  { opacity: var(--op); }
          90%  { opacity: var(--op); }
          100% { transform: translateY(-12vh) rotate(calc(var(--rot) + 15deg)); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .paw-float {
          position: absolute;
          bottom: -10%;
          animation: floatUp linear infinite;
          pointer-events: none;
          user-select: none;
        }
        .animate-in-1 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.1s; }
        .animate-in-2 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.25s; }
        .animate-in-3 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.4s; }
        .animate-in-4 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.55s; }
        .animate-in-5 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.7s; }
        .tag-wiggle { animation: wiggle 2.5s ease-in-out infinite; display: inline-block; }
        .shimmer-btn {
          background: linear-gradient(
            90deg,
            var(--color-sage) 0%,
            #c8eac3 40%,
            var(--color-sage) 100%
          );
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
        .shimmer-btn:hover { animation-play-state: paused; }
        .input-shake {
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>

      <main
        style={{
          minHeight: '100dvh',
          background: 'var(--color-cream)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '40px 24px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Floating paws */}
        {mounted && paws.map((p) => (
          <span
            key={p.id}
            className="paw-float"
            style={{
              left: `${p.x}%`,
              fontSize: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ['--rot' as string]: `${p.rotate}deg`,
              ['--op' as string]: p.opacity,
            }}
          >
            {PAWS[p.id % PAWS.length]}
          </span>
        ))}

        {/* Decorative background blobs */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: 380, height: 380, borderRadius: '50%',
          background: 'var(--color-blossom)', opacity: 0.35,
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-80px',
          width: 320, height: 320, borderRadius: '50%',
          background: 'var(--color-sky)', opacity: 0.3,
          filter: 'blur(70px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '5%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'var(--color-honey)', opacity: 0.2,
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 560,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Tag badge */}
          <div className="animate-in-1" style={{ marginBottom: 24 }}>
            <span
              className="tag-wiggle"
              style={{
                display: 'inline-block',
                background: 'var(--color-bark)',
                color: 'var(--color-cream)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 18px',
                borderRadius: 999,
              }}
            >
              🐶 Netrukus startuojame
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-in-2"
            style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: 'clamp(52px, 10vw, 88px)',
              lineHeight: 1,
              color: 'var(--color-bark)',
              letterSpacing: '0.02em',
              margin: '0 0 12px',
            }}
          >
            PawCharms
          </h1>

          {/* Accent line */}
          <p
            className="animate-in-2"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(22px, 4vw, 30px)',
              color: 'var(--color-sage)',
              margin: '0 0 20px',
              lineHeight: 1.3,
              filter: 'drop-shadow(0 1px 0 rgba(61,53,48,0.12))',
            }}
          >
            kuriamas su meile ♡
          </p>

          {/* Description */}
          <p
            className="animate-in-3"
            style={{
              fontSize: 17,
              color: 'var(--color-bark)',
              opacity: 0.65,
              lineHeight: 1.65,
              margin: '0 auto 40px',
              maxWidth: 420,
            }}
          >
            Personalizuoti šunų antkakliai ir silikoniniai pakabukai šunims, kurie nusipelno daugiau nei įprasto aksesuaro.
            Baigiame paskutinius akcentus ir netrukus pakviesime jus vidun.
          </p>

          {/* Email form */}
          <form
            className="animate-in-4"
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 440,
              margin: '0 auto',
            }}
          >
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-bark)',
              opacity: 0.5,
              marginBottom: 2,
            }}>
              Sužinokite pirmieji
            </p>

            <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="jusu@elpastas.lt"
                disabled={status === 'loading' || status === 'success'}
                className={status === 'error' ? 'input-shake' : ''}
                style={{
                  flex: 1,
                  height: 52,
                  padding: '0 18px',
                  borderRadius: 14,
                  border: `2px solid ${status === 'error' ? '#e05c5c' : 'rgba(61,53,48,0.15)'}`,
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--color-bark)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  width: isMobile ? '100%' : undefined,
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={status !== 'success' ? 'shimmer-btn' : ''}
                style={{
                  height: 52,
                  padding: '0 26px',
                  borderRadius: 14,
                  border: 'none',
                  background: status === 'success' ? '#4caf7d' : undefined,
                  color: 'var(--color-bark)',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: status === 'loading' || status === 'success' ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s, background 0.3s',
                  opacity: status === 'loading' ? 0.7 : 1,
                  width: isMobile ? '100%' : undefined,
                  flexShrink: 0,
                }}
              >
                {status === 'loading' ? 'Saugome…' : status === 'success' ? '✓ Jūs sąraše!' : 'Praneškite man →'}
              </button>
            </div>

            {status === 'error' && (
              <p style={{ fontSize: 13, color: '#e05c5c', margin: 0, textAlign: 'left', paddingLeft: 4 }}>
                Įveskite galiojantį el. pašto adresą.
              </p>
            )}
            {status === 'success' && (
              <p style={{ fontSize: 13, color: '#4caf7d', margin: 0, textAlign: 'left', paddingLeft: 4 }}>
                Puiku! Atsiųsime jums žinutę, kai tik startuosime. 🎉
              </p>
            )}
          </form>

          {/* Social links */}
          <div className="animate-in-5" style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--color-bark)', opacity: 0.4 }}>Turite klausimų?</span>
            <a
              href="mailto:hello@pawcharms.lt"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                borderRadius: 999,
                border: '1.5px solid rgba(61,53,48,0.15)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-bark)',
                textDecoration: 'none',
                transition: 'background 0.15s, border-color 0.15s',
                background: 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--color-sage)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-sage)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(61,53,48,0.15)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16v12H4z"/><path d="m22 7-10 7L2 7"/>
              </svg>
              hello@pawcharms.lt
            </a>
          </div>

          {/* Bottom note */}
          <p
            className="animate-in-5"
            style={{
              marginTop: 48,
              fontSize: 12,
              color: 'var(--color-bark)',
              opacity: 0.3,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            © 2026 PawCharms · Vilnius, Lietuva
          </p>
        </div>
      </main>
    </>
  );
}
