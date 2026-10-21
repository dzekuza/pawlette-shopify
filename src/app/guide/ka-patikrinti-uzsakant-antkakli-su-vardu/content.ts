import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config'
import type { GuideFaqItem } from '@/lib/guide-schema'

export const GUIDE_PATH = '/guide/ka-patikrinti-uzsakant-antkakli-su-vardu'
export const GUIDE_TITLE = 'Ką patikrinti užsakant šuns antkaklį su vardu'
export const GUIDE_DESCRIPTION =
  'Dešimties punktų sąrašas prieš užsakant antkaklį su vardu: dydis, medžiaga, užrašo būdas, sagtis, pristatymas ir grąžinimas. Su lentele ir patarimais.'
export const GUIDE_PUBLISHED = '2026-10-19'
export const GUIDE_MODIFIED = '2026-10-19'

export const GUIDE_INTRO =
  'Prieš užsakydami antkaklį su vardu, patikrinkite dešimt dalykų: dydį, medžiagą, užrašo būdą, galimus simbolius, sagtį, gamintoją, kainą su pristatymu, grąžinimo sąlygas, atsiliepimus ir papildomas išlaidas. Žemiau kiekvienas punktas ir palyginimo lentelė.'

export const CHECKLIST = [
  { title: 'Dydis', text: 'Pasimatuokite kaklą ir rinkitės pagal apimtį, o ne pagal veislę.' },
  { title: 'Medžiaga', text: 'Ar antkaklis atsparus vandeniui ir lengvai valomas? Jei šuo maudosi ar bėgioja per purvą, venkite sugeriančių medžiagų.' },
  { title: 'Užrašo būdas', text: 'Išsiaiškinkite, ar vardas graviruojamas, siuvinėjamas ar kabinamas pakabuke, ir kaip jis atrodys po kelių mėnesių.' },
  { title: 'Raidės ir ilgis', text: 'Paklauskite, kiek simbolių telpa ir ar palaikomos lietuviškos raidės (ą, č, ę, ė, į, š, ų, ū, ž).' },
  { title: 'Telefono numeris', text: 'Jei norite užrašyti telefoną, įsitikinkite, kad tokia galimybė yra. PawsCharm galima užsakyti vardą, trumpą žinutę arba telefono numerį.' },
  { title: 'Sagtis ir D žiedas', text: 'Patikrinkite, ar sagtis tvirta, ar yra žiedas pavadėliui ir ar antkaklis reguliuojamas.' },
  { title: 'Gamintojas', text: 'Sužinokite, kas ir kur gamina. PawsCharm antkakliai gaminami rankomis Vilniuje.' },
  { title: 'Kaina su pristatymu', text: `Palyginkite galutinę kainą, ne tik antkaklio. PawsCharm pristatymas nemokamas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.` },
  { title: 'Grąžinimas ir keitimas', text: 'Personalizuotų prekių sąlygos dažnai skiriasi nuo įprastų, todėl perskaitykite jas prieš užsakydami.' },
  { title: 'Atsiliepimai', text: 'Ieškokite tikrų pirkėjų atsiliepimų, geriausia su nuotraukomis, o ne vien parduotuvės aprašymo.' },
] as const

export const COMPARISON_HEADERS = ['Variantas', 'Kaip pateikiamas vardas', 'Vanduo ir purvas', 'Priežiūra'] as const

export const COMPARISON_ROWS = [
  ['BioThane antkaklis su graviruotu vardu', 'Užrašomas ant paties antkaklio; galima pridėti raidžių pakabukus', 'Nesugeria vandens, nuplaunamas', 'Pakanka nuplauti'],
  ['Nailoninis antkaklis su siuvinėtu vardu', 'Išsiuvinėtas ant audinio', 'Sugeria vandenį ir kvapus', 'Reikia skalbti; siuvinėjimas gali išblukti'],
  ['Odinis antkaklis su metaline plokštele', 'Metalinė plokštelė ar graviruota oda', 'Nemėgsta vandens', 'Reikia odos priežiūros'],
  ['Metalinis pakabukas ant bet kurio antkaklio', 'Atskiras pakabukas su vardu', 'Priklauso nuo antkaklio', 'Gali skambėti ir nukristi'],
] as const

export const FAQ_ITEMS: readonly GuideFaqItem[] = [
  {
    question: 'Ar galima grąžinti personalizuotą antkaklį?',
    answer: 'Tai priklauso nuo pardavėjo sąlygų, todėl jas reikia perskaityti prieš užsakant. PawsCharm sąlygas rasite dažnai užduodamų klausimų puslapyje.',
  },
  {
    question: 'Ką geriausia užrašyti ant antkaklio?',
    answer: 'Telefono numerį ir, jei norite, šuns vardą. Telefonas svarbiausias, nes pasiklydusį šunį radęs žmogus gali iškart paskambinti.',
  },
  {
    question: 'Kuo graviruotas antkaklis skiriasi nuo siuvinėto?',
    answer: 'Graviruotas užrašas daromas ant paties antkaklio, o siuvinėtas — išsiuvinėjamas ant audinio, kuris sugeria vandenį ir ilgainiui dėvisi. Vandeniui atsparios medžiagos užrašą pakanka nuplauti.',
  },
  {
    question: 'Kaip patikrinti, ar antkaklis tinka dydžiu?',
    answer: 'Užsegę antkaklį, pakiškite po juo du pirštus. Jei jie telpa patogiai, dydis tinkamas. Jei telpa trys ar daugiau, rinkitės mažesnį, o jei vos telpa vienas, antkaklis per ankštas.',
  },
]
