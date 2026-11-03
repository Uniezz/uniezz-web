import { useTranslation } from 'react-i18next';

const integral = '∫ x² dx';
const solution = '= x³ / 3 + C';

export function LandingStudyPreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-study-art">
      <div className="landing-notebook">
        <div className="landing-notebook-page">
          <p className="landing-notebook-heading">{t('app.pastPapers')}</p>
          <span className="landing-notebook-formula" aria-hidden>
            {integral}
          </span>
          <span className="landing-notebook-solution" aria-hidden>
            {solution}
          </span>
        </div>
        <div className="landing-notebook-page">
          <p className="landing-notebook-subject">{t('landing.preview.materialOne')}</p>
          <svg viewBox="0 0 160 140" className="landing-notebook-graph" aria-hidden>
            <path d="M20 10V120H150M28 106Q75 105 135 22" />
            <path d="M15 18L20 10L25 18M142 115L150 120L142 125" />
          </svg>
        </div>
        <div className="landing-notebook-binding" aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
