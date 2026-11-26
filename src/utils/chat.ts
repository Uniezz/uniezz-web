import type { ChatConversation, ChatMessage } from '@/@types';
import { dateFormatter } from './dateFormat';
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

/** Up to two letters for an avatar without a photo. Spreading keeps emoji whole. */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0] ?? '')
    .join('')
    .toUpperCase();

/** The text under the name in the chat list: the last message, or a label for an image-only or deleted one. */
export function chatPreview(
  conversation: ChatConversation,
  imageLabel: string,
  deletedLabel: string,
) {
  const message = conversation.lastMessage;
  if (!message || message.kind === 'system') return '';
  if (message.deletedAt) return deletedLabel;
  return message.body || (message.attachments?.length ? imageLabel : '');
}

/** The time of day for today's messages, and a short date for older ones. */
export function chatTime(iso: string, locale: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const sameDay = date.toDateString() === now.toDateString();
  return dateFormatter(
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

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** The date chip in a thread: Today, Yesterday, or a date. The year shows only when it is not this year. */
export function chatDay(iso: string, locale: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  // Rounded, because a day with a clock change is not 24 hours long.
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / (24 * 60 * 60 * 1000));
  if (daysAgo === 0 || daysAgo === 1) {
    const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-daysAgo, 'day');
    return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
  }
  const parts = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  }).formatToParts(date);
  // No dot after a short month ("лист."), and no text after the year ("2025 р.").
  return parts
    .filter(({ type }, index) => type !== 'literal' || index < parts.length - 1)
    .map(({ type, value }) => (type === 'month' ? value.replace('.', '') : value))
    .join('');
}
