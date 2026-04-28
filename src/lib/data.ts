export const SIZES = ['XS — 20–28 cm', 'S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'] as const;

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
  { name: 'Laima K.', dog: 'Luna (Biglis)', rating: 5, text: 'Užsakiau Sage rinkinį ir mano šuo sulaukia komplimentų per kiekvieną pasivaikščiojimą. Pakabukai tikrai prisitvirtina per kelias sekundes.' },
  { name: 'Marta S.', dog: 'Bruno (Auksaspalvis retriveris)', rating: 5, text: 'Antkaklis atlaikė du mėnesius maudynių, purvinų pasivaikščiojimų ir ypač audringą dieną paplūdimyje. Jokio kvapo, jokių dėmių.' },
  { name: 'Rūta P.', dog: 'Mochi (Šiba inu)', rating: 5, text: 'Nusipirkau vieną ir iškart užsakiau dar du dovanoms. Blossom antkaklis ypač gražus. Patinka, kad jis gaminamas Lietuvoje.' },
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
