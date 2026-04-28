import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Krepšelis',
  description: 'Peržiūrėkite pasirinktus PawCharms produktus prieš atsiskaitymą.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
