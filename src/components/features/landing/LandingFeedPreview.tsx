import { CornerDownRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingFeedPreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-question-art">
      <span className="landing-art-punctuation" aria-hidden>
        ?
      </span>
      <p className="landing-art-question">{t('landing.preview.question')}</p>
      <p className="landing-art-answer">
        <CornerDownRight aria-hidden />
        <span>{t('landing.preview.reply')}</span>
      </p>
    </div>
  );
}
