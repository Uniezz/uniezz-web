import { expect, test } from 'bun:test';
import { postFormDefaults, postSubmission, uploadPostImages } from '../../src/utils/feed';

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

test('editing an event fills the form with its local date and audience', () => {
  const eventDate = new Date(2026, 1, 2, 18, 30).toISOString();
  expect(
    postFormDefaults({ ...body, type: 'event', university: 'all', eventDate, tags: ['campus'] }),
  ).toEqual({
    type: 'event',
    audience: 'all',
    title: body.title,
    body: body.content,
    images: [],
    tags: ['campus'],
    tagDraft: '',
    date: '2026-02-02',
    time: '18:30',
  });
});

test('retrying a partial image upload reuses completed uploads in the selected order', async () => {
  const first = new File(['first'], 'first.jpg', { type: 'image/jpeg' });
  const second = new File(['second'], 'second.jpg', { type: 'image/jpeg' });
  const calls: File[] = [];
  const failed = await uploadPostImages([first, second], [], async (file) => {
    calls.push(file);
    if (file === second) throw new Error('Upload failed');
    return { file, mediaId: 'media-1' };
  });
  expect(failed.failed).toBe(true);
  const retry = await uploadPostImages([second, first], failed.uploaded, async (file) => {
    calls.push(file);
    return { file, mediaId: 'media-2' };
  });
  expect(retry.failed).toBe(false);
  if (!retry.failed) expect(retry.mediaIds).toEqual(['media-2', 'media-1']);
  expect(calls).toEqual([first, second, second]);
});
