import { api } from './client';

export const CHAT_PAGE_SIZE = 50;

export async function getChatConversations(cursor?: string) {
  const { data } = await api.GET('/chat/conversations', {
    params: { query: { cursor, limit: CHAT_PAGE_SIZE } },
  });
  return data!;
}

export async function getChatConversation(conversationId: string) {
  const { data } = await api.GET('/chat/conversations/{id}', {
    params: { path: { id: conversationId } },
  });
  return data!;
}

/** History, newest first. `nextCursor` points to older messages. */
export async function getChatMessages(conversationId: string, cursor?: string) {
  const { data } = await api.GET('/chat/conversations/{id}/messages', {
    params: { path: { id: conversationId }, query: { cursor, limit: CHAT_PAGE_SIZE } },
  });
  return data!;
}

/**
 * `idempotencyKey` is a UUID the server echoes back as the message `clientId`. Sending the same key
 * again returns the same message, so a retry never posts twice.
 */
export async function sendChatMessage(
  conversationId: string,
  { body, attachmentIds }: { body?: string; attachmentIds?: string[] },
  idempotencyKey: string,
) {
  const { data } = await api.POST('/chat/conversations/{id}/messages', {
    params: { path: { id: conversationId }, header: { 'Idempotency-Key': idempotencyKey } },
    body: { body, attachmentIds },
  });
  return data!;
}

export async function markChatRead(conversationId: string, seq: number) {
  const { data } = await api.PUT('/chat/conversations/{id}/read', {
    params: { path: { id: conversationId } },
    body: { seq },
  });
  return data!;
}

/** Opens the direct chat with a connection, or returns the one that already exists. */
export async function openDirectConversation(userId: string) {
  const { data } = await api.POST('/chat/conversations/direct', { body: { userId } });
  return data!;
}

/** `memberIds` are connections. The creator is added by the server. */
export async function createChatGroup(name: string, memberIds: string[], idempotencyKey: string) {
  const { data } = await api.POST('/chat/conversations/groups', {
    params: { header: { 'Idempotency-Key': idempotencyKey } },
    body: { name, memberIds },
  });
  return data!;
}
