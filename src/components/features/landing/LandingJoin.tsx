import { useTranslation } from 'react-i18next';
import { LandingJoinTitle } from './LandingJoinTitle';

export function LandingJoin() {
  const { t } = useTranslation();
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
        <footer className="landing-join-footer">
          <span>{t('common.appName').toLowerCase()}</span>
          <p>{t('landing.footer.copyright')}</p>
        </footer>
      </div>
    </section>
  );
}
