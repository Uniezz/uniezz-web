import { expect, mock, test } from 'bun:test';

let request: { path: string; options?: unknown };
let response: { data?: unknown; error?: { error: string } };
mock.module('../../src/api/client.ts', () => ({
  api: {
    GET: async (path: string, options?: unknown) => {
      request = { path, options };
      return response;
    },
  },
}));
const { getFeedPosts, getFeaturedFeedPosts } = await import('../../src/api/feed.ts');

test('feed pagination preserves backend search, author and other filters', async () => {
  response = { data: { items: [], nextCursor: null } };
  const filters = {
    q: 'student meetup',
    authorId: 'author-id',
    university: 'umcs',
    type: 'event' as const,
    from: '2026-11-01T00:00:00Z',
    to: '2026-12-01T00:00:00Z',
  };
  await getFeedPosts(filters, 'next-page');
  expect(request).toEqual({
    path: '/feed/posts',
    options: { params: { query: { limit: 20, ...filters, cursor: 'next-page' } } },
  });
});

test('featured posts use the dedicated endpoint and preserve empty results', async () => {
  response = { data: { items: [] } };
  expect(await getFeaturedFeedPosts()).toEqual({ items: [] });
  expect(request.path).toBe('/feed/posts/featured');
});
