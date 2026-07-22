'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const CHARMS = [
  { src: '/charms/Heart_pink.png', name: 'Širdutė', bg: '#F4B5C0' },
  { src: '/charms/Paw_blue.png', name: 'Letenėlė', bg: '#B8D8F4' },
  { src: '/charms/Butterfly_lavender.png', name: 'Drugelis', bg: '#D4B8F4' },
  { src: '/charms/Flower_lavender.png', name: 'Gėlė', bg: '#D4B8F4' },
  { src: '/charms/Bone_pink.png', name: 'Kauliukas', bg: '#F4B5C0' },
  { src: '/charms/Star_pale_yellow.png', name: 'Žvaigždė', bg: '#F9E4A0' },
  { src: '/charms/Star_sage_green.png', name: 'Žv. žalia', bg: '#A8D5A2' },
  { src: '/charms/Heart_pink_2.png', name: 'Širdis 2', bg: '#F4B5C0' },
  { src: '/charms/Paw_light_blue.png', name: 'Letenėlė 2', bg: '#B8D8F4' },
  { src: '/charms/A_yellow.png', name: 'Raidė A', bg: '#F9E4A0' },
  { src: '/charms/B_pink.png', name: 'Raidė B', bg: '#F4B5C0' },
  { src: '/charms/L_blue.png', name: 'Raidė L', bg: '#B8D8F4' },
  { src: '/charms/M_pale_green.png', name: 'Raidė M', bg: '#A8D5A2' },
  { src: '/charms/R_pink.png', name: 'Raidė R', bg: '#F4B5C0' },
  { src: '/charms/S_yellow.png', name: 'Raidė S', bg: '#F9E4A0' },
  { src: '/charms/D_purple.png', name: 'Raidė D', bg: '#D4B8F4' },
  { src: '/charms/G_green.png', name: 'Raidė G', bg: '#A8D5A2' },
  { src: '/charms/K_green.png', name: 'Raidė K', bg: '#A8D5A2' },
];

const REVIEWS = [
  {
    name: 'Greta K.',
    handle: '@gretaandsnukutis',
    dog: 'Bichon Frise šeimininkė',
    text: 'Mano Snukutis dabar labiausiai stilingas parke! Letenėlė ir širdutė pakabukai atrodo fantastiška kartu. Kokybė tikrai puiki — jau trečias mėnuo ir niekas nenusitrynia.',
    img: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  },
  {
    name: 'Tomas M.',
    handle: '@tomasandmax',
    dog: 'Prancūzų buldogo tėtis',
    text: 'Nusipirkau mėlyną antkaklį su raidėmis "MAX". Šuniui puikiai tiko iš karto. Greitas pristatymas, gražiai supakuota.',
    img: '/A_man_sits_at_an_outdoor_cafe_with_a_French_BfuQAh4h.webp',
  },
  {
    name: 'Aistė B.',
    handle: '@aisteandluna',
    dog: 'Auksinuko mama',
    text: 'Labai patiko galimybė rinktis pakabukus pagal savo skonį. Nusipirkau rožinį antkaklį su drugeliais ir gėlėmis. Visi parke klausia kur gavau!',
    img: '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
  },
];

