import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = locale === 'en' ? 'https://pawscharm.com/en/configure' : 'https://pawscharm.com/configure'

  return {
    title: 'Sukurk savo antkaklio rinkinį | PawCharms',
    description: 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui. Greitas pristatymas visoje Lietuvoje.',
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com/configure',
        en: 'https://pawscharm.com/en/configure',
      },
    },
    openGraph: {
      title: 'Sukurk savo antkaklio rinkinį | PawCharms',
      description: 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui.',
      url: canonical,
      images: [{ url: 'https://pawscharm.com/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
