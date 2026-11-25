import { expect, test } from 'bun:test';
import {
  chatAvatar,
  chatClock,
  chatPreview,
  chatTime,
  chatTitle,
  isOwnMessage,
  selectedConversationId,
} from '../../src/utils/chat';
import type { ChatConversation, ChatMessage } from '../../src/@types/chat';

const student = {
  id: 'u1',
  firstName: 'Jan',
  lastName: 'Kowalski',
  avatarUrl: 'https://img/jan.jpg',
  universityId: 'umcs',
  deleted: false,
};
const chat = (extra: Partial<ChatConversation> = {}): ChatConversation => ({
  id: 'c1',
  kind: 'direct',
  name: null,
  lastSeq: 1,
  changeSeq: 1,
  lastReadSeq: 0,
  unreadCount: 1,
  memberCount: null,
  myRole: null,
  createdAt: '2026-11-22T10:00:00Z',
  peer: student,
  ...extra,
});

test('a direct chat is named after the other student and uses their photo', () => {
  expect(chatTitle(chat(), 'Deleted')).toBe('Jan Kowalski');
  expect(chatAvatar(chat())).toBe('https://img/jan.jpg');
});

test('a deleted student and a group fall back to a label or the group name', () => {
  expect(chatTitle(chat({ peer: { ...student, deleted: true } }), 'Deleted')).toBe('Deleted');
  expect(chatTitle(chat({ kind: 'group', name: 'Maths', peer: undefined }), 'Deleted')).toBe(
    'Maths',
  );
});

test('the preview is the last message text, or a label for images only', () => {
  const last = (extra: object) =>
    chat({ lastMessage: { ...message, ...extra } as ChatConversation['lastMessage'] });
  const message = { kind: 'text', body: 'Hi', attachments: null, deletedAt: null };
  expect(chatPreview(last({}), 'Photo')).toBe('Hi');
  expect(chatPreview(last({ body: null, attachments: [{}] }), 'Photo')).toBe('Photo');
  expect(chatPreview(last({ deletedAt: '2026-11-22T11:00:00Z' }), 'Photo')).toBe('');
  expect(chatPreview(last({ kind: 'system', body: null }), 'Photo')).toBe('');
  expect(chatPreview(chat(), 'Photo')).toBe('');
});

test('time shows the clock for today and a date for older messages', () => {
  const now = new Date('2026-11-22T12:00:00Z');
  expect(chatTime('2026-11-22T10:05:00Z', 'en-GB', now)).toMatch(/^\d{2}:\d{2}$/);
  expect(chatTime('2026-11-10T10:05:00Z', 'en-GB', now)).toBe('10 Nov');
  expect(chatTime('not a date', 'en-GB', now)).toBe('');
});

test('a message is mine when the sender id matches', () => {
  expect(isOwnMessage({ sender: student } as ChatMessage, 'u1')).toBe(true);
  expect(isOwnMessage({ sender: student } as ChatMessage, 'u2')).toBe(false);
  expect(isOwnMessage({ sender: student } as ChatMessage, undefined)).toBe(false);
});

test('the open chat comes from the URL, or is the newest chat', () => {
  const list = [chat({ id: 'a' }), chat({ id: 'b' })];
  expect(selectedConversationId(list, 'b')).toBe('b');
  expect(selectedConversationId(list, 'not-loaded-yet')).toBe('not-loaded-yet');
  expect(selectedConversationId(list, undefined)).toBe('a');
  expect(selectedConversationId([], undefined)).toBeUndefined();
});

test('the message clock shows hours and minutes only', () => {
  expect(chatClock('2026-11-10T10:05:00Z', 'en-GB')).toMatch(/^\d{2}:\d{2}$/);
  expect(chatClock('nope', 'en-GB')).toBe('');
});
