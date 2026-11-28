import { useTranslation } from 'react-i18next';

import type { ChatConversation } from '@/@types';
import { useAcceptChatRequest, useDeclineChatRequest } from '@/hooks';
import { UIButton } from '@/ui/components';
import { apiErrorKey, chatTitle, toast } from '@/utils';

/**
 * Phone-only: the mobile app's ChatRequestBar in place of the composer while a message request waits.
 * The recipient accepts or declines; the sender, having used their one message, waits.
 */
export function ChatRequestBar({
  conversation,
  onDeclined,
}: {
  conversation: ChatConversation;
  onDeclined: () => void;
}) {
  const { t } = useTranslation();
  const name = chatTitle(conversation, t('app.accountDeleted'));
  const { mutateAsync: accept, isPending: isAccepting } = useAcceptChatRequest(conversation.id);
  const { mutateAsync: decline, isPending: isDeclining } = useDeclineChatRequest(conversation.id);
  const isBusy = isAccepting || isDeclining;

  const handleAccept = async () => {
    try {
      await accept();
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  };
  const handleDecline = async () => {
    try {
      await decline();
      toast.success(t('chat.requestDeclined'));
      onDeclined();
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  };

  if (!conversation.incoming) {
    return (
      <div className="flex flex-col gap-1.5 rounded-2xl p-3.5 glass">
        <p className="text-center text-label text-secondary">
          {t('chat.requestWaiting', { name })}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl p-3.5 glass">
      <p className="text-center text-body font-semibold">{t('chat.requestFrom', { name })}</p>
      <p className="text-center text-micro text-secondary">{t('chat.requestHint')}</p>
      <div className="mt-1.5 flex gap-2">
        <UIButton
          bg="secondary"
          disabled={isBusy}
          onClick={() => void handleDecline()}
          className="flex-1 rounded-[14px]"
        >
          {t('chat.decline')}
        </UIButton>
        <UIButton
          disabled={isBusy}
          onClick={() => void handleAccept()}
          className="flex-1 rounded-[14px]"
        >
          {t('chat.accept')}
        </UIButton>
      </div>
    </div>
  );
}
