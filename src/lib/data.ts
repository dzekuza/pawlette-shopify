export const SIZES = ['S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'] as const;

export const REVIEWS = [
  { name: 'Laima K.', dog: 'Luna, Biglis',   rating: 5, text: 'Antkaklis atlaikė du mėnesius maudynių ir purvinų pasivaikščiojimų. Jokio kvapo, jokių dėmių.' },
  { name: 'Marta S.', dog: 'Bruno, Auksaspalvis retriveris',  rating: 5, text: 'Pakabukai tikrai prisitvirtina per kelias sekundes. Abejojau, bet tai iš tiesų taip greita.' },
  { name: 'Rūta P.',  dog: 'Mochi, Šiba inu',  rating: 5, text: 'Nusipirkau vieną ir iškart užsakiau dar du dovanoms. Patinka, kad gaminama Lietuvoje.' },
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
  { name: 'Laima K.', dog: 'Luna (Biglis)', rating: 5, text: 'Užsakiau Sage rinkinį ir mano šuo sulaukia komplimentų per kiekvieną pasivaikščiojimą. Pakabukai tikrai prisitvirtina per kelias sekundes.', avatar: '/testimonials/avatar-laima-luna.jpg' },
  { name: 'Marta S.', dog: 'Bruno (Auksaspalvis retriveris)', rating: 5, text: 'Antkaklis atlaikė du mėnesius maudynių, purvinų pasivaikščiojimų ir ypač audringą dieną paplūdimyje. Jokio kvapo, jokių dėmių.', avatar: '/testimonials/avatar-marta-bruno.jpg' },
  { name: 'Rūta P.', dog: 'Mochi (Šiba inu)', rating: 5, text: 'Nusipirkau vieną ir iškart užsakiau dar du dovanoms. Blossom antkaklis ypač gražus. Patinka, kad jis gaminamas Lietuvoje.', avatar: '/testimonials/avatar-ruta-mochi.jpg' },
] as const;

export const TICKER_ITEMS = [
  '🐾 Laima iš Vilniaus ką tik užsakė Blossom rinkinį',
  '⭐ Marta Sage antkakliui skyrė 5 žvaigždutes',
  '💧 Bruno išsimaudė ežere — antkaklis atrodo kaip naujas',
  '🛍 Rūta užsakė 3 rinkinius dovanoms',
  '🌸 Mochi šiandien segi naują Hibiscus pakabuką',
  '🇱🇹 Papildėme atsargas — Honey rinkinys vėl prekyboje',
  '⚡ „Pakeisti užtruko tiesiog 5 sekundes“ — Jurgita K.',
  '🐕 Luna per vieną pasivaikščiojimą sulaukė 4 komplimentų',
] as const;

// Collar size ranges by neck circumference (cm) — numeric twin of SIZES, used to
// map breed neck ranges onto S/M/L in /guide/antkakliu-dydziai-pagal-veisle.
export const COLLAR_SIZE_RANGES = [
  { size: 'S', min: 28, max: 36 },
  { size: 'M', min: 36, max: 44 },
  { size: 'L', min: 44, max: 52 },
] as const;

export type BreedGroup = 'small' | 'medium' | 'large';

export interface BreedNeckSize {
  slug: string;
  name: string;
  group: BreedGroup;
  neckMin: number;
  neckMax: number;
}

