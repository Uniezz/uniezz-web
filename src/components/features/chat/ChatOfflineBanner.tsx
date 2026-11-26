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
        <p className="mx-5 mt-3 flex items-center gap-2.5 rounded-[14px] border border-amber-30 bg-amber-10 px-3.5 py-2.5 text-detail text-amber">
          <WifiOff size={16} aria-hidden="true" />
          {t('chat.offline')}
        </p>
      )}
    </div>
  );
}
