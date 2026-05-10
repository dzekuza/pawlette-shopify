import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'PawCharms — Rankų darbo šunų antkakliai su keičiamais pakabukais',
    template: '%s | PawCharms',
  },
  description: 'Vandeniui atsparūs, personalizuojami šunų antkakliai su per 5 sekundes keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
  metadataBase: new URL('https://pawcharms.lt'),
  icons: {
    icon: '/pawcharmsfav.jpg',
    apple: '/pawcharmsfav.jpg',
  },
  openGraph: {
    images: [{ url: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', width: 1200, height: 630 }],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PawCharms',
  alternateName: 'Žavesys',
  url: 'https://pawcharms.lt',
  logo: 'https://pawcharms.lt/charm-z.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@pawcharms.lt',
    contactType: 'customer service',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vilnius',
    addressCountry: 'LT',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PawCharms',
  url: 'https://pawcharms.lt',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Caveat:wght@400;500&display=swap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {process.env.NODE_ENV === "development" && (
          <>
            <Script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
