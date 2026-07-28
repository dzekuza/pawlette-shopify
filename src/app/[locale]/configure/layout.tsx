import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = locale === 'en' ? 'https://pawscharm.com/en/configure' : 'https://pawscharm.com/configure'

  // Root layout's `title.template` ('%s | PawsCharm') already appends the
  // brand suffix to this value — don't include " | PawsCharm" here too, or
  // <title> renders it twice. openGraph.title bypasses that template, so it
  // gets the suffix added explicitly below instead.
  const title = locale === 'en' ? 'Build Your Collar Set' : 'Sukurk savo antkaklio rinkinį'
  const description = locale === 'en'
    ? "Choose your collar color, charms, and size — build a unique set for your dog. Fast shipping across the EU."
    : 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui. Greitas pristatymas visoje Lietuvoje.'
  const ogDescription = locale === 'en'
    ? "Choose your collar color, charms, and size — build a unique set for your dog."
    : 'Pasirink antkaklio spalvą, pakabukus ir dydį — sukurk unikalų rinkinį savo šuniui.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com/configure',
        en: 'https://pawscharm.com/en/configure',
        'x-default': 'https://pawscharm.com/configure',
      },
    },
    openGraph: {
      title: `${title} | PawsCharm`,
      description: ogDescription,
      url: canonical,
      images: [{ url: 'https://pawscharm.com/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
