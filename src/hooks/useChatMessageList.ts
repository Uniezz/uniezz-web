import { useState } from 'react';
import type { ListRange } from 'react-virtuoso';

import type { ChatMessageView, ChatUnreadAtOpen } from '@/@types';
import { isOwnMessage, messagePosition, startsDay, startsUnread } from '@/utils';
import { useMessages } from './useChat';
import { useMyProfile } from './useMyProfile';

// Virtuoso keeps the scroll position when older messages are added at the top only if `firstItemIndex`
// goes down by their number. It cannot be negative, so it starts high.
const START_INDEX = 1_000_000;

/** The messages of a thread, oldest first, and how Virtuoso loads, follows and groups them. */
export function useChatMessageList(conversationId: string, unreadAtOpen: ChatUnreadAtOpen) {
  const { data: me } = useMyProfile();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
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

  // The newest message when the student scrolled up, or null at the bottom.
  const [leftAtSeq, setLeftAtSeq] = useState<number | null>(null);
  const handleAtBottomChange = (isAtBottom: boolean) =>
    setLeftAtSeq(isAtBottom ? null : messages.reduce((max, { seq }) => Math.max(max, seq), 0));
  const newCount =
    leftAtSeq === null
      ? 0
      : messages.filter((message) => message.seq > leftAtSeq && !isOwnMessage(message, me?.id))
          .length;

  const isFirstUnread = (index: number) =>
    unreadAtOpen.count > 0 &&
    startsUnread(messages[index - 1], messages[index], unreadAtOpen.lastReadSeq, me?.id);

  const getRow = (itemIndex: number, message: ChatMessageView) => {
    const index = itemIndex - firstItemIndex;
    const previous = messages[index - 1];
    const next = messages[index + 1];
    const firstUnread = isFirstUnread(index);
    const nextFirstUnread = next !== undefined && isFirstUnread(index + 1);
    return {
      outgoing: isOwnMessage(message, me?.id),
      firstOfDay: startsDay(previous, message),
      firstUnread,
      // The new messages divider also ends a group.
      position: messagePosition(
        firstUnread ? undefined : previous,
        message,
        nextFirstUnread ? undefined : next,
      ),
    };
  };

  return {
    messages,
    firstItemIndex,
    isPending,
    isLoaded: data !== undefined,
    isError,
    refetch,
    loadOlderMessages,
    followNewMessages,
    handleAtBottomChange,
    isScrolledUp: leftAtSeq !== null,
    newCount,
    getRow,
  };
}
