import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatConversations, getChatMessages } from '@/api';
import { chatKeys } from './chatKeys';

// The thread does not virtualize, so only the newest 10 pages (300 messages) stay in memory.
const MAX_MESSAGE_PAGES = 10;

export function useConversations() {
  return useInfiniteQuery({
    queryKey: chatKeys.conversations(),
    queryFn: ({ pageParam }) => getChatConversations(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

/** Pages go from the newest messages to older ones; `fetchNextPage` loads older history. */
export function useMessages(conversationId: string | undefined) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId ?? ''),
    queryFn: ({ pageParam }) => getChatMessages(conversationId!, pageParam),
    enabled: Boolean(conversationId),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    maxPages: MAX_MESSAGE_PAGES,
  });
}
