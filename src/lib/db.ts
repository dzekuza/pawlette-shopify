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

export async function getLandingCollars(): Promise<LandingCollar[]> {
  const collars = await getCollars();
  return collars.map((c) => ({
    id: c.id,
    name: c.title,
    price: c.price,
    collarColor: c.color,
    bg: c.bgTint,
    image: '',
    desc: 'Waterproof silicone collar with snap-on charms.',
    charms: [
      { bg: '#A8D5A2', e: '🌿' },
      { bg: '#B8D8F4', e: '⭐' },
      { bg: '#F9E4A0', e: '☀️' },
      { bg: '#D4B8F4', e: '🌸' },
    ],
  }));
}
