import { expect, test } from 'bun:test';
import { postSubmission } from '../../src/utils/feed';

const body = {
  type: 'announcement' as const,
  title: 'Campus news',
  content: 'An update for everyone.',
  university: 'umcs',
  mediaIds: ['media-1'],
};

test('retrying the same post preserves its idempotency key', () => {
  const first = postSubmission(body);
  expect(postSubmission({ ...body, mediaIds: ['media-1'] }, first).key).toBe(first.key);
});

test('editing a post or replacing its image starts a new submission', () => {
  const first = postSubmission(body);
  expect(postSubmission({ ...body, title: 'Updated campus news' }, first).key).not.toBe(first.key);
  expect(postSubmission({ ...body, mediaIds: ['media-2'] }, first).key).not.toBe(first.key);
  expect(postSubmission({ ...body, mediaIds: undefined }, first).key).not.toBe(first.key);
});
