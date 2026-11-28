import type { TFunction } from 'i18next';
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

/** Up to two letters for an avatar without a photo. Spreading keeps emoji whole. */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0] ?? '')
    .join('')
    .toUpperCase();

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

const DAY_MS = 24 * 60 * 60 * 1000;

/** The phone chat list's time, as in the app: the clock today, the weekday within 6 days, then the date. */
export function appChatTime(iso: string, locale: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const today = date.toDateString() === now.toDateString();
  return new Intl.DateTimeFormat(
    locale,
    today
      ? { hour: '2-digit', minute: '2-digit' }
      : now.getTime() - date.getTime() < 6 * DAY_MS
        ? { weekday: 'short' }
        : { month: 'short', day: 'numeric' },
  ).format(date);
}

/** The phone thread's day chip, as in the app: `todayLabel` today, otherwise "Mon, Nov 28". */
export function appChatDay(iso: string, locale: string, todayLabel: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toDateString() === now.toDateString()
    ? todayLabel
    : new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(
        date,
      );
}

/** The Chat tab badge's text, capped. */
export const unreadBadge = (count: number) => (count > 99 ? '99+' : String(count));

// photos per album row by count, as the app lays out a message album
export const CHAT_ALBUM_ROWS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [2, 2],
  5: [2, 3],
};

// album row heights in px by photos in the row, as in the app
export const CHAT_ALBUM_ROW_HEIGHTS: Record<number, number> = { 1: 220, 2: 140, 3: 100 };

// the API's limit of images per message, as the app picks them
export const MAX_CHAT_PHOTOS = 5;

// the app's composer limit
export const CHAT_MESSAGE_MAX_LENGTH = 2000;

// "who can message me", narrowest last; it changes only new message requests
export const WHO_CAN_MESSAGE = [
  ['everyone', 'chat.whoEveryone'],
  ['university', 'chat.whoUniversity'],
  ['matches', 'chat.whoMatches'],
] as const;

// the conversationId the chat opens with, alongside a userId, before a message request exists
export const DRAFT_CHAT_ID = 'draft';

// the phone thread's loading placeholder: 56px bubbles, newest last, mine on the right
export const CHAT_SKELETON_BUBBLES = [
  { isMine: false, width: 180 },
  { isMine: false, width: 120 },
  { isMine: true, width: 200 },
  { isMine: false, width: 150 },
  { isMine: true, width: 110 },
  { isMine: true, width: 170 },
];

// the phone chat list's tabs, as in the app
export const CHAT_LIST_TABS = ['all', 'groups', 'requests'] as const;

/**
 * A message as one line, as the app shows it: the body, "Message deleted", "Photo", or the system
 * sentence naming who did what. `names` resolves member ids; an unknown id reads as "someone".
 */
export function chatMessageText(
  message: ChatMessage,
  t: TFunction,
  names?: ReadonlyMap<string, string>,
) {
  if (message.deletedAt) return t('chat.deletedMessage');
  if (message.kind !== 'system') {
    return message.body || (message.attachments?.length ? t('chat.photo') : '');
  }
  const { event, params } = message.payload as {
    event?: unknown;
    params?: Record<string, unknown>;
  };
  const name = message.sender.deleted
    ? t('app.accountDeleted')
    : authorName(message.sender) || t('apiState.student');
  const nameOf = (id: unknown) => (typeof id === 'string' && names?.get(id)) || t('chat.someone');
  const title = typeof params?.name === 'string' ? params.name : '';
  switch (event) {
    case 'group_created':
      return t('chat.systemGroupCreated', { name, title });
    case 'renamed':
      return t('chat.systemRenamed', { name, title });
    case 'member_added': {
      const ids = Array.isArray(params?.userIds) ? params.userIds : [];
      return t('chat.systemMemberAdded', { name, names: ids.map(nameOf).join(', ') });
    }
    case 'member_removed':
      return t('chat.systemMemberRemoved', { name, target: nameOf(params?.userId) });
    case 'member_left':
      return t('chat.systemMemberLeft', { name });
    case 'owner_changed':
      return t('chat.systemOwnerChanged', { target: nameOf(params?.userId) });
    default:
      return t('chat.systemOther');
  }
}
