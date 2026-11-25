import { expect, test } from 'bun:test';

import type { ChatMessageView } from '../../src/@types';
import { messageActions } from '../../src/utils/chatActions';
import { createPendingMessage } from '../../src/utils/chatMessages';

const pending = createPendingMessage(
  { conversationId: 'c1', body: 'Hello', clientId: 'k1' },
  { id: 'u1', firstName: 'Anna', lastName: 'Nowak', avatarUrl: null, universityId: 'umcs' },
);
const message = (extra: Partial<ChatMessageView> = {}): ChatMessageView => ({
  ...pending,
  status: undefined,
  ...extra,
});

test('my message can be copied and deleted, but not reported', () => {
  expect(messageActions(message(), true)).toEqual(['copy', 'delete']);
});

test('a message from another student can be copied and reported, but not deleted', () => {
  expect(messageActions(message(), false)).toEqual(['copy', 'report']);
});

test('a message with only images has no text to copy', () => {
  expect(messageActions(message({ body: null }), true)).toEqual(['delete']);
  expect(messageActions(message({ body: null }), false)).toEqual(['report']);
});

test('a deleted account cannot be reported', () => {
  const sender = { ...pending.sender, id: null, deleted: true };
  expect(messageActions(message({ sender }), false)).toEqual(['copy']);
});

test('a sending or deleted message has no actions', () => {
  expect(messageActions(pending, true)).toEqual([]);
  expect(messageActions(message({ deletedAt: '2026-11-25T10:00:00Z' }), true)).toEqual([]);
});
