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
