import { getCollars, getLeashes } from './shopify';
import { getProductBySlugAsync, buildCollarProduct, buildGroupedLeashProduct, type ProductDetail } from './catalog';
export type { ProductDetail };

export interface LandingCollar {
  id: string | number;
  name: string;
  price: string;
  originalPrice?: string;
  collarColor: string;
  bg: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  desc: string;
  charms: readonly { bg: string; e: string }[];
}

let _cache: LandingCollar[] | null = null;
let _inflight: Promise<LandingCollar[]> | null = null;

export function getLandingCollarsSync(): LandingCollar[] | null { return _cache; }

let _productsCache: ProductDetail[] | null = null;
let _productsInflight: Promise<ProductDetail[]> | null = null;

export function getLandingProductsSync(): ProductDetail[] | null { return _productsCache; }

export async function getLandingProducts(): Promise<ProductDetail[]> {
  if (_productsCache) return _productsCache;
  if (!_productsInflight) {
    _productsInflight = (async () => {
      const [collars, leashes, charmCollection] = await Promise.all([
        getCollars(),
        getLeashes(),
        getProductBySlugAsync('charm-charms'),
      ]);
      const collarProduct = collars[0] ? (() => {
        const p = buildCollarProduct(collars[0]);
        p.name = collars[0].parentTitle;
        return p;
      })() : null;
      const leashProduct = leashes.length > 0 ? buildGroupedLeashProduct(leashes) : null;
      const results = [collarProduct, charmCollection, leashProduct].filter((p): p is ProductDetail => !!p);
      _productsCache = results;
      _productsInflight = null;
      return results;
    })();
  }
  return _productsInflight;
}

export async function getLandingCollars(): Promise<LandingCollar[]> {
  if (_cache) return _cache;
  if (!_inflight) {
    _inflight = getCollars().then(collars => {
      _cache = collars.map((c) => ({
        id: c.id,
        name: c.parentTitle,
        price: c.price,
        originalPrice: c.originalPrice,
        collarColor: c.color,
        bg: c.bgTint,
        image: c.image,
        desc: 'Vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais.',
        charms: [
          { bg: '#A8D5A2', e: '🌿' },
          { bg: '#B8D8F4', e: '⭐' },
          { bg: '#F9E4A0', e: '☀️' },
          { bg: '#D4B8F4', e: '🌸' },
        ],
      }));
      return _cache;
    });
  }
  return _inflight;
}
