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
  originalPrice?: string;
  image?: string;
}

export interface ShopifyCollar {
  id: string;
  handle: string;
  title: string;
  parentTitle: string;
  variantId: string;
  price: string;
  originalPrice?: string;
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
  nodeHandle?: string;
  parentImage?: string;
  parentDescription?: string;
  socialVideos?: string[];
}

export interface ShopifyCharm {
  id: string;
  handle: string;
  title: string;
  baseTitle: string;
  variantId: string;
  price: string;
  originalPrice?: string;
  bg: string;
  category: string;
  /** 3D mesh shape key for icon charms with a Blender-authored model ("Heart", "Star", ...); undefined if none exists yet. */
  shape?: string;
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
  socialVideos?: string[];
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
  compareAtPrice?: {
    amount: string;
  } | null;
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

function formatEuroPrice(amount?: string | null, fallback = '') {
  if (!amount) return fallback;

  const parsed = parseFloat(amount);
  if (Number.isNaN(parsed)) return fallback;

  return `€${parsed.toFixed(0)}`;
}

function normalizeShopText(value?: string | null) {
  if (!value) return '';

  return value
    .replace(/\bPawlette\b/gi, 'PawCharms')
    .replace(/\bantkakli\b/gi, 'antkaklį')
    .replace(/\s+/g, ' ')
    .trim();
}

// The "custom.pawlette_social_video" metafield holds one video URL as a plain string
// (Single line text). Also handles a JSON array or comma-separated string, in case the
// definition is ever changed to a list type or multiple URLs are pasted into one field.
function parseVideoList(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string' && v.length > 0);
  } catch {
    // not JSON — fall through to comma-split
  }
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

const COLLARS_QUERY = `
  query GetCollars {
    products(first: 50, query: "product_type:collar") {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
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
                compareAtPrice { amount }
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
            { namespace: "pawlette", key: "shipping" },
            { namespace: "custom", key: "pawlette_social_video" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

// Local fallback images for charm variants (used when Shopify variant has no image).
// File contents verified by visual inspection — filenames do NOT reliably describe the image.
const CHARM_LOCAL_IMAGES: Record<string, string> = {
  // Icon charms — keys match titleToHandle(variant.title) from Shopify
  // "Blue Paw Charm" → "blue-paw-charm", "Green Star Charm" → "green-star-charm", etc.
  'blue-paw-charm':          '/charms/Paw_blue.png',
  'light-paw-charm':         '/charms/Paw_light_blue.png',
  'green-star-charm':        '/charms/Star_sage_green.png',
  'sage-leaf-charm':         '/charms/Star_sage_green.png',
  'sage-sun-charm':          '/charms/Star_sage_green.png',
  'pink-heart-charm':        '/charms/Heart_pink.png',
  'mini-heart-charm':        '/charms/Heart_pink_2.png',
  'pink-bow-charm':          '/charms/Heart_pink.png',
  'yellow-star-charm':       '/charms/Star_pale_yellow.png',
  'lavender-flower-charm':   '/charms/Flower_lavender.png',
  'butterfly-charm':         '/charms/Butterfly_lavender.png',
  'pink-mushroom-charm':     '/charms/Heart_pink_2.png',
  'blue-drop-charm':         '/charms/Paw_light_blue_2.png',
  // Current live product's shape charm variants — titleToHandle("Širdis – Rožinė") → "širdis-rožinė", etc.
  // Images from /collar-customiser/renders/charm_variants/ (3D renders, 2026-07)
  'širdis-mėlyna':                '/charms/Heart_blue.png',
  'širdis-tamsiai-mėlyna':        '/charms/Heart_dark-blue.png',
  'širdis-violetinė':             '/charms/Heart_purple.png',
  'širdis-rožinė':                '/charms/Heart_pink.png',
  'širdis-geltona':               '/charms/Heart_yellow.png',
  'gėlė-mėlyna':                  '/charms/Flower_blue.png',
  'gėlė-tamsiai-mėlyna':          '/charms/Flower_dark-blue.png',
  'gėlė-violetinė':               '/charms/Flower_purple.png',
  'gėlė-rožinė':                  '/charms/Flower_pink.png',
  'gėlė-geltona':                 '/charms/Flower_yellow.png',
  'žvaigždė-mėlyna':              '/charms/Star_blue.png',
  'žvaigždė-tamsiai-mėlyna':      '/charms/Star_dark-blue.png',
  'žvaigždė-violetinė':           '/charms/Star_purple.png',
  'žvaigždė-rožinė':              '/charms/Star_pink.png',
  'žvaigždė-geltona':             '/charms/Star_yellow.png',
  // Also handle "Paw Charm - Blue" style (iconColorMatch format)
  'paw-charm-blue':          '/charms/Paw_blue.png',
  'paw-charm-green':         '/charms/Star_sage_green.png',
  'heart-charm-pink':        '/charms/Heart_pink.png',
  'star-charm-yellow':       '/charms/Star_pale_yellow.png',
  'flower-charm-purple':     '/charms/Flower_lavender.png',
  // Lithuanian variant titles (Shopify uses em dash – which titleToHandle normalises to -)
  'letenėlės-pakabučiukas-mėlyna':     '/charms/Paw_blue.png',
  'letenėlės-pakabučiukas-rožinė':     '/charms/Heart_pink.png',
  'letenėlės-pakabučiukas-žalia':      '/charms/Star_sage_green.png',
  'širdutės-pakabučiukas-rožinė':      '/charms/Heart_pink.png',
  'širdutės-pakabučiukas-mėlyna':      '/charms/Paw_light_blue.png',
  'žvaigždutės-pakabučiukas-geltona':  '/charms/Star_pale_yellow.png',
  'žvaigždutės-pakabučiukas-žalia':    '/charms/Star_sage_green.png',
  'kaspino-pakabučiukas-rožinė':       '/charms/Heart_pink.png',
  'kaspino-pakabučiukas-mėlyna':       '/charms/Paw_light_blue.png',
  'saulutės-pakabučiukas-geltona':     '/charms/Star_pale_yellow.png',
  'lapelio-pakabučiukas-žalia':        '/charms/Star_sage_green.png',
  'drugelio-pakabučiukas-violetinė':   '/charms/Butterfly_lavender.png',
  'grybuko-pakabučiukas-rožinė':       '/charms/Heart_pink_2.png',
  'lašelio-pakabučiukas-mėlyna':       '/charms/Paw_light_blue_2.png',
  'gėlytės-pakabučiukas-violetinė':    '/charms/Flower_lavender.png',
  // Letena (Paw) × 5 colours — 3D renders from /collar-customiser/renders/charm_variants/ (2026-07)
  'letena-mėlyna':              '/charms/Paw_blue.png',
  'letena-tamsiai-mėlyna':      '/charms/Paw_dark-blue.png',
  'letena-violetinė':           '/charms/Paw_purple.png',
  'letena-rožinė':              '/charms/Paw_pink.png',
  'letena-geltona':             '/charms/Paw_yellow.png',
  // Letter charms — all A–Z × 5 colours, handle = titleToHandle("Letter X - Color")
  // e.g. "Letter A - Blue" → "letter-a-blue", "Letter A - Dark Blue" → "letter-a-dark-blue"
  'letter-a-blue':        '/charms/A_blue.png',
  'letter-a-dark-blue':   '/charms/A_dark-blue.png',
  'letter-a-purple':      '/charms/A_purple.png',
  'letter-a-pink':        '/charms/A_pink.png',
  'letter-a-yellow':      '/charms/A_yellow.png',
  'letter-b-blue':        '/charms/B_blue.png',
  'letter-b-dark-blue':   '/charms/B_dark-blue.png',
  'letter-b-purple':      '/charms/B_purple.png',
  'letter-b-pink':        '/charms/B_pink.png',
  'letter-b-yellow':      '/charms/B_yellow.png',
  'letter-c-blue':        '/charms/C_blue.png',
  'letter-c-dark-blue':   '/charms/C_dark-blue.png',
  'letter-c-purple':      '/charms/C_purple.png',
  'letter-c-pink':        '/charms/C_pink.png',
  'letter-c-yellow':      '/charms/C_yellow.png',
  'letter-d-blue':        '/charms/D_blue.png',
  'letter-d-dark-blue':   '/charms/D_dark-blue.png',
  'letter-d-purple':      '/charms/D_purple.png',
  'letter-d-pink':        '/charms/D_pink.png',
  'letter-d-yellow':      '/charms/D_yellow.png',
  'letter-e-blue':        '/charms/E_blue.png',
  'letter-e-dark-blue':   '/charms/E_dark-blue.png',
  'letter-e-purple':      '/charms/E_purple.png',
  'letter-e-pink':        '/charms/E_pink.png',
  'letter-e-yellow':      '/charms/E_yellow.png',
  'letter-f-blue':        '/charms/F_blue.png',
  'letter-f-dark-blue':   '/charms/F_dark-blue.png',
  'letter-f-purple':      '/charms/F_purple.png',
  'letter-f-pink':        '/charms/F_pink.png',
  'letter-f-yellow':      '/charms/F_yellow.png',
  'letter-g-blue':        '/charms/G_blue.png',
  'letter-g-dark-blue':   '/charms/G_dark-blue.png',
  'letter-g-purple':      '/charms/G_purple.png',
  'letter-g-pink':        '/charms/G_pink.png',
  'letter-g-yellow':      '/charms/G_yellow.png',
  'letter-h-blue':        '/charms/H_blue.png',
  'letter-h-dark-blue':   '/charms/H_dark-blue.png',
  'letter-h-purple':      '/charms/H_purple.png',
  'letter-h-pink':        '/charms/H_pink.png',
  'letter-h-yellow':      '/charms/H_yellow.png',
  'letter-i-blue':        '/charms/I_blue.png',
  'letter-i-dark-blue':   '/charms/I_dark-blue.png',
  'letter-i-purple':      '/charms/I_purple.png',
  'letter-i-pink':        '/charms/I_pink.png',
  'letter-i-yellow':      '/charms/I_yellow.png',
  'letter-j-blue':        '/charms/J_blue.png',
  'letter-j-dark-blue':   '/charms/J_dark-blue.png',
  'letter-j-purple':      '/charms/J_purple.png',
  'letter-j-pink':        '/charms/J_pink.png',
  'letter-j-yellow':      '/charms/J_yellow.png',
  'letter-k-blue':        '/charms/K_blue.png',
  'letter-k-dark-blue':   '/charms/K_dark-blue.png',
  'letter-k-purple':      '/charms/K_purple.png',
  'letter-k-pink':        '/charms/K_pink.png',
  'letter-k-yellow':      '/charms/K_yellow.png',
  'letter-l-blue':        '/charms/L_blue.png',
  'letter-l-dark-blue':   '/charms/L_dark-blue.png',
  'letter-l-purple':      '/charms/L_purple.png',
  'letter-l-pink':        '/charms/L_pink.png',
  'letter-l-yellow':      '/charms/L_yellow.png',
  'letter-m-blue':        '/charms/M_blue.png',
  'letter-m-dark-blue':   '/charms/M_dark-blue.png',
  'letter-m-purple':      '/charms/M_purple.png',
  'letter-m-pink':        '/charms/M_pink.png',
  'letter-m-yellow':      '/charms/M_yellow.png',
  'letter-n-blue':        '/charms/N_blue.png',
  'letter-n-dark-blue':   '/charms/N_dark-blue.png',
  'letter-n-purple':      '/charms/N_purple.png',
  'letter-n-pink':        '/charms/N_pink.png',
  'letter-n-yellow':      '/charms/N_yellow.png',
  'letter-o-blue':        '/charms/O_blue.png',
  'letter-o-dark-blue':   '/charms/O_dark-blue.png',
  'letter-o-purple':      '/charms/O_purple.png',
  'letter-o-pink':        '/charms/O_pink.png',
  'letter-o-yellow':      '/charms/O_yellow.png',
  'letter-p-blue':        '/charms/P_blue.png',
  'letter-p-dark-blue':   '/charms/P_dark-blue.png',
  'letter-p-purple':      '/charms/P_purple.png',
  'letter-p-pink':        '/charms/P_pink.png',
  'letter-p-yellow':      '/charms/P_yellow.png',
  'letter-q-blue':        '/charms/Q_blue.png',
  'letter-q-dark-blue':   '/charms/Q_dark-blue.png',
  'letter-q-purple':      '/charms/Q_purple.png',
  'letter-q-pink':        '/charms/Q_pink.png',
  'letter-q-yellow':      '/charms/Q_yellow.png',
  'letter-r-blue':        '/charms/R_blue.png',
  'letter-r-dark-blue':   '/charms/R_dark-blue.png',
  'letter-r-purple':      '/charms/R_purple.png',
  'letter-r-pink':        '/charms/R_pink.png',
  'letter-r-yellow':      '/charms/R_yellow.png',
  'letter-s-blue':        '/charms/S_blue.png',
  'letter-s-dark-blue':   '/charms/S_dark-blue.png',
  'letter-s-purple':      '/charms/S_purple.png',
  'letter-s-pink':        '/charms/S_pink.png',
  'letter-s-yellow':      '/charms/S_yellow.png',
  'letter-t-blue':        '/charms/T_blue.png',
  'letter-t-dark-blue':   '/charms/T_dark-blue.png',
  'letter-t-purple':      '/charms/T_purple.png',
  'letter-t-pink':        '/charms/T_pink.png',
  'letter-t-yellow':      '/charms/T_yellow.png',
  'letter-u-blue':        '/charms/U_blue.png',
  'letter-u-dark-blue':   '/charms/U_dark-blue.png',
  'letter-u-purple':      '/charms/U_purple.png',
  'letter-u-pink':        '/charms/U_pink.png',
  'letter-u-yellow':      '/charms/U_yellow.png',
  'letter-v-blue':        '/charms/V_blue.png',
  'letter-v-dark-blue':   '/charms/V_dark-blue.png',
  'letter-v-purple':      '/charms/V_purple.png',
  'letter-v-pink':        '/charms/V_pink.png',
  'letter-v-yellow':      '/charms/V_yellow.png',
  'letter-w-blue':        '/charms/W_blue.png',
  'letter-w-dark-blue':   '/charms/W_dark-blue.png',
  'letter-w-purple':      '/charms/W_purple.png',
  'letter-w-pink':        '/charms/W_pink.png',
  'letter-w-yellow':      '/charms/W_yellow.png',
  'letter-x-blue':        '/charms/X_blue.png',
  'letter-x-dark-blue':   '/charms/X_dark-blue.png',
  'letter-x-purple':      '/charms/X_purple.png',
  'letter-x-pink':        '/charms/X_pink.png',
  'letter-x-yellow':      '/charms/X_yellow.png',
  'letter-y-blue':        '/charms/Y_blue.png',
  'letter-y-dark-blue':   '/charms/Y_dark-blue.png',
  'letter-y-purple':      '/charms/Y_purple.png',
  'letter-y-pink':        '/charms/Y_pink.png',
  'letter-y-yellow':      '/charms/Y_yellow.png',
  'letter-z-blue':        '/charms/Z_blue.png',
  'letter-z-dark-blue':   '/charms/Z_dark-blue.png',
  'letter-z-purple':      '/charms/Z_purple.png',
  'letter-z-pink':        '/charms/Z_pink.png',
  'letter-z-yellow':      '/charms/Z_yellow.png',
};

// Static map from charm handle -> bg/category for legacy icon variants.
// `shape` is only set for icon charms with a matching Blender-authored 3D mesh
// (see charms.glb / collar-customiser/blender/export_glb.py) — every other icon
// charm still has no 3D representation and stays hidden from the 3D preview.
export const CHARM_META: Record<string, { bg: string; category: string; shape?: string }> = {
  'blue-paw-charm':        { bg: '#B8D8F4', category: 'icon', shape: 'Paw'    },
  'green-star-charm':      { bg: '#A8D5A2', category: 'icon', shape: 'Star'   },
  'sage-leaf-charm':       { bg: '#A8D5A2', category: 'icon'   },
  'lavender-flower-charm': { bg: '#D4B8F4', category: 'icon', shape: 'Flower' },
  'pink-heart-charm':      { bg: '#F4B5C0', category: 'icon', shape: 'Heart'  },
  'mini-heart-charm':      { bg: '#F4B5C0', category: 'icon', shape: 'Heart'  },
  'pink-bow-charm':        { bg: '#F4B5C0', category: 'icon'   },
  'sage-sun-charm':        { bg: '#A8D5A2', category: 'icon'   },
  'yellow-star-charm':     { bg: '#F9E4A0', category: 'icon', shape: 'Star'   },
  'light-paw-charm':       { bg: '#B8D8F4', category: 'icon', shape: 'Paw'    },
  'blue-drop-charm':       { bg: '#B8D8F4', category: 'icon'   },
  'butterfly-charm':       { bg: '#D4B8F4', category: 'icon'   },
  'pink-mushroom-charm':   { bg: '#F4B5C0', category: 'icon'   },
};

const COLOR_BG: Record<string, string> = {
  blue:         '#B8D8F4',
  'sky blue':   '#B8D8F4',
  'sky-blue':   '#B8D8F4',
  mėlyna:       '#B8D8F4',
  melyna:       '#B8D8F4',
  'dark blue':  '#6B9FD4',
  'dark-blue':  '#6B9FD4',
  'tamsiai mėlyna': '#6B9FD4',
  green:        '#A8D5A2',
  žalia:        '#A8D5A2',
  zalia:        '#A8D5A2',
  red:          '#F4B5C0',
  pink:         '#F4B5C0',
  rausva:       '#F4B5C0',
  rožinė:       '#F4B5C0',
  rozine:       '#F4B5C0',
  yellow:       '#F9E4A0',
  geltona:      '#F9E4A0',
  purple:       '#D4B8F4',
  violetinė:    '#D4B8F4',
  violetine:    '#D4B8F4',
};

// Maps an icon charm's base title (English or Lithuanian, singular/diminutive)
// to its 3D shape key, for charms that don't go through the CHARM_META handle
// lookup below (the newer "Style – Colour" variant titles never hit CHARM_META
// since their handle is built per-colour, not from a fixed legacy handle).
const SHAPE_FROM_BASE_TITLE: Array<[RegExp, string]> = [
  [/paw|letena|letenėl/iu, 'Paw'],
  [/star|žvaigžd/iu, 'Star'],
  [/heart|širdut|širdis/iu, 'Heart'],
  [/flower|gėlyt|gėlė/iu, 'Flower'],
];

function shapeFromBaseTitle(baseTitle: string): string | undefined {
  return SHAPE_FROM_BASE_TITLE.find(([re]) => re.test(baseTitle))?.[1];
}

// Resolves bg/category/color/baseTitle/shape from variant title.
// Handles "Letter A - Blue", "Paw Charm - Blue", and legacy icon names.
function resolveCharmMeta(title: string): { bg: string; category: string; color: string; baseTitle: string; shape?: string } {
  const letterMatch = title.match(/^((?:Letter|Raidė)\s+[A-ZĄČĘĖĮŠŲŪŽ])\s+[–-]\s+([\p{L}\s]+)$/iu);
  if (letterMatch) {
    const color = letterMatch[2].toLowerCase();
    return { bg: COLOR_BG[color] ?? '#B8D8F4', category: 'letter', color, baseTitle: letterMatch[1] };
  }
  if (/^(letter|raidė)\s+\w+\s+(charm|pakabukas)$/iu.test(title)) {
    return { bg: '#B8D8F4', category: 'letter', color: '', baseTitle: title };
  }
  const iconColorMatch = title.match(/^(.+?)\s+[–-]\s+([\p{L}\s]+)$/iu);
  if (iconColorMatch) {
    const color = iconColorMatch[2].toLowerCase();
    const baseTitle = iconColorMatch[1]
    return { bg: COLOR_BG[color] ?? '#B8D8F4', category: 'icon', color, baseTitle, shape: shapeFromBaseTitle(baseTitle) };
  }
  const handle = title.toLowerCase().replace(/\s+/g, '-');
  const meta = CHARM_META[handle] ?? { bg: '#B8D8F4', category: 'icon' };
  return { ...meta, color: '', baseTitle: title, shape: meta.shape ?? shapeFromBaseTitle(title) };
}

function titleToHandle(title: string): string {
  return title.toLowerCase().replace(/\s*–\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// All charms (shapes + letters, in every color) live as variants on one "PawCharms pakabučiai" product.
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
            { namespace: "pawlette", key: "shipping" },
            { namespace: "custom", key: "pawlette_social_video" }
          ]) {
            key
            value
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                selectedOptions { name value }
                image { url }
                price { amount }
                compareAtPrice { amount }
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

      // Hex colors for collar color names (used when a single product has a Color option)
      const COLLAR_COLOR_HEX: Record<string, string> = {
        sage:        '#A8D5A2',
        blossom:     '#F4B5C0',
        sky:         '#B8D8F4',
        honey:       '#F9E4A0',
        // English Shopify variant names
        'dark blue': '#6B9FD4',
        blue:        '#B8D8F4',
        pink:        '#F4B5C0',
        purple:      '#C3A8D5',
        yellow:      '#F9E4A0',
        // Lithuanian ASCII (no diacritics)
        'melyna':         '#B8D8F4',
        'tamsiai melyna': '#6B9FD4',
        'rozine':         '#F4B5C0',
        'geltona':        '#F9E4A0',
        'violetine':      '#C3A8D5',
        // Lithuanian with diacritics
        'mėlyna':         '#B8D8F4',
        'tamsiai mėlyna': '#6B9FD4',
        'rožinė':         '#F4B5C0',
        'violetinė':      '#C3A8D5',
      };

      // Masculine Lithuanian adjective forms (agreeing with "antkaklis") for slugs/titles —
      // Shopify's Color option stores the feminine form ("Mėlyna", matching "spalva"),
      // which doesn't grammatically agree with the masculine noun "antkaklis".
      // ASCII form is used for the URL slug; the diacritics form is used for display copy.
      const COLLAR_COLOR_ADJECTIVE: Record<string, string> = {
        sage: 'salotinis', blossom: 'rozinis', sky: 'melynas', honey: 'geltonas',
        'dark blue': 'tamsiai-melynas', blue: 'melynas', pink: 'rozinis', purple: 'violetinis', yellow: 'geltonas',
        melyna: 'melynas', 'tamsiai melyna': 'tamsiai-melynas', rozine: 'rozinis', geltona: 'geltonas', violetine: 'violetinis',
        mėlyna: 'melynas', 'tamsiai mėlyna': 'tamsiai-melynas', rožinė: 'rozinis', violetinė: 'violetinis',
      };
      const COLLAR_COLOR_ADJECTIVE_DISPLAY: Record<string, string> = {
        sage: 'Salotinis', blossom: 'Rožinis', sky: 'Mėlynas', honey: 'Geltonas',
        'dark blue': 'Tamsiai mėlynas', blue: 'Mėlynas', pink: 'Rožinis', purple: 'Violetinis', yellow: 'Geltonas',
        melyna: 'Mėlynas', 'tamsiai melyna': 'Tamsiai mėlynas', rozine: 'Rožinis', geltona: 'Geltonas', violetine: 'Violetinis',
        mėlyna: 'Mėlynas', 'tamsiai mėlyna': 'Tamsiai mėlynas', rožinė: 'Rožinis', violetinė: 'Violetinis',
      };

      const result = data.products.edges.flatMap(({ node }) => {
        const meta = (key: string) =>
          node.metafields?.find((metafield) => metafield?.key === key)?.value;
        const allVariants: ShopifyCollarVariant[] = node.variants.edges.map(({ node: variant }) => ({
          id: variant.id,
          title: variant.title,
          size: variant.selectedOptions?.find((option) => ['Size', 'Dydis'].includes(option.name))?.value ?? '',
          color: variant.selectedOptions?.find((option) => ['Colors', 'Color', 'Spalvos', 'Spalva'].includes(option.name))?.value ?? '',
          price: formatEuroPrice(variant.price?.amount, '€24.99'),
          originalPrice:
            variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
              ? formatEuroPrice(variant.compareAtPrice.amount)
              : undefined,
          image: variant.image?.url ?? '',
        }));
        const productImages = (node.images?.edges ?? []).map(({ node: image }) => image.url);
        const parentImage = node.featuredImage?.url ?? '';
        const parentDescription = normalizeShopText((node.descriptionHtml ?? '').replace(/<[^>]*>/g, ' '));
        const sharedMeta = {
          tags: (node.tags ?? []) as string[],
          description: meta('description') || undefined,
          features: meta('features') || undefined,
          set_includes: meta('set_includes') || undefined,
          care: meta('care') || undefined,
          shipping: meta('shipping') || undefined,
          socialVideos: parseVideoList(meta('pawlette_social_video')),
        };

        // If the product has a Color option, expand into one ShopifyCollar per color
        // so that slugs like collar-sage-collar still work with a single unified product.
        const colorValues = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        if (colorValues.length > 0) {
          return colorValues.map(colorName => {
            const colorVariants = allVariants.filter(v => v.color === colorName);
            const colorHex = COLLAR_COLOR_HEX[colorName.toLowerCase()] ?? '#A8D5A2';
            const colorKey = colorName.toLowerCase();
            const colorAdjective = COLLAR_COLOR_ADJECTIVE[colorKey]
              ?? colorKey.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const colorAdjectiveDisplay = COLLAR_COLOR_ADJECTIVE_DISPLAY[colorKey] ?? colorName;
            const collarHandle = `pawcharms-${colorAdjective}-antkaklis`;
            const collarTitle = `${colorAdjectiveDisplay} antkaklis`;
            const firstColorVariant = colorVariants[0];
            const saleColorVariant = colorVariants.find(v => v.originalPrice) ?? firstColorVariant;
            const colorImage = firstColorVariant?.image || node.featuredImage?.url || '';
            return {
              id: collarHandle,
              handle: collarHandle,
              title: collarTitle,
              parentTitle: node.title,
              nodeHandle: node.handle,
              parentImage,
              parentDescription,
              variantId: firstColorVariant?.id ?? '',
              price: firstColorVariant ? firstColorVariant.price : '€24.99',
              originalPrice: saleColorVariant?.originalPrice,
              color: colorHex,
              bgTint: hexToRgba(colorHex, 0.15),
              glowColor: hexToRgba(colorHex, 0.5),
              image: colorImage,
              images: [colorImage, ...productImages.filter((image) => image !== colorImage)].filter(Boolean),
              sizes: colorVariants.map(v => v.size).filter(Boolean),
              colors: [colorName],
              variants: colorVariants,
              ...sharedMeta,
            };
          });
        }

        // Fallback: single-color product (old setup with one product per collar color)
        const color = meta('color') ?? '#A8D5A2';
        const sizes = [...new Set(allVariants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        const firstVariant = allVariants[0];
        const saleVariant = allVariants.find(v => v.originalPrice) ?? firstVariant;
        return [{
          id: node.handle,
          handle: node.handle,
          title: node.title,
          parentTitle: node.title,
          variantId: firstVariant?.id ?? '',
          price: firstVariant ? firstVariant.price : '€24.99',
          originalPrice: saleVariant?.originalPrice,
          color,
          bgTint: hexToRgba(color, 0.15),
          glowColor: hexToRgba(color, 0.5),
          image: node.featuredImage?.url ?? '',
          images: productImages,
          sizes,
          colors,
          variants: allVariants,
          ...sharedMeta,
        }];
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
      const extractText = (node: RichTextNode | null | undefined): string => {
        if (!node) return '';
        if (typeof node.value === 'string') return node.value;
        if (Array.isArray(node.children)) return node.children.map(extractText).join(' ');
        return '';
      };

      // All charms (shapes + letters, every color) are variants on one product —
      // Style ("Letenėlės pakabučiukas" / "Raidė A" / ...) x Spalva (color) options.
      const { data, errors } = await shopifyClient.request<ShopifyProductsResponse>(CHARMS_QUERY);
      if (errors || !data) return [];

      const mainProduct = data.products.edges[0]?.node;
      if (!mainProduct) return [];

      const productMeta = (key: string) =>
        mainProduct.metafields?.find((metafield) => metafield?.key === key)?.value;
      const productTitle = mainProduct.title ?? 'Charms';
      const productFeaturedImage = mainProduct.featuredImage?.url ?? '';
      const productDescriptionHtml = mainProduct.descriptionHtml ?? '';
      const rawDesc = productMeta('description');
      let productDescriptionPlain = '';
      if (rawDesc) {
        try { productDescriptionPlain = normalizeShopText(extractText(JSON.parse(rawDesc))); }
        catch { productDescriptionPlain = normalizeShopText(rawDesc); }
      }
      if (!productDescriptionPlain) {
        productDescriptionPlain = normalizeShopText(productDescriptionHtml.replace(/<[^>]*>/g, ' '));
      }
      const allProductImages = (mainProduct.images?.edges ?? []).map(({ node: img }) => img.url);
      const variantImageUrls = new Set(
        mainProduct.variants.edges
          .map(({ node: v }) => v.image?.url).filter((u): u is string => Boolean(u))
          .map((u) => u.split('?')[0])
      );
      const productImages = allProductImages.filter(u => !variantImageUrls.has(u.split('?')[0]));

      // Map Lithuanian "Spalva" values → English (keeps resolveCharmMeta + CHARM_LOCAL_IMAGES keys stable for letters)
      const LT_COLOR_TO_EN: Record<string, string> = {
        'mėlyna': 'Blue',
        'tamsiai mėlyna': 'Dark Blue',
        'violetinė': 'Purple',
        'rožinė': 'Pink',
        'geltona': 'Yellow',
      };

      const charms: ShopifyCharm[] = [];
      for (const { node: variant } of mainProduct.variants.edges) {
        const style = variant.selectedOptions?.find((o) => o.name === 'Style')?.value ?? '';
        const spalva = variant.selectedOptions?.find((o) => o.name === 'Spalva')?.value ?? '';
        const isLetter = /^Raidė\s+[A-ZĄČĘĖĮŠŲŪŽ]$/iu.test(style);
        const title = isLetter
          ? `${style.replace(/^Raidė/i, 'Letter')} - ${LT_COLOR_TO_EN[spalva.toLowerCase()] ?? spalva}`
          : `${style} – ${spalva}`;

        const { bg, category, color, baseTitle, shape } = resolveCharmMeta(title);
        const handle = titleToHandle(title);
        const localImage = CHARM_LOCAL_IMAGES[handle];
        charms.push({
          id: handle,
          handle,
          title,
          baseTitle,
          variantId: variant.id ?? '',
          price: formatEuroPrice(variant.price?.amount, '€4'),
          originalPrice:
            variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
              ? formatEuroPrice(variant.compareAtPrice.amount)
              : undefined,
          bg,
          category,
          shape,
          color,
          image: variant.image?.url || localImage || '',
          productImages,
          productFeaturedImage,
          productTitle,
          productDescription: productDescriptionPlain,
          description: rawDesc || undefined,
          care: productMeta('care') || undefined,
          shipping: productMeta('shipping') || undefined,
          socialVideos: parseVideoList(productMeta('pawlette_social_video')),
        });
      }

      // Icon/shape charms first, then letters A–Z grouped by their color order.
      const COLOR_ORDER = ['blue', 'dark-blue', 'purple', 'pink', 'yellow', 'green'];
      charms.sort((a, b) => {
        if (a.category !== b.category) return a.category === 'icon' ? -1 : 1;
        if (a.category === 'icon') return 0;
        const letterCmp = a.baseTitle.localeCompare(b.baseTitle);
        if (letterCmp !== 0) return letterCmp;
        return COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color);
      });

      _charmsCache = charms;
      _charmsCacheAt = Date.now();
      _charmsInflight = null;
      return charms;
    })();
  }
  return _charmsInflight;
}

const LEASHES_QUERY = `
  query GetLeashes {
    products(first: 20, query: "product_type:leash") {
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
                compareAtPrice { amount }
                selectedOptions { name value }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "description" },
            { namespace: "pawlette", key: "features" },
            { namespace: "pawlette", key: "care" },
            { namespace: "pawlette", key: "shipping" },
            { namespace: "custom", key: "pawlette_social_video" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

let _leashesCacheAt = 0;
let _leashesCacheData: ShopifyCollar[] | null = null;
let _leashesCacheInflight: Promise<ShopifyCollar[]> | null = null;

export function getLeashesSync(): ShopifyCollar[] | null { return _leashesCacheData; }

export async function getLeashes(): Promise<ShopifyCollar[]> {
  if (_leashesCacheData && isFresh(_leashesCacheAt)) return _leashesCacheData;
  if (_leashesCacheData && !isFresh(_leashesCacheAt)) {
    _leashesCacheData = null;
    _leashesCacheInflight = null;
  }
  if (!_leashesCacheInflight) {
    _leashesCacheInflight = (async () => {
      const { data, errors } = await shopifyClient.request<ShopifyProductsResponse>(LEASHES_QUERY);
      if (errors || !data) return [];

      const LEASH_COLOR_HEX: Record<string, string> = {
        pink:        '#F4B5C0',
        purple:      '#C3A8D5',
        'dark blue': '#6B9FD4',
        blue:        '#B8D8F4',
        yellow:      '#F9E4A0',
        sage:        '#A8D5A2',
        blossom:     '#F4B5C0',
        sky:         '#B8D8F4',
        honey:       '#F9E4A0',
        // Lithuanian ASCII (no diacritics)
        'melyna':         '#B8D8F4',
        'tamsiai melyna': '#6B9FD4',
        'rozine':         '#F4B5C0',
        'geltona':        '#F9E4A0',
        'violetine':      '#C3A8D5',
        // Lithuanian with diacritics
        'mėlyna':         '#B8D8F4',
        'tamsiai mėlyna': '#6B9FD4',
        'rožinė':         '#F4B5C0',
        'violetinė':      '#C3A8D5',
      };

      const result = data.products.edges.flatMap(({ node }) => {
        const meta = (key: string) =>
          node.metafields?.find((metafield) => metafield?.key === key)?.value;
        const allVariants: ShopifyCollarVariant[] = node.variants.edges.map(({ node: variant }) => ({
          id: variant.id,
          title: variant.title,
          size: variant.selectedOptions?.find((o) => ['Size', 'Dydis'].includes(o.name))?.value ?? '',
          color: variant.selectedOptions?.find((o) => ['Color', 'Spalva', 'Colors', 'Spalvos'].includes(o.name))?.value ?? '',
          price: formatEuroPrice(variant.price?.amount, '€32.99'),
          originalPrice:
            variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
              ? formatEuroPrice(variant.compareAtPrice.amount)
              : undefined,
          image: variant.image?.url ?? '',
        }));
        const productImages = (node.images?.edges ?? []).map(({ node: img }) => img.url);
        const sharedMeta = {
          tags: (node.tags ?? []) as string[],
          description: meta('description') || undefined,
          features: meta('features') || undefined,
          care: meta('care') || undefined,
          shipping: meta('shipping') || undefined,
          socialVideos: parseVideoList(meta('pawlette_social_video')),
        };
        // Expand by color (same pattern as collars)
        const colorValues = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        if (colorValues.length > 0) {
          return colorValues.map(colorName => {
            const colorVariants = allVariants.filter(v => v.color === colorName);
            const colorHex = LEASH_COLOR_HEX[colorName.toLowerCase()] ?? '#A8D5A2';
            const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const leashHandle = `${colorSlug}-leash`;
            const firstColorVariant = colorVariants[0];
            const saleColorVariant = colorVariants.find(v => v.originalPrice) ?? firstColorVariant;
            const colorImage = firstColorVariant?.image || node.featuredImage?.url || '';
            return {
              id: leashHandle,
              handle: leashHandle,
              title: `${colorName} Leash`,
              parentTitle: node.title,
              nodeHandle: node.handle,
              variantId: firstColorVariant?.id ?? '',
              price: firstColorVariant ? firstColorVariant.price : '€32.99',
              originalPrice: saleColorVariant?.originalPrice,
              color: colorHex,
              bgTint: hexToRgba(colorHex, 0.15),
              glowColor: hexToRgba(colorHex, 0.5),
              image: colorImage,
              images: [colorImage, ...productImages.filter((image) => image !== colorImage)].filter(Boolean),
              sizes: [...new Set(colorVariants.map(v => v.size).filter(Boolean))],
              colors: [colorName],
              variants: colorVariants,
              ...sharedMeta,
            };
          });
        }
        // Fallback: no color option — single entry
        const firstVariant = allVariants[0];
        const saleVariant = allVariants.find(v => v.originalPrice) ?? firstVariant;
        const colorHex = LEASH_COLOR_HEX[firstVariant?.color?.toLowerCase() ?? ''] ?? '#A8D5A2';
        return [{
          id: node.handle,
          handle: node.handle,
          title: node.title,
          parentTitle: node.title,
          nodeHandle: node.handle,
          variantId: firstVariant?.id ?? '',
          price: firstVariant ? firstVariant.price : '€32.99',
          originalPrice: saleVariant?.originalPrice,
          color: colorHex,
          bgTint: hexToRgba(colorHex, 0.15),
          glowColor: hexToRgba(colorHex, 0.5),
          image: node.featuredImage?.url ?? '',
          images: productImages,
          sizes: [...new Set(allVariants.map(v => v.size).filter(Boolean))],
          colors: [...new Set(allVariants.map(v => v.color).filter(Boolean))],
          variants: allVariants,
          ...sharedMeta,
        }];
      });

      _leashesCacheData = result;
      _leashesCacheAt = Date.now();
      _leashesCacheInflight = null;
      return result;
    })();
  }
  return _leashesCacheInflight;
}

const COLLECTION_PRODUCT_HANDLES_QUERY = `
  query GetCollectionProductHandles($handle: String!) {
    collection(handle: $handle) {
      products(first: 50) {
        edges {
          node {
            handle
          }
        }
      }
    }
  }
`;

interface CollectionProductHandlesResponse {
  collection: { products: { edges: Array<{ node: { handle: string } }> } } | null;
}

const _collectionHandlesCache = new Map<string, { data: string[]; at: number }>();
const _collectionHandlesInflight = new Map<string, Promise<string[]>>();

// Lets merchants control which products appear (and in what order) in a storefront
// carousel purely from Shopify Admin, by adding/reordering products in a manual collection.
export async function getCollectionProductHandles(handle: string): Promise<string[]> {
  const cached = _collectionHandlesCache.get(handle);
  if (cached && isFresh(cached.at)) return cached.data;

  const inflight = _collectionHandlesInflight.get(handle);
  if (inflight) return inflight;

  const promise = (async () => {
    const { data, errors } = await shopifyClient.request<CollectionProductHandlesResponse>(
      COLLECTION_PRODUCT_HANDLES_QUERY,
      { variables: { handle } }
    );
    _collectionHandlesInflight.delete(handle);
    if (errors || !data?.collection) return [];

    const result = data.collection.products.edges.map(({ node }) => node.handle);
    _collectionHandlesCache.set(handle, { data: result, at: Date.now() });
    return result;
  })();

  _collectionHandlesInflight.set(handle, promise);
  return promise;
}
