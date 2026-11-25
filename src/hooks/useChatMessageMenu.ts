import { Copy, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView, Option } from '@/@types';
import { captureAnalytics } from '@/utils/analytics';
import { messageActions, type ChatMessageAction } from '@/utils/chatActions';
import { toast } from '@/utils/mutationProgress';

/** The menu of one message. An action is shown only when it has an option here. */
export function useChatMessageMenu(
  message: ChatMessageView,
  outgoing: boolean,
  onDelete: (message: ChatMessageView) => void,
) {
  const { t } = useTranslation();
  const menuOptions: Partial<Record<ChatMessageAction, Option>> = {
    copy: { value: 'copy', label: t('chat.copyText'), Icon: Copy },
    delete: { value: 'delete', label: t('chat.delete'), Icon: Trash2, danger: true },
  };
  const options = messageActions(message, outgoing).flatMap((action) => menuOptions[action] ?? []);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(message.body ?? '');
      captureAnalytics('message_copied');
      toast.success(t('chat.textCopied'));
    } catch {
      captureAnalytics('message_copy_failed');
      toast.error(t('apiState.error'));
    }
  }

  function selectAction(action: string) {
    if (action === 'copy') void copyText();
    if (action === 'delete') onDelete(message);
  }

  return { options, selectAction };
}
