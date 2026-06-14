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

// Local fallback images for charm variants (used when Shopify variant has no image)
const CHARM_LOCAL_IMAGES: Record<string, string> = {
  // Icon charms
  'paw-charm-blue':          '/charms/004_A_light_blue_paw_print_shaped_object_is_centrally_0i_pOMaJ Background Removed.png',
  'paw-charm-pink':          '/charms/005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ Background Removed.png',
  'paw-charm-green':         '/charms/001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d Background Removed.png',
  'heart-charm-pink':        '/charms/003_A_soft_pink_heart-shaped_object_is_presented_with_TtBIxLMs Background Removed.png',
  'heart-charm-blue':        '/charms/004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF Background Removed.png',
  'star-charm-yellow':       '/charms/002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC Background Removed.png',
  'star-charm-green':        '/charms/001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d Background Removed.png',
  'bow-charm-pink':          '/charms/005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ Background Removed.png',
  'bow-charm-blue':          '/charms/004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF Background Removed.png',
  'sun-charm-yellow':        '/charms/002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC Background Removed.png',
  'leaf-charm-green':        '/charms/008_In_a_minimalist_style_a_smooth_matte_sage_green_oqryxWtd Background Removed.png',
  'butterfly-charm-purple':  '/charms/010_A_smooth_matte_lavender_butterfly_shape_is_FjmwAp0n Background Removed.png',
  'mushroom-charm-pink':     '/charms/005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ Background Removed.png',
  'drop-charm-blue':         '/charms/004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF Background Removed.png',
  'flower-charm-purple':     '/charms/005_A_smooth_matte_lavender_flower-shaped_object_is_VsK9Nys5 Background Removed.png',
  // Letter charms
  'letter-a-blue':           '/charms/001_The_letter_C_is_rendered_in_a_soft_pastel_XpEQ8qyU Background Removed.png',
  'letter-b-pink':           '/charms/002_A_soft_plush_pink_letter_B_is_centrally_iHYYGQpJ Background Removed.png',
  'letter-c-blue':           '/charms/001_The_letter_C_is_rendered_in_a_soft_pastel_XpEQ8qyU Background Removed.png',
  'letter-d-purple':         '/charms/003_A_soft_purple_letter_D_is_presented_on_a_plain_cTsglZyk Background Removed.png',
  'letter-e-green':          '/charms/006_A_soft_muted_green_lowercase_letter_k_floats_VUpysPf Background Removed.png',
  'letter-g-purple':         '/charms/003_A_single_oversized_three-dimensional_letter_G_ISlrl-QI Background Removed.png',
  'letter-i-pink':           '/charms/002_A_soft_plush_pink_letter_B_is_centrally_iHYYGQpJ Background Removed.png',
  'letter-k-green':          '/charms/006_A_soft_muted_green_lowercase_letter_k_floats_VUpysPf Background Removed.png',
  'letter-l-blue':           '/charms/005_A_soft_blue_rounded_letter_L_is_centrally_BYREvDc Background Removed.png',
  'letter-m-green':          '/charms/004_A_smooth_rounded_letter_M_in_a_pale_green_hue_eS51RxOA Background Removed.png',
  'letter-n-yellow':         '/charms/007_A_soft_rounded_pale_yellow_letter_N_is_Ji0FDBaj Background Removed.png',
  'letter-o-purple':         '/charms/008_A_soft_matte_lavender_letter_O_is_centered_on_9kzmsGFR Background Removed.png',
  'letter-r-pink':           '/charms/007_A_large_rounded_pink_letter_R_is_presented_0sIURIE7 Background Removed.png',
  'letter-s-yellow':         '/charms/006_A_soft_matte_yellow_letter_S_stands_against_a_s0lt4jH Background Removed.png',
  'letter-t-blue':           '/charms/009_A_soft_light_blue_rounded_letter_T_is_UOMVagIa Background Removed.png',
  'letter-u-pink':           '/charms/007_A_large_rounded_pink_letter_R_is_presented_0sIURIE7 Background Removed.png',
  'letter-v-green':          '/charms/004_A_smooth_rounded_letter_M_in_a_pale_green_hue_eS51RxOA Background Removed.png',
  'letter-z-blue':           '/charms/005_A_soft_blue_rounded_letter_L_is_centrally_BYREvDc Background Removed.png',
};

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
  return title.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
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

      const result = data.products.edges.map(({ node }) => {
        const meta = (key: string) =>
          node.metafields?.find((metafield) => metafield?.key === key)?.value;
        const color = meta('color') ?? '#A8D5A2';
        const allVariants: ShopifyCollarVariant[] = node.variants.edges.map(({ node: variant }) => ({
          id: variant.id,
          title: variant.title,
          size: variant.selectedOptions?.find((option) => ['Size', 'Dydis'].includes(option.name))?.value ?? '',
          color: variant.selectedOptions?.find((option) => ['Colors', 'Color', 'Spalvos', 'Spalva'].includes(option.name))?.value ?? '',
          price: formatEuroPrice(variant.price?.amount, '€28'),
          originalPrice:
            variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
              ? formatEuroPrice(variant.compareAtPrice.amount)
              : undefined,
          image: variant.image?.url ?? '',
        }));
        const sizes = [...new Set(allVariants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        const firstVariant = allVariants[0];
        const saleVariant = allVariants.find(v => v.originalPrice) ?? firstVariant;
        return {
          id: node.handle,
          handle: node.handle,
          title: node.title,
          variantId: firstVariant?.id ?? '',
          price: firstVariant ? firstVariant.price : '€28',
          originalPrice: saleVariant?.originalPrice,
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
          price: formatEuroPrice(variant.price?.amount, '€6'),
          originalPrice:
            variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
              ? formatEuroPrice(variant.compareAtPrice.amount)
              : undefined,
          bg,
          category,
          color,
          image: variant.image?.url || CHARM_LOCAL_IMAGES[titleToHandle(variant.title)] || '',
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
