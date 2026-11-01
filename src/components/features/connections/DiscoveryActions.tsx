import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';
import { UIButton } from '@/ui/components';

// TODO(api): Replace local pass/connect toggles with discovery API mutations.
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
    <div className="flex justify-center gap-3.5">
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
            className={cn('mb-2 size-16', !primary && 'text-danger')}
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
    </div>
  );
}
