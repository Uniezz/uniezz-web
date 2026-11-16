import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SITE_ORIGIN } from '@/utils/site';
import { landingJsonLd } from '@/utils/seo';

test('builds landing JSON-LD with site origin', () => {
  const schemas = landingJsonLd('Student community in Lublin.');
  assert.deepEqual(schemas[0], {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'uniezz',
    url: SITE_ORIGIN,
    description: 'Student community in Lublin.',
    inLanguage: ['en', 'pl', 'uk', 'ru', 'be', 'de', 'es'],
  });
  assert.equal((schemas[1] as { logo: string }).logo, `${SITE_ORIGIN}/favicon.png`);
});
