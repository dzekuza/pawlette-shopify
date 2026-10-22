import type { BreedGroup } from '@/lib/data'
import type { GuideFaqItem } from '@/lib/guide-schema'

export const GUIDE_PATH = '/guide/antkakliu-dydziai-pagal-veisle'
export const GUIDE_TITLE = 'Šunų antkaklių dydžiai pagal veislę'
export const GUIDE_DESCRIPTION =
  'Kaklo apimtis ir antkaklio dydis 34 populiarioms šunų veislėms — nuo čihuahua iki rotveilerio. Lentelė centimetrais su S, M ir L dydžiais.'
export const GUIDE_PUBLISHED = '2026-10-23'
export const GUIDE_MODIFIED = '2026-10-23'

export const GUIDE_INTRO =
  'Kokio dydžio antkaklio reikia jūsų šuniui? Žemiau rasite apytikslę suaugusių šunų kaklo apimtį 34 populiarioms veislėms ir kurį PawsCharm dydį ji atitinka. Lentelė padeda orientuotis, bet tikslų dydį visada nustatykite išmatavę savo šunį.'

export const BREED_GROUPS: readonly { key: BreedGroup, title: string, intro: string }[] = [
  { key: 'small', title: 'Maži šunys', intro: 'Mažų veislių kaklai labai skiriasi — čihuahua gali būti vos 18 cm, o mopsas jau 40 cm.' },
  { key: 'medium', title: 'Vidutiniai šunys', intro: 'Daugumai vidutinių veislių tinka M, bet dalis šunų lieka tarp S ir M — matuokite.' },
  { key: 'large', title: 'Dideli šunys', intro: 'Stambių veislių patinai dažnai išauga iš L dydžio, todėl prieš užsakant būtina išmatuoti.' },
]

export const FAQ_ITEMS: readonly GuideFaqItem[] = [
  {
    question: 'Ar užtenka žinoti veislę, kad parinkčiau antkaklio dydį?',
    answer: 'Ne. Veislė parodo tik apytikslį intervalą — patinai, patelės, šuniukai ir mišrūnai gali skirtis 10 cm ir daugiau. Visada išmatuokite savo šunį ir dydį rinkitės pagal centimetrus.',
  },
  {
    question: 'Ką daryti, jei šuns kaklo apimtis tarp dviejų dydžių?',
    answer: 'Rinkitės didesnį dydį. Šiek tiek didesnis antkaklis yra saugesnis ir patogesnis nei per ankštas, o reguliavimo skylutės leidžia jį priveržti.',
  },
  {
    question: 'Kokio dydžio antkaklio reikia šuniukui?',
    answer: 'Šuniukai auga greitai, todėl matuokite kas 2–3 savaites ir tikrinkite dviejų pirštų taisykle. Didelių veislių šuniukams dažniausiai prireikia 2–3 antkaklių, kol užauga.',
  },
  {
    question: 'Kaip parinkti dydį mišrūnui?',
    answer: 'Mišrūnams veislių lentelė mažai padeda — išmatuokite kaklo apimtį plačiausioje vietoje ir palyginkite su S (28–36 cm), M (36–44 cm) ir L (44–52 cm) dydžiais.',
  },
  {
    question: 'Mano šuns kaklas mažesnis nei 28 cm arba didesnis nei 52 cm. Ar turite tinkamą antkaklį?',
    answer: 'Šiuo metu PawsCharm antkakliai gaminami S, M ir L dydžiais (28–52 cm). Jei jūsų šuo už šių ribų, parašykite mums į info@pawscharm.com — pranešime, kai atsiras daugiau dydžių.',
  },
]

export const EMBED_SNIPPET = `<a href="https://pawscharm.com${GUIDE_PATH}">${GUIDE_TITLE} — PawsCharm</a>`
