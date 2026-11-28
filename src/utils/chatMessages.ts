import type { InfiniteData } from '@tanstack/react-query';
import type { ChatMessageView, ChatPage } from '@/@types';

export type ChatMessagePages = InfiniteData<ChatPage<ChatMessageView>, string | undefined>;

type Sender = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  universityId: string;
};

const isSame = (a: ChatMessageView, b: ChatMessageView) =>
  a.id === b.id || (a.clientId !== null && a.clientId === b.clientId);

/** A message that is still sending is the newest. Everything else goes by `seq`. */
const rank = ({ status, seq }: ChatMessageView) => (status === 'sending' ? Infinity : seq);

/** Newest first. A message with the same id or client id is replaced, so a retry or echo never doubles it. */
export function mergeMessage(items: ChatMessageView[], message: ChatMessageView) {
  return [...items.filter((item) => !isSame(item, message)), message].sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)];
    return ra === rb ? 0 : rb > ra ? 1 : -1;
  });
}

/** Adds or replaces a message in the newest page. Leaves an empty cache empty. */
export function upsertMessage(data: ChatMessagePages | undefined, message: ChatMessageView) {
  if (!data) return data;
  const [first, ...rest] = data.pages.map((page) => ({
    ...page,
    items: (page.items ?? []).filter((item) => !isSame(item, message)),
  }));
  return { ...data, pages: [{ ...first, items: mergeMessage(first.items, message) }, ...rest] };
}

/**
 * Writes catch-up results into a loaded thread: a known message (or the pending one with its client id)
 * is replaced, a newer one joins the newest page, and an older one the loaded pages lack stays out.
 */
export function mergeFetchedMessages(
  data: ChatMessagePages | undefined,
  fetched: ChatMessageView[],
) {
  if (!data || fetched.length === 0) return data;
  const loaded = data.pages.flatMap((page) => page.items ?? []);
  const newestSeq = Math.max(0, ...loaded.filter((m) => m.status !== 'sending').map((m) => m.seq));
  const loadedMatch = (message: ChatMessageView) => loaded.find((item) => isSame(item, message));
  const replaceInPlace = (pages: ChatMessagePages, message: ChatMessageView) => ({
    ...pages,
    pages: pages.pages.map((page) => ({
      ...page,
      items: page.items?.map((item) => (isSame(item, message) ? message : item)) ?? page.items,
    })),
  });
  return fetched.reduce<ChatMessagePages>((pages, message) => {
    const match = loadedMatch(message);
    // a pending message sits on top, so the stored one takes its place by seq instead
    if (match)
      return match.status === 'sending'
        ? upsertMessage(pages, message)!
        : replaceInPlace(pages, message);
    return message.seq > newestSeq ? upsertMessage(pages, message)! : pages;
  }, data);
}

/** The highest change the thread holds: where its catch-up starts. */
export const newestChangeSeq = (data: ChatMessagePages | undefined) =>
  Math.max(0, ...(data?.pages ?? []).flatMap((page) => (page.items ?? []).map((m) => m.changeSeq)));

export function removeMessage(data: ChatMessagePages | undefined, clientId: string) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items?.filter((item) => item.clientId !== clientId) ?? page.items,
    })),
  };
}

/** The message the student sees right after pressing send, before the server answers. */
export function createPendingMessage(
  { conversationId, body, clientId }: { conversationId: string; body?: string; clientId: string },
  me: Sender | undefined,
): ChatMessageView {
  return {
    id: `pending-${clientId}`,
    conversationId,
    seq: 0,
    changeSeq: 0,
    kind: 'text',
    sender: {
      id: me?.id ?? null,
      firstName: me?.firstName ?? null,
      lastName: me?.lastName ?? null,
      avatarUrl: me?.avatarUrl ?? null,
      universityId: me?.universityId ?? null,
      deleted: false,
    },
    body: body ?? null,
    payload: {},
    clientId,
    attachments: null,
    createdAt: new Date().toISOString(),
    deletedAt: null,
    status: 'sending',
  };
}

// Virtuoso keeps the scroll position when older messages are added at the top only if `firstItemIndex`
// goes down by their number. It cannot be negative, so it starts high.
export const MESSAGE_START_INDEX = 1_000_000;

// The newest message: the list opens there, and the jump button scrolls there.
export const LATEST_MESSAGE = { index: 'LAST', align: 'end' } as const;

// A sending message has a `clientId` until the server gives it an `id`, so the key stays the same.
export const messageKey = (_: number, message: ChatMessageView) => message.clientId ?? message.id;
