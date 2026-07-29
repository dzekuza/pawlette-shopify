'use client';

import { useState, useEffect, useRef } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { cn } from '@/lib/utils';

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
            rgba(255, 255, 255, 0.45) 40%,
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

      <main className="font-sans min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden py-10 px-6">
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
        <div className="absolute top-[-120px] right-[-120px] w-[380px] h-[380px] rounded-full bg-blossom/35 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-80px] w-[320px] h-[320px] rounded-full bg-sky/30 blur-[70px] pointer-events-none" />
        <div className="absolute top-[40%] left-[5%] w-[200px] h-[200px] rounded-full bg-honey/20 blur-[60px] pointer-events-none" />

        {/* Card */}
        <div className="relative z-10 max-w-[560px] w-full text-center">
          {/* Tag badge */}
          <div className="animate-in-1 mb-6">
            <span className="tag-wiggle font-sans inline-block bg-bark text-cream text-[13px] font-semibold tracking-[0.12em] uppercase py-1.5 px-[18px] rounded-full">
              🐶 Netrukus startuojame
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-in-2 font-display text-[clamp(52px,10vw,88px)] leading-none text-bark tracking-[0.02em] mb-3">
            PawsCharm
          </h1>

          {/* Accent line */}
          <p className="animate-in-2 font-handwriting text-[clamp(22px,4vw,30px)] text-sage mb-5 leading-[1.3] drop-shadow-[0_1px_0_rgba(61,53,48,0.12)]">
            kuriamas su meile ♡
          </p>

          {/* Description */}
          <p className="animate-in-3 text-[17px] text-bark/65 leading-[1.65] mx-auto mb-10 max-w-[420px]">
            Personalizuoti šunų antkakliai ir silikoniniai pakabukai šunims, kurie nusipelno daugiau nei įprasto aksesuaro.
            Baigiame paskutinius akcentus ir netrukus pakviesime jus vidun.
          </p>

          {/* Email form */}
          <form
            className="animate-in-4 flex flex-col gap-3 max-w-[440px] w-full mx-auto"
            onSubmit={handleSubmit}
          >
            <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-bark opacity-50 mb-[2px]">
              Sužinokite pirmieji
            </p>

            <div className={cn("flex gap-2", isMobile ? "flex-col" : "flex-row")}>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="jusu@elpastas.lt"
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                  "font-sans flex-1 h-[52px] px-[18px] rounded-[14px] bg-white/75 backdrop-blur-[8px] text-[15px] text-bark outline-none transition-colors duration-200",
                  status === 'error' ? 'input-shake border-2 border-destructive' : 'border-2 border-bark/15',
                  isMobile && 'w-full'
                )}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                  "font-sans h-[52px] px-[26px] rounded-[14px] border-none text-[15px] font-bold text-bark whitespace-nowrap transition-all duration-300 shrink-0",
                  status === 'success' ? 'bg-sage text-interactive-text' : 'shimmer-btn',
                  status === 'loading' || status === 'success' ? 'cursor-default' : 'cursor-pointer',
                  status === 'loading' && 'opacity-70',
                  isMobile && 'w-full'
                )}
              >
                {status === 'loading' ? 'Saugome…' : status === 'success' ? '✓ Jūs sąraše!' : 'Praneškite man →'}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-[13px] text-destructive m-0 text-left pl-1">
                Įveskite galiojantį el. pašto adresą.
              </p>
            )}
            {status === 'success' && (
              <p className="text-[13px] text-interactive-text m-0 text-left pl-1">
                Puiku! Atsiųsime jums žinutę, kai tik startuosime. 🎉
              </p>
            )}
          </form>

          {/* Social links */}
          <div className="animate-in-5 mt-10 flex gap-4 justify-center items-center">
            <span className="text-[13px] text-bark opacity-40">Turite klausimų?</span>
            <a
              href="mailto:hello@pawscharm.com"
              className="flex items-center gap-1.5 py-1.5 px-4 rounded-full border border-bark/15 text-[13px] font-semibold text-bark no-underline transition-colors duration-150 bg-white/50 hover:bg-sage hover:border-sage"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16v12H4z"/><path d="m22 7-10 7L2 7"/>
              </svg>
              hello@pawscharm.com
            </a>
          </div>

          {/* Bottom note */}
          <p
            className="animate-in-5 font-sans"
            style={{
              marginTop: 48,
              fontSize: 12,
              color: 'var(--color-bark)',
              opacity: 0.3,
            }}
          >
            © 2026 PawsCharm · Vilnius, Lietuva
          </p>
        </div>
      </main>
    </>
  );
}
