import { expect, test } from 'bun:test';
import { createPendingMessage } from '../../src/utils/chatMessages';
import { messagePosition, startsDay, startsUnread } from '../../src/utils/chatGroups';

/** Times are local, so the tests pass in every time zone. */
const message = (time: string, senderId: string | null = 'u1') => {
  const base = createPendingMessage(
    { conversationId: 'c1', body: 'Hi', clientId: time },
    undefined,
  );
  return {
    ...base,
    createdAt: new Date(`2026-11-${time}`).toISOString(),
    sender: { ...base.sender, id: senderId },
  };
};

test('messages from one sender in a row form a group', () => {
  const [a, b, c] = [message('22T10:00'), message('22T10:01'), message('22T10:02')];
  expect(messagePosition(undefined, a, b)).toBe('first');
  expect(messagePosition(a, b, c)).toBe('middle');
  expect(messagePosition(b, c, undefined)).toBe('last');
  expect(messagePosition(undefined, a, undefined)).toBe('single');
});

test('a group ends on another sender', () => {
  expect(
    messagePosition(message('22T10:00', 'u2'), message('22T10:01'), message('22T10:02', 'u2')),
  ).toBe('single');
});

test('a group ends after 5 minutes', () => {
  expect(messagePosition(undefined, message('22T10:00'), message('22T10:04'))).toBe('first');
  expect(messagePosition(undefined, message('22T10:00'), message('22T10:05'))).toBe('single');
});

test('a group ends on a new day', () => {
  const [late, early] = [message('22T23:59'), message('23T00:01')];
  expect(messagePosition(undefined, late, early)).toBe('single');
  expect(startsDay(late, early)).toBe(true);
});

test('messages from deleted accounts are not grouped', () => {
  expect(messagePosition(undefined, message('22T10:00', null), message('22T10:01', null))).toBe(
    'single',
  );
});

test('the first message starts a day, and the next one on that day does not', () => {
  expect(startsDay(undefined, message('22T10:00'))).toBe(true);
  expect(startsDay(message('22T10:00'), message('22T18:00'))).toBe(false);
});

test('the unread part starts at the first incoming message after the last read one', () => {
  const at = (seq: number, senderId = 'u2') => ({ ...message('22T10:00', senderId), seq });
  expect(startsUnread(at(5), at(6), 5, 'u1')).toBe(true);
  expect(startsUnread(at(4), at(5), 5, 'u1')).toBe(false);
  expect(startsUnread(at(6), at(7), 5, 'u1')).toBe(false);
  expect(startsUnread(at(5), at(6, 'u1'), 5, 'u1')).toBe(false);
  // The message before it is not loaded yet.
  expect(startsUnread(undefined, at(6), 5, 'u1')).toBe(false);
});
