import type { Metadata } from 'next';
import { LandingPageV4 } from '@/components/LandingPageV4';

export const metadata: Metadata = {
  title: 'PawsCharm Core — Basepowercompany Reference Landing',
  description:
    'Vandeniui atsparus JAV BioThane® šuns antkaklis su 5 sekundžių Charm Lock™ vardo sistema.',
  robots: { index: false, follow: false },
};

export default function Landing4AliasPage() {
  return <LandingPageV4 />;
}
