import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import type { ChatMessageView, ChatUnreadAtOpen } from '@/@types';
import { useChatMessageList } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { chatDay } from '@/utils';
import { ChatJumpToLatest } from './ChatJumpToLatest';
import { ChatMarker } from './ChatMarker';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatPreviewState } from './ChatImagePreview';
import { ChatThreadSkeleton } from './ChatThreadSkeleton';

function EmptyThread() {
  const { t } = useTranslation();
  return (
    <UIEmpty>
      <p>{t('chat.emptyThread')}</p>
    </UIEmpty>
  );
}

const messageListComponents = { ...listComponents, EmptyPlaceholder: EmptyThread };

// A sending message has a `clientId` until the server gives it an `id`, so the key stays the same.
const messageKey = (_: number, message: ChatMessageView) => message.clientId ?? message.id;

// The newest message: the list opens there, and the jump button scrolls there.
const LATEST_ITEM = { index: 'LAST', align: 'end' } as const;

export function ChatMessageList({
  conversationId,
  isGroup,
  unreadAtOpen,
  onPreview,
}: {
  conversationId: string;
  isGroup: boolean;
  unreadAtOpen: ChatUnreadAtOpen;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t, i18n } = useTranslation();
  const list = useRef<VirtuosoHandle>(null);
  const {
    messages,
    firstItemIndex,
    isPending,
    isLoaded,
    isError,
    refetch,
    loadOlderMessages,
    followNewMessages,
    handleAtBottomChange,
    isScrolledUp,
    newCount,
    getRow,
  } = useChatMessageList(conversationId, unreadAtOpen);

  const jumpLabel =
    newCount > 0
      ? `${t('chat.jumpToLatest')}, ${t('chat.newMessages', { count: newCount })}`
      : t('chat.jumpToLatest');

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
          isGroup={isGroup}
          onPreview={onPreview}
        />
      </>
    );
  };

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col px-7 py-5"
      role="log"
      aria-label={t('app.messages')}
    >
      {isPending ? <ChatThreadSkeleton /> : null}
      {isLoaded && (
        <Virtuoso
          ref={list}
          data={messages}
          firstItemIndex={firstItemIndex}
          rangeChanged={loadOlderMessages}
          computeItemKey={messageKey}
          initialTopMostItemIndex={LATEST_ITEM}
          alignToBottom
          followOutput={followNewMessages}
          atBottomStateChange={handleAtBottomChange}
          components={messageListComponents}
          className="min-h-0 flex-1"
          itemContent={renderMessage}
        />
      )}
      {isScrolledUp ? (
        <ChatJumpToLatest
          unreadCount={newCount}
          aria-label={jumpLabel}
          className="absolute right-7 bottom-5"
          onClick={() => list.current?.scrollToIndex(LATEST_ITEM)}
        />
      ) : null}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
