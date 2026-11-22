import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { Conversation } from '@/@types';
import { UIAvatar, UIButton } from '@/ui/components';
// TODO(api): Replace mock chat status with API-backed presence data.
import { CHATMOCKS } from '@/utils';

export function ChatHeader({ current, onBack }: { current: Conversation; onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 border-b border-white-5 px-5 py-4">
      <UIButton
        bg="transparent"
        size="icon"
        className="md:hidden"
        aria-label={t('app.back')}
        onClick={onBack}
      >
        <ArrowLeft size={18} />
      </UIButton>
      <UIAvatar
        imgSrc={current.imageUrl || (current.image ? `/app/rPsdQ-${current.image}.jpg` : undefined)}
        avatarSymbols={current.name.slice(0, 2)}
      />
      <div>
        <h2 className="text-section font-semibold">{current.name}</h2>
        {current.name === 'Kateryna Melnyk' && (
          <p className="text-detail text-secondary">{CHATMOCKS.status}</p>
        )}
      </div>
    </div>
  );
}
