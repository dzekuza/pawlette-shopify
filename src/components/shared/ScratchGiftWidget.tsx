'use client';

import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Gift, X, Copy, Check } from 'lucide-react';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { InputField } from '@/components/shared/InputField';
import { DisplayHeading, Eyebrow, BodyCopy } from '@/components/storefront/Typography';
import { NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';

const GIFT_CLAIMED_KEY = 'pawlette_gift_claimed';
const CANVAS_SIZE = 280;
const SCRATCH_RADIUS = 32;
const REVEAL_THRESHOLD = 0.3;

type Step = 'closed' | 'scratch' | 'email' | 'code';

interface NewsletterResponse {
  code?: string;
  error?: string;
}

export function ScratchGiftWidget() {
  const [step, setStep] = useState<Step>('closed');
  const [hideIcon, setHideIcon] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const revealedRef = useRef(false);
  const sampleCounterRef = useRef(0);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (localStorage.getItem(GIFT_CLAIMED_KEY)) {
      setHideIcon(true);
    }
  }, []);

  useEffect(() => {
    if (step === 'closed') return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [step]);

  useEffect(() => {
    if (step !== 'scratch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    revealedRef.current = false;
    sampleCounterRef.current = 0;

    // Canvas fillStyle can't parse CSS var() — resolve the tokens to computed colors first.
    const rootStyles = getComputedStyle(document.documentElement);
    const coverBgColor = rootStyles.getPropertyValue('--color-surface-2').trim() || '#F3EDE6';
    const coverTextColor = rootStyles.getPropertyValue('--color-bark-muted').trim() || '#706B68';
    const borderColor = rootStyles.getPropertyValue('--color-bark-border').trim() || 'rgba(61, 53, 48, 0.15)';

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw background cover
    ctx.fillStyle = coverBgColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw a dashed border to look like a ticket coupon
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(16, 16, CANVAS_SIZE - 32, CANVAS_SIZE - 32);
    ctx.setLineDash([]); // Reset line dash
    
    // Draw text
    ctx.fillStyle = coverTextColor;
    ctx.font = '600 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Braukite čia 🎁', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
  }, [step]);

  function scratchAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CANVAS_SIZE;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    sampleCounterRef.current += 1;
    if (sampleCounterRef.current % 6 !== 0) return;

    const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4 * 8) {
      if (data[i] === 0) cleared += 1;
    }
    const sampledPixels = data.length / (4 * 8);
    const percentCleared = cleared / sampledPixels;

    if (percentCleared > REVEAL_THRESHOLD) {
      revealedRef.current = true;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      revealTimeoutRef.current = setTimeout(() => setStep('email'), 600);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true;
    scratchAt(event.clientX, event.clientY);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    scratchAt(event.clientX, event.clientY);
  }

  function handlePointerUp() {
    isDrawingRef.current = false;
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setErrorMessage('Įveskite el. pašto adresą.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = (await response.json()) as NewsletterResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Nepavyko užregistruoti el. pašto.');
      }

      setCode(data.code ?? '');
      localStorage.setItem(GIFT_CLAIMED_KEY, 'true');
      setStep('code');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nepavyko užregistruoti el. pašto.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyCode() {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function closeDialog() {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    setStep('closed');
    setEmail('');
    setErrorMessage('');
    setCopied(false);
  }

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (step === 'closed') return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDialog();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  if (hideIcon && step === 'closed') return null;

  return (
    <>
      {step === 'closed' ? (
        <button
          type="button"
          onClick={() => setStep('scratch')}
          aria-label="Atidaryti nuolaidos dovaną"
          className="fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] left-5 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-sage text-interactive-text shadow-[0_8px_24px_rgba(61,53,48,0.2)] transition-transform hover:scale-105 md:bottom-5"
        >
          <Gift className="h-6 w-6" />
        </button>
      ) : null}

      {step !== 'closed' ? (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center bg-bark/50 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div className="relative w-[90vw] max-w-[420px] rounded-[28px] bg-cream px-5 py-8 sm:p-8 text-center shadow-[0_24px_80px_rgba(61,53,48,0.2)]">
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Uždaryti"
              className="absolute right-5 top-5 text-bark-muted transition-colors hover:text-bark"
            >
              <X className="h-5 w-5" />
            </button>

            {step === 'scratch' ? (
              <>
                <Eyebrow className="mb-2">Jūsų dovana</Eyebrow>
                <DisplayHeading as="h2" size="compact" className="mb-4">
                  Nubraukite ir laimėkite nuolaidą
                </DisplayHeading>
                <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
                  <div
                    aria-hidden
                    className="absolute inset-0 z-0 flex items-center justify-center bg-sage"
                  >
                    <DisplayHeading as="h3" size="page" className="text-bark">
                      {NEWSLETTER_DISCOUNT_PERCENT}%
                    </DisplayHeading>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="absolute inset-0 z-10 touch-none cursor-pointer"
                    style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                  />
                </div>
              </>
            ) : null}

            {step === 'email' ? (
              <>
                <Eyebrow className="mb-2">Sveikiname!</Eyebrow>
                <DisplayHeading as="h2" size="compact" className="mb-2">
                  Jūs laimėjote {NEWSLETTER_DISCOUNT_PERCENT}% nuolaidą
                </DisplayHeading>
                <BodyCopy className="mb-6">
                  Įveskite savo el. paštą ir gaukite unikalų nuolaidos kodą.
                </BodyCopy>
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <InputField
                    label="El. paštas"
                    type="email"
                    autoComplete="email"
                    placeholder="jusu@pastas.lt"
                    value={email}
                    onChange={setEmail}
                    disabled={submitting}
                  />
                  {errorMessage ? (
                    <p className="text-[13px] text-[#A64B4B]">{errorMessage}</p>
                  ) : null}
                  <PrimaryButton variant="sage" size="md" fullWidth onClick={undefined}>
                    {submitting ? 'Siunčiama...' : 'Gauti kodą'}
                  </PrimaryButton>
                </form>
              </>
            ) : null}

            {step === 'code' ? (
              <>
                <Eyebrow className="mb-2">Jūsų kodas</Eyebrow>
                <DisplayHeading as="h2" size="compact" className="mb-4">
                  Naudokite šį kodą apmokėjimo metu
                </DisplayHeading>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="mx-auto mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-sage bg-surface-2 px-6 py-4 font-display text-[22px] tracking-[0.08em] text-bark transition-colors hover:bg-sage/20"
                >
                  {code || '—'}
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
                <PrimaryButton variant="dark" size="md" fullWidth onClick={closeDialog}>
                  Uždaryti
                </PrimaryButton>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
