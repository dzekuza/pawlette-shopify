import type { NextConfig } from "next";

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storeHostname = storeDomain
  ? storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.93'],
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
