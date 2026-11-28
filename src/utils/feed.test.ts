import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isLiveEvent, midnightDaysAgo } from './feed';

test('midnightDaysAgo starts at local midnight', () => {
  const value = new Date(midnightDaysAgo(6, new Date(2026, 4, 10, 15, 30)));
  assert.deepEqual(
    [value.getFullYear(), value.getMonth(), value.getDate(), value.getHours()],
    [2026, 4, 4, 0],
  );
});

test('isLiveEvent covers the first two hours', () => {
  const start = new Date(2026, 0, 1, 12).toISOString();
  const at = (hour: number) => new Date(2026, 0, 1, hour).getTime();
  assert.equal(isLiveEvent(start, at(11)), false);
  assert.equal(isLiveEvent(start, at(13)), true);
  assert.equal(isLiveEvent(start, at(14)), false);
  assert.equal(isLiveEvent(null, at(13)), false);
});
