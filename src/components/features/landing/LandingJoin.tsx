import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { LandingJoinTitle } from './LandingJoinTitle';

export function LandingJoin() {
  const { t, i18n } = useTranslation();
  const isPolish = i18n.resolvedLanguage === 'pl';
  const steps = [
    { title: t('landing.steps.universityTitle'), body: t('landing.steps.universityBody') },
    { title: t('landing.steps.verifyTitle'), body: t('landing.steps.verifyBody') },
    { title: t('landing.steps.connectTitle'), body: t('landing.steps.connectBody') },
  ];
  return (
    <section id="join" className="landing-join" aria-labelledby="join-title">
      <ol className="landing-join-steps landing-container">
        {steps.map(({ title, body }) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
      <div className="landing-join-stage landing-container">
        <div className="landing-join-invitation">
          <p className="landing-join-statement">{t('landing.footer.statement')}</p>
          <LandingJoinTitle />
        </div>
        <footer className="landing-join-footer flex-wrap">
          <span>{t('common.appName').toLowerCase()}</span>
          <p>{t('landing.footer.copyright')}</p>
          <nav
            aria-label={isPolish ? 'Informacje prawne' : 'Legal information'}
            className="flex gap-4"
          >
            <Link
              to="/privacy"
              data-ph-capture-attribute-label={isPolish ? 'Polityka prywatności' : 'Privacy policy'}
              className="hover:text-white"
            >
              {isPolish ? 'Polityka prywatności' : 'Privacy policy'}
            </Link>
            <Link
              to="/terms"
              data-ph-capture-attribute-label={isPolish ? 'Regulamin' : 'Terms and conditions'}
              className="hover:text-white"
            >
              {isPolish ? 'Regulamin' : 'Terms and conditions'}
            </Link>
            <Link
              to="/child-safety"
              data-ph-capture-attribute-label={
                isPolish ? 'Standardy bezpieczeństwa dzieci' : 'Child safety standards'
              }
              className="hover:text-white"
            >
              {isPolish ? 'Bezpieczeństwo dzieci' : 'Child safety'}
            </Link>
          </nav>
        </footer>
      </div>
    </section>
  );
}
