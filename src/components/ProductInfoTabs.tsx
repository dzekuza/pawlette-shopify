'use client'

import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Accordion } from '@/components/shared/Accordion'

interface ProductInfoTabsProps {
  isDark: boolean
}

const ACCORDION_ITEMS = [
  {
    id: 'description',
    title: 'Aprašymas',
    content: 'Pasiruošęs bet kokiam nuotykiui, mūsų vandeniui atsparus šuns antkaklio ir pavadėlio rinkinys sujungia patvarumą, patogumą ir praktiškumą. Lengvas reguliuojamas antkaklis yra atsparus purvui ir kvapams, lengvai valomas ir turi saugų atsegamą užsegimą. Suteikite jam asmeniškumo su mūsų silikoniniais šunų pakabukais.',
  },
  {
    id: 'features',
    title: 'Produkto savybės',
    content: 'Vandeniui atsparios antkaklio ir pavadėlio medžiagos, lengvas reguliuojamas prigludimas, saugus atsegamas užsegimas, atsparumas purvui ir kvapams, lengvas pavadėlio reguliavimas, paminkštinta rankena ir integruotas maišelių laikiklis.',
  },
  {
    id: 'includes',
    title: 'Į rinkinį įeina',
    content: '1 vandeniui atsparus reguliuojamas antkaklis, 1 vandeniui atsparus 1,5 m pavadėlis ir suderinamumas su silikoniniais prisegamais pakabukais personalizavimui.',
  },
  {
    id: 'care',
    title: 'Priežiūra',
    content: 'Po purvinų ar paplūdimio pasivaikščiojimų nuplaukite vandeniu ir nusausinkite minkšta šluoste. Džiovinkite paguldę. Venkite tiesioginės aukštos temperatūros, kad išliktų forma ir apdaila.',
  },
  {
    id: 'shipping',
    title: 'Pristatymas ir grąžinimas',
    content: 'Greitas pristatymas visoje Lietuvoje ir ES. Nemokamas pristatymas tinkamiems užsakymams ir paprastas grąžinimas per nustatytą terminą, jei prekė nenaudota ir originalios būklės.',
  },
]

export function ProductInfoTabs({ isDark }: ProductInfoTabsProps) {
  const windowWidth = useWindowWidth() ?? 1200
  const isMobile = windowWidth < 768
  const sectionBg = isDark ? '#241A16' : '#FFFFFF'

  return (
    <section style={{ background: sectionBg, padding: isMobile ? '28px 16px' : '28px 40px 36px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Accordion items={ACCORDION_ITEMS} isMobile={isMobile} />
      </div>
    </section>
  )
}
