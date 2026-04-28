import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

export interface ShopifyCollarVariant {
  id: string;
  title: string;
  size: string;
  color: string;
  price: string;
  image?: string;
}

export interface ShopifyCollar {
  id: string;
  handle: string;
  title: string;
  variantId: string;
  price: string;
  color: string;
  bgTint: string;
  glowColor: string;
  sizes: string[];
  image: string;
  images: string[];
  colors: string[];
  variants: ShopifyCollarVariant[];
  tags: string[];
  description?: string;
  features?: string;
  set_includes?: string;
  care?: string;
  shipping?: string;
}

export interface ShopifyCharm {
  id: string;
  handle: string;
  title: string;
  baseTitle: string;
  variantId: string;
  price: string;
  bg: string;
  category: string;
  color: string;
  image: string;
  productImages: string[];
  productFeaturedImage: string;
  productTitle: string;
  productDescription: string;
  description?: string;
  features?: string;
  care?: string;
  shipping?: string;
}

interface ShopifyMetafield {
  key: string;
  value: string;
}

interface ShopifySelectedOption {
  name: string;
  value: string;
}

interface ShopifyImageNode {
  url: string;
}

interface ShopifyVariantNode {
  id: string;
  title: string;
  price?: {
    amount: string;
  };
  selectedOptions?: ShopifySelectedOption[];
  image?: ShopifyImageNode;
}

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  tags?: string[];
  featuredImage?: ShopifyImageNode;
  images?: {
    edges: Array<{
      node: ShopifyImageNode;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariantNode;
    }>;
  };
  metafields?: Array<ShopifyMetafield | null>;
  descriptionHtml?: string;
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProductNode;
    }>;
  };
}

interface RichTextNode {
  value?: string;
  children?: RichTextNode[];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const COLLARS_QUERY = `
  query GetCollars {
    products(first: 50, query: "product_type:collar") {
      edges {
        node {
          id
          handle
          title
          tags
          featuredImage { url }
          images(first: 10) { edges { node { url } } }
          variants(first: 50) {
            edges {
              node {
                id
                title
                image { url }
                price { amount }
                selectedOptions { name value }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "color" },
            { namespace: "pawlette", key: "description" },
            { namespace: "pawlette", key: "features" },
            { namespace: "pawlette", key: "set_includes" },
            { namespace: "pawlette", key: "care" },
            { namespace: "pawlette", key: "shipping" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

// Static map from charm handle -> bg/category for legacy icon variants
export const CHARM_META: Record<string, { bg: string; category: string }> = {
  'blue-paw-charm':        { bg: '#B8D8F4', category: 'icon'   },
  'green-star-charm':      { bg: '#A8D5A2', category: 'icon'   },
  'sage-leaf-charm':       { bg: '#A8D5A2', category: 'icon'   },
  'lavender-flower-charm': { bg: '#D4B8F4', category: 'icon'   },
  'pink-heart-charm':      { bg: '#F4B5C0', category: 'icon'   },
  'mini-heart-charm':      { bg: '#F4B5C0', category: 'icon'   },
  'pink-bow-charm':        { bg: '#F4B5C0', category: 'icon'   },
  'sage-sun-charm':        { bg: '#A8D5A2', category: 'icon'   },
  'yellow-star-charm':     { bg: '#F9E4A0', category: 'icon'   },
  'light-paw-charm':       { bg: '#B8D8F4', category: 'icon'   },
  'blue-drop-charm':       { bg: '#B8D8F4', category: 'icon'   },
  'butterfly-charm':       { bg: '#D4B8F4', category: 'icon'   },
  'pink-mushroom-charm':   { bg: '#F4B5C0', category: 'icon'   },
};

const COLOR_BG: Record<string, string> = {
  blue:   '#B8D8F4',
  mėlyna: '#B8D8F4',
  melyna: '#B8D8F4',
  green:  '#A8D5A2',
  žalia:  '#A8D5A2',
  zalia:  '#A8D5A2',
  red:    '#F4B5C0',
  rausva: '#F4B5C0',
  rožinė: '#F4B5C0',
  rozine: '#F4B5C0',
  yellow: '#F9E4A0',
  geltona:'#F9E4A0',
  purple: '#D4B8F4',
  violetinė: '#D4B8F4',
  violetine: '#D4B8F4',
};

// Resolves bg/category/color/baseTitle from variant title.
// Handles "Letter A - Blue", "Paw Charm - Blue", and legacy icon names.
function resolveCharmMeta(title: string): { bg: string; category: string; color: string; baseTitle: string } {
  const letterMatch = title.match(/^((?:Letter|Raidė)\s+[A-ZĄČĘĖĮŠŲŪŽ])\s+-\s+([\p{L}\s]+)$/iu);
  if (letterMatch) {
    const color = letterMatch[2].toLowerCase();
    return { bg: COLOR_BG[color] ?? '#B8D8F4', category: 'letter', color, baseTitle: letterMatch[1] };
  }
  if (/^(letter|raidė)\s+\w+\s+(charm|pakabukas)$/iu.test(title)) {
    return { bg: '#B8D8F4', category: 'letter', color: '', baseTitle: title };
  }
  const iconColorMatch = title.match(/^(.+?)\s+-\s+([\p{L}\s]+)$/iu);
  if (iconColorMatch) {
    const color = iconColorMatch[2].toLowerCase();
    return { bg: COLOR_BG[color] ?? '#B8D8F4', category: 'icon', color, baseTitle: iconColorMatch[1] };
  }
  const handle = title.toLowerCase().replace(/\s+/g, '-');
  const meta = CHARM_META[handle] ?? { bg: '#B8D8F4', category: 'icon' };
  return { ...meta, color: '', baseTitle: title };
}

function titleToHandle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

const CHARMS_QUERY = `
  query GetCharms {
    products(first: 1, query: "product_type:charm") {
      edges {
        node {
          id
          title
          descriptionHtml
          featuredImage { url }
          images(first: 250) {
            edges { node { url } }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "description" },
            { namespace: "pawlette", key: "care" },
            { namespace: "pawlette", key: "shipping" }
          ]) {
            key
            value
          }
          variants(first: 200) {
            edges {
              node {
                id
                title
                image { url }
                price { amount }
              }
            }
          }
        }
      }
    }
  }
