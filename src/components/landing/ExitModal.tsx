'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getGaBrowserIds } from '@/components/shared/GoogleAnalytics';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography';

const PHOTO_SRC = '/hero-figma/bento-dog-leash-meadow.jpg';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterResponse {
  code?: string;
  error?: string;
}

export function ExitModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('landing.exitModal');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError(t('errorEmail'));
      return;
    }
    if (!consent) {
      setError(t('errorConsent'));
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const gaIds = await getGaBrowserIds();
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, consent: true, leadSource: 'exit_modal', gaClientId: gaIds?.clientId }),
      });
      const data = await response.json() as NewsletterResponse;
      if (!response.ok) throw new Error(data.error || t('errorGeneric'));
      setCode(data.code ?? '');
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fade-in fixed inset-0 z-[500] flex items-center justify-center bg-bark/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('heading')}
        className="slide-up relative w-[90vw] max-w-[480px] overflow-hidden rounded-[28px] bg-cream px-6 py-8 shadow-[0_24px_80px_-24px_rgba(61,53,48,0.35)] md:px-11 md:py-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="btn-press absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-bark transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="relative -mx-6 -mt-8 mb-6 h-44 md:-mx-11 md:-mt-12">
          <Image src={PHOTO_SRC} alt="" fill sizes="480px" className="object-cover" />
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <DisplayHeading as="h2" size="compact" className="text-bark">{t('sentHeading')}</DisplayHeading>
            <BodyCopy className="mb-3 text-[15px] text-bark-light md:text-[15px]">{code ? t('sentCodeDescription', { code }) : t('sentDescription')}</BodyCopy>
            <PrimaryButton variant="sage" size="lg" onClick={onClose}>{t('sentCta')}</PrimaryButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <DisplayHeading as="h2" size="compact" className="text-bark">{t('heading')}</DisplayHeading>
              <BodyCopy className="text-[15px] text-bark-light md:text-[15px]">{t('description')}</BodyCopy>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder={t('emailPlaceholder')}
                  aria-label={t('emailPlaceholder')}
                  aria-invalid={Boolean(error)}
                  className="h-12 min-w-0 flex-1 rounded-full border border-bark/10 bg-white px-5 text-[15px] text-bark outline-none transition-colors placeholder:text-bark-muted focus:border-sage aria-[invalid=true]:border-bark/40"
                />
                <PrimaryButton type="submit" variant="sage" size="lg" className="sm:shrink-0" disabled={submitting}>
                  {submitting ? t('submitting') : t('submit')}
                </PrimaryButton>
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-left text-[13px] leading-snug text-bark-light">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setError('');
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-interactive-text)]"
                />
                <span>{t('consent')}</span>
              </label>
              {error ? <p role="alert" className="m-0 text-center text-[13px] text-bark">{error}</p> : null}
              <button
                type="button"
                onClick={onClose}
                className="mx-auto text-[13px] text-bark-muted underline underline-offset-2 transition-colors hover:text-bark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t('declineCta')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
