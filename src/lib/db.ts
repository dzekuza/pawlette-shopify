import { getCollars } from './shopify';

export interface LandingCollar {
  id: string | number;
  name: string;
  price: string;
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

export async function getLandingCollars(): Promise<LandingCollar[]> {
  if (_cache) return _cache;
  if (!_inflight) {
    _inflight = getCollars().then(collars => {
      _cache = collars.map((c) => ({
        id: c.id,
        name: c.title,
        price: c.price,
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
