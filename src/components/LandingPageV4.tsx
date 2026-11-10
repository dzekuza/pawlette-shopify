'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Droplets,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  CloudRain,
  Wrench,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartCount } from '@/hooks/useCartCount';
import { BREED_NECK_SIZES, LANDING_REVIEWS } from '@/lib/data';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { TopBar } from '@/components/landing/TopBar';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { Accordion, type AccordionItem } from '@/components/shared/Accordion';
import { TrustNote } from '@/components/shared/TrustNote';
import { DisplayHeading, Eyebrow, BodyCopy } from '@/components/storefront/Typography';
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard';
import { ReviewStars } from '@/components/storefront/TestimonialCard';
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer';

const MOSAIC_TILES = [
  { src: '/hero/park-moment-cover.jpg', alt: 'Parko akimirka su šunimis', corner: 'tl' },
  { src: '/hero-figma/gallery-bazu-beach.png', alt: 'Šuo paplūdimyje su Sky antkakliu', corner: '' },
  { src: '/hero-figma/bento-dog-leash-meadow.jpg', alt: 'Kokerspanielis pievoje', corner: '' },
  { src: '/hero-figma/gallery-golden-leash.png', alt: 'Auksaspalvis retriveris su pavadėliu', corner: '' },
  { src: '/hero-figma/gallery-bazu-winter.png', alt: 'Žiemos pasivaikščiojimas sniege', corner: 'tr' },
  { src: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', alt: 'Sage žalias antkaklis HARRY', corner: '' },
  { src: '/hero-figma/hero-dsc01458.jpg', alt: 'Šuo su rožiniu antkakliu', corner: '' },
  { src: '/hero-figma/hero-dsc02225.jpg', alt: 'Pasivaikščiojimas gamtoje', corner: '' },
  { src: '/hero-figma/hero-dsc03015.jpg', alt: 'Antkaklio detalė iš arti', corner: '' },
  { src: '/hero-figma/hero-dsc01798.jpg', alt: 'Šuo su PawsCharm antkakliu', corner: '' },
  { src: '/hero-figma/hero-dsc02865.jpg', alt: 'PawsCharm kolekcija', corner: 'bl' },
  { src: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', alt: 'Auksaspalvis retriveris ant žolės', corner: '' },
  { src: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', alt: 'Šeimininkė su šunimi', corner: '' },
  { src: '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp', alt: 'Bėgimas paplūdimiu', corner: '' },
  { src: '/hero-figma/hero-dsc00912.jpg', alt: 'PawsCharm nuotykis', corner: 'br' },
] as const;

const CORE_STEPS = [
  {
    id: 'biothane',
    number: '01',
    title: '100% vandeniui atsparus JAV BioThane®',
    highlight: '0% drėgmės ir kvapų',
    body: 'Kiekvienas PawsCharm Core gaminamas iš originalios JAV BioThane® juostos. Ji nesugeria vandens, purvo ir jūros druskos — po maudynių tiesiog nuplaukite po čiaupu per 5 sekundes.',
    image: '/hero-figma/gallery-bazu-beach.png',
    caption: 'TESTAS NR. 01 // PAPLŪDIMIO BANGOS IR DRUSKA — BAZU',
  },
  {
    id: 'charmlock',
    number: '02',
    title: '5 sekundžių Charm Lock™ personalizacija',
    highlight: '5 pakabukai įskaičiuoti',
    body: 'Jokių įrankių ir jokio barškėjimo. Užmaukite šuns vardo raides ir 3D simbolius tiesiai ant antkaklio dirželio. Norite atnaujinti įvaizdį? Pakeiskite raides ar simbolius per kelias sekundes.',
    image: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
    caption: 'TESTAS NR. 02 // 5 SEKUNDŽIŲ CHARM LOCK™ SISTEMA — HARRY',
  },
  {
    id: 'seasons',
    number: '03',
    title: 'Nuo vasaros karščio iki lietuviškos žiemos',
    highlight: 'Išbandyta nuo -25°C iki +45°C',
    body: 'Antkaklis nesukietėja per šaltį, neskilinėja ir neblunka saulėje. Lieto metalo furnitūra atlaiko iki 220 kg tempimo jėgą, todėl tinka tiek mažiems, tiek stipriems dideliems šunims.',
    image: '/hero-figma/gallery-bazu-winter.png',
    caption: 'TESTAS NR. 03 // ŽIEMOS MIŠKAS IR SNIEGAS — -25°C',
  },
  {
    id: 'pricing',
    number: '04',
    title: 'Sąžininga kaina be tarpininkų antkainių',
    highlight: '€32.99 pilnas rinkinys',
    body: 'Viską projektuojame ir surenkame patys savo studijoje Vilniuje. Todėl pilnas vardo antkaklis su 5 pasirinktais pakabukais kainuoja €32.99, o ne €60+ kaip vardinėse butikų parduotuvėse.',
    image: '/hero-figma/bento-dog-leash-meadow.jpg',
    caption: 'TESTAS NR. 04 // VILNIAUS STUDIJA → TIESIAI JUMS',
  },
] as const;

const HOW_TO_STEPS = [
  {
    step: '1',
    title: 'Pasirinkite dydį pagal šuns veislę arba kaklo apimtį',
    body: 'Įveskite savo šuns veislę mūsų skaičiuoklėje žemiau arba išmatuokite kaklą — iškart parodysime tikslų S, M arba L dydį.',
  },
  {
    step: '2',
    title: 'Sukurkite vardą ir pasirinkite BioThane® spalvą',
    body: 'Įrašykite šuns vardą, išsirinkite vieną iš 5 pastelinių atspalvių ir pridėkite mėgstamą 3D simbolį (5 pakabukai jau įskaičiuoti į kainą).',
  },
  {
    step: '3',
    title: 'Gaukite per 1–2 d. d. ir mėgaukitės švariais pasivaikščiojimais',
    body: 'Kiekvieną užsakymą surenkame rankomis Vilniuje ir išsiunčiame per 24 valandas. Netiko dydis? Pakeisime nemokamai per 30 dienų.',
  },
] as const;

const STUDIO_COLORS = [
  {
    key: 'sage',
    label: 'Sage',
    fullName: 'Šalavijų žalia (Sage)',
    cssVar: 'var(--color-sage)',
    badgeClass: 'bg-sage',
    cutout: '/hero-figma/card-dog-freddie.png',
  },
  {
    key: 'sky',
    label: 'Sky',
    fullName: 'Dangaus mėlyna (Sky)',
    cssVar: 'var(--color-sky)',
    badgeClass: 'bg-sky',
    cutout: '/hero-figma/card-dog-baz.png',
  },
  {
    key: 'blossom',
    label: 'Blossom',
    fullName: 'Žiedų rožinė (Blossom)',
    cssVar: 'var(--color-blossom)',
    badgeClass: 'bg-blossom',
    cutout: '/collar-pink.png',
  },
  {
    key: 'honey',
    label: 'Honey',
    fullName: 'Medaus geltona (Honey)',
    cssVar: 'var(--color-honey)',
    badgeClass: 'bg-honey',
    cutout: '/collar-yellow.png',
  },
  {
    key: 'lavender',
    label: 'Lilac',
    fullName: 'Levandų violetinė (Lilac)',
    cssVar: 'var(--color-lavender)',
    badgeClass: 'bg-lavender',
    cutout: '/hero-figma/bento-collar-charm.png',
  },
] as const;

type StudioColorKey = (typeof STUDIO_COLORS)[number]['key'];

const CHARM_SYMBOLS = [
  { id: 'star', label: 'Žvaigždė', src: '/charm-star.png' },
  { id: 'heart', label: 'Širdelė', src: '/charm-heart.png' },
  { id: 'flower', label: 'Gėlytė', src: '/charm-flower.png' },
  { id: 'paw', label: 'Letenėlė', src: '/charm-paw.png' },
] as const;

type CharmSymbolId = (typeof CHARM_SYMBOLS)[number]['id'];

interface SlotItem {
  type: 'letter' | 'charm';
  value: string;
}

const SPEC_CATEGORIES = [
  {
    category: 'Medžiaga ir tvirtumas',
    items: [
      { label: 'Pagrindinė juosta', value: 'Originalus JAV BioThane® (Beta 520)' },
      { label: 'Atsparumas tempimui', value: 'Iki 220 kg (485 lbs) trūkio apkrova' },
      { label: 'Atsparumas vandeniui', value: '100% hidrofobinis (0% įgeriamumas)' },
      { label: 'Juostos plotis ir storis', value: '20 mm / 25 mm plotis · 2.5 mm storis' },
      { label: 'Furnitūra', value: 'Lietas matinis cinko ir plieno lydinys, nerūdijantis' },
    ],
  },
  {
    category: '5 sek. Charm Lock™ sistema',
    items: [
      { label: 'Tvirtinimo mechanizmas', value: 'Be įrankių, užmaunamas per 5 sekundes' },
      { label: 'Įskaičiuota į kainą', value: '5 vnt. pasirinktų 3D raidžių arba simbolių' },
      { label: 'Pakabukų medžiaga', value: 'UV spinduliams ir smūgiams atsparus elastingas polimeras' },
      { label: 'Triukšmo lygis', value: '0 dBA (nebarška į metalinį žiedą)' },
    ],
  },
  {
    category: 'Eksploatacija ir dydžiai',
    items: [
      { label: 'Darbinė temperatūra', value: 'Nuo -25 °C iki +45 °C (nesukietėja šaltyje)' },
      { label: 'Galimi dydžiai', value: 'S (28–36 cm) · M (36–44 cm) · L (44–52 cm)' },
      { label: 'Valymas', value: 'Šiltas vanduo ir muilas (per 5–10 sek.)' },
    ],
  },
  {
    category: 'Garantija ir gamyba',
    items: [
      { label: 'Gamybos vieta', value: 'Rankų darbas Vilniuje, Lietuvoje 🇱🇹' },
      { label: 'Dydžio keitimo garantija', value: '30 dienų nemokamas keitimas arba grąžinimas' },
    ],
  },
] as const;

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'core-what',
    title: 'Kas yra „PawsCharm Core“ ir kuo BioThane® skiriasi nuo įprasto antkaklio?',
    content:
      '„PawsCharm Core“ yra mūsų naujos kartos personalizuotas antkaklis, pagamintas iš JAV sukurtos „BioThane®“ medžiagos. Skirtingai nei nailonas ar oda, „BioThane®“ turi 0% drėgmės įgeriamumą — po maudynių jūroje, ežere ar purviname miške antkaklis neįgeria kvapų, nesupelija ir nuplaunamas vandeniu per 5 sekundes.',
  },
  {
    id: 'core-charms',
    title: 'Kaip laikosi vardo raidės ir pakabukai? Ar šuo jų nepames bėgiodamas?',
    content:
      'Mūsų „Charm Lock™“ pakabukai turi specialų vidinį kanalą, pritaikytą tiksliam „BioThane®“ juostos storiui (2.5 mm) ir pločiui. Užmautas pakabukas priglunda prie juostos be jokių išsikišusių kilpų, todėl neužsikabina už šakų, nebarška ir tvirtai laikosi net aktyvių žaidimų metu.',
  },
  {
    id: 'core-included',
    title: 'Kas įskaičiuota į €32.99 kainą?',
    content:
      'Į €32.99 bazinę kainą įskaičiuotas pasirinktos spalvos ir dydžio „BioThane®“ antkaklis bei 5 bet kurie pasirinkti pakabukai (raidės arba simboliai). Jei jūsų šuns vardas ilgesnis arba norite papildomų simbolių, kiekvienas papildomas pakabukas kainuoja €3.99.',
  },
  {
    id: 'core-size',
    title: 'Kaip išsirinkti tinkamą dydį ir kas, jei dydis netiks?',
    content:
      'Galite pasinaudoti mūsų veislės dydžio parinkikliu šiame puslapyje arba išmatuoti šuns kaklą virvele (palikdami 2 pirštų tarpą): S tinka 28–36 cm, M — 36–44 cm, L — 44–52 cm kaklui. Jei gavus antkaklį dydis netiks, per 30 dienų jį pakeisime kitu dydžiu visiškai nemokamai.',
  },
  {
    id: 'core-winter',
    title: 'Ar antkaklis tinka lietuviškai žiemai ir sūriam jūros vandeniui?',
    content:
      'Taip! „BioThane®“ išlieka minkštas ir lankstus net esant -25 °C šaltiui, o nerūdijančio lydinio furnitūra nebijo Baltijos jūros druskos, sniego ir ledo.',
  },
];

const NAV_SECTIONS = [
  { id: 'core-hero', label: 'Pradžia' },
  { id: 'core-why', label: 'Kodėl Core' },
  { id: 'core-manifesto', label: 'Apie' },
  { id: 'core-features', label: '4 Privalumai' },
  { id: 'core-witness', label: 'Parkas / Jūra' },
  { id: 'core-how', label: '3 Žingsniai' },
  { id: 'core-pricing', label: 'Konfigūratorius' },
  { id: 'core-reviews', label: 'Atsiliepimai' },
  { id: 'core-specs', label: 'Specifikacijos' },
  { id: 'core-faq', label: 'D.U.K.' },
] as const;

export function LandingPageV4() {
  const cartCount = useCartCount();
  const pricingSectionRef = useRef<HTMLElement | null>(null);

  // Active section index for the Basepowercompany vertical right rail
  const [activeRailIdx, setActiveRailIdx] = useState(0);

  // Hero season mode & video preview modal
  const [heroAllSeasons, setHeroAllSeasons] = useState(false);
  const [videoPipOpen, setVideoPipOpen] = useState(false);

  // Mosaic grid lock state (toggles between exploded tiles & locked full photo)
  const [mosaicLocked, setMosaicLocked] = useState(false);

  // Section 4: Better walks start with Core (active step 0..3)
  const [activeCoreStep, setActiveCoreStep] = useState(0);

  // Section 5: Day (Park) vs Night/Storm (Mud & Sea) toggle (`bcc-witness`)
  const [isStormMode, setIsStormMode] = useState(false);

  // Section 7: Pricing & Live Core Studio + Breed Finder
  const [studioColor, setStudioColor] = useState<StudioColorKey>('sage');
  const [studioSize, setStudioSize] = useState<'S' | 'M' | 'L'>('M');
  const [nameInput, setNameInput] = useState('BAZU');
  const [slots, setSlots] = useState<SlotItem[]>([
    { type: 'letter', value: 'B' },
    { type: 'letter', value: 'A' },
    { type: 'letter', value: 'Z' },
    { type: 'letter', value: 'U' },
    { type: 'charm', value: 'star' },
  ]);
  const [priceDetailsOpen, setPriceDetailsOpen] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  // Breed finder (analogous to Base Power's "Select your utility provider")
  const [breedQuery, setBreedQuery] = useState('');
  const [selectedBreedSlug, setSelectedBreedSlug] = useState('auksaspalvis-retriveris');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = NAV_SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActiveRailIdx(idx);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const currentColorConfig = STUDIO_COLORS.find((c) => c.key === studioColor) ?? STUDIO_COLORS[0];
  const currentStepObj = CORE_STEPS[activeCoreStep] ?? CORE_STEPS[0];

  const extraCharmCount = Math.max(0, slots.length - 5);
  const totalPrice = (32.99 + extraCharmCount * 3.99).toFixed(2);

  const selectedBreed =
    BREED_NECK_SIZES.find((b) => b.slug === selectedBreedSlug) ?? BREED_NECK_SIZES[0];

  const filteredBreeds = breedQuery.trim()
    ? BREED_NECK_SIZES.filter((b) =>
        b.name.toLowerCase().includes(breedQuery.trim().toLowerCase()),
      )
    : BREED_NECK_SIZES;

  function getRecommendedSize(neckMin: number, neckMax: number): {
    size: 'S' | 'M' | 'L';
    range: string;
  } {
    const avg = (neckMin + neckMax) / 2;
    if (avg <= 35) return { size: 'S', range: '28–36 cm' };
    if (avg <= 44) return { size: 'M', range: '36–44 cm' };
    return { size: 'L', range: '44–52 cm' };
  }

  const breedRecommendation = getRecommendedSize(
    selectedBreed.neckMin,
    selectedBreed.neckMax,
  );

  function handleNameChange(raw: string) {
    const clean = raw
      .toUpperCase()
      .replace(/[^A-ZĄČĘĖĮŠŲŪŽ]/g, '')
      .slice(0, 6);
    setNameInput(clean);
    const existingCharms = slots.filter((s) => s.type === 'charm');
    const letterItems: SlotItem[] = clean
      .split('')
      .map((ch) => ({ type: 'letter', value: ch }));
    setSlots([...letterItems, ...existingCharms].slice(0, 6));
  }

  function handleAddCharm(charmId: CharmSymbolId) {
    setSlots((prev) => {
      const next = prev.length >= 6 ? prev.slice(0, 5) : [...prev];
      return [...next, { type: 'charm', value: charmId }];
    });
  }

  function handleRemoveSlot(idx: number) {
    const next = slots.filter((_, i) => i !== idx);
    setSlots(next);
    setNameInput(
      next
        .filter((s) => s.type === 'letter')
        .map((s) => s.value)
        .join(''),
    );
  }

  function scrollToPricing(presetName?: string, presetColor?: StudioColorKey) {
    if (presetName) {
      setNameInput(presetName);
      const letterItems: SlotItem[] = presetName
        .split('')
        .map((ch) => ({ type: 'letter', value: ch }));
      const nextSlots: SlotItem[] = [...letterItems, { type: 'charm', value: 'star' }];
      setSlots(nextSlots.slice(0, 6));
    }
    if (presetColor) {
      setStudioColor(presetColor);
    }
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleAddToCart() {
    setJustAdded(true);
    window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT));
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div
      className="relative min-h-screen bg-surface-2 font-sans text-bark selection:bg-sage selection:text-interactive-text"
      style={{
        backgroundImage:
          'radial-gradient(circle at center, var(--color-bark-divider) 0 1.5px, transparent 1.6px)',
        backgroundSize: '12px 12px',
      }}
    >
      <TopBar />
      <LandingNav cartCount={cartCount} />

      {/* BASEPOWER RIGHT-HAND VERTICAL PROGRESS RAIL (.bcc-rail) */}
      <nav
        aria-label="Puslapio sekcijos"
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex"
      >
        {NAV_SECTIONS.map((sec, idx) => {
          const dist = Math.abs(activeRailIdx - idx);
          const isCurrent = activeRailIdx === idx;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              title={sec.label}
              aria-label={sec.label}
              className="group flex h-3 items-center justify-end gap-2"
            >
              <span className="pointer-events-none rounded bg-bark px-2 py-0.5 text-[11px] font-medium text-cream opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                {sec.label}
              </span>
              <span
                className={cn(
                  'block rounded-full transition-all duration-300',
                  isCurrent
                    ? 'h-1.5 w-5 bg-interactive-text'
                    : dist === 1
                      ? 'h-1 w-3.5 bg-bark/40 group-hover:bg-bark'
                      : 'h-1 w-2 bg-bark/20 group-hover:bg-bark/60',
                )}
              />
            </a>
          );
        })}
      </nav>

      <main>
        {/* =====================================================================
            SECTION 01: BASE CORE RUNWAY HERO (bcc-runway / bcc-stage-hero)
            Full-viewport photo/video stage, rotated tape badge, 88px/48px display
            headline, 8px rounded sage action button (48px height), corner videocard
        ===================================================================== */}
        <section
          id="core-hero"
          className="relative min-h-[calc(100svh-68px)] w-full overflow-hidden border-b border-bark/12"
        >
          {/* Background media */}
          <div className="absolute inset-0">
            <Image
              src={
                heroAllSeasons
                  ? '/hero-figma/gallery-bazu-winter.png'
                  : '/hero/park-moment-cover.jpg'
              }
              alt="PawsCharm Core antkaklis gamtoje"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-out"
            />
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/hero/park-moment-cover.jpg"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
                heroAllSeasons ? 'opacity-0' : 'opacity-90',
              )}
            >
              <source src="/hero/hero-loop.mp4" type="video/mp4" />
            </video>
            {/* Left-to-right and top-to-bottom dark scrim matching .bcc-hero-scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-bark/75 via-bark/40 to-bark/65 md:bg-gradient-to-r md:from-bark/85 md:via-bark/45 md:to-transparent" />
          </div>

          {/* Hero Content Container (1440px reference frame, 1200px canonical inner) */}
          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-68px)] max-w-[1200px] flex-col justify-between px-5 pb-10 pt-16 md:justify-center md:px-8 md:py-24">
            <div className="max-w-[680px]">
              {/* Rotated Tape Badge (.bcc-hero-tape) */}
              <button
                type="button"
                onClick={() => setHeroAllSeasons((prev) => !prev)}
                className="group mb-4 inline-flex -rotate-2 cursor-pointer items-center gap-2 rounded-[4px] bg-cream/95 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-bark shadow-md transition-transform duration-300 hover:rotate-0 hover:scale-105"
              >
                <span className="size-2 rounded-full bg-sage" />
                <span>Susipažinkite su</span>
                <span className="rounded bg-sage/40 px-1.5 py-0.5 text-[10px] font-bold text-interactive-text">
                  {heroAllSeasons ? 'Žiemos režimas' : 'Spausk: 4 sezonai'}
                </span>
              </button>

              {/* Headline-lg: 48px mobile -> 88px desktop, lineHeight 1, letterSpacing -2.64px */}
              <DisplayHeading
                as="h1"
                size="floatingHero"
                className="font-display text-[48px] font-semibold leading-none tracking-[-0.03em] text-cream md:text-[88px] md:leading-none md:tracking-[-2.64px]"
              >
                PawsCharm Core
              </DisplayHeading>

              {/* Rotated handwritten sub-headline (.bcc-hero-sub) */}
              <p className="mt-3 -rotate-1 font-handwriting text-3xl text-sage md:text-4xl">
                Sukurtas visiems metų laikams — nuo Baltijos bangų iki žiemos miško.
              </p>

              <BodyCopy className="mt-5 max-w-[50ch] text-base font-medium leading-[1.4] tracking-[0.2px] text-cream/90 md:text-lg">
                Pirmasis šuns antkaklis iš JAV <strong className="font-semibold text-cream">BioThane®</strong> juostos su 5 sekundžių <strong className="font-semibold text-cream">Charm Lock™</strong> vardo sistema. 100% atsparus vandeniui, purvui ir kvapams.
              </BodyCopy>

              {/* DESIGN (2).md Action-Primary spec:
                  backgroundColor: #B2DD79 -> bg-sage
                  textColor: #1E4D2B -> text-interactive-text
                  height: 48px -> h-12
                  rounded: 8px -> rounded-[8px]
                  padding: 16px x 12px -> px-4 py-3
                  label: "Sužinoti daugiau" / "Susikurti Core" */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#core-pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToPricing();
                  }}
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-[8px] bg-sage px-5 py-3 text-base font-semibold leading-normal tracking-[0.2px] text-interactive-text transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-95 active:scale-[0.98]"
                >
                  <span>Susikurti savo Core</span>
                  <ArrowRight className="size-4" />
                </a>

                <a
                  href="#core-features"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-cream/30 bg-cream/10 px-4 py-3 text-base font-semibold leading-normal tracking-[0.2px] text-cream backdrop-blur-md transition-colors duration-150 hover:bg-cream/20"
                >
                  <span>Sužinoti daugiau</span>
                </a>
              </div>

              {/* Micro stats bar */}
              <div className="mt-10 grid max-w-[520px] grid-cols-3 gap-4 border-t border-cream/20 pt-5 text-cream">
                <div>
                  <div className="font-display text-2xl font-semibold text-sage md:text-3xl">5 sek.</div>
                  <div className="text-xs font-medium text-cream/75">Vardo užmovimas</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold text-sage md:text-3xl">0%</div>
                  <div className="text-xs font-medium text-cream/75">Vandens ir kvapų</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold text-sage md:text-3xl">€32.99</div>
                  <div className="text-xs font-medium text-cream/75">Su 5 pakabukais</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right Floating Video Card (.bcc-hero-videocard) */}
          <button
            type="button"
            onClick={() => setVideoPipOpen(true)}
            aria-label="Žiūrėti PawsCharm Core video iš arti"
            className="group absolute bottom-6 right-5 z-20 hidden aspect-[303/188] w-[220px] cursor-pointer overflow-hidden rounded-[18px] border-2 border-cream/30 shadow-2xl transition-transform duration-300 hover:scale-[1.04] sm:block md:bottom-8 md:right-8 md:w-[280px]"
          >
            <Image
              src="/hero-figma/gallery-bazu-beach.png"
              alt="PawsCharm Core bandymas"
              fill
              sizes="280px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-bark/35 transition-colors group-hover:bg-bark/20" />
            <span className="absolute left-3 top-3 rounded-[6px] bg-cream/95 px-2.5 py-1 text-[11px] font-semibold text-bark">
              Vilniaus studija · 0:24
            </span>
            <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sage text-interactive-text shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="size-5 fill-current" />
            </span>
            <span className="absolute bottom-2.5 left-3 right-3 text-left text-xs font-semibold text-cream">
              Žiūrėti: 5 sek. Charm Lock™ testas →
            </span>
          </button>
        </section>

        {/* FLOATING PIP VIDEO MODAL (.bcc-fact-pip) */}
        {videoPipOpen && (
          <div className="fixed bottom-5 right-5 z-50 w-[320px] overflow-hidden rounded-2xl border border-bark/20 bg-bark shadow-2xl sm:w-[380px]">
            <div className="relative aspect-video w-full">
              <video
                src="/hero/hero-loop.mp4"
                autoPlay
                controls
                loop
                playsInline
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setVideoPipOpen(false)}
                aria-label="Uždaryti video"
                className="absolute right-2.5 top-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-bark/75 text-cream transition-colors hover:bg-bark"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex items-center justify-between bg-bark px-4 py-2.5 text-xs text-cream">
              <span className="font-semibold">PawsCharm Core™ dirbtuvės</span>
              <button
                type="button"
                onClick={() => {
                  setVideoPipOpen(false);
                  scrollToPricing();
                }}
                className="cursor-pointer font-semibold text-sage hover:underline"
              >
                Susikurti savo →
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 02: PROBLEM STATEMENT + 5x3 MOSAIC REVEAL
            (.bcc-stage-stress & .bcc-stage-grid)
        ===================================================================== */}
        <section id="core-why" className="border-b border-bark/12 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            {/* Statement Head (typography.headline-md: ~68px desktop, 1.2 line-height) */}
            <div className="max-w-[980px]">
              <Eyebrow className="mb-3 uppercase tracking-wider text-interactive-text">
                01 // KODĖL SUKŪRĖME CORE
              </Eyebrow>
              <DisplayHeading
                as="h2"
                size="page"
                className="font-display text-[36px] font-semibold leading-[1.15] tracking-[-0.02em] text-bark md:text-[64px] md:leading-[1.12]"
              >
                Šunų nuotykiai tampa vis{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">šlapesni ir purvinesni.</span>
                  <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 rounded-xs bg-sage/60 md:h-4" />
                </span>{' '}
                O įprasti nailoniniai antkakliai tiesiog neatlaiko.
              </DisplayHeading>

              {/* .bcc-chips */}
              <ul className="mt-9 flex flex-col items-start gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
                {[
                  {
                    icon: Droplets,
                    text: 'Šlapi ir nemaloniai kvepiantys antkakliai po maudynių',
                    badgeBg: 'bg-sky',
                  },
                  {
                    icon: Wrench,
                    text: 'Barškantys ir pasimetantys graviruoti pakabukai',
                    badgeBg: 'bg-honey',
                  },
                  {
                    icon: RotateCcw,
                    text: 'Atspalviai, kurie nublunka ir apsivelia kailiu',
                    badgeBg: 'bg-blossom',
                  },
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <li key={chip.text} className="relative pl-3 pt-3">
                      <span
                        className={cn(
                          'absolute left-0 top-0 flex size-7 items-center justify-center rounded-full border border-bark/15 text-bark shadow-xs',
                          chip.badgeBg,
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <span className="inline-block rounded-[8px] border border-bark/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-bark shadow-xs md:text-sm">
                        {chip.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 5x3 Mosaic Grid Stage (.bcc-stage-grid / .bcc-grid-tiles) */}
            <div className="mt-14">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-bark-muted">
                  5×3 NUOTYKIŲ MOZAIKA · TIKRI LIETUVOS ŠUNYS
                </span>
                <button
                  type="button"
                  onClick={() => setMosaicLocked((prev) => !prev)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[8px] bg-sage px-3.5 py-2 text-xs font-semibold text-interactive-text transition-transform active:scale-95"
                >
                  <span>{mosaicLocked ? 'Išskleisti 15 kadrų mozaiką' : 'Sujungti į Core portretą'}</span>
                </button>
              </div>

              <div
                onClick={() => setMosaicLocked((prev) => !prev)}
                className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[24px] border border-bark/12 bg-bark p-2 shadow-xl transition-all duration-500 md:p-3"
              >
                {/* Grid of 15 tiles */}
                <div
                  className={cn(
                    'grid h-full w-full grid-cols-3 grid-rows-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-5 md:grid-rows-3',
                    mosaicLocked ? 'gap-0' : 'gap-2 md:gap-3',
                  )}
                >
                  {MOSAIC_TILES.map((tile, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'relative overflow-hidden transition-all duration-700',
                        mosaicLocked ? 'rounded-none' : 'rounded-xl',
                      )}
                    >
                      <Image
                        src={tile.src}
                        alt={tile.alt}
                        fill
                        sizes="(min-width: 768px) 20vw, 33vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom scrim and Meet Base Core plate (.bcc-grid-plate) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-bark/90 via-bark/45 to-transparent p-6 md:p-10">
                  <span className="-rotate-2 font-handwriting text-2xl text-sage md:text-3xl">
                    Susipažinkite su
                  </span>
                  <h3 className="m-0 font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-cream md:text-6xl">
                    PawsCharm Core™
                  </h3>
                  <p className="mt-2 text-sm font-medium text-cream/85 md:text-base">
                    Rankų darbas Vilniuje · JAV BioThane® technologija · 5 sek. Charm Lock™
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 03: INLINE-ICON & PHOTO EDITORIAL MANIFESTO (.bcc-meet)
            "Texas-sized home battery that automatically powers your home..."
        ===================================================================== */}
        <section id="core-manifesto" className="border-b border-bark/12 bg-cream py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Eyebrow className="mb-4 uppercase tracking-wider text-interactive-text">
              02 // MANIFESTAS
            </Eyebrow>

            <h2 className="font-display text-[32px] font-semibold leading-[1.32] tracking-[-0.02em] text-bark sm:text-[44px] md:text-[58px] md:leading-[1.28]">
              Šuns antkaklis{' '}
              <span className="mx-1 inline-flex h-[1.15em] w-[1.8em] translate-y-1.5 items-center justify-center overflow-hidden rounded-xl border-2 border-bark/15 bg-sky align-baseline shadow-sm">
                <Image
                  src="/hero-figma/bento-collar-charm.png"
                  alt="Antkaklis"
                  width={90}
                  height={60}
                  className="h-full w-full object-cover"
                />
              </span>{' '}
              kuris <span className="text-interactive-text">100% nebijo vandens</span>{' '}
              <span className="mx-1 inline-flex size-[1.05em] translate-y-1 items-center justify-center rounded-full bg-sky/60 text-bark align-baseline">
                <Droplets className="size-[0.6em]" />
              </span>{' '}
              užsideda šuns vardą per{' '}
              <span className="text-interactive-text">5 sekundes</span>{' '}
              <span className="mx-1 inline-flex h-[1.15em] w-[1.8em] translate-y-1.5 items-center justify-center overflow-hidden rounded-xl border-2 border-bark/15 bg-honey align-baseline shadow-sm">
                <Image
                  src="/hero-figma/card-personalization.png"
                  alt="Pakabukai"
                  width={90}
                  height={60}
                  className="h-full w-full object-cover"
                />
              </span>{' '}
              ir sutaupo dešimtis eurų{' '}
              <span className="mx-1 inline-flex size-[1.05em] translate-y-1 items-center justify-center rounded-full bg-sage text-interactive-text align-baseline">
                <Sparkles className="size-[0.6em]" />
              </span>{' '}
              nes tarnauja metų metus.
            </h2>

            <div className="mt-10 flex flex-col justify-between gap-6 border-t border-bark/12 pt-8 md:flex-row md:items-center">
              <div>
                <p className="text-lg font-semibold text-bark md:text-xl">
                  PawsCharm projektuoja, pjausto, komplektuoja ir prižiūri kiekvieną Core antkaklį.
                </p>
                <p className="mt-1 text-base font-medium text-bark-muted">
                  Siunčiame visoje Lietuvoje (Omniva, DPD, LP Express) per 1–2 darbo dienas.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#core-pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToPricing();
                  }}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-sage px-5 py-3 text-base font-semibold text-interactive-text transition-all duration-150 hover:brightness-95"
                >
                  <span>Skaičiuoti savo kainą</span>
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  href="/guide/antkakliu-dydziai-pagal-veisle"
                  className="text-sm font-medium text-bark-light underline underline-offset-4 hover:text-bark"
                >
                  Nežinote dydžio? Peržiūrėkite veislių lentelę ›
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 04: "BETTER WALKS START WITH CORE" (.bcc-bp)
            Left vertical segmented progress list + Right square/portrait photo card
        ===================================================================== */}
        <section id="core-features" className="border-b border-bark/12 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left 6 cols: Heading + Vertical Segmented Step List (.bcc-bp-copy) */}
              <div className="lg:col-span-6">
                <Eyebrow className="mb-2 uppercase tracking-wider text-interactive-text">
                  03 // KETURI CORE STANDARTAI
                </Eyebrow>
                <DisplayHeading
                  as="h2"
                  size="page"
                  className="font-display text-[36px] font-semibold leading-[1.12] text-interactive-text md:text-[54px]"
                >
                  Geresni pasivaikščiojimai prasideda su{' '}
                  <span className="underline decoration-sage decoration-4 underline-offset-4">
                    Core:
                  </span>
                </DisplayHeading>

                {/* Vertical progress track (.bcc-bp-list) */}
                <ol className="relative mt-8 flex flex-col gap-2 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1.5 before:rounded-full before:bg-bark/12">
                  {CORE_STEPS.map((step, idx) => {
                    const isActive = activeCoreStep === idx;
                    return (
                      <li key={step.id} className="relative pl-6">
                        {/* Left segment bar (.bcc-bp-seg) */}
                        <span
                          className={cn(
                            'absolute bottom-0 left-0 top-0 w-1.5 rounded-full transition-all duration-300',
                            isActive ? 'bg-interactive-text' : 'bg-transparent',
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveCoreStep(idx)}
                          className={cn(
                            'w-full cursor-pointer rounded-2xl p-4 text-left transition-colors',
                            isActive ? 'bg-cream shadow-xs' : 'hover:bg-cream/60',
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-sans text-xs font-bold uppercase tracking-wider text-interactive-text">
                                {step.number}
                              </span>
                              <h3 className="m-0 font-sans text-lg font-semibold leading-[1.35] tracking-[0.2px] text-interactive-text md:text-xl">
                                {step.title}
                              </h3>
                            </div>
                            <span className="shrink-0 rounded-[6px] bg-sage/45 px-2.5 py-0.5 text-xs font-semibold text-interactive-text">
                              {step.highlight}
                            </span>
                          </div>

                          <p
                            className={cn(
                              'mt-2 font-sans text-[15px] font-medium leading-[1.45] tracking-[0.2px] text-bark transition-opacity duration-300 md:text-base',
                              isActive ? 'opacity-100' : 'opacity-70',
                            )}
                          >
                            {step.body}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* Action buttons (.bcc-bp-cta) */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#core-pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToPricing();
                    }}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-sage px-5 py-3 text-base font-semibold text-interactive-text transition-all duration-150 hover:brightness-95"
                  >
                    <span>Susikurti savo antkaklį</span>
                    <ArrowRight className="size-4" />
                  </a>
                  <PrimaryButton href="/products/pawcharms-antkaklis" variant="dark" size="lg">
                    Atidaryti 3D katalogą
                  </PrimaryButton>
                </div>
              </div>

              {/* Right 6 cols: Square/Portrait Image Card (.bcc-bp-card) */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[676/665] w-full overflow-hidden rounded-[24px] border border-bark/12 bg-bark shadow-xl">
                  <Image
                    src={currentStepObj.image}
                    alt={currentStepObj.title}
                    fill
                    sizes="(min-width: 1024px) 580px, 100vw"
                    className="object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark/80 via-transparent to-transparent" />

                  {/* Top step pills inside card */}
                  <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-[8px] bg-cream/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-bark backdrop-blur-md">
                      {currentStepObj.caption}
                    </span>
                    <div className="flex items-center gap-1.5 rounded-[8px] bg-bark/70 p-1 backdrop-blur-md">
                      {CORE_STEPS.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveCoreStep(idx)}
                          className={cn(
                            'cursor-pointer rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-colors',
                            activeCoreStep === idx
                              ? 'bg-sage text-interactive-text'
                              : 'text-cream/75 hover:text-cream',
                          )}
                        >
                          {s.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom card caption */}
                  <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-cream/20 bg-bark/75 p-5 text-cream backdrop-blur-md">
                    <div className="text-xs font-bold uppercase tracking-wider text-sage">
                      STANDARTAS {currentStepObj.number} / 04 · {currentStepObj.highlight}
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold text-cream">
                      {currentStepObj.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 05: INTERACTIVE DAY / STORM WITNESS TOGGLE (.bcc-witness)
            Base Core's signature "Grid: ON / OFF" interactive scene switch!
            Switches entire section between Sunny Park (Day) & Sea/Mud Storm (Night)
        ===================================================================== */}
        <section
          id="core-witness"
          className={cn(
            'relative border-b border-bark/12 py-20 transition-colors duration-500 md:py-28',
            isStormMode ? 'bg-bark text-cream' : 'bg-cream text-bark',
          )}
          style={
            isStormMode
              ? {
                  backgroundImage:
                    'radial-gradient(circle at center, rgba(250, 247, 242, 0.08) 0 1.5px, transparent 1.6px)',
                  backgroundSize: '12px 12px',
                }
              : undefined
          }
        >
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Left 8 Cols: Interactive Scene Card with Top-Right Switch (.bcc-witness-card) */}
              <div className="lg:col-span-8">
                <div className="relative aspect-[920/558] w-full overflow-hidden rounded-[20px] border border-bark/15 shadow-2xl">
                  <Image
                    src={
                      isStormMode
                        ? '/hero-figma/gallery-bazu-beach.png'
                        : '/hero-figma/bento-dog-leash-meadow.jpg'
                    }
                    alt={
                      isStormMode
                        ? 'Šuo jūros bangose ir smėlyje su PawsCharm antkakliu'
                        : 'Šuo saulėtoje vasaros pievoje su PawsCharm antkakliu'
                    }
                    fill
                    sizes="(min-width: 1024px) 780px, 100vw"
                    className="object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark/75 via-transparent to-bark/20" />

                  {/* Top-Right Switch Widget (.bcc-witness-toggle) */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!isStormMode}
                    onClick={() => setIsStormMode((prev) => !prev)}
                    className="absolute right-4 top-4 z-20 flex cursor-pointer items-center gap-3 rounded-[8px] bg-surface-2 p-2 text-bark shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <span className="pl-1.5 text-xs font-bold uppercase tracking-wider text-bark">
                      Sąlygos:
                    </span>
                    <span
                      className={cn(
                        'relative flex h-[34px] w-[108px] items-center rounded-full p-1 transition-colors duration-300',
                        !isStormMode ? 'bg-sage' : 'bg-honey',
                      )}
                    >
                      <span
                        className={cn(
                          'z-10 flex size-[26px] items-center justify-center rounded-full bg-white text-bark shadow-sm transition-transform duration-300',
                          !isStormMode ? 'translate-x-[72px]' : 'translate-x-0',
                        )}
                      >
                        {!isStormMode ? (
                          <Sun className="size-3.5 text-interactive-text" />
                        ) : (
                          <CloudRain className="size-3.5 text-bark" />
                        )}
                      </span>
                      <span
                        className={cn(
                          'absolute left-3 text-[11px] font-bold uppercase tracking-wider text-interactive-text transition-opacity',
                          !isStormMode ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        PARKAS
                      </span>
                      <span
                        className={cn(
                          'absolute right-3 text-[11px] font-bold uppercase tracking-wider text-bark transition-opacity',
                          isStormMode ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        LIŪTIS
                      </span>
                    </span>
                  </button>

                  {/* Bottom status badge inside image */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-cream">
                    <span className="rounded-[8px] bg-bark/75 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                      {!isStormMode
                        ? 'REŽIMAS 01 // SAULĖTAS MIESTO PARKAS IR KAVINĖ'
                        : 'REŽIMAS 02 // JŪROS BANGOS, SMĖLIS IR MIŠKO PURVAS'}
                    </span>
                    <span className="rounded-[8px] bg-sage px-3 py-1.5 text-xs font-bold text-interactive-text">
                      {!isStormMode ? 'Lengvas 48 g svoris' : 'Nuplaunama per 5 sek.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Dynamic Witness Copy (.bcc-witness-copy) */}
              <div className="lg:col-span-4">
                <Eyebrow
                  className={cn(
                    'mb-2 uppercase tracking-wider',
                    isStormMode ? 'text-sage' : 'text-interactive-text',
                  )}
                >
                  04 // INTERAKTYVUS REŽIMŲ TESTAS
                </Eyebrow>

                {!isStormMode ? (
                  <div>
                    <h2 className="font-display text-3xl font-semibold leading-tight text-bark md:text-4xl">
                      Kai šviečia saulė ir einate į parką ar kavinę:
                    </h2>
                    <p className="mt-4 text-base font-medium leading-relaxed text-bark-light">
                      Minkšta pastelinė <strong className="font-semibold text-bark">BioThane®</strong> juosta švelniai priglunda prie kailio, nepeša plaukų ir nesukelia alergijos. Ryškios 3D vardo raidės iš tolo traukia praeivių šypsenas ir komplimentus.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-display text-3xl font-semibold leading-tight text-cream md:text-4xl">
                      Kai užklumpa liūtis, jūros bangos ar purvas:
                    </h2>
                    <p className="mt-4 text-base font-medium leading-relaxed text-cream/85">
                      Ten, kur įprasti antkakliai permirksta ir pradeda dvokti, <strong className="font-semibold text-sage">PawsCharm Core</strong> išlieka 100% sausas viduje. Grįžę namo pakiškite po vandens srove — po 5 sekundžių jis vėl kaip naujas.
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStormMode((prev) => !prev)}
                    className={cn(
                      'inline-flex h-11 cursor-pointer items-center gap-2 rounded-[8px] px-4 text-sm font-semibold transition-colors',
                      isStormMode
                        ? 'bg-sage text-interactive-text'
                        : 'bg-bark text-cream',
                    )}
                  >
                    <span>
                      {isStormMode
                        ? 'Perjungti į saulėtą parką ☀'
                        : 'Išbandyti liūties ir jūros režimą 🌧'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Press / Trust Strip (.bcc-witness-press) */}
            <div
              className={cn(
                'mt-14 border-t pt-8',
                isStormMode ? 'border-cream/15' : 'border-bark/12',
              )}
            >
              <p
                className={cn(
                  'mb-5 text-center text-xs font-semibold uppercase tracking-wider',
                  isStormMode ? 'text-cream/60' : 'text-bark-muted',
                )}
              >
                PATIKRINTA ŠIMTŲ LIETUVOS ŠUNŲ AUGINTOJŲ IR REKOMENDUOJAMA Kiekvienai dienai
              </p>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  '100% JAV BioThane®',
                  '5 sek. Charm Lock™',
                  'Atlaiko 220 kg tempimą',
                  'Nuo -25°C iki +45°C',
                  'Rankų darbas Vilniuje',
                  '30 d. grąžinimo garantija',
                ].map((item) => (
                  <li
                    key={item}
                    className={cn(
                      'flex items-center justify-center rounded-[10px] border px-3 py-2.5 text-center text-xs font-semibold',
                      isStormMode
                        ? 'border-cream/15 bg-cream/5 text-cream/90'
                        : 'border-bark/10 bg-surface-2 text-bark',
                    )}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 06: "KAIP UŽSISAKYTI:" 3-COLUMN VERTICAL RULE STEPS (.bcc-how)
        ===================================================================== */}
        <section id="core-how" className="border-b border-bark/12 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Eyebrow className="mb-2 uppercase tracking-wider text-interactive-text">
              05 // GREITAS PROCESAS
            </Eyebrow>
            <DisplayHeading
              as="h2"
              size="page"
              className="font-display text-[36px] font-semibold text-interactive-text md:text-[54px]"
            >
              Kaip gauti PawsCharm Core savo šuniui:
            </DisplayHeading>

            <ol className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
              {HOW_TO_STEPS.map((item) => (
                <li key={item.step} className="relative pl-9">
                  {/* Left vertical accent rule (.bcc-how-rule) */}
                  <span className="absolute bottom-0 left-0 top-0 w-2.5 rounded-full bg-sage" />

                  {/* Number chip (.bcc-how-chip) */}
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-bark/12 bg-white font-sans text-sm font-bold text-interactive-text shadow-xs">
                    {item.step}
                  </span>

                  <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-interactive-text md:text-[28px]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 font-sans text-base font-medium leading-relaxed text-bark-light">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex justify-start lg:justify-center">
              <a
                href="#core-pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToPricing();
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-sage px-6 py-3 text-base font-semibold text-interactive-text transition-all duration-150 hover:brightness-95"
              >
                <span>Pradėti konfigūravimą</span>
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 07: INTERACTIVE CORE STUDIO & PRICING CARD (.bcc-pricing)
            2-column layout: Left elevated pricing + live collar builder card,
            Right value breakdown + interactive Breed Size Calculator card
        ===================================================================== */}
        <section
          ref={pricingSectionRef}
          id="core-pricing"
          className="border-b border-bark/12 bg-cream py-20 md:py-28"
        >
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              {/* LEFT 7 COLS: Elevated Spec & Configurator Card */}
              <div className="overflow-hidden rounded-3xl border-2 border-interactive-text/25 bg-white shadow-xl lg:col-span-7">
                {/* Top Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-6 py-5 md:px-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-interactive-text">
                      PAWSCHARM CORE™ · VILNIAUS STUDIJA
                    </span>
                    <h3 className="m-0 mt-0.5 font-display text-2xl font-semibold text-bark">
                      BioThane® Antkaklis + 5 Pakabukai
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-bold text-interactive-text">
                      €{totalPrice}
                    </div>
                    <div className="text-xs font-medium text-bark-muted">
                      5 pakabukai įskaičiuoti
                    </div>
                  </div>
                </div>

                {/* Live Interactive Collar Strap Preview */}
                <div className="border-b border-border bg-cream/60 p-6 md:px-8">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold text-bark-muted">
                    <span>GYVA PERŽIŪRA: {currentColorConfig.fullName}</span>
                    <span>{slots.length} / 6 langeliai (spausk pašalinti)</span>
                  </div>

                  <div
                    className="mx-auto flex h-24 w-full items-center justify-between rounded-full border-2 border-bark/20 px-4 shadow-md transition-colors duration-300 sm:h-26 sm:px-7"
                    style={{ backgroundColor: currentColorConfig.cssVar }}
                  >
                    {/* Buckle Left */}
                    <div className="h-14 w-4 shrink-0 rounded-lg bg-bark/85 sm:h-16 sm:w-5" />

                    {/* 6 Charm Slots */}
                    <div className="mx-2 flex flex-1 items-center justify-center gap-1.5 sm:gap-2.5">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const slot = slots[idx];
                        if (!slot) {
                          return (
                            <div
                              key={idx}
                              className="flex h-12 w-9 items-center justify-center rounded-xl border-2 border-dashed border-bark/25 bg-cream/45 text-[11px] font-semibold text-bark/50 sm:h-14 sm:w-12"
                            >
                              +{idx + 1}
                            </div>
                          );
                        }
                        const charmObj = CHARM_SYMBOLS.find((c) => c.id === slot.value);
                        return (
                          <button
                            key={`${slot.value}-${idx}`}
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            title="Spausk pašalinti"
                            className="flex h-12 w-9 cursor-pointer items-center justify-center rounded-xl border border-bark/20 bg-cream shadow-xs transition-transform hover:-translate-y-0.5 sm:h-14 sm:w-12"
                          >
                            {slot.type === 'letter' ? (
                              <span className="font-display text-lg font-bold text-bark sm:text-xl">
                                {slot.value}
                              </span>
                            ) : charmObj ? (
                              <Image
                                src={charmObj.src}
                                alt={charmObj.label}
                                width={30}
                                height={30}
                                className="object-contain"
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {/* D-Ring Right */}
                    <div className="h-14 w-3.5 shrink-0 rounded-r-full border-4 border-bark/80 sm:h-16 sm:w-4" />
                  </div>
                </div>

                {/* Configurator Controls */}
                <div className="flex flex-col gap-5 p-6 md:p-8">
                  {/* Step 1: Strap Color */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-bark-muted">
                      1. Pasirinkite BioThane® spalvą:
                    </label>
                    <div className="mt-2.5 grid grid-cols-5 gap-2">
                      {STUDIO_COLORS.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setStudioColor(c.key)}
                          style={{ backgroundColor: c.cssVar }}
                          className={cn(
                            'flex h-10 cursor-pointer items-center justify-center rounded-[8px] text-xs font-bold text-bark transition-transform hover:scale-[1.03]',
                            studioColor === c.key
                              ? 'border-2 border-interactive-text shadow-xs'
                              : 'border border-bark/15 opacity-80',
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Name Input + Presets */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="sm:col-span-7">
                      <label
                        htmlFor="core-dog-name"
                        className="text-xs font-bold uppercase tracking-wider text-bark-muted"
                      >
                        2. Šuns vardas (iki 6 raidžių):
                      </label>
                      <input
                        id="core-dog-name"
                        type="text"
                        maxLength={6}
                        value={nameInput}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="BAZU"
                        className="mt-2 h-11 w-full rounded-[8px] border border-border bg-surface-2 px-3.5 font-display text-lg font-bold uppercase tracking-wider text-bark outline-none focus:border-interactive-text"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-bark-muted">
                        3. Dydis:
                      </span>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {(['S', 'M', 'L'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setStudioSize(sz)}
                            className={cn(
                              'h-11 cursor-pointer rounded-[8px] text-xs font-bold transition-colors',
                              studioSize === sz
                                ? 'bg-interactive-text text-cream'
                                : 'border border-border bg-surface-2 text-bark hover:bg-cream',
                            )}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Add 3D Symbol Charm */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-bark-muted">
                      4. Pridėkite 3D simbolio pakabuką:
                    </span>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {CHARM_SYMBOLS.map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleAddCharm(ch.id)}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-border bg-surface-2 p-2 transition-colors hover:bg-cream"
                        >
                          <Image
                            src={ch.src}
                            alt={ch.label}
                            width={26}
                            height={26}
                            className="object-contain"
                          />
                          <span className="text-xs font-semibold text-bark">{ch.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Price Details (<dl> matching Base Core's "Price details") */}
                  <div className="rounded-xl border border-border bg-surface-2/70 p-4">
                    <button
                      type="button"
                      onClick={() => setPriceDetailsOpen((prev) => !prev)}
                      className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-semibold text-bark"
                    >
                      <span>Kainos išklotinė</span>
                      <ChevronDown
                        className={cn(
                          'size-4 transition-transform',
                          priceDetailsOpen && 'rotate-180',
                        )}
                      />
                    </button>
                    {priceDetailsOpen && (
                      <dl className="mt-3 flex flex-col gap-2 border-t border-border pt-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-bark-light">
                            BioThane® Core dirželis ({studioSize} dydis)
                          </dt>
                          <dd className="font-semibold text-bark">€32.99</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-bark-light">Pirmi 5 vardo / simbolių pakabukai</dt>
                          <dd className="font-semibold text-interactive-text">€0.00 (Įskaičiuota)</dd>
                        </div>
                        {extraCharmCount > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-bark-light">
                              Papildomas 6-as pakabukas ({extraCharmCount} vnt.)
                            </dt>
                            <dd className="font-semibold text-bark">
                              €{(extraCharmCount * 3.99).toFixed(2)}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-border pt-2 font-semibold text-bark">
                          <dt>Viso su PVM</dt>
                          <dd className="text-interactive-text">€{totalPrice}</dd>
                        </div>
                      </dl>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-sage px-6 py-3 text-base font-semibold text-interactive-text transition-all duration-150 hover:brightness-95"
                    >
                      {justAdded ? (
                        <>
                          <Check className="size-4" />
                          <span>Pridėta į krepšelį!</span>
                        </>
                      ) : (
                        <>
                          <span>Pridėti į krepšelį · €{totalPrice}</span>
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                    <PrimaryButton
                      href="/products/pawcharms-antkaklis"
                      variant="dark"
                      size="lg"
                    >
                      3D Konfigūratorius
                    </PrimaryButton>
                  </div>
                  <TrustNote />
                </div>
              </div>

              {/* RIGHT 5 COLS: Base Core Value Breakdown + Breed Neck Calculator */}
              <div className="flex flex-col gap-8 lg:col-span-5">
                <div>
                  <Eyebrow className="mb-2 uppercase tracking-wider text-interactive-text">
                    ANTKAKLIS + 5 PAKABUKAI
                  </Eyebrow>
                  <DisplayHeading
                    as="h2"
                    size="section"
                    className="font-display text-3xl font-semibold text-bark md:text-4xl"
                  >
                    Pilnas personalizuotas rinkinys tik už €32.99 — jokių paslėptų mokesčių už raides.
                  </DisplayHeading>

                  <ul className="mt-6 flex flex-col gap-5">
                    {[
                      {
                        title: '5 pakabukai jau įskaičiuoti į kainą.',
                        desc: 'Kiti prekių ženklai skaičiuoja po €4–€6 už kiekvieną raidę atskirai. Su Core 5 pasirinkti pakabukai jau įeina į €32.99.',
                      },
                      {
                        title: 'Keiskite vardą ar simbolius bet kada.',
                        desc: 'Pakeitėte pavadėlio spalvą ar norite naujo simbolio? Pakabukus permausite per 5 sekundes be naujo antkaklio pirkimo.',
                      },
                      {
                        title: 'Tarnauja 3–5 kartus ilgiau nei nailonas.',
                        desc: 'JAV BioThane® neirsta, nesugeria drėgmės ir neišsitampo net po šimtų maudynių ežere ar Baltijos jūroje.',
                      },
                      {
                        title: 'Gaminama tiesiogiai mūsų studijoje Vilniuje.',
                        desc: 'Jokių perpardavinėtojų antkainių — užsakymus surenkame ir išsiunčiame per 24 valandas.',
                      },
                    ].map((point) => (
                      <li key={point.title} className="flex items-start gap-3.5">
                        <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-sage text-interactive-text">
                          <Check className="size-3.5 stroke-[2.5]" />
                        </span>
                        <div>
                          <div className="font-sans text-base font-semibold text-bark">
                            {point.title}
                          </div>
                          <p className="mt-0.5 text-sm leading-relaxed text-bark-light">
                            {point.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Breed Size Calculator Card (Base Core's "Select your utility provider" equivalent) */}
                <SurfaceCard variant="muted" padding="default" className="border-bark/15 bg-surface-2">
                  <SurfaceCardBody className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-interactive-text">
                      <ShieldCheck className="size-4" />
                      <span>GREITA DYDŽIO PATIKRA PAGAL VEISLĘ</span>
                    </div>
                    <h3 className="m-0 font-display text-2xl font-semibold text-interactive-text">
                      Sužinokite tikslų Core dydį savo šuniui
                    </h3>
                    <p className="m-0 text-sm text-bark-light">
                      Pasirinkite savo šuns veislę ir mes automatiškai parinksime rekomenduojamą antkaklio dydį.
                    </p>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bark-muted" />
                      <input
                        type="text"
                        value={breedQuery}
                        onChange={(e) => setBreedQuery(e.target.value)}
                        placeholder="Ieškoti veislės (pvz. Biglis, Retriveris)..."
                        aria-label="Ieškoti šuns veislės"
                        className="h-10 w-full rounded-[8px] border border-border bg-white pl-9 pr-3 text-sm text-bark outline-none focus:border-interactive-text"
                      />
                    </div>

                    <select
                      aria-label="Pasirinkite šuns veislę"
                      value={selectedBreedSlug}
                      onChange={(e) => {
                        setSelectedBreedSlug(e.target.value);
                        const found = BREED_NECK_SIZES.find((b) => b.slug === e.target.value);
                        if (found) {
                          const rec = getRecommendedSize(found.neckMin, found.neckMax);
                          setStudioSize(rec.size);
                        }
                      }}
                      className="h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-bark outline-none focus:border-interactive-text"
                    >
                      {filteredBreeds.map((b) => (
                        <option key={b.slug} value={b.slug}>
                          {b.name} ({b.neckMin}–{b.neckMax} cm kaklas)
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between rounded-xl border border-sage bg-white p-3.5">
                      <div>
                        <div className="text-xs font-semibold uppercase text-bark-muted">
                          {selectedBreed.name} · Kaklas ~{selectedBreed.neckMin}–{selectedBreed.neckMax} cm
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-interactive-text">
                          Rekomenduojamas dydis: {breedRecommendation.size} ({breedRecommendation.range})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStudioSize(breedRecommendation.size)}
                        className="cursor-pointer rounded-[8px] bg-sage px-3 py-2 text-xs font-bold text-interactive-text"
                      >
                        Taikyti {breedRecommendation.size}
                      </button>
                    </div>
                  </SurfaceCardBody>
                </SurfaceCard>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 08: BUILT BY OUR VILNIUS STUDIO POLAROID COLLAGE (.bcc-crew)
        ===================================================================== */}
        <section className="border-b border-bark/12 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Eyebrow className="mb-2 uppercase tracking-wider text-interactive-text">
                  06 // VILNIAUS DIRBTUVĖS
                </Eyebrow>
                <DisplayHeading
                  as="h2"
                  size="page"
                  className="font-display text-[36px] font-semibold leading-[1.12] text-bark md:text-[52px]"
                >
                  Sukurta šunų mylėtojų ir dizainerių komandos{' '}
                  <span className="underline decoration-sage decoration-4 underline-offset-4">
                    Vilniuje.
                  </span>
                </DisplayHeading>
                <BodyCopy className="mt-4 text-bark-light">
                  Kiekvienas antkaklis gimsta mūsų studijoje: nuo tikslaus JAV BioThane® juostos pjovimo ir kniedijimo iki 3D pakabukų išbandymo su mūsų pačių keturkojais.
                </BodyCopy>
                <div className="mt-8">
                  <PrimaryButton href="/products" variant="dark" size="lg">
                    Peržiūrėti visą kolekciją
                  </PrimaryButton>
                </div>
              </div>

              {/* Tilted Polaroid Collage (.bcc-crew-collage) */}
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:col-span-7">
                {[
                  {
                    src: '/hero-figma/card-handmade.png',
                    caption: 'Rankų darbas Vilniuje',
                    rot: '-rotate-2',
                  },
                  {
                    src: '/hero-figma/bento-collar-charm.png',
                    caption: 'Charm Lock™ 3D testas',
                    rot: 'rotate-2',
                  },
                  {
                    src: '/hero-figma/card-combo.png',
                    caption: 'Antkaklio + pavadėlio deriniai',
                    rot: '-rotate-1',
                  },
                ].map((card) => (
                  <div
                    key={card.caption}
                    className={cn(
                      'relative rounded-2xl border border-bark/12 bg-white p-3 shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105',
                      card.rot,
                    )}
                  >
                    {/* Washi tape top strip */}
                    <span className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-xs bg-honey/80 shadow-2xs" />
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-2">
                      <Image
                        src={card.src}
                        alt={card.caption}
                        fill
                        sizes="(min-width: 1024px) 220px, 45vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2.5 text-center font-handwriting text-xl text-bark">
                      {card.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 09: WHAT MEMBERS ARE SAYING (.bcc-say)
            Dark green/bark dotted background + split headline + review deck
        ===================================================================== */}
        <section
          id="core-reviews"
          className="border-b border-bark/12 bg-bark py-20 text-cream md:py-28"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(168, 213, 162, 0.14) 0 1.5px, transparent 1.6px)',
            backgroundSize: '12px 12px',
          }}
        >
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            {/* Split Headline (.bcc-say-head) */}
            <div className="flex flex-col justify-between gap-2 border-b border-cream/15 pb-8 md:flex-row md:items-end">
              <h2 className="m-0 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] text-cream md:text-[72px]">
                Ką sako
              </h2>
              <div className="font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] text-sage md:text-right md:text-[72px]">
                šunų šeimininkai
              </div>
            </div>

            {/* Scattered/Bento Deck of Review + Photo Cards (.bcc-say-deck) */}
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {LANDING_REVIEWS.map((rev, i) => (
                <li
                  key={rev.name}
                  className={cn(
                    'flex flex-col justify-between rounded-2xl bg-white p-6 text-bark shadow-xl transition-transform duration-300 hover:-translate-y-1',
                    i === 1 && 'md:rotate-1',
                    i === 0 && 'md:-rotate-1',
                  )}
                >
                  <div>
                    <ReviewStars rating={rev.rating} />
                    <p className="mt-4 font-sans text-base font-medium leading-relaxed text-bark">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-sans text-sm font-bold text-bark">{rev.name}</div>
                      <div className="text-xs font-medium text-bark-muted">{rev.dog}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =====================================================================
            SECTION 10: BASE CORE TECHNICAL SPEC SHEET (.bcc-specs)
        ===================================================================== */}
        <section id="core-specs" className="border-b border-bark/12 bg-surface-2 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              {/* Left 4 Cols: Sticky Spec Title + Product Cutout */}
              <div className="lg:sticky lg:top-24 lg:col-span-4">
                <Eyebrow className="mb-2 uppercase tracking-wider text-interactive-text">
                  07 // TECHNINIAI DUOMENYS
                </Eyebrow>
                <DisplayHeading
                  as="h2"
                  size="section"
                  className="font-display text-3xl font-semibold text-interactive-text md:text-5xl"
                >
                  PawsCharm Core specifikacijos
                </DisplayHeading>
                <p className="mt-3 text-sm font-medium leading-relaxed text-bark-light">
                  Sukurtas ir išbandytas kasdieniams pasivaikščiojimams bet kokiomis oro sąlygomis.
                </p>

                <div className="relative mt-6 aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-bark/10 bg-cream p-4">
                  <Image
                    src="/hero-figma/features-collar.png"
                    alt="PawsCharm Core techninė schema"
                    fill
                    sizes="260px"
                    className="object-contain p-4"
                  />
                </div>
              </div>

              {/* Right 8 Cols: Categorized <dl> Spec Sheet */}
              <div className="rounded-3xl border border-bark/12 bg-cream p-6 shadow-xs md:p-10 lg:col-span-8">
                {SPEC_CATEGORIES.map((group, idx) => (
                  <div
                    key={group.category}
                    className={cn(
                      'py-6 first:pt-0 last:pb-0',
                      idx < SPEC_CATEGORIES.length - 1 && 'border-b border-border',
                    )}
                  >
                    <h3 className="mb-4 font-display text-xl font-semibold text-interactive-text">
                      {group.category}
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <div key={item.label}>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-bark-muted">
                            {item.label}
                          </dt>
                          <dd className="mt-1 font-sans text-base font-medium text-bark">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 11: STICKY-HEADER FAQ (.bcc-faq)
        ===================================================================== */}
        <section id="core-faq" className="border-b border-bark/12 bg-cream py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="mx-auto max-w-[860px]">
              <div className="inline-flex -rotate-1 rounded-[4px] bg-sage/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-interactive-text">
                Turite klausimų?
              </div>
              <DisplayHeading
                as="h2"
                size="page"
                className="mt-3 font-display text-3xl font-semibold text-interactive-text md:text-5xl"
              >
                Mes turime atsakymus
              </DisplayHeading>

              <div className="mt-8">
                <Accordion items={FAQ_ITEMS} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 12: CLOSING PAYOFF BANNER (.bcc-nf)
            "When the grid goes down, your home doesn't." ->
            "Kai prasideda liūtis ir purvas, jūsų šuns stilius nesustoja."
        ===================================================================== */}
        <section className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-bark py-24 text-center text-cream">
          <Image
            src="/hero-figma/closing-banner.png"
            alt="PawsCharm Core pasivaikščiojimas"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark via-bark/65 to-bark/80" />

          <div className="relative z-10 mx-auto max-w-[820px] px-5">
            <span className="inline-block -rotate-2 rounded-[6px] bg-sage px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-interactive-text">
              PawsCharm Core™ · Vilnius, LT
            </span>
            <h2 className="mt-5 font-display text-[40px] font-semibold leading-[1.06] tracking-[-0.03em] text-cream md:text-[68px]">
              Kai prasideda liūtis ir purvas, jūsų šuns stilius nesustoja.
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-base font-medium text-cream/85 md:text-lg">
              Sukurkite savo šuns vardo antkaklį per mažiau nei 30 sekundžių. Siunčiame visoje Lietuvoje per 1–2 darbo dienas.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#core-pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToPricing();
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-sage px-6 py-3 text-base font-semibold text-interactive-text transition-all duration-150 hover:brightness-95"
              >
                <span>Susikurti savo Core dabar</span>
                <ArrowRight className="size-4" />
              </a>
              <PrimaryButton href="/products" variant="ghost" size="lg">
                Visi produktai
              </PrimaryButton>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
