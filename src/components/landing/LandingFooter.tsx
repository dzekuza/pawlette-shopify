'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Eyebrow } from '@/components/storefront/Typography';
import { FREE_SHIPPING_THRESHOLD_EURO } from '@/lib/site-config';
import ltMessages from '@/messages/lt.json';
import enMessages from '@/messages/en.json';
import { localizeHref } from '@/lib/locale-path';

// LandingFooter is imported directly by non-migrated pages (/faq, /cart,
// /checkout) that sit outside the `[locale]` route segment and have no
// NextIntlClientProvider ancestor. Calling next-intl's useTranslations()
// here throws ("No intl context found") on those routes. So instead of the
// hook, resolve copy from a plain object keyed by the URL's locale prefix,
// mirroring the same segment check CartDrawer/LanguageSwitcher use
// (`/en/...` → en, everything else → lt).
const FOOTER_STRINGS = { lt: ltMessages.landing.footer, en: enMessages.landing.footer };
const COMMON_STRINGS = { lt: ltMessages.common, en: enMessages.common };

const FOOTER_COLS = [
  { key: 'store', links: [
    { key: 'collarSets', href: '/products' },
    { key: 'leashes', href: '/pavadeliai' },
    { key: 'charms', href: '/products/pawcharms-pakabuciai' },
    { key: 'buildYourOwn', href: '/products' },
  ]},
  { key: 'support', links: [
    { key: 'allGuides', href: '/guide' },
    { key: 'sizeGuide', href: '/guide/how-to-measure-dog-collar' },
    { key: 'breedSizes', href: '/guide/antkakliu-dydziai-pagal-veisle' },
    { key: 'siliconeVsNylon', href: '/guide/silicone-vs-nylon-dog-collars' },
    { key: 'chooseCollar', href: '/guide/kaip-isrinkti-antkakli-su-vardu' },
    { key: 'orderChecklist', href: '/guide/ka-patikrinti-uzsakant-antkakli-su-vardu' },
    { key: 'shipping', href: '/faq#orders' },
    { key: 'returns', href: '/faq#orders' },
  ]},
  { key: 'brand', links: [
    { key: 'ourStory', href: '/#about' },
    { key: 'faq', href: '/faq#products' },
    { key: 'contact', href: 'mailto:info@pawscharm.com' },
  ]},
] as const;

export function LandingFooter() {
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const t = FOOTER_STRINGS[locale];
  const tCommon = COMMON_STRINGS[locale];
  const shippingCopy = tCommon.freeShipping.replace('{threshold}', String(FREE_SHIPPING_THRESHOLD_EURO));
  const homeHref = localizeHref('/', locale);
  return (
    <footer className="bg-cream px-4 pb-6 pt-8 text-cream md:px-6 md:pb-8 md:pt-12">
      <div className="mx-auto max-w-[1152px] rounded-[32px] bg-bark p-7 md:p-12">
        <div className="mb-12 grid gap-10 md:mb-16 md:gap-12 xl:grid-cols-[1.6fr_2fr]">
          <div className="flex flex-col items-start gap-5">
            <Link href={homeHref} aria-label={t.logoAriaLabel} className="inline-flex">
              <Image src="/pawcharms.svg" alt="PawsCharm" width={64} height={32} className="block h-9 w-auto" />
            </Link>
            <p className="m-0 max-w-[300px] text-[15px] leading-relaxed text-cream/70">{t.tagline}</p>
            <p className="m-0 font-handwriting text-xl leading-none text-sage">{t.swapNote}</p>
            <div className="flex flex-wrap gap-2">
              {[shippingCopy, t.returnsBadge].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cream/15 bg-cream/[0.07] px-3 py-1.5 text-xs font-medium leading-none text-cream/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
            {FOOTER_COLS.map((col, index) => (
              <div key={col.key} className={index === FOOTER_COLS.length - 1 ? 'col-span-2 md:col-span-1' : ''}>
                <Eyebrow className="mb-5 text-cream/45">{t.columns[col.key].title}</Eyebrow>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {col.links.map((l) => (
                    <li key={l.key}>
                      <Link
                        href={localizeHref(l.href, locale)}
                        className="text-[15px] leading-snug text-cream/75 no-underline underline-offset-4 transition-colors duration-150 hover:text-cream hover:underline"
                      >
                        {(t.columns[col.key].links as Record<string, string>)[l.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/10 pt-6 text-sm text-cream/50 md:flex-row md:items-center md:justify-between md:gap-4">
          <div>{t.copyright.replace('{year}', String(new Date().getFullYear()))}</div>
          <div>{t.contactLine.replace('{email}', 'info@pawscharm.com')}</div>
        </div>
      </div>
    </footer>
  );
}
