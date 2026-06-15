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
  // Letter charms — local fallbacks for letters without Shopify images
  'letter-a-yellow':         '/charms/A_yellow.png',
  'letter-b-pink':           '/charms/B_pink.png',
  'letter-c-blue':           '/charms/C.png',
  'letter-d-purple':         '/charms/D_purple.png',
  'letter-g-green':          '/charms/G_green.png',
  'letter-i-pink':           '/charms/I_pink.png',
  'letter-k-green':          '/charms/K_green.png',
  'letter-l-blue':           '/charms/L_blue.png',
  'letter-m-green':          '/charms/M_pale_green.png',
  'letter-n-yellow':         '/charms/N_yellow.png',
  'letter-o-purple':         '/charms/O_lavender.png',
  'letter-r-pink':           '/charms/R_pink.png',
  'letter-s-yellow':         '/charms/S_yellow.png',
  'letter-t-blue':           '/charms/T_light_blue.png',
  'letter-u-pink':           '/charms/I_pink.png',
  'letter-v-green':          '/charms/K_green.png',
  'letter-z-blue':           '/charms/Z.png',
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

// Resolves bg/category/color/baseTitle from variant title.
// Handles "Letter A - Blue", "Paw Charm - Blue", and legacy icon names.
function resolveCharmMeta(title: string): { bg: string; category: string; color: string; baseTitle: string } {
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
    return { bg: COLOR_BG[color] ?? '#B8D8F4', category: 'icon', color, baseTitle: iconColorMatch[1] };
  }
  const handle = title.toLowerCase().replace(/\s+/g, '-');
  const meta = CHARM_META[handle] ?? { bg: '#B8D8F4', category: 'icon' };
  return { ...meta, color: '', baseTitle: title };
}

