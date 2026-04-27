export const COLLARS = [
  { id: 'blossom', name: 'Blossom', color: '#F4B5C0', bgTint: 'rgba(244,181,192,0.15)', glowColor: 'rgba(244,181,192,0.5)' },
  { id: 'sage',    name: 'Sage',    color: '#A8D5A2', bgTint: 'rgba(168,213,162,0.15)', glowColor: 'rgba(168,213,162,0.5)' },
  { id: 'sky',     name: 'Sky',     color: '#B8D8F4', bgTint: 'rgba(184,216,244,0.15)', glowColor: 'rgba(184,216,244,0.5)' },
  { id: 'honey',   name: 'Honey',   color: '#F9E4A0', bgTint: 'rgba(249,228,160,0.15)', glowColor: 'rgba(249,228,160,0.5)' },
] as const;

export type Collar = typeof COLLARS[number];

export const ALL_CHARMS = [
  { id: 'c1',  bg: '#B8D8F4', e: '✨', name: 'Charm 1',  category: 'letter', image: '/charms/009_A_soft_light_blue_rounded_letter_T_is_UOMVagIa Background Removed.png' },
  { id: 'c2',  bg: '#D4B8F4', e: '✨', name: 'Charm 2',  category: 'letter', image: '/charms/003_A_soft_purple_letter_D_is_presented_on_a_plain_cTsglZyk Background Removed.png' },
  { id: 'c3',  bg: '#B8D8F4', e: '✨', name: 'Charm 3',  category: 'icon',   image: '/charms/010_A_stylized_blue_paw_print_is_centrally_positioned_l1z-Lcyk Background Removed.png' },
  { id: 'c4',  bg: '#A8D5A2', e: '✨', name: 'Charm 4',  category: 'icon',   image: '/charms/001_In_a_3D_render_style_a_large_rounded_light_rJitw6c9 Background Removed.png' },
  { id: 'c5',  bg: '#A8D5A2', e: '✨', name: 'Charm 5',  category: 'letter', image: '/charms/006_A_soft_muted_green_lowercase_letter_k_floats_VUpysPf Background Removed.png' },
  { id: 'c6',  bg: '#D4B8F4', e: '✨', name: 'Charm 6',  category: 'letter', image: '/charms/008_A_soft_matte_lavender_letter_O_is_centered_on_9kzmsGFR Background Removed.png' },
  { id: 'c7',  bg: '#F4B5C0', e: '✨', name: 'Charm 7',  category: 'letter', image: '/charms/002_A_soft_plush_pink_letter_B_is_centrally_iHYYGQpJ Background Removed.png' },
  { id: 'c8',  bg: '#A8D5A2', e: '✨', name: 'Charm 8',  category: 'icon',   image: '/charms/001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d Background Removed.png' },
  { id: 'c9',  bg: '#D4B8F4', e: '✨', name: 'Charm 9',  category: 'icon',   image: '/charms/005_A_smooth_matte_lavender_flower-shaped_object_is_VsK9Nys5 Background Removed.png' },
  { id: 'c10', bg: '#F4B5C0', e: '✨', name: 'Charm 10', category: 'icon',   image: '/charms/003_A_soft_pink_heart-shaped_object_is_presented_with_TtBIxLMs Background Removed.png' },
  { id: 'c11', bg: '#F4B5C0', e: '✨', name: 'Charm 11', category: 'icon',   image: '/charms/009_A_smooth_matte_pink_heart_shape_is_centered_X6r9CPGM Background Removed.png' },
  { id: 'c12', bg: '#D4B8F4', e: '✨', name: 'Charm 12', category: 'letter', image: '/charms/003_A_single_oversized_three-dimensional_letter_G_ISlrl-QI Background Removed.png' },
  { id: 'c13', bg: '#F4B5C0', e: '✨', name: 'Charm 13', category: 'icon',   image: '/charms/005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ Background Removed.png' },
  { id: 'c14', bg: '#A8D5A2', e: '✨', name: 'Charm 14', category: 'icon',   image: '/charms/008_In_a_minimalist_style_a_smooth_matte_sage_green_oqryxWtd Background Removed.png' },
  { id: 'c15', bg: '#F9E4A0', e: '✨', name: 'Charm 15', category: 'letter', image: '/charms/006_A_soft_matte_yellow_letter_S_stands_against_a_s0lt4jH Background Removed.png' },
  { id: 'c16', bg: '#B8D8F4', e: '✨', name: 'Charm 16', category: 'letter', image: '/charms/005_A_soft_blue_rounded_letter_L_is_centrally_BYREvDc Background Removed.png' },
  { id: 'c17', bg: '#F9E4A0', e: '✨', name: 'Charm 17', category: 'icon',   image: '/charms/002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC Background Removed.png' },
  { id: 'c18', bg: '#B8D8F4', e: '✨', name: 'Charm 18', category: 'letter', image: '/charms/001_The_letter_C_is_rendered_in_a_soft_pastel_XpEQ8qyU Background Removed.png' },
  { id: 'c19', bg: '#F4B5C0', e: '✨', name: 'Charm 19', category: 'letter', image: '/charms/007_A_large_rounded_pink_letter_R_is_presented_0sIURIE7 Background Removed.png' },
  { id: 'c20', bg: '#B8D8F4', e: '✨', name: 'Charm 20', category: 'icon',   image: '/charms/004_A_light_blue_paw_print_shaped_object_is_centrally_0i_pOMaJ Background Removed.png' },
  { id: 'c21', bg: '#B8D8F4', e: '✨', name: 'Charm 21', category: 'icon',   image: '/charms/004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF Background Removed.png' },
  { id: 'c22', bg: '#F9E4A0', e: '✨', name: 'Charm 22', category: 'letter', image: '/charms/007_A_soft_rounded_pale_yellow_letter_N_is_Ji0FDBaj Background Removed.png' },
  { id: 'c23', bg: '#A8D5A2', e: '✨', name: 'Charm 23', category: 'letter', image: '/charms/004_A_smooth_rounded_letter_M_in_a_pale_green_hue_eS51RxOA Background Removed.png' },
  { id: 'c24', bg: '#D4B8F4', e: '✨', name: 'Charm 24', category: 'icon',   image: '/charms/010_A_smooth_matte_lavender_butterfly_shape_is_FjmwAp0n Background Removed.png' },
  { id: 'c25', bg: '#F4B5C0', e: '✨', name: 'Charm 25', category: 'icon',   image: '/charms/002_In_a_3D_rendered_style_a_soft_rounded_zSoOXavu Background Removed.png' },
] as const;

