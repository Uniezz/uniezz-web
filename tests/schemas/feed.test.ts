import { expect, test } from 'bun:test';
import { commentSchema, postSchema, postTagAdditionSchema } from '../../src/schemas';

const post = {
  type: 'announcement',
  audience: 'university',
  title: 'A valid title',
  body: 'A valid description.',
  date: '',
  time: '',
  images: [],
  tags: [],
  tagDraft: '',
};

test('post validation matches API text and image limits', () => {
  expect(postSchema.safeParse(post).success).toBe(true);
  expect(postSchema.safeParse({ ...post, type: 'post' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, audience: 'all' }).success).toBe(true);
  expect(postSchema.safeParse({ ...post, audience: 'other' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, title: 'ab' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, title: 'a'.repeat(151) }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, body: '123456789' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, body: 'a'.repeat(5001) }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, tags: Array(11).fill('tag') }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, tags: ['a'.repeat(31)] }).success).toBe(false);
  expect(
    postSchema.safeParse({
      ...post,
      images: Array(11).fill(new File(['x'], 'photo.jpg', { type: 'image/jpeg' })),
    }).success,
  ).toBe(false);
  expect(
    postSchema.safeParse({
      ...post,
      images: [new File([new Uint8Array(6 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' })],
    }).success,
  ).toBe(true);
  expect(
    postSchema.safeParse({ ...post, images: [new File([''], 'photo.jpg', { type: 'image/jpeg' })] })
      .success,
  ).toBe(false);
  expect(
    postSchema.safeParse({
      ...post,
      images: [new File(['data'], 'test.svg', { type: 'image/svg+xml' })],
    }).success,
  ).toBe(false);
});

test('post tags are trimmed and must be unique and within the limit', () => {
  expect(postTagAdditionSchema.parse(['campus', '  News  '])).toEqual(['campus', 'News']);
  expect(postTagAdditionSchema.safeParse(['campus', ' CAMPUS ']).success).toBe(false);
  expect(postTagAdditionSchema.safeParse(['campus', '  ']).success).toBe(false);
  expect(
    postTagAdditionSchema.safeParse(Array.from({ length: 11 }, (_, i) => `tag${i}`)).success,
  ).toBe(false);
  expect(postTagAdditionSchema.safeParse(['campus', 'campus', 'news']).success).toBe(true);
});

test('comments are trimmed and limited to 1000 characters', () => {
  expect(commentSchema.parse('  hello  ')).toBe('hello');
  expect(commentSchema.safeParse('   ').success).toBe(false);
  expect(commentSchema.safeParse('x'.repeat(1001)).success).toBe(false);
});

test('events require valid date and time while ordinary posts do not', () => {
  expect(postSchema.safeParse({ ...post, type: 'event' }).success).toBe(false);
  expect(
    postSchema.safeParse({ ...post, type: 'event', date: '2026-11-01', time: '18:30' }).success,
  ).toBe(true);
  expect(
    postSchema.safeParse({ ...post, type: 'event', date: '2026-02-30', time: '25:00' }).success,
  ).toBe(false);
});