// Approximate adult neck circumference ranges (cm). Individual dogs vary a lot —
// the guide page always tells readers to measure their own dog.
export const BREED_NECK_SIZES: BreedNeckSize[] = [
  { slug: 'cihuahua', name: 'Čihuahua', group: 'small', neckMin: 18, neckMax: 25 },
  { slug: 'jorksyro-terjeras', name: 'Jorkšyro terjeras', group: 'small', neckMin: 20, neckMax: 28 },
  { slug: 'toy-pudelis', name: 'Toy pudelis', group: 'small', neckMin: 20, neckMax: 28 },
  { slug: 'pomeranijos-spicas', name: 'Pomeranijos špicas', group: 'small', neckMin: 20, neckMax: 30 },
  { slug: 'maltos-bisonas', name: 'Maltos bišonas', group: 'small', neckMin: 23, neckMax: 30 },
  { slug: 'miniatiurinis-taksas', name: 'Miniatiūrinis taksas', group: 'small', neckMin: 25, neckMax: 33 },
  { slug: 'si-tsu', name: 'Ši tsu', group: 'small', neckMin: 25, neckMax: 35 },
  { slug: 'miniatiurinis-pudelis', name: 'Miniatiūrinis pudelis', group: 'small', neckMin: 25, neckMax: 35 },
  { slug: 'dzeko-raselo-terjeras', name: 'Džeko Raselo terjeras', group: 'small', neckMin: 28, neckMax: 36 },
  { slug: 'vakaru-skotijos-baltasis-terjeras', name: 'Vakarų Škotijos baltasis terjeras', group: 'small', neckMin: 30, neckMax: 38 },
  { slug: 'kavalierius-karalius-karolis-spanielis', name: 'Kavalierius Karalius Karolis spanielis', group: 'small', neckMin: 30, neckMax: 38 },
  { slug: 'miniatiurinis-snauceris', name: 'Miniatiūrinis šnauceris', group: 'small', neckMin: 30, neckMax: 38 },
  { slug: 'mopsas', name: 'Mopsas', group: 'small', neckMin: 30, neckMax: 40 },
  { slug: 'taksas', name: 'Taksas', group: 'medium', neckMin: 30, neckMax: 40 },
  { slug: 'vipetas', name: 'Vipetas', group: 'medium', neckMin: 30, neckMax: 40 },
  { slug: 'basendzis', name: 'Basendžis', group: 'medium', neckMin: 33, neckMax: 40 },
  { slug: 'siba-inu', name: 'Šiba inu', group: 'medium', neckMin: 33, neckMax: 41 },
  { slug: 'prancuzu-buldogas', name: 'Prancūzų buldogas', group: 'medium', neckMin: 33, neckMax: 43 },
  { slug: 'biglis', name: 'Biglis', group: 'medium', neckMin: 33, neckMax: 43 },
  { slug: 'kokerspanielis', name: 'Kokerspanielis', group: 'medium', neckMin: 36, neckMax: 43 },
  { slug: 'didysis-pudelis', name: 'Didysis pudelis', group: 'medium', neckMin: 35, neckMax: 45 },
  { slug: 'velso-korgis', name: 'Velso korgis', group: 'medium', neckMin: 36, neckMax: 46 },
  { slug: 'borderkolis', name: 'Borderkolis', group: 'medium', neckMin: 38, neckMax: 48 },
  { slug: 'lietuvos-skalikas', name: 'Lietuvos skalikas', group: 'large', neckMin: 40, neckMax: 50 },
  { slug: 'australu-aviganis', name: 'Australų aviganis', group: 'large', neckMin: 40, neckMax: 50 },
  { slug: 'sibiro-haskis', name: 'Sibiro haskis', group: 'large', neckMin: 40, neckMax: 50 },
  { slug: 'dalmatinas', name: 'Dalmatinas', group: 'large', neckMin: 40, neckMax: 50 },
  { slug: 'labradoro-retriveris', name: 'Labradoro retriveris', group: 'large', neckMin: 45, neckMax: 55 },
  { slug: 'auksaspalvis-retriveris', name: 'Auksaspalvis retriveris', group: 'large', neckMin: 45, neckMax: 55 },
  { slug: 'samojedas', name: 'Samojedas', group: 'large', neckMin: 45, neckMax: 55 },
  { slug: 'bokseris', name: 'Bokseris', group: 'large', neckMin: 45, neckMax: 55 },
  { slug: 'vokieciu-aviganis', name: 'Vokiečių aviganis', group: 'large', neckMin: 45, neckMax: 60 },
  { slug: 'berno-zenenhundas', name: 'Berno zenenhundas', group: 'large', neckMin: 50, neckMax: 65 },
  { slug: 'rotveileris', name: 'Rotveileris', group: 'large', neckMin: 55, neckMax: 70 },
];
