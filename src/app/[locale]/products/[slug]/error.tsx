'use client';

import { useEffect } from 'react';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 text-center">
      <DisplayHeading as="h1" size="hero" className="text-bark">
        Kažkas nutiko
      </DisplayHeading>
      <BodyCopy className="text-bark mt-3 mb-7 max-w-md">
        Įvyko klaida. Bandykite dar kartą.
      </BodyCopy>
      <PrimaryButton onClick={reset} variant="sage">
        Bandyti dar kartą
      </PrimaryButton>
    </main>
  );
}

