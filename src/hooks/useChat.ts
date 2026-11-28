import {
  type InfiniteData,
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  acceptChatRequest,
  addChatMembers,
  ApiRequestError,
  createChatGroup,
  createChatRequest,
  declineChatRequest,
  deleteChatMessage,
  getChatConversation,
  getChatConversations,
  getChatMembers,
  getChatMessage,
  getChatMessageChanges,
  getChatMessages,
  getChatRequests,
  getMyChatSettings,
  leaveChatGroup,
  markChatRead,
  openDirectConversation,
  removeChatMember,
  renameChatGroup,
  sendChatMessage,
  updateMyChatSettings,
} from '@/api';
import {
  apiErrorKey,
  chatKeys,
  createPendingMessage,
  DRAFT_CHAT_ID,
  mergeFetchedMessages,
  newestChangeSeq,
  patchCachedItem,
  removeMessage,
  toast,
  upsertMessage,
} from '@/utils';
import type { ChatConversation, ChatMessage, ChatPage, SendMessageInput } from '@/@types';
import type { ChatMessagePages } from '@/utils';
import i18n from '@/i18n';
import { useMyProfile } from './useMyProfile';

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
  });
}

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
      // the composer puts the text back and shows the toast
    },
    // The sent message comes with the catch-up, not from this response: merging it first would move the
    // changedAfter cursor past a message someone else sent a moment earlier, which is then skipped.
    onSuccess: (_message, { conversationId }) =>
      refetchChatConversation(queryClient, conversationId),
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

/**
 * A thread asks only for what changed since its newest change (changedAfter) instead of reloading its
 * pages. A failed catch-up falls back to a reload. This is the only place a thread's cursor moves.
 */
export async function catchUpChatThread(queryClient: QueryClient, conversationId: string) {
  const queryKey = chatKeys.messages(conversationId);
  const data = queryClient.getQueryData<ChatMessagePages>(queryKey);
  if (!data) return queryClient.invalidateQueries({ queryKey });
  try {
    const changedAfter = newestChangeSeq(data);
    const fetched: ChatMessage[] = [];
    let cursor: string | undefined;
    // shortcut: at most 10 pages of changes; more than that reloads the thread instead
    for (let page = 0; page < 10; page += 1) {
      const changes = await getChatMessageChanges(conversationId, changedAfter, cursor);
      fetched.push(...(changes.items ?? []));
      cursor = changes.nextCursor ?? undefined;
      if (!cursor) break;
    }
    if (cursor) return queryClient.invalidateQueries({ queryKey });
    queryClient.setQueryData<ChatMessagePages>(queryKey, (current) =>
      mergeFetchedMessages(current, fetched),
    );
  } catch {
    return queryClient.invalidateQueries({ queryKey });
  }
}

/** Something in a chat changed: its thread catches up, and the rest cached about it refetches. */
export const refetchChatConversation = (queryClient: QueryClient, conversationId: string) =>
  Promise.all([
    catchUpChatThread(queryClient, conversationId),
    ...[
      chatKeys.conversation(conversationId),
      chatKeys.members(conversationId),
      chatKeys.conversations(),
      chatKeys.unread(),
      chatKeys.requests(),
    ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  ]);

/** A left, removed or declined chat: its cache goes, and the lists refetch. */
export function forgetChatConversation(queryClient: QueryClient, conversationId: string) {
  for (const queryKey of [
    chatKeys.conversation(conversationId),
    chatKeys.messages(conversationId),
    chatKeys.members(conversationId),
  ]) {
    queryClient.removeQueries({ queryKey });
  }
  return Promise.all(
    [chatKeys.conversations(), chatKeys.unread(), chatKeys.requests()].map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  );
}

/** A chat the loaded list already holds. */
export const findCachedConversation = (
  queryClient: QueryClient,
  isMatch: (conversation: ChatConversation) => boolean,
) =>
  queryClient
    .getQueryData<InfiniteData<ChatPage<ChatConversation>>>(chatKeys.conversations())
    ?.pages.flatMap((page) => page.items ?? [])
    .find(isMatch);

/** Who may send the student a message request. */
export function useMyChatSettings() {
  return useQuery({ queryKey: chatKeys.settings(), queryFn: getMyChatSettings });
}

export function useUpdateMyChatSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_settings_update' },
    mutationFn: updateMyChatSettings,
    onSuccess: (settings) => queryClient.setQueryData(chatKeys.settings(), settings),
  });
}

