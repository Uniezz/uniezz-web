import { SITE_ORIGIN } from '@/utils/site';

export function landingJsonLd(description: string): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'uniezz',
      url: SITE_ORIGIN,
      description,
      inLanguage: ['en', 'pl', 'uk', 'ru', 'be', 'de', 'es'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'uniezz',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/favicon.png`,
      parentOrganization: {
        '@type': 'Organization',
        name: 'MADIS sp. z o.o.',
      },
    },
  ];
}
