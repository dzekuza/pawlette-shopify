'use client';

import { FormEvent, useState } from 'react';

interface NewsletterResponse {
  code?: string;
  error?: string;
}

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus('error');
      setMessage('Įveskite el. pašto adresą.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json() as NewsletterResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Nepavyko užregistruoti el. pašto.');
      }

      setStatus('success');
      setMessage(data.code
        ? `Ačiū. Jūsų 10% nuolaidos kodas: ${data.code}`
        : 'Ačiū. Jūsų prenumerata patvirtinta.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Nepavyko užregistruoti el. pašto.');
    }
  }

  return (
    <section className="px-4 pb-6 md:px-6 md:pb-8">
      <div className="mx-auto max-w-[1200px] rounded-[32px] border border-sage/30 bg-[linear-gradient(135deg,rgba(168,213,162,0.18),rgba(184,216,244,0.22),rgba(244,181,192,0.14))] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-bark-muted">PawCharms naujienlaiškis</p>
          <h2 className="mb-3 font-display text-[clamp(30px,4vw,48px)] leading-[1.05] tracking-[0.02em] text-bark">
            Gaukite 10% nuolaidą pirmam užsakymui
          </h2>
          <p className="mx-auto mb-6 max-w-[620px] text-[15px] leading-[1.7] text-bark-muted md:text-[16px]">
            Prisijunkite prie PawCharms bendruomenės — naujienos, stilingos idėjos ir išskirtiniai pasiūlymai.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-[620px] flex-col gap-3 md:flex-row">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Jūsų el. paštas"
              className="min-h-[54px] flex-1 rounded-full border border-bark/10 bg-white/90 px-5 text-[15px] text-bark outline-none transition-colors placeholder:text-bark-muted focus:border-sage"
              aria-label="El. pašto adresas"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="min-h-[54px] rounded-full bg-sage px-7 text-[15px] font-medium text-interactive-text transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? 'Siunčiama...' : 'Prenumeruoti →'}
            </button>
          </form>

          {message ? (
            <p
              className="mt-4 text-[14px] leading-[1.6]"
              style={{ color: status === 'error' ? '#A64B4B' : 'var(--color-bark)' }}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
