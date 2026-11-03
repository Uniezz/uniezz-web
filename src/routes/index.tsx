import { createFileRoute } from '@tanstack/react-router';
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

  return (
    <div className="landing-page min-h-svh overflow-x-clip bg-ink text-white">
      <header className="landing-header">
        <a
          href="#life"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
          aria-label={t('common.appName')}
        >
          <img src="/favicon.png" alt="" className="size-9 rounded-lg" />
          <span className="hidden sm:inline">{t('common.appName').toLowerCase()}</span>
        </a>
        <nav
          aria-label={t('landing.navigation')}
          className="hidden items-center gap-7 text-body text-secondary lg:flex"
        >
          <a className="landing-text-link" href="#explore">
            {t('landing.navCommunity')}
          </a>
          <a className="landing-text-link" href="#unicat">
            {t('landing.unicat.nav')}
          </a>
          <a className="landing-text-link" href="#join">
            {t('landing.navJoin')}
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <UILanguageSwitcher />
          <UIButton navigateTo="/login" bg="secondary" size="sm">
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