`;

let _collarsCache: ShopifyCollar[] | null = null;
let _collarsInflight: Promise<ShopifyCollar[]> | null = null;
let _collarsCacheAt = 0;

const CACHE_TTL_MS = process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000;

export function getCollarsSync(): ShopifyCollar[] | null { return _collarsCache; }

function isFresh(timestamp: number) {
  return Date.now() - timestamp < CACHE_TTL_MS;
}

export async function getCollars(): Promise<ShopifyCollar[]> {
  if (_collarsCache && isFresh(_collarsCacheAt)) return _collarsCache;
  if (_collarsCache && !isFresh(_collarsCacheAt)) {
    _collarsCache = null;
    _collarsInflight = null;
  }
  if (!_collarsInflight) {
    _collarsInflight = (async () => {
      const { data, errors } = await shopifyClient.request<ShopifyProductsResponse>(COLLARS_QUERY);
      if (errors || !data) return [];

      const result = data.products.edges.map(({ node }) => {
        const meta = (key: string) =>
          node.metafields?.find((metafield) => metafield?.key === key)?.value;
        const color = meta('color') ?? '#A8D5A2';
        const allVariants: ShopifyCollarVariant[] = node.variants.edges.map(({ node: variant }) => ({
          id: variant.id,
          title: variant.title,
          size: variant.selectedOptions?.find((option) => ['Size', 'Dydis'].includes(option.name))?.value ?? '',
          color: variant.selectedOptions?.find((option) => ['Colors', 'Color', 'Spalvos', 'Spalva'].includes(option.name))?.value ?? '',
          price: variant.price ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€28',
          image: variant.image?.url ?? '',
        }));
        const sizes = [...new Set(allVariants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        const firstVariant = allVariants[0];
        return {
          id: node.handle,
          handle: node.handle,
          title: node.title,
          variantId: firstVariant?.id ?? '',
          price: firstVariant ? firstVariant.price : '€28',
          color,
          bgTint: hexToRgba(color, 0.15),
          glowColor: hexToRgba(color, 0.5),
          image: node.featuredImage?.url ?? '',
          images: (node.images?.edges ?? []).map(({ node: image }) => image.url),
          sizes,
          colors,
          variants: allVariants,
          tags: (node.tags ?? []) as string[],
          description: meta('description') || undefined,
          features: meta('features') || undefined,
          set_includes: meta('set_includes') || undefined,
          care: meta('care') || undefined,
          shipping: meta('shipping') || undefined,
        };
      });
      _collarsCache = result;
      _collarsCacheAt = Date.now();
      _collarsInflight = null;
      return result;
    })();
  }
  return _collarsInflight;
}

let _charmsCache: ShopifyCharm[] | null = null;
let _charmsInflight: Promise<ShopifyCharm[]> | null = null;
let _charmsCacheAt = 0;

export function getCharmsSync(): ShopifyCharm[] | null { return _charmsCache; }

export async function getCharms(): Promise<ShopifyCharm[]> {
  if (_charmsCache && isFresh(_charmsCacheAt)) return _charmsCache;
  if (_charmsCache && !isFresh(_charmsCacheAt)) {
    _charmsCache = null;
    _charmsInflight = null;
  }
  if (!_charmsInflight) {
    _charmsInflight = (async () => {
      const { data, errors } = await shopifyClient.request<ShopifyProductsResponse>(CHARMS_QUERY);
      if (errors || !data) return [];

      const product = data.products.edges[0]?.node;
      if (!product) return [];

      const productMeta = (key: string) =>
        product.metafields?.find((metafield) => metafield?.key === key)?.value;
      const productTitle: string = product.title ?? 'Charms';
      const productFeaturedImage: string = product.featuredImage?.url ?? '';
      const productDescriptionHtml: string = product.descriptionHtml ?? '';
      const rawDesc = productMeta('description');
      // Shopify rich-text metafields are JSON — extract plain text recursively
      const extractText = (node: RichTextNode | null | undefined): string => {
        if (!node) return '';
        if (typeof node.value === 'string') return node.value;
        if (Array.isArray(node.children)) return node.children.map(extractText).join(' ');
        return '';
      };
      let productDescriptionPlain = '';
      if (rawDesc) {
        try { productDescriptionPlain = extractText(JSON.parse(rawDesc)).trim(); }
        catch { productDescriptionPlain = rawDesc; }
      }
      if (!productDescriptionPlain) {
        productDescriptionPlain = productDescriptionHtml.replace(/<[^>]*>/g, '').trim();
      }
      const productDescription = rawDesc || undefined;
      const productCare = productMeta('care') || undefined;
      const productShipping = productMeta('shipping') || undefined;
      const allProductImages: string[] = (product.images?.edges ?? []).map(({ node: image }) => image.url);
      const variantImageUrls = new Set(
        product.variants.edges
          .map(({ node: variant }) => variant.image?.url)
          .filter((url): url is string => Boolean(url))
          .map((url) => url.split('?')[0])
      );
      // Gallery images = product-level images that are NOT variant images (compare base URLs, ignore CDN query params)
      const productImages = allProductImages.filter(url => !variantImageUrls.has(url.split('?')[0]));

      const result = product.variants.edges.map(({ node: variant }) => {
        const { bg, category, color, baseTitle } = resolveCharmMeta(variant.title);
        return {
          id: titleToHandle(variant.title),
          handle: titleToHandle(variant.title),
          title: variant.title,
          baseTitle,
          variantId: variant.id ?? '',
          price: variant.price ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€6',
          bg,
          category,
          color,
          image: variant.image?.url ?? '',
          productImages,
          productFeaturedImage,
          productTitle,
          productDescription: productDescriptionPlain,
          description: productDescription,
          care: productCare,
          shipping: productShipping,
        };
      });
      _charmsCache = result;
      _charmsCacheAt = Date.now();
      _charmsInflight = null;
      return result;
    })();
  }
  return _charmsInflight;
}
