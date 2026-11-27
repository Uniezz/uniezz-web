import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiRequestError } from '@/api/errors';
import { apiErrorKey } from './apiErrorKey';

const failed = (code: string) =>
  new ApiRequestError('save', 'failed', undefined, { error: code }, 400);

test('a blocked word gets its own message, anything else the fallback', () => {
  assert.equal(apiErrorKey(failed('content_not_allowed')), 'apiState.contentNotAllowed');
  assert.equal(apiErrorKey(failed('invalid_input')), 'apiState.error');
  assert.equal(
    apiErrorKey(new Error('offline'), 'apiState.profileSaveError'),
    'apiState.profileSaveError',
  );
});
