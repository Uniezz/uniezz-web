import { expect, test } from 'bun:test';
import type { ChatMessageView } from '../../src/@types';
import {
  createPendingMessage,
  markMessageDeleted,
  mergeMessage,
  removeMessage,
  upsertMessage,
  type ChatMessagePages,
} from '../../src/utils/chatMessages';

const message = (seq: number, extra: Partial<ChatMessageView> = {}): ChatMessageView => ({
  ...createPendingMessage(
    { conversationId: 'c1', body: `m${seq}`, clientId: `k${seq}` },
    undefined,
  ),
  id: `m${seq}`,
  seq,
  status: undefined,
  ...extra,
});
const pages = (...items: ChatMessageView[][]): ChatMessagePages => ({
  pages: items.map((page) => ({ items: page, nextCursor: null })),
  pageParams: items.map(() => undefined),
});

test('merging keeps the newest message first, even when messages arrive out of order', () => {
  const merged = mergeMessage([message(3), message(1)], message(2));
  expect(merged.map((m) => m.seq)).toEqual([3, 2, 1]);
});

test('a message that is still sending stays on top', () => {
  const sending = message(0, { id: 'pending-k9', clientId: 'k9', status: 'sending' });
  expect(mergeMessage([message(5)], sending).map((m) => m.id)).toEqual(['pending-k9', 'm5']);
});

test('the server answer replaces the sending message with the same client id', () => {
  const sending = message(0, { id: 'pending-k4', clientId: 'k4', status: 'sending' });
  const confirmed = message(4, { clientId: 'k4' });
  const merged = mergeMessage([sending, message(3)], confirmed);
  expect(merged.map((m) => m.id)).toEqual(['m4', 'm3']);
  expect(merged[0].status).toBeUndefined();
});

test('the same message twice is kept once', () => {
  expect(mergeMessage([message(2)], message(2))).toHaveLength(1);
});

test('upsert puts the message in the newest page and removes it from older pages', () => {
  const data = upsertMessage(pages([message(3)], [message(2), message(1)]), message(4));
  expect(data?.pages[0].items?.map((m) => m.seq)).toEqual([4, 3]);
  expect(data?.pages[1].items?.map((m) => m.seq)).toEqual([2, 1]);
  expect(upsertMessage(undefined, message(1))).toBeUndefined();
});

test('removing by client id drops only that message', () => {
  const data = removeMessage(pages([message(2), message(1)]), 'k2');
  expect(data?.pages[0].items?.map((m) => m.seq)).toEqual([1]);
});

test('a deleted message keeps its place but loses its content, also in an older page', () => {
  const data = markMessageDeleted(pages([message(2)], [message(1)]), 'm1');
  expect(data?.pages[1].items?.[0]).toMatchObject({ id: 'm1', seq: 1, body: null });
  expect(data?.pages[1].items?.[0].deletedAt).toBeTruthy();
  expect(data?.pages[0].items?.[0]).toMatchObject({ body: 'm2', deletedAt: null });
  expect(markMessageDeleted(undefined, 'm1')).toBeUndefined();
});

test('the pending message carries the sender, text and client id', () => {
  const me = { id: 'u1', firstName: 'Jan', lastName: 'K', avatarUrl: null, universityId: 'umcs' };
  const pending = createPendingMessage({ conversationId: 'c1', body: 'Hi', clientId: 'k1' }, me);
  expect(pending).toMatchObject({
    id: 'pending-k1',
    clientId: 'k1',
    body: 'Hi',
    status: 'sending',
    sender: { id: 'u1', firstName: 'Jan' },
  });
});
