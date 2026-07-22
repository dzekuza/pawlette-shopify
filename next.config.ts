import type { NextConfig } from "next";

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storeHostname = storeDomain
  ? storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  : undefined;

const OLD_TO_NEW_COLLAR_SLUGS: Record<string, string> = {
  'collar-melyna-collar': 'pawcharms-melynas-antkaklis',
  'collar-tamsiai-melyna-collar': 'pawcharms-tamsiai-melynas-antkaklis',
  'collar-geltona-collar': 'pawcharms-geltonas-antkaklis',
  'collar-rozine-collar': 'pawcharms-rozinis-antkaklis',
  'collar-violetine-collar': 'pawcharms-violetinis-antkaklis',
};

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.93'],
  async redirects () {
    return Object.entries(OLD_TO_NEW_COLLAR_SLUGS).map(([oldSlug, newSlug]) => ({
      source: `/products/${oldSlug}`,
      destination: `/products/${newSlug}`,
      permanent: true,
    }));
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      ...(storeHostname
        ? [{
            protocol: 'https' as const,
            hostname: storeHostname,
          }]
        : []),
    ],
  },
};

export default nextConfig;
