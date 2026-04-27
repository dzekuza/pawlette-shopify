import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2025-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

export interface ShopifyCollar {
  id: string;
  handle: string;
  title: string;
  variantId: string;
  price: string;
  color: string;
  bgTint: string;
  glowColor: string;
}

export interface ShopifyCharm {
  id: string;
  handle: string;
  title: string;
  variantId: string;
  price: string;
  bg: string;
  category: string;
  image: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const COLLARS_QUERY = `
  query GetCollars {
    products(first: 10, query: "product_type:collar") {
      edges {
        node {
          id
          handle
          title
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "color" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

const CHARMS_QUERY = `
  query GetCharms {
    products(first: 100, query: "product_type:charm") {
      edges {
        node {
          id
          handle
          title
          featuredImage { url }
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "bg" },
            { namespace: "pawlette", key: "category" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

export async function getCollars(): Promise<ShopifyCollar[]> {
  const { data, errors } = await shopifyClient.request(COLLARS_QUERY);
  if (errors || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.products.edges.map(({ node }: any) => {
    const colorMeta = node.metafields?.find((m: any) => m?.key === 'color');
    const color = colorMeta?.value ?? '#A8D5A2';
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.handle,
      handle: node.handle,
      title: node.title,
      variantId: variant?.id ?? '',
      price: variant ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€28',
      color,
      bgTint: hexToRgba(color, 0.15),
      glowColor: hexToRgba(color, 0.5),
    };
  });
}

export async function getCharms(): Promise<ShopifyCharm[]> {
  const { data, errors } = await shopifyClient.request(CHARMS_QUERY);
  if (errors || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.products.edges.map(({ node }: any) => {
    const bgMeta = node.metafields?.find((m: any) => m?.key === 'bg');
    const catMeta = node.metafields?.find((m: any) => m?.key === 'category');
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.handle,
      handle: node.handle,
      title: node.title,
      variantId: variant?.id ?? '',
      price: variant ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€6',
      bg: bgMeta?.value ?? '#B8D8F4',
      category: catMeta?.value ?? 'icon',
      image: node.featuredImage?.url ?? '',
    };
  });
}
