import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coinsEarned } from './coinRewards';

test('reads coins only from a positive coinsEarned number', () => {
  assert.equal(coinsEarned({ coinsEarned: 1, liked: true }), 1);
  assert.equal(coinsEarned({ coinsEarned: 0 }), 0);
  assert.equal(coinsEarned({ liked: true }), 0);
  assert.equal(coinsEarned({ coinsEarned: '5' }), 0);
  assert.equal(coinsEarned(undefined), 0);
});
