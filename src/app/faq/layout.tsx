import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dažniausiai užduodami klausimai apie šunų antkaklius',
  description: 'Dažniausiai užduodami klausimai apie PawCharms antkaklius, pakabukus, pristatymą ir grąžinimą.',
  alternates: { canonical: 'https://pawcharms.lt/faq' },
  openGraph: {
    title: 'Dažniausiai užduodami klausimai | PawCharms',
    description: 'Dažniausiai užduodami klausimai apie PawCharms antkaklius, pakabukus, pristatymą ir grąžinimą.',
    type: 'website',
    url: 'https://pawcharms.lt/faq',
    siteName: 'PawCharms',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
