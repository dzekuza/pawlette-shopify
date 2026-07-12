import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Caveat } from 'next/font/google';
import { MetaPixel } from "@/components/shared/MetaPixel";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";
import { ScratchGiftWidget } from "@/components/shared/ScratchGiftWidget";
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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T6B2FJ5F';

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
        {/*
          Consent Mode v2 defaults — must be pushed to dataLayer before GTM
          boots below. GA4 itself is now configured as a tag inside the GTM
          container (not loaded directly here), so this only sets consent
          state; GoogleAnalytics calls gtag('consent','update', ...) on accept.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
        {/*
          Google Tag Manager — reuses the same dataLayer, so it inherits the
          Consent Mode v2 defaults set above and stays gated the same way.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
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
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            className="hidden"
          />
        </noscript>
        <MetaPixel />
        <GoogleAnalytics />
        {children}
        <CookieConsentBanner />
        <ScratchGiftWidget />
      </body>
    </html>
  );
}
