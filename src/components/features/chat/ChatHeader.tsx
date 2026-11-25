import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ChatConversation } from '@/@types';
import { UIAvatar, UIButton } from '@/ui/components';
import { chatAvatar, chatTitle, initials } from '@/utils';

export function ChatHeader({
  conversation,
  onBack,
}: {
  conversation: ChatConversation;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const title = chatTitle(conversation, t('app.accountDeleted'));
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
      <UIAvatar imgSrc={chatAvatar(conversation)} avatarSymbols={initials(title)} />
      <h2 className="text-section font-semibold">{title}</h2>
    </div>
  );
}