/** Message requests sent to the student; they stay out of the chat list until accepted or answered. */
export function useChatRequests() {
  return useInfiniteQuery({
    queryKey: chatKeys.requests(),
    queryFn: ({ pageParam }) => getChatRequests(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

/** A message request is created with its first message. */
export function useCreateChatRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_request_create' },
    mutationFn: ({ userId, body }: { userId: string; body: string }) =>
      createChatRequest(userId, body, crypto.randomUUID()),
    onSuccess: ({ id }) => refetchChatConversation(queryClient, id),
  });
}

/** The request becomes a normal chat and moves into the list. */
export function useAcceptChatRequest(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_request_accept' },
    mutationFn: () => acceptChatRequest(conversationId),
    onSuccess: () => refetchChatConversation(queryClient, conversationId),
  });
}

/** Silent: the sender still sees it pending. */
export function useDeclineChatRequest(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_request_decline' },
    mutationFn: () => declineChatRequest(conversationId),
    onSuccess: () => forgetChatConversation(queryClient, conversationId),
  });
}

export function useChatMembers(conversationId: string, isEnabled = true) {
  return useQuery({
    queryKey: chatKeys.members(conversationId),
    queryFn: () => getChatMembers(conversationId),
    enabled: isEnabled,
  });
}

/** Only the owner may rename. */
export function useRenameChatGroup(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_group_rename' },
    mutationFn: (name: string) => renameChatGroup(conversationId, name),
    onSuccess: () => refetchChatConversation(queryClient, conversationId),
  });
}

/** Any member may add their own connections. */
export function useAddChatMembers(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_members_add' },
    mutationFn: (userIds: string[]) => addChatMembers(conversationId, userIds),
    onSuccess: () => refetchChatConversation(queryClient, conversationId),
  });
}

/** Only the owner may remove a member. */
export function useRemoveChatMember(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_member_remove' },
    mutationFn: (userId: string) => removeChatMember(conversationId, userId),
    onSuccess: () => refetchChatConversation(queryClient, conversationId),
  });
}

export function useLeaveChatGroup(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_leave' },
    mutationFn: () => leaveChatGroup(conversationId),
    onSuccess: () => forgetChatConversation(queryClient, conversationId),
  });
}

/** A deleted message stays as a tombstone, so positions keep. */
export function useDeleteChatMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'chat_message_delete' },
    mutationFn: deleteChatMessage,
    onSuccess: () => refetchChatConversation(queryClient, conversationId),
  });
}

/** A photo failed to load: when its link expired, the message comes again with fresh links. */
export function useRefreshChatPhotos() {
  const queryClient = useQueryClient();
  return async (message: ChatMessage) => {
    const isExpired = (message.attachments ?? []).some(
      ({ expiresAt }) => Date.parse(expiresAt) <= Date.now(),
    );
    if (!isExpired) return;
    const fresh = await queryClient.fetchQuery({
      queryKey: [...chatKeys.all, 'message', message.id],
      queryFn: () => getChatMessage(message.id),
    });
    queryClient.setQueryData<ChatMessagePages>(chatKeys.messages(message.conversationId), (data) =>
      mergeFetchedMessages(data, [fresh]),
    );
  };
}

/**
 * Opens the direct chat with a student. One the loaded list holds opens at once; with no connection and
 * no chat yet (409), a draft opens, and the first message goes out as a request.
 */
export function useOpenDirectChat() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    meta: { analyticsAction: 'chat_direct_open' },
    mutationFn: openDirectConversation,
  });
  const openConversation = (conversationId: string, userId?: string) =>
    navigate({ to: '/chat', search: { conversationId, ...(userId ? { userId } : {}) } });
  const openChat = async (userId: string) => {
    const cached = findCachedConversation(
      queryClient,
      (row) => row.kind === 'direct' && row.peer?.id === userId,
    );
    if (cached) return openConversation(cached.id);
    try {
      const { id } = await mutateAsync(userId);
      await openConversation(id);
      return refetchChatConversation(queryClient, id);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 409) {
        return openConversation(DRAFT_CHAT_ID, userId);
      }
      toast.error(i18n.t(apiErrorKey(error)));
    }
  };
  return { openChat, isPending };
}
