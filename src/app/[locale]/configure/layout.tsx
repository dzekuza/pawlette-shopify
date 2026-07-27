import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sukurk savo antkaklio rinkinį | PawCharms',
  description: 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui. Greitas pristatymas visoje Lietuvoje.',
  alternates: {
    canonical: 'https://pawscharm.com/configure',
  },
  openGraph: {
    title: 'Sukurk savo antkaklio rinkinį | PawCharms',
    description: 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui.',
    url: 'https://pawscharm.com/configure',
    images: [{ url: 'https://pawscharm.com/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
