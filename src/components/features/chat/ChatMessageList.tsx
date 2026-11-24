import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import type { ChatMessageView } from '@/@types';
import { useMessages, useMyProfile } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { isOwnMessage } from '@/utils';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatPreviewState } from './ChatImagePreview';

// Virtuoso keeps the scroll position when older messages are added at the top only if `firstItemIndex`
// goes down by their number. It cannot be negative, so it starts high.
const START_INDEX = 1_000_000;

export function ChatMessageList({
  conversationId,
  onPreview,
}: {
  conversationId: string;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessages(conversationId);
  // Pages are newest first, but the thread reads oldest first. System and deleted messages come with W4.
  const pages = (data?.pages ?? []).map((page) =>
    (page.items ?? []).filter(({ kind, deletedAt }) => kind === 'text' && !deletedAt),
  );
  const messages: ChatMessageView[] = pages.flat().reverse();
  const firstItemIndex = START_INDEX - pages.slice(1).flat().length;
  return (
    <div
      className="flex min-h-0 flex-1 flex-col px-7 py-5"
      role="log"
      aria-label={t('app.messages')}
    >
      {messages.length > 0 && (
        <Virtuoso
          data={messages}
          firstItemIndex={firstItemIndex}
          // Older messages load before the student reaches the top.
          rangeChanged={({ startIndex }) => {
            if (startIndex - firstItemIndex <= 30 && hasNextPage && !isFetchingNextPage)
              void fetchNextPage();
          }}
          computeItemKey={(_, message) => message.clientId ?? message.id}
          initialTopMostItemIndex={{ index: 'LAST', align: 'end' }}
          alignToBottom
          // A new message scrolls the list only at the bottom, or when it is the one being sent.
          followOutput={(isAtBottom) =>
            isAtBottom || messages.at(-1)?.status === 'sending' ? 'auto' : false
          }
          components={listComponents}
          className="min-h-0 flex-1"
          itemContent={(_, message) => (
            <ChatMessageBubble
              message={message}
              outgoing={isOwnMessage(message, me?.id)}
              onPreview={onPreview}
            />
          )}
        />
      )}
      {!isPending && !isError && messages.length === 0 && <UIEmpty />}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
