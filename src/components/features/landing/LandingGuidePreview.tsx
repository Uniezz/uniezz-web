import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingGuidePreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-signpost-art">
      <span className="landing-signpost-pole" aria-hidden />
      <p className="landing-signpost-city">{t('landing.preview.city')}</p>
      <p className="landing-street-sign">
        <span>{t('app.hangouts')}</span>
        <ArrowRight aria-hidden />
      </p>
      <p className="landing-street-sign landing-street-sign-left">
        <ArrowLeft aria-hidden />
        <span>{t('app.groceries')}</span>
      </p>
      <p className="landing-street-sign">
        <span>{t('app.dorms')}</span>
        <ArrowRight aria-hidden />
      </p>
      <span className="landing-signpost-ground" aria-hidden />
    </div>
  );
}
