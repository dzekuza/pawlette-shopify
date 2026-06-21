import Link from 'next/link';
import { DisplayHeading } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream font-sans flex flex-col items-center justify-center text-center px-6 py-8">
      <DisplayHeading as="h1" size="hero">
        404
      </DisplayHeading>
      <p className="text-bark text-lg mt-4 mb-8">
        Puslapis nerastas. Gal šuo jį suvalgė?
      </p>
      <PrimaryButton href="/" variant="sage">
        Grįžti į pradžią →
      </PrimaryButton>
    </main>
  );
}
