import type { ChatConversation, ChatMessage, Conversation } from '@/@types';
import type { components } from '@/@types/schema';
import { authorName } from './feed';

/** An empty direct conversation with a match, opened from the connections list. */
export function connectionConversation(
  profile: components['schemas']['ProfileSummary'],
): Conversation {
  return {
    id: profile.id,
    name: authorName(profile),
    preview: '',
    time: '',
    group: false,
    unread: 0,
    image: 0,
    imageUrl: profile.avatarUrl ?? undefined,
    messages: [],
  };
}

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
