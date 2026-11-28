import { useTranslation } from 'react-i18next';

import type { ChatConversation } from '@/@types';
import { UIAvatar } from '@/ui/components';
import { appChatTime, chatMessageText, chatTitle } from '@/utils';

/** The mobile app's ConversationRow: a 48px avatar, the name and time, then the preview and unread badge. */
export function ConversationRow({
  conversation,
  onOpen,
}: {
  conversation: ChatConversation;
  onOpen: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const { lastMessage, unreadCount } = conversation;
  const title = chatTitle(conversation, t('app.accountDeleted'));
  const handleClick = () => onOpen(conversation.id);
  return (
    <button
      type="button"
      data-ph-capture-attribute-label="Open conversation"
      aria-label={title}
      onClick={handleClick}
      className="flex w-full items-center gap-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-blue active:opacity-80"
    >
      <UIAvatar
        imgSrc={conversation.peer?.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="shrink-0 [&>div]:size-12"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.75">
        <span className="flex items-center gap-2">
          <strong className="min-w-0 flex-1 truncate text-base font-semibold">{title}</strong>
          <span className="shrink-0 text-detail text-secondary">
            {appChatTime(lastMessage?.createdAt ?? conversation.createdAt, i18n.language)}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            className={`min-w-0 shrink truncate text-label leading-normal ${unreadCount > 0 ? 'text-white' : 'text-secondary'}`}
          >
            {lastMessage ? chatMessageText(lastMessage, t) : ''}
          </span>
          {unreadCount > 0 && (
            <span className="shrink-0 rounded-full bg-blue px-1.75 py-px text-micro font-semibold">
              {unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
