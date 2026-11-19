import i18n from '@/i18n';

import { landingJsonLd } from '@/utils/seo';
import { SITE_ORIGIN } from '@/utils/site';

const OG_IMAGE = `${SITE_ORIGIN}/og.png`;

type RobotsDirective = 'index, follow' | 'noindex, nofollow';

type PageHeadInput = {
  title: string;
  description: string;
  canonicalPath: string;
  robots: RobotsDirective;
};

export function buildPageHead({ title, description, canonicalPath, robots }: PageHeadInput) {
  const canonicalUrl = new URL(canonicalPath, SITE_ORIGIN).href;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'uniezz' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  };
}

export function homeRouteHead() {
  const description = i18n.t('landing.hero.description');
  return {
    ...buildPageHead({
      title: i18n.t('seo.homeTitle'),
      description,
      canonicalPath: '/',
      robots: 'index, follow',
    }),
    scripts: landingJsonLd(description).map((schema) => ({
      type: 'application/ld+json',
      children: JSON.stringify(schema),
    })),
  };
}

export function privacyRouteHead() {
  return buildPageHead({
    title: i18n.t('seo.privacyTitle'),
    description: i18n.t('seo.privacyDescription'),
    canonicalPath: '/privacy',
    robots: 'index, follow',
  });
}

export function termsRouteHead() {
  return buildPageHead({
    title: i18n.t('seo.termsTitle'),
    description: i18n.t('seo.termsDescription'),
    canonicalPath: '/terms',
    robots: 'index, follow',
  });
}

export function childSafetyRouteHead() {
  return buildPageHead({
    title: i18n.t('seo.childSafetyTitle'),
    description: i18n.t('seo.childSafetyDescription'),
    canonicalPath: '/child-safety',
    robots: 'index, follow',
  });
}

export function privateRouteHead(canonicalPath: string) {
  return buildPageHead({
    title: i18n.t('seo.appTitle'),
    description: i18n.t('seo.defaultDescription'),
    canonicalPath,
    robots: 'noindex, nofollow',
  });
}
