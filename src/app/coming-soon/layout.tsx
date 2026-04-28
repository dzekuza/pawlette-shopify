import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Netrukus startuojame',
  description: 'Prisijunkite prie laukiančiųjų sąrašo ir pirmieji sužinokite, kada startuos PawCharms naujienos.',
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
