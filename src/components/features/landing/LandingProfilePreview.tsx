import { Headphones, Footprints, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingProfilePreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-interests-art">
      {[
        { Icon: Headphones, text: t('landing.preview.interestMusic') },
        { Icon: Footprints, text: t('landing.preview.interestWalks') },
        { Icon: Coffee, text: t('landing.preview.interestCoffee') },
      ].map(({ Icon, text }) => (
        <p key={text}>
          <Icon aria-hidden />
          <span>{text}</span>
        </p>
      ))}
    </div>
  );
}