function titleToHandle(title: string): string {
  return title.toLowerCase().replace(/\s*–\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// Letter charm products are separate products (one per letter) tagged "charms"
const LETTER_CHARMS_QUERY = `
  query GetLetterCharms {
    products(first: 50, query: "tag:charms") {
      edges {
        node {
          id
          title
          featuredImage { url }
          variants(first: 10) {
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
        const sharedMeta = {
          tags: (node.tags ?? []) as string[],
          description: meta('description') || undefined,
          features: meta('features') || undefined,
          set_includes: meta('set_includes') || undefined,
          care: meta('care') || undefined,
          shipping: meta('shipping') || undefined,
        };

        // If the product has a Color option, expand into one ShopifyCollar per color
        // so that slugs like collar-sage-collar still work with a single unified product.
        const colorValues = [...new Set(allVariants.map(v => v.color).filter(Boolean))];
        if (colorValues.length > 0) {
          return colorValues.map(colorName => {
            const colorVariants = allVariants.filter(v => v.color === colorName);
            const colorHex = COLLAR_COLOR_HEX[colorName.toLowerCase()] ?? '#A8D5A2';
            const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const collarHandle = `${colorSlug}-collar`;
            const collarTitle = `${colorName} Collar`;
            const firstColorVariant = colorVariants[0];
            const saleColorVariant = colorVariants.find(v => v.originalPrice) ?? firstColorVariant;
            return {
              id: collarHandle,
              handle: collarHandle,
              title: collarTitle,
              parentTitle: node.title,
              variantId: firstColorVariant?.id ?? '',
              price: firstColorVariant ? firstColorVariant.price : '€24.99',
              originalPrice: saleColorVariant?.originalPrice,
              color: colorHex,
              bgTint: hexToRgba(colorHex, 0.15),
              glowColor: hexToRgba(colorHex, 0.5),
              image: firstColorVariant?.image || (node.featuredImage?.url ?? ''),
              images: productImages,
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

      // Fetch icon charms from the main "Pawlette Charms" product
      const [charmsRes, letterRes] = await Promise.all([
        shopifyClient.request<ShopifyProductsResponse>(CHARMS_QUERY),
        shopifyClient.request<ShopifyProductsResponse>(LETTER_CHARMS_QUERY),
      ]);
      if (charmsRes.errors && letterRes.errors) return [];

      // Icon charms: only non-letter variants from the main product
      const iconCharms: ShopifyCharm[] = [];
      const mainProduct = charmsRes.data?.products.edges[0]?.node;
      if (mainProduct) {
        const productMeta = (key: string) =>
          mainProduct.metafields?.find((metafield) => metafield?.key === key)?.value;
        const productTitle = mainProduct.title ?? 'Charms';
        const productFeaturedImage = mainProduct.featuredImage?.url ?? '';
        const productDescriptionHtml = mainProduct.descriptionHtml ?? '';
        const rawDesc = productMeta('description');
        let productDescriptionPlain = '';
        if (rawDesc) {
          try { productDescriptionPlain = extractText(JSON.parse(rawDesc)).trim(); }
          catch { productDescriptionPlain = rawDesc; }
        }
        if (!productDescriptionPlain) {
          productDescriptionPlain = productDescriptionHtml.replace(/<[^>]*>/g, '').trim();
        }
        const allProductImages = (mainProduct.images?.edges ?? []).map(({ node: img }) => img.url);
        const variantImageUrls = new Set(
          mainProduct.variants.edges
            .map(({ node: v }) => v.image?.url).filter((u): u is string => Boolean(u))
            .map((u) => u.split('?')[0])
        );
        const productImages = allProductImages.filter(u => !variantImageUrls.has(u.split('?')[0]));

        const productFeaturedImageBase = productFeaturedImage.split('?')[0];
        for (const { node: variant } of mainProduct.variants.edges) {
          const { bg, category, color, baseTitle } = resolveCharmMeta(variant.title);
          if (category === 'letter') continue; // letter charms come from separate products
          const handle = titleToHandle(variant.title);
          const shopifyVariantImage = variant.image?.url;
          // Skip Shopify image if it's the same as the product featured image (no per-variant image set)
          const hasOwnImage = shopifyVariantImage && shopifyVariantImage.split('?')[0] !== productFeaturedImageBase;
          const localImage = CHARM_LOCAL_IMAGES[handle];
          iconCharms.push({
            id: handle,
            handle,
            title: variant.title,
            baseTitle,
            variantId: variant.id ?? '',
            price: formatEuroPrice(variant.price?.amount, '€4'),
            originalPrice:
              variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
                ? formatEuroPrice(variant.compareAtPrice.amount)
                : undefined,
            bg,
            category,
            color,
            image: (hasOwnImage ? shopifyVariantImage : null) || localImage || shopifyVariantImage || '',
            productImages,
            productFeaturedImage,
            productTitle,
            productDescription: productDescriptionPlain,
            description: rawDesc || undefined,
            care: productMeta('care') || undefined,
            shipping: productMeta('shipping') || undefined,
          });
        }
      }

      // Letter charms: one product per letter (A–Z), each with color variants.
      // Shopify titles are Lithuanian: "Raidės A pakabučiukas" with variants "Mėlyna", "Tamsiai mėlyna", etc.
      const letterCharms: ShopifyCharm[] = [];
      // Map Lithuanian variant color titles → English (used to build a stable handle + resolveCharmMeta key)
      const LT_COLOR_TO_EN: Record<string, string> = {
        'mėlyna': 'Blue',
        'tamsiai mėlyna': 'Dark Blue',
        'violetinė': 'Purple',
        'rožinė': 'Pink',
        'geltona': 'Yellow',
        'žalia': 'Green',
        'blue': 'Blue',
        'sky blue': 'Sky Blue',
        'dark blue': 'Dark Blue',
        'purple': 'Purple',
        'pink': 'Pink',
        'yellow': 'Yellow',
        'green': 'Green',
      };
      for (const { node: product } of (letterRes.data?.products.edges ?? [])) {
        const productFeaturedImage = product.featuredImage?.url ?? '';
        // Match "Letter A Charm" (English legacy) OR "Raidės A pakabučiukas" (Lithuanian)
        const letterExtract = product.title.match(
          /^(?:Letter\s+([A-Z])\s+Charm|Raidės\s+([A-ZĄČĘĖĮŠŲŪŽ])\s+pakabučiukas)$/i
        );
        if (!letterExtract) continue;
        const letter = (letterExtract[1] || letterExtract[2]).toUpperCase();

        for (const { node: variant } of product.variants.edges) {
          const englishColor = LT_COLOR_TO_EN[variant.title.toLowerCase()];
          if (!englishColor) continue; // skip unknown color variants
          // Build stable English title so resolveCharmMeta + CHARM_LOCAL_IMAGES keys work
          const charmTitle = `Letter ${letter} - ${englishColor}`;
          const { bg, category, color, baseTitle } = resolveCharmMeta(charmTitle);
          const handle = titleToHandle(charmTitle);
          letterCharms.push({
            id: handle,
            handle,
            title: charmTitle,
            baseTitle,
            variantId: variant.id ?? '',
            price: formatEuroPrice(variant.price?.amount, '€4'),
            originalPrice:
              variant.compareAtPrice?.amount && variant.price?.amount && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
                ? formatEuroPrice(variant.compareAtPrice.amount)
                : undefined,
            bg,
            category,
            color,
            image: variant.image?.url || CHARM_LOCAL_IMAGES[handle] || '',
            productImages: [],
            productFeaturedImage,
            productTitle: product.title,
            productDescription: '',
            description: undefined,
            care: undefined,
            shipping: undefined,
          });
        }
      }

      // Sort letter charms: A-Z then by color order
      const COLOR_ORDER = ['blue', 'dark-blue', 'purple', 'pink', 'yellow', 'green'];
      letterCharms.sort((a, b) => {
        const letterCmp = a.baseTitle.localeCompare(b.baseTitle);
        if (letterCmp !== 0) return letterCmp;
        return COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color);
      });

      const result = [...iconCharms, ...letterCharms];
      _charmsCache = result;
      _charmsCacheAt = Date.now();
      _charmsInflight = null;
      return result;
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
              image: firstColorVariant?.image || (node.featuredImage?.url ?? ''),
              images: productImages,
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
