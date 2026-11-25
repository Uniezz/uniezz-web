import type { ChatConversation, ChatMessage } from '@/@types';
import { authorName } from './feed';

/** The name shown for a chat: the group name, or the other student. */
export function chatTitle(conversation: ChatConversation, deletedLabel: string) {
  if (conversation.kind === 'group') return conversation.name ?? '';
  const { peer } = conversation;
  return (peer && !peer.deleted && authorName(peer)) || deletedLabel;
}

/** Direct chats show the other student's photo. Groups have no photo yet. */
export const chatAvatar = (conversation: ChatConversation) =>
  conversation.peer?.avatarUrl ?? undefined;

/** The text under the name in the chat list: the last message, or a label for an image-only one. */
export function chatPreview(conversation: ChatConversation, imageLabel: string) {
  const message = conversation.lastMessage;
  if (!message || message.deletedAt || message.kind === 'system') return '';
  return message.body || (message.attachments?.length ? imageLabel : '');
}

/** The time of day for today's messages, and a short date for older ones. */
export function chatTime(iso: string, locale: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const sameDay = date.toDateString() === now.toDateString();
  return new Intl.DateTimeFormat(
    locale,
    sameDay ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short' },
  ).format(date);
}

export const isOwnMessage = (message: ChatMessage, myId: string | undefined) =>
  myId !== undefined && message.sender.id === myId;

/** The open chat comes from the URL. Without one, the newest chat is shown. */
export const selectedConversationId = (
  conversations: ChatConversation[],
  conversationId: string | undefined,
) => conversationId ?? conversations[0]?.id;

/** The time of day shown under a message bubble. */
export function chatClock(iso: string, locale: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
}
