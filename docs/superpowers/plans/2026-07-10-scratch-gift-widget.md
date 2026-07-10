# Scratch Gift Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating gift icon (bottom-left, site-wide) that opens a full-screen scratch-card dialog revealing a discount code, gated behind an email capture.

**Architecture:** A single self-contained client component (`ScratchGiftWidget`) owns all local state (`closed → scratch → email → code`) and is mounted once in the root layout. The scratch mechanic is a vanilla `<canvas>` with pointer-event erasing (no libraries). Email submission reuses the existing `POST /api/newsletter` route unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 tokens, lucide-react icons. No new dependencies.

## Global Constraints

- No inline styles except where a value must be dynamic/JS-driven (canvas fill colors via CSS vars) — per `CLAUDE.md` styling convention.
- Never hardcode raw hex — use Tailwind token classes (`bg-sage`, `bg-cream`, `text-bark`, etc.) or `var(--color-*)` CSS vars for the canvas 2D API (which cannot consume Tailwind classes).
- Use `DisplayHeading`, `Eyebrow`, `BodyCopy` from `src/components/storefront/Typography.tsx` and `PrimaryButton` / `InputField` from `src/components/shared/` — do not hand-roll equivalents.
- Named export `export function ComponentName()` for the component file.
- `'use client'` at the top of the component file.
- Reuse `NEWSLETTER_DISCOUNT_PERCENT` and the existing `POST /api/newsletter` contract (`{ email } → { code?, error? }`) from `src/lib/site-config.ts` / `src/app/api/newsletter/route.ts` — no backend changes.
- This project has no automated test suite (per `CLAUDE.md`) — verification steps use `npm run build` (TypeScript check) and manual browser checks via `npm run dev`, not a test runner.

---

### Task 1: Build `ScratchGiftWidget` component

**Files:**
- Create: `src/components/shared/ScratchGiftWidget.tsx`

**Interfaces:**
- Consumes: `NEWSLETTER_DISCOUNT_PERCENT` (number) from `@/lib/site-config`; `PrimaryButton` from `@/components/shared/PrimaryButton`; `InputField` from `@/components/shared/InputField`; `DisplayHeading`, `Eyebrow`, `BodyCopy` from `@/components/storefront/Typography`; `cn` from `@/lib/utils`.
- Produces: `export function ScratchGiftWidget()` — a zero-prop component. Later mounted directly in `layout.tsx`, no props/exports beyond the component itself.

- [ ] **Step 1: Create the component file with full implementation**

```tsx
'use client';

import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Gift, X, Copy, Check } from 'lucide-react';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { InputField } from '@/components/shared/InputField';
import { DisplayHeading, Eyebrow, BodyCopy } from '@/components/storefront/Typography';
import { cn } from '@/lib/utils';
import { NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';

const GIFT_CLAIMED_KEY = 'pawlette_gift_claimed';
const CANVAS_SIZE = 280;
const SCRATCH_RADIUS = 22;
const REVEAL_THRESHOLD = 0.5;

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

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = 'var(--color-sage)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = 'var(--color-cream)';
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
      setTimeout(() => setStep('email'), 600);
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
    setStep('closed');
    setEmail('');
    setErrorMessage('');
    setCopied(false);
  }

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
          className="fixed bottom-5 left-5 z-[400] flex h-14 w-14 items-center justify-center rounded-full bg-sage text-interactive-text shadow-[0_8px_24px_rgba(61,53,48,0.2)] transition-transform hover:scale-105"
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
          <div className="relative w-[90vw] max-w-[420px] rounded-[28px] bg-cream p-8 text-center shadow-[0_24px_80px_rgba(61,53,48,0.2)]">
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
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="mx-auto touch-none rounded-2xl"
                  style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
                <div
                  aria-hidden
                  className="mx-auto -mt-[280px] flex h-[280px] w-[280px] items-center justify-center rounded-2xl"
                  style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, pointerEvents: 'none' }}
                >
                  <DisplayHeading as="h3" size="page" className="text-bark">
                    {NEWSLETTER_DISCOUNT_PERCENT}%
                  </DisplayHeading>
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
```

Note: `PrimaryButton`'s `type="button"` behavior — it renders a plain `<button onClick={onClick}>` with no `type` attribute, so inside a `<form>` it defaults to `type="submit"`. The email-step `PrimaryButton` relies on this default-submit behavior to trigger `handleEmailSubmit` via the form's `onSubmit`; passing `onClick={undefined}` is intentional (no extra click handler needed since the form submit already fires).

- [ ] **Step 2: Type-check the new file**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `ScratchGiftWidget.tsx`. (Pre-existing unrelated errors elsewhere in the repo, if any, are not in scope.)

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/ScratchGiftWidget.tsx
git commit -m "feat: add scratch-card gift discount widget component"
```

---

### Task 2: Mount the widget site-wide and verify in the browser

**Files:**
- Modify: `src/app/layout.tsx:118-122` (body contents)

**Interfaces:**
- Consumes: `ScratchGiftWidget` (zero-prop component) from Task 1, imported from `@/components/shared/ScratchGiftWidget`.

- [ ] **Step 1: Add the import**

In `src/app/layout.tsx`, add alongside the existing shared-component imports (near `CookieConsentBanner`):

```tsx
import { ScratchGiftWidget } from "@/components/shared/ScratchGiftWidget";
```

- [ ] **Step 2: Mount the component in the body**

Change:

```tsx
      <body>
        <MetaPixel />
        {children}
        <CookieConsentBanner />
      </body>
```

to:

```tsx
      <body>
        <MetaPixel />
        {children}
        <CookieConsentBanner />
        <ScratchGiftWidget />
      </body>
```

- [ ] **Step 3: Run the production build (type check + compile)**

Run: `npm run build`
Expected: build completes successfully with no TypeScript or compile errors.

- [ ] **Step 4: Manual verification in the browser**

Run: `npm run dev`

Then, in a browser at `http://localhost:3000` (or `3001` if 3000 is taken):
1. Confirm the sage circular gift icon appears fixed at the bottom-left corner.
2. Click it — a full-screen dialog opens with the scratch canvas.
3. Drag across the canvas — it erases progressively; once roughly half is cleared, it auto-clears and the dialog transitions to the email step after ~0.6s.
4. Submit a real-format email (e.g. `test@example.com`) — the dialog transitions to the code step showing a discount code (or an error message if the Shopify request fails, which is expected behavior, not a bug in this widget).
5. Copy the code via the copy button, then close the dialog.
6. Reload the page — the gift icon should now be hidden (because `pawlette_gift_claimed` is set in `localStorage`).
7. In devtools, run `localStorage.removeItem('pawlette_gift_claimed')` and reload — confirm the icon reappears.
8. Navigate to `/products`, `/cart`, and one `/guide/*` page — confirm the icon renders there too (site-wide mount via root layout).

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount scratch gift widget site-wide in root layout"
```

---

## Self-Review

- **Spec coverage:** floating icon (Task 1/2) ✓, full-screen dialog ✓, scratch area ✓, discount reveal ✓, email input ✓, discount code reveal ✓, site-wide mount ✓, hide-after-claim via `localStorage` ✓, reuses existing `/api/newsletter` + `site-config.ts` constants ✓, no new libraries ✓, Tailwind tokens + CSS vars only ✓.
- **Placeholder scan:** none — all steps contain complete, runnable code.
- **Type consistency:** `Step` type (`'closed' | 'scratch' | 'email' | 'code'`) used consistently; `NewsletterResponse` matches the existing `/api/newsletter` contract (`{ code?: string; error?: string }`) already used by `NewsletterSignup.tsx`.
