import { expect, mock, test } from 'bun:test';

let request: { method: string; path: string; options?: unknown };
const response = { data: { items: [], nextCursor: null }, error: undefined };
mock.module('../../src/api/client.ts', () => ({
  api: {
    GET: async (path: string, options: unknown) => {
      request = { method: 'GET', path, options };
      return response;
    },
    DELETE: async (path: string) => {
      request = { method: 'DELETE', path };
      return { error: undefined };
    },
  },
}));
const { getProfiles, getPublicProfile, deleteMyAvatar } = await import('../../src/api/profile.ts');

test('student search sends the name and cursor to the backend', async () => {
  await getProfiles('Jan', 'next-page');
  expect(request).toEqual({
    method: 'GET',
    path: '/profiles',
    options: { params: { query: { name: 'Jan', cursor: 'next-page' } } },
  });
});

test('the student list omits the name filter when browsing all students', async () => {
  await getProfiles('', 'next-page');
  expect(request).toEqual({
    method: 'GET',
    path: '/profiles',
    options: { params: { query: { name: undefined, cursor: 'next-page' } } },
  });
});

test('public profiles and avatar removal use their API endpoints', async () => {
  await getPublicProfile('student-id');
  expect(request).toEqual({
    method: 'GET',
    path: '/profiles/{id}',
    options: { params: { path: { id: 'student-id' } } },
  });
  await deleteMyAvatar();
  expect(request).toEqual({ method: 'DELETE', path: '/profile/avatar' });
});