export default function Demo4Page() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const isTablet = w < 1024;
  const [mounted, setMounted] = useState(false);
  const [hoveredCharm, setHoveredCharm] = useState<number | null>(null);
  const charmScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      background: '#FAF7F2',
      minHeight: '100dvh',
      fontFamily: "'DM Sans', sans-serif",
      color: '#3D3530',
      overflowX: 'hidden',
    }}>

      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: isMobile ? '16px 20px' : '20px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(250,247,242,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(61,53,48,0.08)',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: 22, color: '#3D3530',
            letterSpacing: '0.04em',
          }}>
            Paw<span style={{ color: '#F4B5C0' }}>Charms</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32 }}>
          {!isMobile && (
            <>
              <Link href="#charms" style={{ color: 'rgba(61,53,48,0.55)', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>Pakabukai</Link>
              <Link href="#kaip" style={{ color: 'rgba(61,53,48,0.55)', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>Kaip veikia</Link>
              <Link href="/faq" style={{ color: 'rgba(61,53,48,0.55)', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>DUK</Link>
            </>
          )}
          <Link href="https://pawcharms.lt/products/pawcharms-melynas-antkaklis" style={{
            background: '#3D3530', color: '#FAF7F2',
            padding: isMobile ? '9px 18px' : '10px 24px',
            borderRadius: 100, fontSize: 13, fontWeight: 700,
            textDecoration: 'none', letterSpacing: '-0.01em',
            transition: 'background 0.2s',
          }}>
            Pirkti dabar
          </Link>
        </div>
      </nav>

      {/* ─── HERO — ASYMMETRIC SPLIT ─────────────────────── */}
      <section style={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        paddingTop: isMobile ? 80 : 0,
      }}>
        {/* Left: typography */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '48px 24px 40px' : '120px 48px 80px 48px',
          position: 'relative',
        }}>
          {/* Overline */}
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#F4B5C0', fontWeight: 700, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1.5, background: '#F4B5C0' }} />
            Personalizuoti šunų antkakliai
          </p>

          {/* Display heading */}
          <h1 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 'clamp(64px, 16vw, 88px)' : 'clamp(72px, 7.5vw, 120px)',
            lineHeight: 0.9, letterSpacing: '0.02em',
            margin: '0 0 32px',
            color: '#3D3530',
          }}>
            Antkakliai,<br />
            kurie<br />
            <span style={{
              color: '#F4B5C0',
              WebkitTextStroke: '2px #F4B5C0',
            }}>kalba</span>
            <span style={{ color: '#3D3530' }}>.</span>
          </h1>

          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: 'rgba(61,53,48,0.6)',
            maxWidth: 400,
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            Silikoniniai antkakliai su keičiamais pakabukai. Pasirink spalvą, pridėk pakabukai ir sukurk rinkinį, kuris atspindi tavo šuns charakterį.
          </p>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
            <Link href="https://pawcharms.lt/products/pawcharms-melynas-antkaklis" style={{
              background: '#F4B5C0', color: '#3D3530',
              padding: isMobile ? '16px 32px' : '16px 36px',
              borderRadius: 100, fontSize: 15, fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: 8,
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 24px rgba(244,181,192,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}>
              Kurk savo antkaklį →
            </Link>
            <Link href="#charms" style={{
              background: 'transparent',
              border: '1.5px solid rgba(61,53,48,0.2)',
              color: '#3D3530',
              padding: isMobile ? '16px 32px' : '16px 36px',
              borderRadius: 100, fontSize: 15, fontWeight: 500,
              textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: 8,
              letterSpacing: '-0.01em',
            }}>
              Žiūrėti kolekciją
            </Link>
          </div>

          {/* Trust row */}
          <div style={{
            display: 'flex', gap: isMobile ? 20 : 32,
            marginTop: 48, flexWrap: 'wrap',
          }}>
            {[
              { icon: '💧', label: 'Vandeniui atsparus' },
              { icon: '✦', label: '18+ pakabukai' },
              { icon: '🚚', label: 'Pristatymas per 2–3 d.' },
            ].map((b, i) => (
              <span key={i} style={{
                fontSize: 12, color: 'rgba(61,53,48,0.45)',
                display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 500,
              }}>
                <span style={{ fontSize: 14 }}>{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>

          {/* Floating charm decoration — desktop */}
          {mounted && !isMobile && (
            <div style={{
              position: 'absolute', bottom: 80, right: -20, zIndex: 10,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {[
                { src: '/charms/Heart_pink.png', size: 56, rotate: -12 },
                { src: '/charms/Star_pale_yellow.png', size: 44, rotate: 18 },
                { src: '/charms/Butterfly_lavender.png', size: 52, rotate: -8 },
              ].map((c, i) => (
                <Image key={i} src={c.src} alt="" width={c.size} height={c.size}
                  style={{
                    objectFit: 'contain',
                    transform: `rotate(${c.rotate}deg)`,
                    animation: `d4float ${3.5 + i * 0.8}s ease-in-out ${i * 0.4}s infinite alternate`,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: full-bleed image */}
        {!isMobile ? (
          <div style={{
            position: 'relative', overflow: 'hidden',
            minHeight: '100dvh',
          }}>
            <Image
              src="/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp"
              alt="Šuo su PawCharms antkaklio"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* Subtle overlay for edge blending */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(250,247,242,0.15) 0%, transparent 20%)',
            }} />
            {/* Floating stat badge */}
            <div style={{
              position: 'absolute', bottom: 48, left: 32,
              background: 'rgba(250,247,242,0.92)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: '20px 24px',
              display: 'flex', gap: 24,
              boxShadow: '0 8px 40px rgba(61,53,48,0.12)',
              border: '1px solid rgba(61,53,48,0.06)',
            }}>
              {[
                { val: '2 000+', label: 'Laimingų šunų' },
                { val: '4.9★', label: 'Įvertinimas' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 28, color: '#3D3530', letterSpacing: '0.02em', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(61,53,48,0.5)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
            <Image
              src="/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp"
              alt="Šuo su PawCharms antkaklio"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        )}
      </section>

      {/* ─── TICKER ──────────────────────────────────────── */}
      <div style={{
        background: '#F4B5C0',
        padding: '12px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        <div style={{ display: 'inline-flex', animation: 'd4ticker 24s linear infinite' }}>
          {[...Array(8)].flatMap((_, i) =>
            ['★ VANDENIUI ATSPARUS', '✦ KEIČIAMI PAKABUKAI', '✶ SILIKONAS', '★ UNIKALUS DIZAINAS', '✦ GREITAS PRISTATYMAS', '✶ RANKŲ DARBO KOKYBĖ'].map((t, j) => (
              <span key={`${i}-${j}`} style={{
                fontFamily: "'Luckiest Guy', cursive",
                fontSize: 13, color: '#3D3530',
                letterSpacing: '0.08em', padding: '0 28px',
                display: 'inline-block',
              }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ─── FEATURES — ZIGZAG ───────────────────────────── */}
      <section style={{ padding: isMobile ? '72px 24px' : '120px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.4)', fontWeight: 700, marginBottom: 16 }}>
              Kodėl PawCharms
            </p>
            <h2 style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: isMobile ? 48 : 80,
              letterSpacing: '0.02em', lineHeight: 0.9,
              margin: 0, maxWidth: 600,
              color: '#3D3530',
            }}>
              Sukurta<br />šunims ir<br /><span style={{ color: '#A8D5A2' }}>šeimininkams</span>
            </h2>
          </div>

          {/* Zigzag feature rows */}
          {[
            {
              icon: '💧',
              title: 'Vandeniui atsparus',
              desc: 'Maistinio silikono medžiaga — puikiai tinka maudynėms, lietui ir purvinoms pasivaikščiojimams. Nusiplauna per 10 sekundžių.',
              color: '#B8D8F4',
              img: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
              flip: false,
            },
            {
              icon: '✨',
              title: 'Keičiami pakabukai',
              desc: '18+ skirtingų dizainų. Pakeisk per 5 sekundes be jokių įrankių — vieni nusega, kiti prisega. Kiekviena diena — naujas stilius.',
              color: '#F4B5C0',
              img: '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
              flip: true,
            },
            {
              icon: '🐾',
              title: 'Patogus ir šuniui',
              desc: 'Minkštas silikono paviršius nesukelia dirginimo. Lengvas, bet tvirtas — šuo nė nejaučia, o tu džiaugiesi stilingu rezultatu.',
              color: '#A8D5A2',
              img: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
              flip: false,
            },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 24 : 64,
              alignItems: 'center',
              marginBottom: isMobile ? 56 : 80,
              direction: (!isMobile && f.flip) ? 'rtl' : 'ltr',
            }}>
              {/* Image */}
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: 24,
                overflow: 'hidden',
                direction: 'ltr',
                flexShrink: 0,
              }}>
                <Image src={f.img} alt={f.title} fill style={{ objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: f.color,
                  borderRadius: 100, padding: '6px 16px',
                  fontSize: 11, fontWeight: 700,
                  color: '#3D3530', letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {f.icon} Funkcija {String(i + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Text */}
              <div style={{ direction: 'ltr', padding: isMobile ? 0 : '0 16px' }}>
                <h3 style={{
                  fontFamily: "'Luckiest Guy', cursive",
                  fontSize: isMobile ? 36 : 52,
                  letterSpacing: '0.02em', lineHeight: 0.95,
                  margin: '0 0 20px', color: '#3D3530',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  color: 'rgba(61,53,48,0.6)',
                  fontSize: 16, lineHeight: 1.72,
                  margin: '0 0 28px', maxWidth: 400,
                }}>
                  {f.desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  gap: 8, padding: '10px 20px',
                  background: f.color + '30',
                  borderRadius: 100,
                  fontSize: 13, fontWeight: 600,
                  color: '#3D3530',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, display: 'inline-block' }} />
                  Sužinoti daugiau
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CHARMS — HORIZONTAL SCROLL ──────────────────── */}
      <section id="charms" style={{
        padding: isMobile ? '64px 0' : '100px 0',
        background: '#3D3530',
        overflow: 'hidden',
      }}>
        <div style={{ padding: isMobile ? '0 24px' : '0 48px', marginBottom: 48 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F4B5C0', fontWeight: 700, marginBottom: 14 }}>
                Kolekcija
              </p>
              <h2 style={{
                fontFamily: "'Luckiest Guy', cursive",
                fontSize: isMobile ? 48 : 80,
                letterSpacing: '0.02em', lineHeight: 0.9,
                margin: 0, color: '#FAF7F2',
              }}>
                Rink savo<br /><span style={{ color: '#F4B5C0' }}>pakabukai</span>
              </h2>
            </div>
            <Link href="https://pawcharms.lt/products/pawcharms-melynas-antkaklis" style={{
              color: 'rgba(250,247,242,0.4)', textDecoration: 'none',
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', alignSelf: 'flex-end',
            }}>
              Visi →
            </Link>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={charmScrollRef}
          style={{
            display: 'flex', gap: 12,
            overflowX: 'auto',
            paddingLeft: isMobile ? 24 : 48,
            paddingRight: isMobile ? 24 : 48,
            paddingBottom: 8,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {CHARMS.map((charm, i) => (
            <button
              key={i}
              onMouseEnter={() => setHoveredCharm(i)}
              onMouseLeave={() => setHoveredCharm(null)}
              onClick={() => window.location.href = 'https://pawcharms.lt/products/pawcharms-melynas-antkaklis'}
              style={{
                flexShrink: 0,
                width: isMobile ? 104 : 120,
                background: hoveredCharm === i ? charm.bg + '20' : 'rgba(250,247,242,0.05)',
                border: `1.5px solid ${hoveredCharm === i ? charm.bg + '60' : 'rgba(250,247,242,0.1)'}`,
                borderRadius: 20,
                padding: '20px 12px 16px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 10,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                transform: hoveredCharm === i ? 'translateY(-6px)' : 'translateY(0)',
              }}
            >
              <Image
                src={charm.src}
                alt={charm.name}
                width={56}
                height={56}
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  transform: hoveredCharm === i ? 'scale(1.12) rotate(-6deg)' : 'scale(1)',
                  transition: 'transform 0.18s ease',
                  width: isMobile ? 44 : 56,
                  height: isMobile ? 44 : 56,
                }}
              />
              <span style={{
                fontSize: 10, color: 'rgba(250,247,242,0.45)',
                textAlign: 'center', lineHeight: 1.3,
                fontWeight: 500, letterSpacing: '0.02em',
              }}>
                {charm.name}
              </span>
            </button>
          ))}
        </div>

        {/* CTA inside charm section */}
        <div style={{ padding: isMobile ? '40px 24px 0' : '48px 48px 0', maxWidth: 1296, margin: '0 auto' }}>
          <Link href="https://pawcharms.lt/products/pawcharms-melynas-antkaklis" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#F4B5C0', color: '#3D3530',
            padding: isMobile ? '14px 28px' : '16px 36px',
            borderRadius: 100, fontSize: 15, fontWeight: 700,
            textDecoration: 'none', letterSpacing: '-0.01em',
          }}>
            Pradėti kurti antkaklį →
          </Link>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────── */}
      <section id="kaip" style={{ padding: isMobile ? '80px 24px' : '120px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: isMobile ? 48 : 72 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.4)', fontWeight: 700, marginBottom: 16 }}>Procesas</p>
            <h2 style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: isMobile ? 48 : 80,
              letterSpacing: '0.02em', lineHeight: 0.9,
              margin: 0, color: '#3D3530',
            }}>
              Trys žingsniai<br /><span style={{ color: '#A8D5A2' }}>iki tobulo</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 40 : 64,
            alignItems: 'start',
          }}>
            {/* Steps list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { num: '01', title: 'Pasirink antkaklį', desc: 'Pasirink spalvą (mėlyna, žalia, rožinė, geltona) ir dydį (XS–L). Silikono antkakliai tinka bet kokiam šuniui.', color: '#B8D8F4' },
                { num: '02', title: 'Pridėk pakabukus', desc: 'Rink iš 18+ skirtingų pakabukai — širdutės, letenėlės, raidės, žvaigždutės. Prisega per 5 sekundes.', color: '#F4B5C0' },
                { num: '03', title: 'Gauk ir džiaukis', desc: 'Pristatome per 2–3 darbo dienas visoje Lietuvoje. Graži pakuotė — tinkama ir kaip dovana.', color: '#A8D5A2' },
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 24,
                  padding: '32px 0',
                  borderBottom: i < 2 ? '1px solid rgba(61,53,48,0.08)' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Luckiest Guy', cursive",
                    fontSize: 13, color: step.color,
                    letterSpacing: '0.08em', minWidth: 32,
                    paddingTop: 4,
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "'Luckiest Guy', cursive",
                      fontSize: 28, letterSpacing: '0.02em',
                      margin: '0 0 10px', color: '#3D3530',
                      lineHeight: 1,
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      color: 'rgba(61,53,48,0.55)',
                      fontSize: 15, lineHeight: 1.7, margin: 0,
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stacked images */}
            {!isMobile && (
              <div style={{ position: 'relative', height: 520 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 24,
                  width: '80%', aspectRatio: '4/3',
                  borderRadius: 24, overflow: 'hidden',
                  border: '4px solid #FAF7F2',
                  boxShadow: '0 16px 48px rgba(61,53,48,0.15)',
                }}>
                  <Image src="/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp" alt="Antkakliai" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '70%', aspectRatio: '4/3',
                  borderRadius: 24, overflow: 'hidden',
                  border: '4px solid #FAF7F2',
                  boxShadow: '0 16px 48px rgba(61,53,48,0.15)',
                }}>
                  <Image src="/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp" alt="Pakabukai" fill style={{ objectFit: 'cover' }} />
                </div>
                {/* Charm badge overlay */}
                {mounted && (
                  <div style={{
                    position: 'absolute', top: '42%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#FAF7F2',
                    borderRadius: '50%', width: 88, height: 88,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(61,53,48,0.2)',
                    zIndex: 10,
                    animation: 'd4float 4s ease-in-out infinite alternate',
                  }}>
                    <Image src="/charms/Heart_pink.png" alt="" width={52} height={52} style={{ objectFit: 'contain' }} />
                  </div>
                )}
              </div>
            )}

            {/* Mobile: single image */}
            {isMobile && (
              <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image src="/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp" alt="Antkakliai" fill style={{ objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS — EDITORIAL MASONRY ─────────────────── */}
      <section style={{
        padding: isMobile ? '72px 24px' : '120px 48px',
        background: '#F9F5EF',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.4)', fontWeight: 700, marginBottom: 16 }}>Atsiliepimai</p>
            <h2 style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: isMobile ? 48 : 80,
              letterSpacing: '0.02em', lineHeight: 0.9,
              margin: 0, color: '#3D3530',
            }}>
              Šunų<br /><span style={{ color: '#F4B5C0' }}>šeimininkai</span><br />myli mus
            </h2>
          </div>

          {/* Masonry-like reviews */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: 16,
            alignItems: 'start',
          }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: '#FAF7F2',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(61,53,48,0.07)',
                marginTop: !isMobile && i === 1 ? 32 : 0,
              }}>
                {/* Photo */}
                <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                  <Image src={r.img} alt={r.name} fill style={{ objectFit: 'cover' }} />
                </div>
                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div style={{ color: '#F4B5C0', fontSize: 14, marginBottom: 12, letterSpacing: '0.04em' }}>★★★★★</div>
                  <p style={{
                    color: 'rgba(61,53,48,0.7)',
                    fontSize: 14, lineHeight: 1.72,
                    margin: '0 0 20px',
                  }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#F4B5C0', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#3D3530',
                      flexShrink: 0,
                    }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#3D3530' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(61,53,48,0.4)', marginTop: 2 }}>{r.dog}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 1,
            marginTop: 48,
            background: 'rgba(61,53,48,0.06)',
            borderRadius: 24,
            overflow: 'hidden',
          }}>
            {[
              { val: '2 000+', label: 'Patenkintų šeimininkų' },
              { val: '4.9★', label: 'Vidutinis įvertinimas' },
              { val: '18+', label: 'Pakabukai kolekcijoje' },
              { val: '2–3d.', label: 'Pristatymo laikas' },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#FAF7F2',
                padding: isMobile ? '24px 20px' : '32px 28px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Luckiest Guy', cursive",
                  fontSize: isMobile ? 32 : 40,
                  color: '#3D3530', letterSpacing: '0.02em',
                  marginBottom: 6, lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(61,53,48,0.45)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA — IMAGE WITH OVERLAY ────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? 480 : 600 }}>
        <Image
          src="/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(61,53,48,0.85) 0%, rgba(61,53,48,0.35) 60%, transparent 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: 'flex-end',
          padding: isMobile ? '40px 24px 48px' : '60px 80px',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.6)', fontWeight: 700, marginBottom: 20 }}>
            Pradėk šiandien
          </p>
          <h2 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 'clamp(52px, 13vw, 72px)' : 'clamp(72px, 7vw, 112px)',
            letterSpacing: '0.02em', lineHeight: 0.9,
            color: '#FAF7F2', margin: '0 0 32px',
          }}>
            Jūsų šuo<br />nusipelno<br /><span style={{ color: '#F4B5C0' }}>daugiau</span>
          </h2>
          <Link href="https://pawcharms.lt/products/pawcharms-melynas-antkaklis" style={{
            background: '#F4B5C0', color: '#3D3530',
            padding: isMobile ? '16px 36px' : '18px 48px',
            borderRadius: 100, fontSize: isMobile ? 16 : 18,
            fontWeight: 700, textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 8px 40px rgba(244,181,192,0.4)',
          }}>
            Kurk savo antkaklį →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer style={{
        background: '#3D3530',
        padding: isMobile ? '40px 24px' : '48px 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
            paddingBottom: 32,
            marginBottom: 32,
            borderBottom: '1px solid rgba(250,247,242,0.08)',
          }}>
            <span style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 22, color: '#FAF7F2', letterSpacing: '0.04em' }}>
              Paw<span style={{ color: '#F4B5C0' }}>Charms</span>
            </span>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 32, flexWrap: 'wrap' }}>
              {[
                { label: 'Pakabukai', href: '#charms' },
                { label: 'Kaip veikia', href: '#kaip' },
                { label: 'DUK', href: '/faq' },
                { label: 'Matavimas', href: '/guide/how-to-measure-dog-collar' },
              ].map((l, i) => (
                <Link key={i} href={l.href} style={{ color: 'rgba(250,247,242,0.4)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(250,247,242,0.25)', fontSize: 12, margin: 0 }}>© 2025 PawCharms. Vilnius, Lietuva.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/faq" style={{ color: 'rgba(250,247,242,0.25)', textDecoration: 'none', fontSize: 12 }}>Privatumo politika</Link>
              <Link href="/faq" style={{ color: 'rgba(250,247,242,0.25)', textDecoration: 'none', fontSize: 12 }}>Pirkimo sąlygos</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── GLOBAL ANIMATIONS ───────────────────────────── */}
      <style>{`
        @keyframes d4float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-12px); }
        }
        @keyframes d4ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-12.5%); }
        }
        /* Hide scrollbar for charm strip */
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
