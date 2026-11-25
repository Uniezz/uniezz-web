import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useOnline } from '@/hooks/useOnline';

export function ChatOfflineBanner() {
  const { t } = useTranslation();
  const isOnline = useOnline();
  // The status element is always there, so a screen reader announces the text when it appears.
  return (
    <div role="status">
      {isOnline ? null : (
        <p className="flex items-center justify-center gap-2 bg-warning-soft px-5 py-2 text-detail text-warning">
          <WifiOff size={16} aria-hidden="true" />
          {t('chat.offline')}
        </p>
      )}
    </div>
  );
}
