import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coinGrantReasonLabel, questLabel } from './rewards';

test('known codes map to their labels, unknown ones to a generic label', () => {
  assert.equal(coinGrantReasonLabel('like_given'), 'rewards.reasonLikeGiven');
  assert.equal(coinGrantReasonLabel('toString'), 'rewards.reasonOther');
  assert.equal(coinGrantReasonLabel('new_reason'), 'rewards.reasonOther');
  assert.equal(questLabel('reply'), 'rewards.questReply');
  assert.equal(questLabel('streak'), 'rewards.questOther');
});
