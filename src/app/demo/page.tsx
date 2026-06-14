import type { Metadata } from 'next';
import { FloatingHero } from "@/components/ui/hero-floating";

export const metadata: Metadata = {
  title: 'Demo',
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <main>
      <FloatingHero />
    </main>
  );
}
