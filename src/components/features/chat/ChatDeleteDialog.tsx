import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { useDeleteMessage } from '@/hooks';
import { UIButton, UIDialog } from '@/ui/components';

export function ChatDeleteDialog({
  message,
  onClose,
}: {
  /** The message to delete. Without one, the dialog is closed. */
  message: ChatMessageView | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { mutate: deleteMessage, isPending } = useDeleteMessage();
  return (
    <UIDialog
      open={message !== null}
      onOpenChange={onClose}
      dismissible={!isPending}
      title={t('chat.deleteTitle')}
      description={t('chat.deleteDescription')}
      className="max-w-100"
    >
      <div className="flex flex-col gap-2">
        <UIButton
          size="pill"
          bg="danger"
          disabled={isPending}
          onClick={() => message && deleteMessage(message, { onSuccess: onClose })}
        >
          {t('chat.deleteForEveryone')}
        </UIButton>
        <UIButton size="pill" bg="transparent" disabled={isPending} onClick={onClose}>
          {t('app.cancel')}
        </UIButton>
      </div>
    </UIDialog>
  );
}