export type Charm = typeof ALL_CHARMS[number];

export const SIZES = ['XS — 20–28 cm', 'S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'] as const;

export const REVIEWS = [
  { name: 'Laima K.', dog: 'Luna, Beagle',   rating: 5, text: 'The collar survived two months of swimming and mud walks. Zero smell, zero stains.' },
  { name: 'Marta S.', dog: 'Bruno, Golden',  rating: 5, text: "Charms really do snap on in seconds. I was skeptical but it's genuinely that fast." },
  { name: 'Rūta P.',  dog: 'Mochi, Shiba',  rating: 5, text: 'Bought one, immediately ordered two more as gifts. Love that it\'s made in Lithuania.' },
] as const;

export interface CartItem {
  collar: Collar;
  charms: (string | null)[];
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

// ── LANDING PAGE DATA ─────────────────────────────────────────────

export const PRODUCTS = [
  { id: 1, name: 'Blossom set', price: '€28', collarColor: '#F4B5C0', bg: '#FAF0F5',
    image: '/In_a_minimalist_style_a_delicate_pink_hzs32ACd.webp',
    badge: 'New arrival', badgeColor: '#3a7a3a', badgeBg: '#eef7ee',
    desc: 'Blush collar, five interchangeable charms.',
    charms: [{ bg: '#A8D5A2', e: '🌿' }, { bg: '#B8D8F4', e: '⭐' }, { bg: '#F9E4A0', e: '☀️' }, { bg: '#D4B8F4', e: '🌸' }] },
  { id: 2, name: 'Sage set', price: '€28', collarColor: '#A8D5A2', bg: '#EEF5EE',
    image: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
    badge: undefined, badgeColor: undefined, badgeBg: undefined,
    desc: 'Fresh and earthy. Botanical charms.',
    charms: [{ bg: '#F4B5C0', e: '🌸' }, { bg: '#D4B8F4', e: '🦋' }, { bg: '#F9E4A0', e: '🍃' }] },
  { id: 3, name: 'Sky set', price: '€28', collarColor: '#B8D8F4', bg: '#EEF2F9',
    image: '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
    badge: 'Waterproof', badgeColor: '#2a5080', badgeBg: '#ddeeff',
    desc: 'For the adventurous pup. Fully waterproof.',
    charms: [{ bg: '#D4B8F4', e: '💎' }, { bg: '#A8D5A2', e: '🌊' }, { bg: '#F4B5C0', e: '🐾' }] },
  { id: 4, name: 'Honey set', price: '€28', collarColor: '#F9E4A0', bg: '#FDF6E3',
    image: '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
    badge: 'Summer drop', badgeColor: '#8a6010', badgeBg: '#fdf0d0',
    desc: 'Warm and sunny. Seasonal summer charms.',
    charms: [{ bg: '#F4B5C0', e: '🌻' }, { bg: '#A8D5A2', e: '🍀' }, { bg: '#D4B8F4', e: '⭐' }] },
] as const;

export type Product = typeof PRODUCTS[number];

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
