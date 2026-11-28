import type { UpdateChatSettingsInput } from '@/@types';
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

/** Messages created or changed after `changedAfter`, oldest change first: the thread's catch-up. */
export async function getChatMessageChanges(
  conversationId: string,
  changedAfter: number,
  cursor?: string,
) {
  const { data } = await api.GET('/chat/conversations/{id}/messages', {
    params: {
      path: { id: conversationId },
      query: { changedAfter: String(changedAfter), cursor, limit: CHAT_PAGE_SIZE },
    },
  });
  return data!;
}

/** One message with fresh photo links. */
export async function getChatMessage(messageId: string) {
  const { data } = await api.GET('/chat/messages/{id}', {
    params: { path: { id: messageId } },
  });
  return data!;
}

/** A deleted message stays as a "Message deleted" tombstone. */
export async function deleteChatMessage(messageId: string) {
  await api.DELETE('/chat/messages/{id}', { params: { path: { id: messageId } } });
}

export async function getMyChatSettings() {
  const { data } = await api.GET('/chat/settings/me');
  return data!;
}

export async function updateMyChatSettings(body: UpdateChatSettingsInput) {
  const { data } = await api.PATCH('/chat/settings/me', { body });
  return data!;
}

/** Message requests sent to the student, newest first. */
export async function getChatRequests(cursor?: string) {
  const { data } = await api.GET('/chat/requests', {
    params: { query: { cursor, limit: CHAT_PAGE_SIZE } },
  });
  return data!;
}

/** Starts a message request to a student who is not a connection, with its first message. */
export async function createChatRequest(userId: string, body: string, idempotencyKey: string) {
  const { data } = await api.POST('/chat/requests', {
    params: { header: { 'Idempotency-Key': idempotencyKey } },
    body: { userId, body },
  });
  return data!;
}

export async function acceptChatRequest(conversationId: string) {
  const { data } = await api.PUT('/chat/requests/{id}/acceptance', {
    params: { path: { id: conversationId } },
  });
  return data!;
}

export async function declineChatRequest(conversationId: string) {
  await api.DELETE('/chat/requests/{id}', { params: { path: { id: conversationId } } });
}

/** Owner first; a group holds at most 50 members, so one page is the whole group. */
export async function getChatMembers(conversationId: string) {
  const { data } = await api.GET('/chat/conversations/{id}/members', {
    params: { path: { id: conversationId }, query: { limit: CHAT_PAGE_SIZE } },
  });
  return data!;
}

export async function renameChatGroup(conversationId: string, name: string) {
  const { data } = await api.PATCH('/chat/conversations/{id}', {
    params: { path: { id: conversationId } },
    body: { name },
  });
  return data!;
}

export async function addChatMembers(conversationId: string, userIds: string[]) {
  const { data } = await api.POST('/chat/conversations/{id}/members', {
    params: { path: { id: conversationId } },
    body: { userIds },
  });
  return data!;
}

export async function removeChatMember(conversationId: string, userId: string) {
  await api.DELETE('/chat/conversations/{id}/members/{userId}', {
    params: { path: { id: conversationId, userId } },
  });
}

export async function leaveChatGroup(conversationId: string) {
  await api.DELETE('/chat/conversations/{id}/members/me', {
    params: { path: { id: conversationId } },
  });
}

/** Unread messages across all chats, for the phone's Chat tab badge. */
export async function getChatUnread() {
  const { data } = await api.GET('/chat/unread');
  return data!;
}
