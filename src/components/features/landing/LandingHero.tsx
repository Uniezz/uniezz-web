import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLandingScroll } from '@/hooks/useLandingScroll';
import { UIButton } from '@/ui/components';
import { LandingFeedPreview } from './LandingFeedPreview';

export function LandingHero() {
  const { t } = useTranslation();
  const { ref, activeStep, isPinned } = useLandingScroll(2);
  return (
    <section ref={ref} id="life" className="landing-opening" aria-labelledby="landing-title">
      <div className="landing-opening-stage">
        <div aria-hidden className="landing-light-field" />
        <div aria-hidden className="landing-film-grain" />
        <div className="landing-opening-front" inert={isPinned && activeStep === 1}>
          <p className="landing-eyebrow">{t('landing.hero.eyebrow')}</p>
          <h1 id="landing-title" className="landing-wordmark">
            {t('common.appName').toLowerCase()}
          </h1>
          <div className="landing-opening-intro">
            <p>{t('landing.hero.description')}</p>
            <UIButton navigateTo="/login" bg="transparent" className="landing-cta mt-6">
              {t('landing.findPeople')}
              <ArrowUpRight size={18} aria-hidden />
            </UIButton>
          </div>
        </div>
        <div
          className="landing-opening-reveal landing-container"
          inert={isPinned && activeStep === 0}
        >
          <div className="landing-opening-copy">
            <h2 className="landing-display">
              {t('landing.hero.title')}
              <br />
              <span className="text-sky">{t('landing.hero.serif')}</span>
            </h2>
            <p className="mt-6 max-w-95 text-base leading-relaxed text-secondary">
              {t('landing.hero.caption')}
            </p>
          </div>
          <div className="landing-opening-product">
            <LandingFeedPreview />
          </div>
        </div>
        <div className="landing-hero-bottom">
          <a href="#unicat" className="landing-text-link">
            {t('landing.hero.scroll')}
            <ArrowDown size={14} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
