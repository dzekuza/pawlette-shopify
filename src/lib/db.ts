import { getCollars, getLeashes } from './shopify';
import { getProductBySlugAsync, buildCollarProduct, buildGroupedLeashProduct, slugFromProductName, applyLocaleOverlay, type ProductDetail } from './catalog';
export type { ProductDetail };

export interface LandingCollar {
  id: string | number;
  slug: string;
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

const _productsCache = new Map<string, ProductDetail[]>();
const _productsInflight = new Map<string, Promise<ProductDetail[]>>();

export function getLandingProductsSync(locale: string = 'lt'): ProductDetail[] | null {
  return _productsCache.get(locale) ?? null;
}

export async function getLandingProducts(locale: string = 'lt'): Promise<ProductDetail[]> {
  const cached = _productsCache.get(locale);
  if (cached) return cached;

  let inflight = _productsInflight.get(locale);
  if (!inflight) {
    inflight = (async () => {
      const [collars, leashes, charmCollection] = await Promise.all([
        getCollars(),
        getLeashes(),
        getProductBySlugAsync('charm-charms', locale),
      ]);
      const collarProduct = collars[0] ? (() => {
        return buildCollarProduct(collars[0], {
          useParentMedia: true,
          slugOverride: collars[0].nodeHandle || collars[0].handle,
        }, locale)
      })() : null;
      const leashProduct = leashes.length > 0 ? (() => {
        const p = buildGroupedLeashProduct(leashes, locale)
        p.name = leashes[0].parentTitle
        p.slug = leashes[0].nodeHandle || leashes[0].handle
        p.parentHandle = leashes[0].nodeHandle
        // The grouped product built above overlaid the color-variant slug; now that
        // the slug has been rewritten to the parent nodeHandle, re-apply the overlay
        // so the landing card's generic "PawsCharm Leash" name/description win in English.
        return applyLocaleOverlay(p, locale)
      })() : null;
      const results = [collarProduct, leashProduct, charmCollection].filter((p): p is ProductDetail => !!p);
      _productsCache.set(locale, results);
      _productsInflight.delete(locale);
      return results;
    })();
    _productsInflight.set(locale, inflight);
  }
  return inflight;
}

export async function getLandingCollars(): Promise<LandingCollar[]> {
  if (_cache) return _cache;
  if (!_inflight) {
    _inflight = getCollars().then(collars => {
      _cache = collars.map((c) => ({
        id: c.id,
        slug: slugFromProductName(c.title),
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
