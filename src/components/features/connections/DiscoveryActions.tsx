import { Link } from '@tanstack/react-router';
import { Heart, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton, UIPanel } from '@/ui/components';

export function DiscoveryActions({
  showProfile,
  connected,
  onPass,
  onConnect,
}: {
  showProfile: boolean;
  connected: boolean;
  onPass: () => void;
  onConnect: () => void;
}) {
  const { t } = useTranslation();
  return (
    <UIPanel className="flex justify-center gap-3.5">
      {[
        { label: t('app.pass'), icon: X, action: onPass, primary: false },
        {
          label: connected ? t('app.connected') : t('app.connect'),
          icon: Heart,
          action: onConnect,
          primary: true,
        },
      ].map(({ label, icon: Icon, action, primary }) => (
        <div key={label} className="text-center">
          <UIButton
            size="icon"
            className="mb-2 size-16"
            bg={primary ? 'primary' : 'secondary'}
            aria-label={label}
            disabled={!showProfile}
            onClick={action}
          >
            <Icon size={24} />
          </UIButton>
          <p className="text-detail text-secondary">{label}</p>
        </div>
      ))}
      <div className="text-center">
        <Link
          to="/chat"
          search={{ recipient: 'Zofia' }}
          aria-label={t('app.message')}
          className="mb-2 inline-flex size-16 items-center justify-center rounded-full border border-white-10 bg-white-5"
        >
          <MessageCircle size={24} />
        </Link>
        <p className="text-detail text-secondary">{t('app.message')}</p>
      </div>
    </UIPanel>
  );
}
