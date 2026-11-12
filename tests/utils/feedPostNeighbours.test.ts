import { expect, test } from 'bun:test';
import { feedPostNeighbours } from '../../src/utils/feed';
import { samplePost } from '../../src/utils/feedSkeletonData';
import { feedPostSearchSchema } from '../../src/schemas/feed';

const page = (ids: string[]) => ({
  items: ids.map((id) => ({ ...samplePost, id })),
  nextCursor: null,
});

test('prev and next follow the list order across pagination boundaries', () => {
  const pages = [page(['one', 'two']), page(['three', 'four'])];
  expect(feedPostNeighbours('one', pages)).toEqual({ previousId: null, nextId: 'two' });
  expect(feedPostNeighbours('two', pages)).toEqual({ previousId: 'one', nextId: 'three' });
  expect(feedPostNeighbours('three', pages)).toEqual({ previousId: 'two', nextId: 'four' });
  expect(feedPostNeighbours('four', pages)).toEqual({ previousId: 'three', nextId: null });
});

test('liked, saved or filtered lists keep their own ordering', () => {
  expect(feedPostNeighbours('two', [page(['four', 'two', 'one'])])).toEqual({
    previousId: 'four',
    nextId: 'one',
  });
});

test('posts outside the source list are standalone, like mobile', () => {
  expect(feedPostNeighbours('other', [page(['one'])])).toEqual({ previousId: null, nextId: null });
  expect(feedPostNeighbours('other', undefined)).toEqual({ previousId: null, nextId: null });
  expect(feedPostNeighbours('other', [{ items: null, nextCursor: null }])).toEqual({
    previousId: null,
    nextId: null,
  });
});

test('post routes validate and preserve their source filters', () => {
  const search = {
    postSource: 'liked',
    postFilters: { type: 'event', authorId: 'author', q: 'music', from: '2026-11-01T00:00:00Z' },
  };
  expect(feedPostSearchSchema.parse(search)).toEqual(search);
  expect(
    feedPostSearchSchema.parse({ postSource: 'other', postFilters: { type: 'other' } }),
  ).toEqual({ postSource: undefined, postFilters: undefined });
  expect(feedPostSearchSchema.parse({ postFilters: { limit: -1 } }).postFilters).toBeUndefined();
});
