import type { MouseEvent } from 'react';
import { captureAnalytics } from '@/utils/analytics';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UniversityMap } from '@/components/landing';
import { LandingProgress } from '@/components/features/landing/LandingProgress';
import { LandingJoin } from '@/components/features/landing/LandingJoin';
import { LandingHero } from '@/components/features/landing/LandingHero';
import { LandingTour } from '@/components/features/landing/LandingTour';
import { LandingUnicat } from '@/components/features/landing/LandingUnicat';
import { useUniversities } from '@/hooks';
import { UIButton, UILanguageSwitcher } from '@/ui/components';

export const Route = createFileRoute('/')({ component: LandingPage });

function LandingPage() {
  const { t } = useTranslation();
  const { data: universities = [], isPending, isError } = useUniversities();

  const handleSignInClick = (event: MouseEvent<HTMLElement>) => {
    if (event.button !== 0 && event.button !== 1) return;
    captureAnalytics('landing_sign_in_clicked', { cta: 'landing-sign-in-header' });
  };

  return (
    <div className="landing-page bg-app min-h-svh overflow-x-clip text-white">
      <header className="landing-header">
        <Link
          to="/"
          className="flex items-center gap-0.5 text-xl font-semibold tracking-tight"
          data-ph-capture-attribute-label={t('common.appName')}
          aria-label={t('common.appName')}
        >
          {/* The icon is the "u", so the wordmark reads as one word: [u]niezz. */}
          <img src="/favicon.png" alt="" className="size-9 rounded-lg" />
          <span className="hidden sm:inline">{t('common.appName').toLowerCase().slice(1)}</span>
        </Link>
        <nav
          aria-label={t('landing.navigation')}
          className="hidden items-center gap-7 text-body text-secondary lg:flex"
        >
          <a
            className="landing-text-link"
            data-ph-capture-attribute-label={t('landing.navCommunity')}
            href="#explore"
          >
            {t('landing.navCommunity')}
          </a>
          <a
            className="landing-text-link"
            data-ph-capture-attribute-label={t('landing.unicat.nav')}
            href="#unicat"
          >
            {t('landing.unicat.nav')}
          </a>
          <a
            className="landing-text-link"
            data-ph-capture-attribute-label={t('landing.navJoin')}
            href="#join"
          >
            {t('landing.navJoin')}
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <UILanguageSwitcher />
          <UIButton
            onClick={handleSignInClick}
            onAuxClick={handleSignInClick}
            id="landing-sign-in-header"
            navigateTo="/login"
            bg="secondary"
            size="sm"
          >
            {t('landing.signIn')}
            <ArrowUpRight size={16} aria-hidden />
          </UIButton>
        </div>
      </header>
      <LandingProgress />
      <main>
        <LandingHero />
        <LandingUnicat />
        <LandingTour />
        <UniversityMap universities={universities} isLoading={isPending} isError={isError} />
        <LandingJoin />
      </main>
    </div>
  );
}
