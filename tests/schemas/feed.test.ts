import { expect, test } from 'bun:test';
import { postSchema } from '../../src/schemas';

const post = {
  type: 'announcement',
  title: 'A valid title',
  body: 'A valid description.',
  date: '',
  time: '',
};

test('post validation matches API text and image limits', () => {
  expect(postSchema.safeParse(post).success).toBe(true);
  expect(postSchema.safeParse({ ...post, type: 'post' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, title: 'ab' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, title: 'a'.repeat(151) }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, body: '123456789' }).success).toBe(false);
  expect(postSchema.safeParse({ ...post, body: 'a'.repeat(5001) }).success).toBe(false);
  expect(
    postSchema.safeParse({
      ...post,
      image: new File([new Uint8Array(6 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' }),
    }).success,
  ).toBe(true);
  expect(
    postSchema.safeParse({ ...post, image: new File([''], 'photo.jpg', { type: 'image/jpeg' }) })
      .success,
  ).toBe(false);
  expect(
    postSchema.safeParse({
      ...post,
      image: new File(['data'], 'test.svg', { type: 'image/svg+xml' }),
    }).success,
  ).toBe(false);
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
