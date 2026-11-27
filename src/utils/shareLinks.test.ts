import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiRequestError } from '@/api/errors';
import { postUrl, retryUnlessNotFound } from './shareLinks';

const failed = (status?: number) =>
  new ApiRequestError('load', 'failed', undefined, undefined, status);

test('share links are absolute links on the site', () => {
  assert.equal(postUrl('a b'), 'https://uniezz.pl/feed/post/a%20b');
});

test('a gone item is not retried, other failures are', () => {
  assert.equal(retryUnlessNotFound(0, failed(404)), false);
  assert.equal(retryUnlessNotFound(0, failed(400)), false);
  assert.equal(retryUnlessNotFound(0, failed(500)), true);
  assert.equal(retryUnlessNotFound(0, new TypeError('offline')), true);
  assert.equal(retryUnlessNotFound(3, failed(500)), false);
});
