import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config'
import type { GuideFaqItem } from '@/lib/guide-schema'

export const GUIDE_PATH = '/guide/kaip-isrinkti-antkakli-su-vardu'
export const GUIDE_TITLE = 'Kaip išsirinkti šuns antkaklį su vardu'
export const GUIDE_DESCRIPTION =
  'Dydis, medžiaga, vardo užrašymo būdas ir sagtis: į ką atkreipti dėmesį renkantis šuns antkaklį su vardu ar telefono numeriu.'
export const GUIDE_PUBLISHED = '2026-10-19'
export const GUIDE_MODIFIED = '2026-10-19'

export const GUIDE_INTRO =
  'Rinkdamiesi šuns antkaklį su vardu, atsižvelkite į keturis dalykus: dydį pagal kaklo apimtį, vandeniui atsparią ir lengvai valomą medžiagą, tvarų vardo ar telefono numerio užrašymo būdą ir patikimą sagtį. Žemiau kiekvienas punktas aptartas atskirai.'

export const QUICK_SUMMARY = [
  'Dydis: išmatuokite plačiausią kaklo vietą ir pridėkite 2–3 cm.',
  'Medžiaga: rinkitės tokią, kuri nesugeria vandens ir kvapų.',
  'Užrašas: svarbiausia telefono numeris, vardas — antroje vietoje.',
  'Sagtis: tvirta, su D žiedu pavadėliui ir reguliuojama.',
] as const

export const MATERIAL_OPTIONS = [
  'BioThane (padengta, vandeniui atspari juosta): nesugeria vandens ir kvapų, po pasivaikščiojimo nuplaunama. Tinka šunims, kurie mėgsta maudytis ir bristi per purvą.',
  'Nailonas: lengvas ir nebrangus, bet sugeria vandenį ir kvapus, o siuvinėtas vardas ilgainiui gali išblukti.',
  'Oda: gražiai atrodo, tačiau nemėgsta vandens ir reikalauja priežiūros.',
] as const

export const NAME_METHODS = [
  'Graviravimas: vardas ar numeris užrašomas ant paties antkaklio, todėl nieko nereikia kabinti ir niekas neskamba.',
  'Siuvinėjimas: dažniausias nailoniniams antkakliams; audinys laikui bėgant dėvisi.',
  'Raidžių pakabukai: dekoratyvus būdas sudėti vardą iš raidžių; keičiami be įrankių.',
  'Metalinis pakabukas: universalus, tačiau gali skambėti ir nukristi.',
] as const

export const FAQ_ITEMS: readonly GuideFaqItem[] = [
  {
    question: 'Kokio dydžio antkaklį rinktis šuniui?',
    answer:
      'Išmatuokite plačiausią šuns kaklo vietą ir pridėkite 2–3 cm. PawsCharm dydžiai: S tinka 28–36 cm, M — 36–44 cm, L — 44–52 cm. Jei šuo tarp dydžių, rinkitės didesnį.',
  },
  {
    question: 'Ar ant antkaklio galima užrašyti telefono numerį?',
    answer:
      'Taip. PawsCharm atsiskaitymo metu galima užsakyti graviravimą: šuns vardą, trumpą žinutę arba telefono numerį.',
  },
  {
    question: 'Kokia medžiaga geriausia šuniui, kuris mėgsta vandenį?',
    answer:
      'Vandeniui atspari medžiaga, kuri nesugeria vandens ir kvapų, pavyzdžiui, BioThane. Ją pakanka nuplauti po pasivaikščiojimo, o nailonas ar oda su vandeniu elgiasi prasčiau.',
  },
  {
    question: 'Kuo antkaklis su vardu skiriasi nuo pakabuko?',
    answer:
      'Pakabukas kabo ant žiedo, gali skambėti ir nukristi. Antkaklis su vardu turi užrašą ant paties antkaklio, todėl nieko papildomo kabinti nereikia.',
  },
  {
    question: 'Kur gaminami PawsCharm antkakliai ir kiek kainuoja pristatymas?',
    answer: `Kiekvienas antkaklis gaminamas rankomis Vilniuje, Lietuvoje. Pristatymas nemokamas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`,
  },
]
