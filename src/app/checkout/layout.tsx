import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atsiskaitymas',
  description: 'Užbaikite PawCharms užsakymą saugioje Shopify atsiskaitymo aplinkoje.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
