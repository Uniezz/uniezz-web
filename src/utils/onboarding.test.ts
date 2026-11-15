import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isNewProfile } from './onboarding';

test('a profile counts as new for 10 minutes after creation', () => {
  const now = Date.parse('2026-11-15T12:00:00Z');
  assert.equal(isNewProfile('2026-11-15T11:55:00Z', now), true);
  assert.equal(isNewProfile('2026-11-15T11:49:59Z', now), false);
});
