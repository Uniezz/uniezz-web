import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLandingScroll } from '@/hooks/useLandingScroll';
import { LandingCatPortrait } from './LandingCatPortrait';

export function LandingUnicat() {
  const { t } = useTranslation();
  const { ref } = useLandingScroll();
  return (
    <section ref={ref} id="unicat" className="landing-unicat" aria-labelledby="unicat-title">
      <div className="landing-unicat-stage">
        <span aria-hidden className="landing-unicat-word">
          {t('landing.unicat.name')}
        </span>
        <LandingCatPortrait />
        <div className="landing-unicat-copy landing-container">
          <div>
            <h2 id="unicat-title" className="landing-display">
              {t('landing.unicat.title')}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-white/80">{t('landing.unicat.note')}</p>
            <a
              href="#explore"
              data-ph-capture-attribute-label={t('landing.unicat.action')}
              className="landing-text-link mt-5 text-body"
            >
              {t('landing.unicat.action')}
              <ArrowDown size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
