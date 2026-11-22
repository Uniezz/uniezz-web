import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createChatGroup,
  getChatConversation,
  getChatConversations,
  getChatMessages,
  markChatRead,
  openDirectConversation,
  sendChatMessage,
} from '@/api';
import {
  createPendingMessage,
  patchCachedItem,
  removeMessage,
  toast,
  upsertMessage,
} from '@/utils';
import type { ChatMessagePages } from '@/utils';
import i18n from '@/i18n';
import { chatKeys } from './chatKeys';
import { useMyProfile } from './useMyProfile';

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

/** One chat by id, for a link to a chat that is not in the loaded list pages. */
export function useConversation(conversationId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId ?? ''),
    queryFn: () => getChatConversation(conversationId!),
    enabled: Boolean(conversationId),
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

export type SendMessageInput = {
  conversationId: string;
  body?: string;
  attachmentIds?: string[];
  /** A new UUID per send. It is the `Idempotency-Key`, and the server returns it as `clientId`. */
  clientId: string;
};

/**
 * The message shows at once as "sending". When the send fails it is removed and a toast is shown;
 * the caller keeps or restores the typed text.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { data: me } = useMyProfile();
  return useMutation({
    meta: { analyticsAction: 'message_send' },
    mutationFn: ({ conversationId, body, attachmentIds, clientId }: SendMessageInput) =>
      sendChatMessage(conversationId, { body, attachmentIds }, clientId),
    onMutate: async (input) => {
      const queryKey = chatKeys.messages(input.conversationId);
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<ChatMessagePages>(queryKey, (data) =>
        upsertMessage(data, createPendingMessage(input, me)),
      );
    },
    onError: (_error, { conversationId, clientId }) => {
      queryClient.setQueryData<ChatMessagePages>(chatKeys.messages(conversationId), (data) =>
        removeMessage(data, clientId),
      );
      toast.error(i18n.t('app.sendError'));
    },
    onSuccess: (message, { conversationId }) => {
      queryClient.setQueryData<ChatMessagePages>(chatKeys.messages(conversationId), (data) =>
        upsertMessage(data, message),
      );
      void queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

export function useCreateChatGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'group_create', progress: () => i18n.t('progress.groupCreate') },
    mutationFn: ({ name, memberIds }: { name: string; memberIds: string[] }) =>
      createChatGroup(name, memberIds, crypto.randomUUID()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatKeys.conversations() }),
  });
}

/** Opens the chat with a connection. The server returns the existing chat when there is one. */
export function useOpenDirectConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'conversation_open' },
    mutationFn: openDirectConversation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatKeys.conversations() }),
    onError: () => toast.error(i18n.t('apiState.error')),
  });
}

/** Tells the server how far the student has read, and clears the unread count in the cached chats. */
export function useMarkChatRead() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_mark_read' },
    mutationFn: ({ conversationId, seq }: { conversationId: string; seq: number }) =>
      markChatRead(conversationId, seq),
    onSuccess: (read, { conversationId }) => {
      patchCachedItem(queryClient, chatKeys.conversations(), conversationId, read);
      patchCachedItem(queryClient, chatKeys.conversation(conversationId), conversationId, read);
    },
  });
}
