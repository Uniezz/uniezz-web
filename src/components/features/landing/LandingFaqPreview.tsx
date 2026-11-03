import { useTranslation } from 'react-i18next';

const questionKeys = ['faqOne', 'faqTwo', 'faqThree'] as const;

export function LandingFaqPreview() {
  const { t } = useTranslation();

  return (
    <div className="landing-feature-art landing-faq-art" aria-hidden="true">
      <div className="landing-faq-sheet">
        <p className="landing-faq-sheet-title">{t('faq.title')}</p>
        <ul className="landing-faq-list">
          {questionKeys.map((key) => (
            <li key={key}>
              <span>{t(`landing.preview.${key}`)}</span>
              <span aria-hidden>+</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
