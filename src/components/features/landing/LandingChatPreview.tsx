import { useTranslation } from 'react-i18next';

export function LandingChatPreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-conversation-art">
      <p>{t('landing.preview.messageOne')}</p>
      <p>{t('landing.preview.messageTwo')}</p>
      <p>{t('landing.preview.messageThree')}</p>
    </div>
  );
}
