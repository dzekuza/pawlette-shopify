export const SIZES = ['XS — 20–28 cm', 'S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'] as const;

export const REVIEWS = [
  { name: 'Laima K.', dog: 'Luna, Beagle',   rating: 5, text: 'The collar survived two months of swimming and mud walks. Zero smell, zero stains.' },
  { name: 'Marta S.', dog: 'Bruno, Golden',  rating: 5, text: "Charms really do snap on in seconds. I was skeptical but it's genuinely that fast." },
  { name: 'Rūta P.',  dog: 'Mochi, Shiba',  rating: 5, text: "Bought one, immediately ordered two more as gifts. Love that it's made in Lithuania." },
] as const;

export interface CartItem {
  collarId: string;
  collarName: string;
  collarColor: string;
  collarBgTint: string;
  collarVariantId: string;
  charmIds: (string | null)[];
  charmVariantIds: (string | null)[];
  size: string;
  engraving: string;
  extra?: boolean;
}

export const CHARM_POSITIONS = [
  { x: -170, y: -55 },
  { x: -90,  y: -115 },
  { x: 0,    y: -135 },
  { x: 90,   y: -115 },
  { x: 170,  y: -55 },
] as const;

export const FLOAT_DURATIONS = [3.8, 4.2, 3.5, 4.8, 3.2] as const;

export const LANDING_REVIEWS = [
  { name: 'Laima K.', dog: 'Luna (Beagle)', rating: 5, text: "Ordered the Sage set and my dog gets compliments every walk. The charms really do snap on in seconds — I was skeptical but it's genuinely that fast." },
  { name: 'Marta S.', dog: 'Bruno (Golden)', rating: 5, text: 'The collar survived two months of swimming, mud walks, and a particularly rough beach day. Zero smell, zero stains. Absolutely worth it.' },
  { name: 'Rūta P.', dog: 'Mochi (Shiba)', rating: 5, text: "Bought one, immediately ordered two more as gifts. The Blossom collar in particular is just gorgeous. Love that it's made in Lithuania." },
] as const;

export const TICKER_ITEMS = [
  '🐾 Laima from Vilnius just ordered the Blossom set',
  '⭐ Marta rated the Sage collar 5 stars',
  '💧 Bruno survived a lake swim — collar looks brand new',
  '🛍 Rūta ordered 3 sets as gifts',
  '🌸 Mochi is wearing the new Hibiscus charm',
  '🇱🇹 Just restocked — Honey set is back',
  '⚡ "Took literally 5 seconds to swap" — Jurgita K.',
  '🐕 Luna got 4 compliments on one walk',
] as const;
