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
