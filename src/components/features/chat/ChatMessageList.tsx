import { useTranslation } from 'react-i18next';
import { Virtuoso, type ListRange } from 'react-virtuoso';

import type { ChatMessageView } from '@/@types';
import { useMessages, useMyProfile } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { chatDay, isOwnMessage, messagePosition, startsDay } from '@/utils';
import { ChatMarker } from './ChatMarker';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatPreviewState } from './ChatImagePreview';

// Virtuoso keeps the scroll position when older messages are added at the top only if `firstItemIndex`
// goes down by their number. It cannot be negative, so it starts high.
const START_INDEX = 1_000_000;

const messageListComponents = { ...listComponents, EmptyPlaceholder: () => <UIEmpty /> };

// A sending message has a `clientId` until the server gives it an `id`, so the key stays the same.
const messageKey = (_: number, message: ChatMessageView) => message.clientId ?? message.id;

// The list opens at the newest message.
const INITIAL_TOP_ITEM = { index: 'LAST', align: 'end' } as const;

export function ChatMessageList({
  conversationId,
  onPreview,
}: {
  conversationId: string;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t, i18n } = useTranslation();
  const { data: me } = useMyProfile();
  const { data, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessages(conversationId);
  // Pages are newest first, but the thread reads oldest first. System and deleted messages come with W4.
  const pages = (data?.pages ?? []).map((page) =>
    (page.items ?? []).filter(({ kind, deletedAt }) => kind === 'text' && !deletedAt),
  );
  const messages: ChatMessageView[] = pages.flat().reverse();
  const firstItemIndex = START_INDEX - pages.slice(1).flat().length;

  // Older messages load before the student reaches the top.
  const loadOlderMessages = ({ startIndex }: ListRange) => {
    if (startIndex - firstItemIndex <= 30 && hasNextPage && !isFetchingNextPage)
      void fetchNextPage();
  };

  // A new message scrolls the list only at the bottom, or when it is the one being sent.
  const followNewMessages = (isAtBottom: boolean) =>
    isAtBottom || messages.at(-1)?.status === 'sending' ? 'auto' : false;

  const renderMessage = (itemIndex: number, message: ChatMessageView) => {
    const index = itemIndex - firstItemIndex;
    const previous = messages[index - 1];
    return (
      <>
        {startsDay(previous, message) ? (
          <ChatMarker variant="chip" role="listitem">
            {chatDay(message.createdAt, i18n.language)}
          </ChatMarker>
        ) : null}
        <ChatMessageBubble
          message={message}
          outgoing={isOwnMessage(message, me?.id)}
          position={messagePosition(previous, message, messages[index + 1])}
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
      {data && (
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
