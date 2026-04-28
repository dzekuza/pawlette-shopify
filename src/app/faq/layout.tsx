import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DUK',
  description: 'Dažniausiai užduodami klausimai apie PawCharms antkaklius, pakabukus, pristatymą ir grąžinimą.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
