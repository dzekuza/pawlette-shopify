import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['lt', 'en'],
  defaultLocale: 'lt',
  localePrefix: 'as-needed',
  // `/` must always render the default (Lithuanian) site — never auto-redirect to `/en`.
  localeDetection: false,
});
