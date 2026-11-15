import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canRedeemInvite } from './referral';

test('an invite code can be redeemed during the first 7 days', () => {
  const now = Date.parse('2026-11-15T12:00:00Z');
  assert.equal(canRedeemInvite('2026-11-08T12:00:01Z', now), true);
  assert.equal(canRedeemInvite('2026-11-08T12:00:00Z', now), false);
});
