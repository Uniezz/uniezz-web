import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import type { ChatMessageView, ChatUnreadAtOpen } from '@/@types';
import { useChatMessageList } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { chatDay } from '@/utils';
import { ChatMarker } from './ChatMarker';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatPreviewState } from './ChatImagePreview';

const messageListComponents = { ...listComponents, EmptyPlaceholder: () => <UIEmpty /> };

// A sending message has a `clientId` until the server gives it an `id`, so the key stays the same.
const messageKey = (_: number, message: ChatMessageView) => message.clientId ?? message.id;

// The list opens at the newest message.
const INITIAL_TOP_ITEM = { index: 'LAST', align: 'end' } as const;

export function ChatMessageList({
  conversationId,
  unreadAtOpen,
  onPreview,
}: {
  conversationId: string;
  unreadAtOpen: ChatUnreadAtOpen;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t, i18n } = useTranslation();
  const {
    messages,
    firstItemIndex,
    isLoaded,
    isError,
    refetch,
    loadOlderMessages,
    followNewMessages,
    getRow,
  } = useChatMessageList(conversationId, unreadAtOpen);

  const renderMessage = (itemIndex: number, message: ChatMessageView) => {
    const { outgoing, firstOfDay, firstUnread, position } = getRow(itemIndex, message);
    return (
      <>
        {firstOfDay ? (
          <ChatMarker variant="chip" role="listitem">
            {chatDay(message.createdAt, i18n.language)}
          </ChatMarker>
        ) : null}
        {firstUnread ? (
          <ChatMarker variant="divider" role="listitem">
            {t('chat.newMessages', { count: unreadAtOpen.count })}
          </ChatMarker>
        ) : null}
        <ChatMessageBubble
          message={message}
          outgoing={outgoing}
          position={position}
          onPreview={onPreview}
        />
      </>
    );
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-7 py-5"
      role="log"
      aria-label={t('app.messages')}
    >
      {isLoaded && (
        <Virtuoso
          data={messages}
          firstItemIndex={firstItemIndex}
          rangeChanged={loadOlderMessages}
          computeItemKey={messageKey}
          initialTopMostItemIndex={INITIAL_TOP_ITEM}
          alignToBottom
          followOutput={followNewMessages}
          components={messageListComponents}
          className="min-h-0 flex-1"
          itemContent={renderMessage}
        />
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
