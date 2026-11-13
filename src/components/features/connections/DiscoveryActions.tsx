import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';
import { UIButton } from '@/ui/components';

export type DiscoveryActionsProps = {
  disabled: boolean;
  onPass: () => void;
  onConnect: () => void;
};

export function DiscoveryActions({ disabled, onPass, onConnect }: DiscoveryActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center gap-3.5">
      {[
        { label: t('app.pass'), icon: X, action: onPass, primary: false },
        { label: t('app.connect'), icon: Heart, action: onConnect, primary: true },
      ].map(({ label, icon: Icon, action, primary }) => (
        <div key={label} className="text-center">
          <UIButton
            size="icon"
            className={cn('mb-2 size-16', !primary && 'text-danger')}
            bg={primary ? 'primary' : 'secondary'}
            aria-label={label}
            disabled={disabled}
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
