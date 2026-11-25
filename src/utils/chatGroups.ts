import type { ChatMessageView } from '@/@types';
import { isOwnMessage } from './chat';

const GROUP_GAP_MS = 5 * 60 * 1000;

export type ChatMessagePosition = 'single' | 'first' | 'middle' | 'last';

/** The first message of a day, in the local time of the student. */
export const startsDay = (previous: ChatMessageView | undefined, message: ChatMessageView) =>
  !previous ||
  new Date(previous.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

/** Deleted accounts have no sender id, so their messages are never grouped. */
function isSameGroup(previous: ChatMessageView, message: ChatMessageView) {
  return (
    message.sender.id !== null &&
    previous.sender.id === message.sender.id &&
    !startsDay(previous, message) &&
    Date.parse(message.createdAt) - Date.parse(previous.createdAt) < GROUP_GAP_MS
  );
}

/** Place of a message in a group from one sender. It looks only at the two neighbours. */
export function messagePosition(
  previous: ChatMessageView | undefined,
  message: ChatMessageView,
  next: ChatMessageView | undefined,
): ChatMessagePosition {
  const joinsPrevious = previous !== undefined && isSameGroup(previous, message);
  const joinsNext = next !== undefined && isSameGroup(message, next);
  if (joinsPrevious) return joinsNext ? 'middle' : 'last';
  return joinsNext ? 'first' : 'single';
}

/**
 * The first unread message, when `lastReadSeq` is where the student stopped reading. The message before it
 * must be loaded, so the divider never shows at a wrong place.
 */
export const startsUnread = (
  previous: ChatMessageView | undefined,
  message: ChatMessageView,
  lastReadSeq: number,
  myId: string | undefined,
) =>
  previous !== undefined &&
  previous.seq <= lastReadSeq &&
  message.seq > lastReadSeq &&
  !isOwnMessage(message, myId);
