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
  { src: '/charms/Heart_pink_2.png', name: 'Širdis 2', bg: '#F4B5C0' },
  { src: '/charms/Paw_light_blue.png', name: 'Letenėlė 2', bg: '#B8D8F4' },
  { src: '/charms/Star_pale_yellow.png', name: 'Žvaigždė', bg: '#F9E4A0' },
  { src: '/charms/Star_sage_green.png', name: 'Žvaigžd. žalia', bg: '#A8D5A2' },
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

const FLOAT_CHARMS = [
  { src: '/charms/Heart_pink.png', top: '12%', left: '5%', size: 72, rotate: -18 },
  { src: '/charms/Paw_blue.png', top: '20%', right: '6%', size: 64, rotate: 22 },
  { src: '/charms/Butterfly_lavender.png', bottom: '28%', left: '8%', size: 80, rotate: 12 },
  { src: '/charms/Star_pale_yellow.png', bottom: '22%', right: '5%', size: 58, rotate: -25 },
  { src: '/charms/Flower_lavender.png', top: '48%', left: '2%', size: 50, rotate: 8 },
  { src: '/charms/Bone_pink.png', top: '60%', right: '3%', size: 55, rotate: -10 },
];

export default function Demo3Page() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [mounted, setMounted] = useState(false);
  const [activeCharm, setActiveCharm] = useState<number | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ background: '#0C0A08', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#FAF7F2', overflowX: 'hidden' }}>

      {/* ─── NAV ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '14px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(12, 10, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(250,247,242,0.07)',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 20, color: '#A8D5A2', letterSpacing: '0.04em' }}>
            PawCharms
          </span>
        </Link>
        <div style={{ display: 'flex', gap: isMobile ? 12 : 28, alignItems: 'center' }}>
          {!isMobile && (
            <>
              <Link href="#kolekciia" style={{ color: 'rgba(250,247,242,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Kolekcija</Link>
              <Link href="#kaip" style={{ color: 'rgba(250,247,242,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Kaip tai veikia</Link>
            </>
          )}
          <Link href="https://pawcharms.lt/products/collar-melyna-collar" style={{
            background: '#A8D5A2', color: '#0C0A08',
            padding: '9px 20px', borderRadius: 100,
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}>
            Pirkti dabar
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: isMobile ? '120px 24px 80px' : '120px 64px 100px',
        textAlign: 'center',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '5%', left: '-15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(168,213,162,0.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-15%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(244,181,192,0.1) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(184,216,244,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Floating charms — desktop only */}
        {mounted && !isMobile && FLOAT_CHARMS.map((c, i) => (
          <Image key={i} src={c.src} alt="" width={c.size} height={c.size} style={{
            position: 'absolute',
            objectFit: 'contain', zIndex: 1,
            top: c.top, left: c.left, right: (c as { right?: string }).right, bottom: (c as { bottom?: string }).bottom,
            transform: `rotate(${c.rotate}deg)`,
            animation: `pawFloat ${4 + i * 0.7}s ease-in-out ${i * 0.3}s infinite alternate`,
            opacity: 0.9,
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{
            fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#A8D5A2', fontWeight: 700, marginBottom: 28,
          }}>
            ✦ Personalizuoti šunų antkakliai ✦
          </p>

          <h1 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 'clamp(56px, 14vw, 80px)' : 'clamp(88px, 10vw, 144px)',
            lineHeight: 0.92, letterSpacing: '0.02em',
            margin: '0 0 36px', maxWidth: 920,
            color: '#FAF7F2',
          }}>
            Sukurk<br />
            <span style={{ color: '#F4B5C0', WebkitTextStroke: isMobile ? 'none' : '0px' }}>savo stiliaus</span><br />
            antkaklį
          </h1>

          <p style={{
            fontSize: isMobile ? 16 : 19, color: 'rgba(250,247,242,0.65)',
            maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.65,
          }}>
            Silikoniniai antkakliai su keičiamais pakabukai. Vandeniui atsparūs, patvarūs ir išskirtiniai — kaip ir jūsų šuo.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="https://pawcharms.lt/products/collar-melyna-collar" style={{
              background: '#A8D5A2', color: '#0C0A08',
              padding: isMobile ? '15px 32px' : '18px 42px',
              borderRadius: 100, fontSize: isMobile ? 16 : 18,
              fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 0 40px rgba(168,213,162,0.25)',
            }}>
              Kurk savo antkaklį →
            </Link>
            <Link href="#kolekciia" style={{
              border: '1.5px solid rgba(250,247,242,0.2)', color: '#FAF7F2',
              padding: isMobile ? '15px 32px' : '18px 42px',
              borderRadius: 100, fontSize: isMobile ? 16 : 18,
              fontWeight: 500, textDecoration: 'none',
            }}>
              Peržiūrėti
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: isMobile ? 16 : 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {['💧 Vandeniui atsparus', '✦ 12+ pakabukai', '🚚 Pristatymas LT'].map((b, i) => (
              <span key={i} style={{ fontSize: 13, color: 'rgba(250,247,242,0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Hero image trio */}
        {!isMobile && (
          <div style={{
            display: 'flex', gap: 16, marginTop: 80,
            maxWidth: 820, width: '100%', position: 'relative', zIndex: 2,
          }}>
            {[
              { src: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp', offset: 0 },
              { src: '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp', offset: -24 },
              { src: '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp', offset: 12 },
            ].map((img, i) => (
              <div key={i} style={{
                flex: i === 1 ? 1.2 : 1,
                aspectRatio: '3/4',
                borderRadius: 20,
                overflow: 'hidden',
                transform: `translateY(${img.offset}px)`,
                border: '1px solid rgba(250,247,242,0.08)',
                position: 'relative',
              }}>
                <Image src={img.src} alt="" fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {isMobile && (
          <div style={{ marginTop: 56, width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              <Image src="/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp" alt="" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        )}
      </section>

      {/* ─── TICKER ──────────────────────────────────── */}
      <div style={{ background: '#A8D5A2', padding: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div ref={tickerRef} style={{ display: 'inline-flex', animation: 'pawTicker 22s linear infinite' }}>
          {[...Array(6)].flatMap((_, i) =>
            ['★ VANDENIUI ATSPARUS', '✦ KEIČIAMI PAKABUKAI', '✶ RANKŲ DARBO KOKYBĖ', '★ SILIKONAS', '✦ UNIKALUS DIZAINAS', '✶ GREITAS PRISTATYMAS'].map((t, j) => (
              <span key={`${i}-${j}`} style={{
                fontFamily: "'Luckiest Guy', cursive",
                fontSize: 15, color: '#0C0A08',
                letterSpacing: '0.06em', padding: '0 32px',
                display: 'inline-block',
              }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ─── FEATURES ────────────────────────────────── */}
      <section style={{ padding: isMobile ? '72px 24px' : '100px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '💧', title: 'Vandeniui atsparus', desc: 'Maistinio silikono medžiaga — puikiai tinka maudynėms, lietui ir purvinoms pasivaikščiojimams.', color: '#B8D8F4' },
              { icon: '✨', title: 'Keičiami pakabukai', desc: '12+ skirtingų dizainų. Pakeisk per 5 sekundes be jokių įrankių — vieni nusega, kiti prisega.', color: '#F4B5C0' },
              { icon: '🐾', title: 'Patogus ir šuniui', desc: 'Minkštas silikono paviršius nesukelia dirginimo. Lengvas, bet tvirtas — šuo nė nejaučia.', color: '#A8D5A2' },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'rgba(250,247,242,0.03)',
                border: `1px solid ${f.color}20`,
                borderRadius: 24, padding: '36px 32px',
                display: 'flex', flexDirection: 'column', gap: 16,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: `radial-gradient(circle, ${f.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <span style={{ fontSize: 36, lineHeight: 1 }}>{f.icon}</span>
                <h3 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 26, letterSpacing: '0.02em', margin: 0, color: '#FAF7F2' }}>{f.title}</h3>
                <p style={{ color: 'rgba(250,247,242,0.55)', lineHeight: 1.65, margin: 0, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATEMENT ───────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 24px 64px' : '40px 64px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: isMobile ? 44 : 72, letterSpacing: '0.02em',
              lineHeight: 0.95, margin: '0 0 24px', color: '#FAF7F2',
            }}>
              Tavo šuo,<br /><span style={{ color: '#A8D5A2' }}>tavo taisyklės</span>
            </h2>
            <p style={{ color: 'rgba(250,247,242,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
              PawCharms — tai ne tik antkaklis. Tai būdas išreikšti savo šuns charakterį. Kiekvienas pakabuko derinys yra unikalus, kaip ir jūsų augintinis.
            </p>
            <Link href="https://pawcharms.lt/products/collar-melyna-collar" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#A8D5A2', textDecoration: 'none',
              fontSize: 15, fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Pradėti kūrybą →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
              '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
              '/A_man_sits_at_an_outdoor_cafe_with_a_French_BfuQAh4h.webp',
              '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
            ].map((src, i) => (
              <div key={i} style={{
                aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden',
                transform: i % 2 === 1 ? 'translateY(16px)' : 'translateY(0)',
                border: '1px solid rgba(250,247,242,0.07)',
                position: 'relative',
              }}>
                <Image src={src} alt="" fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHARMS COLLECTION ───────────────────────── */}
      <section id="kolekciia" style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: '#111009' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 48, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F4B5C0', fontWeight: 700, marginBottom: 12 }}>Pakabukai</p>
              <h2 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: isMobile ? 48 : 80, letterSpacing: '0.02em', lineHeight: 0.92, margin: 0, color: '#FAF7F2' }}>
                Rink savo<br /><span style={{ color: '#F4B5C0' }}>kolekciją</span>
              </h2>
            </div>
            <Link href="https://pawcharms.lt/products/collar-melyna-collar" style={{
              color: 'rgba(250,247,242,0.5)', textDecoration: 'none',
              fontSize: 14, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', alignSelf: 'flex-end',
            }}>
              Visi pakabukai →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
            gap: isMobile ? 10 : 14,
          }}>
            {CHARMS.map((charm, i) => (
              <button key={i}
                onMouseEnter={() => setActiveCharm(i)}
                onMouseLeave={() => setActiveCharm(null)}
                onClick={() => window.location.href = 'https://pawcharms.lt/products/collar-melyna-collar'}
                style={{
                  background: activeCharm === i ? `${charm.bg}22` : 'rgba(250,247,242,0.03)',
                  border: `1px solid ${activeCharm === i ? charm.bg + '50' : 'rgba(250,247,242,0.08)'}`,
                  borderRadius: isMobile ? 16 : 20,
                  padding: isMobile ? '16px 8px' : '24px 12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: activeCharm === i ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                }}>
                <Image src={charm.src} alt={charm.name} width={60} height={60} style={{
                  width: isMobile ? 44 : 60, height: isMobile ? 44 : 60,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
                  transform: activeCharm === i ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }} />
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(250,247,242,0.5)', textAlign: 'center', lineHeight: 1.3 }}>{charm.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section id="kaip" style={{ padding: isMobile ? '64px 24px' : '100px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8D8F4', fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Procesas</p>
          <h2 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 48 : 80, letterSpacing: '0.02em',
            textAlign: 'center', lineHeight: 0.92, marginBottom: 64, color: '#FAF7F2',
          }}>
            Kaip tai<br /><span style={{ color: '#B8D8F4' }}>veikia?</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { num: '01', title: 'Pasirink antkaklį', desc: 'Pasirink spalvą (mėlyna, žalia, rožinė, geltona) ir dydį (XS–L). Silikono antkakliai tinka bet kokiam šuniui.', color: '#B8D8F4', img: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp' },
              { num: '02', title: 'Pridėk pakabukus', desc: 'Rink iš 18+ skirtingų pakabukai — širdutės, letenėlės, raidės, žvaigždutės. Prisega per 5 sekundes.', color: '#F4B5C0', img: '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp' },
              { num: '03', title: 'Gauk ir džiaukis', desc: 'Pristatome per 2–3 darbo dienas visoje Lietuvoje. Pirmą kartą matydamas rinkinį, šuo bus laimingas (ir tu taip pat).', color: '#A8D5A2', img: '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp' },
            ].map((step, i) => (
              <div key={i} style={{
                background: 'rgba(250,247,242,0.02)',
                border: `1px solid ${step.color}25`,
                borderRadius: 24, overflow: 'hidden',
              }}>
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                  <Image src={step.img} alt={step.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '28px 28px 32px' }}>
                  <span style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 52, color: step.color, lineHeight: 1, opacity: 0.4, display: 'block', marginBottom: 12 }}>{step.num}</span>
                  <h3 style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 26, color: '#FAF7F2', margin: '0 0 12px', letterSpacing: '0.02em' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(250,247,242,0.55)', margin: 0, lineHeight: 1.65, fontSize: 14 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '80px 64px', background: '#111009' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 20, textAlign: 'center', marginBottom: 64 }}>
            {[
              { val: '2 000+', label: 'Patenkintų šeimininkų' },
              { val: '4.9★', label: 'Vidutinis įvertinimas' },
              { val: '18+', label: 'Pakabukai kolekcijoje' },
              { val: '100%', label: 'Silikoninis atsparius vandeniui' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '28px 20px', background: 'rgba(250,247,242,0.03)', borderRadius: 20, border: '1px solid rgba(250,247,242,0.07)' }}>
                <div style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: isMobile ? 32 : 40, color: '#A8D5A2', letterSpacing: '0.02em', marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.45)', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { name: 'Greta K.', dog: 'Bichon Frise šeimininkė', text: 'Mano Snukutis dabar labiausiai stilingas parke! Letenėlė ir širdutė pakabukai atrodo fantastiška kartu. Kokybė tikrai puiki — jau trečias mėnuo ir niekas nenusitrynia.', rating: 5 },
              { name: 'Tomas M.', dog: 'Prancūzų buldogo tėtis', text: 'Nusipirkau mėlyną antkaklį su raidėmis "MAX". Šuniui puikiai tiko iš karto. Greitas pristatymas, gražiai supakuota. Rekomenduoju visiems augintinių savininkams!', rating: 5 },
              { name: 'Aistė B.', dog: 'Auksinuko mama', text: 'Labai patiko galimybė rinktis pakabukus pagal savo skonį. Nusipirkau rožinį antkaklį su drugeliais ir gėlėmis. Visi parke klausia kur gavau!', rating: 5 },
            ].map((r, i) => (
              <div key={i} style={{
                background: 'rgba(250,247,242,0.03)',
                border: '1px solid rgba(250,247,242,0.08)',
                borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div style={{ color: '#F9E4A0', fontSize: 16, letterSpacing: '0.05em' }}>{'★'.repeat(r.rating)}</div>
                <p style={{ color: 'rgba(250,247,242,0.7)', margin: 0, lineHeight: 1.65, fontSize: 14, flex: 1 }}>"{r.text}"</p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#FAF7F2' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.4)', marginTop: 2 }}>{r.dog}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section style={{
        padding: isMobile ? '80px 24px 100px' : '120px 64px 140px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(168,213,162,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Decorative charms */}
        {!isMobile && (
          <>
            <Image src="/charms/Heart_pink.png" alt="" width={64} height={64} style={{ position: 'absolute', left: '8%', top: '20%', opacity: 0.6, animation: 'pawFloat 5s ease-in-out infinite alternate', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
            <Image src="/charms/Star_sage_green.png" alt="" width={56} height={56} style={{ position: 'absolute', right: '8%', top: '30%', opacity: 0.6, animation: 'pawFloat 6s ease-in-out 1s infinite alternate', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
            <Image src="/charms/Butterfly_lavender.png" alt="" width={72} height={72} style={{ position: 'absolute', left: '15%', bottom: '25%', opacity: 0.5, animation: 'pawFloat 4.5s ease-in-out 0.5s infinite alternate', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
            <Image src="/charms/Paw_blue.png" alt="" width={60} height={60} style={{ position: 'absolute', right: '12%', bottom: '20%', opacity: 0.55, animation: 'pawFloat 5.5s ease-in-out 1.5s infinite alternate', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
          </>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: isMobile ? 'clamp(52px, 12vw, 80px)' : 'clamp(80px, 9vw, 120px)',
            letterSpacing: '0.02em', lineHeight: 0.92, marginBottom: 28, color: '#FAF7F2',
          }}>
            Pradėk<br /><span style={{ color: '#A8D5A2' }}>šiandien</span>
          </h2>
          <p style={{ color: 'rgba(250,247,242,0.55)', fontSize: isMobile ? 16 : 19, maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.65 }}>
            Jūsų šuo nusipelno ko nors ypatingo. Sukurk unikalų antkaklio rinkinį per kelias minutes.
          </p>
          <Link href="https://pawcharms.lt/products/collar-melyna-collar" style={{
            background: '#A8D5A2', color: '#0C0A08',
            padding: isMobile ? '16px 40px' : '20px 52px',
            borderRadius: 100, fontSize: isMobile ? 17 : 20,
            fontWeight: 700, textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 0 60px rgba(168,213,162,0.3)',
          }}>
            Kurk savo antkaklį →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer style={{
        background: '#080604', padding: '32px 24px',
        borderTop: '1px solid rgba(250,247,242,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <span style={{ fontFamily: "'Luckiest Guy', cursive", fontSize: 18, color: '#A8D5A2', letterSpacing: '0.04em' }}>PawCharms</span>
        <p style={{ color: 'rgba(250,247,242,0.3)', fontSize: 13, margin: 0 }}>© 2025 PawCharms. Vilnius, Lietuva.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/faq" style={{ color: 'rgba(250,247,242,0.35)', textDecoration: 'none', fontSize: 13 }}>DUK</Link>
          <Link href="/guide/how-to-measure-dog-collar" style={{ color: 'rgba(250,247,242,0.35)', textDecoration: 'none', fontSize: 13 }}>Matavimas</Link>
        </div>
      </footer>

      {/* ─── GLOBAL ANIMATIONS ───────────────────────── */}
      <style>{`
        @keyframes pawFloat {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-14px) rotate(4deg); }
        }
        @keyframes pawTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-16.667%); }
        }
      `}</style>
    </div>
  );
}
