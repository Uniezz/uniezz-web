import { expect, mock, test } from 'bun:test';

let request: { method: string; path: string; options?: unknown };
const respond = (method: string) => async (path: string, options?: unknown) => {
  request = { method, path, options };
  return { data: { ok: true } };
};
mock.module('../../src/api/client.ts', () => ({
  api: { GET: respond('GET'), POST: respond('POST'), PUT: respond('PUT') },
}));
const {
  createChatGroup,
  getChatConversations,
  getChatMessages,
  markChatRead,
  openDirectConversation,
  sendChatMessage,
} = await import('../../src/api/chat.ts');

test('the conversation list asks for a page of 50 and passes the cursor', async () => {
  await getChatConversations('next');
  expect(request).toEqual({
    method: 'GET',
    path: '/chat/conversations',
    options: { params: { query: { cursor: 'next', limit: 50 } } },
  });
});

test('history reads one conversation, newest first, one page at a time', async () => {
  await getChatMessages('c1');
  expect(request).toEqual({
    method: 'GET',
    path: '/chat/conversations/{id}/messages',
    options: { params: { path: { id: 'c1' }, query: { cursor: undefined, limit: 50 } } },
  });
});

test('sending puts the idempotency key in the header and the text in the body', async () => {
  await sendChatMessage('c1', { body: 'Hello', attachmentIds: ['m1'] }, 'key-1');
  expect(request).toEqual({
    method: 'POST',
    path: '/chat/conversations/{id}/messages',
    options: {
      params: { path: { id: 'c1' }, header: { 'Idempotency-Key': 'key-1' } },
      body: { body: 'Hello', attachmentIds: ['m1'] },
    },
  });
});

test('mark read sends the newest seq the student has seen', async () => {
  await markChatRead('c1', 12);
  expect(request).toEqual({
    method: 'PUT',
    path: '/chat/conversations/{id}/read',
    options: { params: { path: { id: 'c1' } }, body: { seq: 12 } },
  });
});

test('opening a direct chat posts the other student id', async () => {
  await openDirectConversation('u1');
  expect(request).toEqual({
    method: 'POST',
    path: '/chat/conversations/direct',
    options: { body: { userId: 'u1' } },
  });
});

test('creating a group sends its name and member ids with an idempotency key', async () => {
  await createChatGroup('Maths', ['u1', 'u2'], 'key-2');
  expect(request).toEqual({
    method: 'POST',
    path: '/chat/conversations/groups',
    options: {
      params: { header: { 'Idempotency-Key': 'key-2' } },
      body: { name: 'Maths', memberIds: ['u1', 'u2'] },
    },
  });
});
