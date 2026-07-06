import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Caveat } from 'next/font/google';
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PawCharms — Rankų darbo šunų antkakliai su keičiamais pakabukais',
    template: '%s | PawCharms',
  },
  description: 'Vandeniui atsparūs, personalizuojami šunų antkakliai su per 5 sekundes keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
  metadataBase: new URL('https://pawcharms.lt'),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
  alternateName: 'PawCharms',
  url: 'https://pawcharms.lt',
  logo: {
    '@type': 'ImageObject',
    url: 'https://pawcharms.lt/pawcharms.svg',
    width: 200,
    height: 60,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@pawcharms.lt',
    contactType: 'customer service',
    areaServed: ['LT', 'EU'],
    availableLanguage: ['Lithuanian', 'English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vilnius',
    addressCountry: 'LT',
  },
  foundingLocation: {
    '@type': 'Place',
    name: 'Vilnius, Lithuania',
  },
  description: 'Rankų darbo, vandeniui atsparūs silikoniniai šunų antkakliai su per 5 sekundes keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
  sameAs: [
    'https://www.instagram.com/pawcharms.lt',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PawCharms',
  url: 'https://pawcharms.lt',
  description: 'Vandeniui atsparūs, personalizuojami šunų antkakliai su per 5 sekundes keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
  inLanguage: 'lt',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://pawcharms.lt/products?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className={`${dmSans.variable} ${caveat.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/LuckiestGuy-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1754814685843543');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1754814685843543&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
